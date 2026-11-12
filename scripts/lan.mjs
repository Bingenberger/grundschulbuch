#!/usr/bin/env node
// Startet die gebaute App zum Ausprobieren im lokalen Netz, z. B. auf dem iPad:
//   npm run build && npm run lan
//
// - findet die eigene IP-Adresse im WLAN/LAN (oder LAN_IP=…),
// - legt einmalig eine eigene Test-Zertifizierungsstelle an (.private/lan/) und
//   stellt damit für die aktuelle IP ein HTTPS-Zertifikat aus,
// - startet die App auf 127.0.0.1:3000 mit BASE_URL=https://<IP>:3443 und
//   davor einen HTTPS-Weiterleiter auf Port 3443 für das ganze Netz.
//
// Kamera, Mikrofon und „Zum Home-Bildschirm“ brauchen HTTPS mit einem
// vertrauenswürdigen Zertifikat. Dafür lädt das iPad einmal
// https://<IP>:3443/lan-zertifikat und vertraut ihm in den Einstellungen.
// Wechselt die IP (anderes Netz), einfach neu starten – die
// Zertifizierungsstelle bleibt, auf dem iPad ist nichts neu zu installieren.
// Nur für Tests: Im Betrieb liefert die Schulplattform HTTPS.
import { execFileSync, spawn } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import http from 'node:http';
import https from 'node:https';
import os from 'node:os';
import path from 'node:path';

const root = process.cwd();
const dir = path.join(root, '.private', 'lan');
const port = Number(process.env.LAN_PORT || 3443);
const appPort = Number(process.env.PORT || 3000);
const standalone = path.join(root, '.next', 'standalone');

function lanAddress() {
  if (process.env.LAN_IP) return process.env.LAN_IP;
  const skip = /^(lo|docker|br-|veth|virbr|tun|tap|wg|zt)/;
  const found = Object.entries(os.networkInterfaces())
    .filter(([name]) => !skip.test(name))
    .flatMap(([name, list]) => (list || []).filter((a) => a.family === 'IPv4' && !a.internal).map((a) => ({ name, address: a.address })));
  // WLAN and Ethernet first.
  found.sort((a, b) => Number(/^(wl|en|eth)/.test(b.name)) - Number(/^(wl|en|eth)/.test(a.name)));
  if (!found.length) throw new Error('Keine Netzwerkadresse gefunden. Bitte LAN_IP=… angeben.');
  return found[0].address;
}

const openssl = (...args) => execFileSync('openssl', args, { cwd: dir, stdio: ['ignore', 'ignore', 'pipe'] });

function certificates(ip) {
  mkdirSync(dir, { recursive: true, mode: 0o700 });
  if (!existsSync(path.join(dir, 'ca.key'))) {
    openssl('req', '-x509', '-newkey', 'rsa:2048', '-nodes', '-sha256', '-days', '3650',
      '-keyout', 'ca.key', '-out', 'ca.crt',
      '-subj', `/CN=Grundschulbuch Test (${os.hostname()})`,
      '-addext', 'basicConstraints=critical,CA:TRUE',
      '-addext', 'keyUsage=critical,keyCertSign,cRLSign');
    console.log('Neue Test-Zertifizierungsstelle angelegt.');
  }
  const name = `server-${ip}`;
  if (!existsSync(path.join(dir, `${name}.crt`))) {
    writeFileSync(path.join(dir, `${name}.ext`), [
      `subjectAltName=IP:${ip},DNS:localhost`,
      'basicConstraints=CA:FALSE',
      'keyUsage=critical,digitalSignature,keyEncipherment',
      'extendedKeyUsage=serverAuth',
    ].join('\n'));
    openssl('req', '-newkey', 'rsa:2048', '-nodes', '-keyout', `${name}.key`, '-out', `${name}.csr`, '-subj', `/CN=${ip}`);
    // Apple accepts server certificates for at most 398 days.
    openssl('x509', '-req', '-in', `${name}.csr`, '-CA', 'ca.crt', '-CAkey', 'ca.key', '-CAcreateserial',
      '-days', '365', '-sha256', '-extfile', `${name}.ext`, '-out', `${name}.crt`);
  }
  return {
    ca: readFileSync(path.join(dir, 'ca.crt')),
    key: readFileSync(path.join(dir, `${name}.key`)),
    cert: readFileSync(path.join(dir, `${name}.crt`)),
  };
}

if (!existsSync(path.join(standalone, 'server.js'))) {
  console.error('Bitte zuerst bauen: npm run build');
  process.exit(1);
}
const ip = lanAddress();
const origin = `https://${ip}:${port}`;
const { ca, key, cert } = certificates(ip);

cpSync(path.join(root, 'public'), path.join(standalone, 'public'), { recursive: true });
cpSync(path.join(root, '.next', 'static'), path.join(standalone, '.next', 'static'), { recursive: true });
const app = spawn(process.execPath, [path.join(standalone, 'server.js')], {
  stdio: 'inherit',
  env: {
    GRUNDSCHULBUCH_DATA_DIR: path.join(root, 'data'),
    SESSION_SECRET_FILE: path.join(root, '.private', 'session-key'),
    GALLERY_ORIGIN: 'https://bilder.gsndk.de',
    ...process.env,
    BASE_URL: origin,
    HOSTNAME: '127.0.0.1',
    PORT: String(appPort),
  },
});

const proxy = https.createServer({ key, cert }, (req, res) => {
  if (req.url === '/lan-zertifikat') {
    res.writeHead(200, {
      'Content-Type': 'application/x-x509-ca-cert',
      'Content-Disposition': 'attachment; filename="grundschulbuch-test.crt"',
    });
    return res.end(ca);
  }
  const upstream = http.request(
    { host: '127.0.0.1', port: appPort, method: req.method, path: req.url, headers: { ...req.headers, 'x-forwarded-proto': 'https', 'x-forwarded-host': req.headers.host } },
    (r) => {
      res.writeHead(r.statusCode || 502, r.headers);
      r.pipe(res);
    },
  );
  upstream.on('error', () => {
    if (!res.headersSent) res.writeHead(502, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Die App startet gerade – bitte gleich noch einmal laden.');
  });
  req.pipe(upstream);
});
proxy.listen(port, '0.0.0.0', () => {
  console.log(`
Grundschulbuch im Netz:   ${origin}
Zertifikat fürs iPad:     ${origin}/lan-zertifikat  (einmalig installieren und vertrauen)
Beenden mit Strg+C.
`);
});

const stop = () => {
  proxy.close();
  app.kill('SIGTERM');
  process.exit(0);
};
process.on('SIGINT', stop);
process.on('SIGTERM', stop);
app.on('exit', (code) => {
  proxy.close();
  process.exit(code ?? 0);
});
