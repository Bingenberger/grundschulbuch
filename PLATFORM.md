# Betrieb und Plattformvertrag

## Container

Node 22.23.4 (Basisimage mit Digest), Next.js 16 standalone, amd64.
Installation aus `package-lock.json`, Benutzer UID/GID 10001, schreibgeschütztes
Root-Dateisystem, keine Capabilities, `/tmp` als tmpfs. Die App lauscht im
Container auf Port 3000, Compose veröffentlicht sie nur auf `127.0.0.1`
(`GRUNDSCHULBUCH_PORT` ändert den Hostport).

| Variable | Bedeutung |
| --- | --- |
| `SESSION_SECRET_FILE` | Datei mit dem privaten Schlüssel (mindestens 32 Zeichen). Wird erst beim Start gelesen und steht nicht in der Docker-Konfiguration. Die Datei muss für UID 10001 lesbar sein, z. B. `chown 10001:10001` bei Rechten 0600. |
| `BASE_URL` | Öffentliche Origin, z. B. `https://buch.schule.de`. Bestimmt das `Secure`-Cookie und die Herkunftsprüfung. Wechsel braucht nur einen Neustart. |
| `GRUNDSCHULBUCH_DATA_DIR` | Datenverzeichnis, im Container `/data`. |

## Daten

`/data` (Verzeichnisse 0700, Dateien 0600) enthält:

| Pfad | Inhalt |
| --- | --- |
| `schema.json` | Schema-Version (derzeit 1) |
| `lehrkraefte.json` | Konten: Name, Rolle, PIN-Hash (bcrypt), offener Einmalcode als HMAC |
| `anmeldeversuche.json` | Fehlversuche und Sperren |
| `sitzungen/` | eine Datei je Sitzung, benannt nach dem HMAC des Cookie-Tokens |
| `sperren/` | kurzlebige Sperrverzeichnisse für gleichzeitige Schreiber |

Alle Dateien werden über eine temporäre Datei mit `fsync` und `rename` atomar
ersetzt. Schreiber halten eine prozessübergreifende Sperre. Sperren beendeter
Prozesse werden anhand der PID erkannt und freigegeben.

## Migration

`node scripts/migrate.mjs` ist ein expliziter, exklusiver Job. Der Serverstart
migriert nie und legt keine Konten an. Ein leeres Verzeichnis bekommt Schema 1.
Eine unbekannte Schema-Version oder fremde Dateien ohne `schema.json` brechen
ohne Änderung ab.

## Konten

- `node scripts/bootstrap.mjs NAME [--admin]` legt ein Konto an oder erzeugt
  für ein vorhandenes Konto einen neuen Einmalcode (vergessene PIN). Vorhandene
  Konten werden nie ersetzt. Das erste Konto wird Admin.
- Der Code erscheint nur an einem Terminal, gilt 15 Minuten und einmal. Beim
  Einlösen wird eine sechsstellige PIN festgelegt, alle bisherigen Sitzungen des
  Kontos enden.
- Kein HTTP-Aufruf legt Konten an.

## Sitzungen und Anmeldung

- Zufälliges Token (256 Bit) im HttpOnly-Cookie `gsb_sitzung`, SameSite=Strict,
  unter HTTPS `Secure`, Laufzeit 8 Stunden. Auf dem Server liegt nur ein HMAC
  des Tokens. Abmelden, PIN-Wechsel und Löschen beenden Sitzungen sofort.
- Höchstens zehn Sitzungen pro Konto; die älteste endet zuerst.
- Fünf Fehlversuche sperren einen Kontonamen 15 Minuten, auch über Neustarts.
  Unbekannte Namen teilen sich einen Eintrag.
- Ändernde Anfragen müssen die Origin aus `BASE_URL` tragen.

## Gesundheit

- `/health/live`: Prozess läuft, braucht keine Daten.
- `/health/ready`: Schema-Version stimmt, `lehrkraefte.json` ist lesbar.
  Externe Dienste sind nicht nötig.

## Sicherung und Wiederherstellung

Alle Schreiber stoppen, dann das komplette Datenverzeichnis und getrennt davon
die Schlüsseldatei sichern. Ohne den Schlüssel sind Einmalcodes und Sitzungen
ungültig; Konten mit PIN funktionieren weiter. Nach einer Wiederherstellung
alte Sitzungen mit `rm /data/sitzungen/*` beenden.

## Prüfung

```sh
npm run typecheck && npm run lint && npm test
docker build --target tests .
```
