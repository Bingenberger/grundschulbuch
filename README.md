# Grundschulbuch

Digitale Hefte für die Grundschule. Lehrkräfte gestalten Hefte mit Lineaturen,
Texten, Bildern und Zeichnungen, zeigen sie an der interaktiven Tafel und
drucken sie aus. Kinder arbeiten auf geteilten iPads mit eigenem Zugang in
ihren Heften. Die App läuft als Serveranwendung auf dem Schulserver.

> **Stand:** Hefteditor, Klassen und Kinderzugang sowie Arbeitsblatt-Generatoren,
> Ton, Sammlungen, interaktive Übungen, Schul- und Musikwerkzeuge sowie portable
> Exporte sind implementiert. Referenzumfang und Unterschiede:
> [Funktionsvergleich](docs/funktionsvergleich.md). Geräteabnahme:
> [Umsetzung und Abnahme](docs/umsetzung.md).

## Funktionsumfang

1. **Phase 1 – Lehrkräfte:** Regal mit Heften, A4-Seiten mit Grundschul-Lineaturen,
   Text, Bild und Zeichnung frei auf der Seite, Schulschriften, Tafelmodus,
   Druck und PDF.
2. **Phase 2 – Kinder:** Klassen, Anmeldung per QR-Karte (auch vorhandene
   Anton-Anmeldecodes), reduzierte Oberfläche für Kinder, Hefte austeilen und
   einsehen.
3. **Phase 3 – Inhalte:** Arbeitsblatt-Generatoren, Ton und Vorlesen,
   Vorlagen-Katalog, persönliches Regal, Teilen im Kollegium.

Hinzu kommen 48 Arbeitsblatt-Formate, Kommunikationstafeln, Timer, Musikwerkzeuge,
Animation/Diaschau, Ordner und Regalsicherungen sowie PDF-Import und HTML-/ePub-/SCORM-Export.
Der optionale KI-Adapter ist standardmäßig inaktiv; Betreiberkonfiguration:
[KI-Dienst](docs/ki.md).

Der ausführliche Plan steht in [docs/konzept.md](docs/konzept.md).

<!-- schulplattform:installation -->
## Installation

### Standalone mit Docker Compose

Benötigt Docker Engine mit Compose v2 (amd64) und Node.js ≥ 22 auf dem Host
für das Setup-Skript. Die App lauscht danach nur auf `http://127.0.0.1:3000`.

```sh
node scripts/prepare-secret.mjs
sudo chown 10001:10001 .private/session-key   # der Container läuft als UID 10001
export GRUNDSCHULBUCH_SECRET_FILE="$PWD/.private/session-key"
export BASE_URL="http://localhost:3000"
docker compose build
docker compose run --rm --no-deps app node scripts/migrate.mjs
docker compose up -d --no-build
docker compose exec app node scripts/bootstrap.mjs "PERSÖNLICHER NAME"
```

Der letzte Befehl legt das erste Konto an (es wird Admin) und zeigt einen
Einmalcode. Damit unter „Mit Einmalcode“ anmelden und eine persönliche
sechsstellige PIN festlegen. Für den Schulbetrieb HTTPS über einen eigenen
Reverse Proxy einrichten und `BASE_URL` auf die öffentliche Adresse setzen.
Einzelheiten in [PLATFORM.md](PLATFORM.md).
<!-- /schulplattform:installation -->

## Entwicklung

```sh
npm install
node scripts/prepare-secret.mjs
export SESSION_SECRET_FILE="$PWD/.private/session-key"
node scripts/migrate.mjs                      # legt ./data an
node scripts/bootstrap.mjs "Frau Beispiel"    # Einmalcode für das erste Konto
npm run dev
```

Prüfungen: `npm run typecheck`, `npm run lint`, `npm test`.
Browsertests nach `npm run build -- --webpack` und `npx playwright install chromium`:
`npm run test:e2e`. Sie nutzen ausschließlich ein temporäres Testverzeichnis.

Lehrkräfte starten unter `/`, die Kinder unter `/kinder`. Klassen und Karten
werden unter „Meine Klassen“ verwaltet. Die vollständige Bedienübersicht steht
in [docs/umsetzung.md](docs/umsetzung.md).

Konten anlegen/PIN zurücksetzen: wie bisher `node scripts/bootstrap.mjs NAME`.
Sperren und Entsperren auf dem Server:

```sh
node scripts/accounts.mjs sperren "Frau Beispiel"
node scripts/accounts.mjs entsperren "Frau Beispiel"
```

Das letzte aktive Admin-Konto kann nicht gesperrt werden.

**Zielgeräte:** iPads mit Safari (Kinder) und interaktive Tafeln von iiyama mit
einem älteren Browser. Deshalb nur breit unterstütztes CSS verwenden, z. B.
keine `dvh`-Einheiten.

## Technik

| Schicht | Technologie |
| --- | --- |
| Framework | Next.js 16 (App Router), React 19 |
| Anmeldung | PIN mit bcrypt, serverseitige Sitzungen |
| Speicher | JSON-Dateien im Datenverzeichnis, atomar ersetzt, keine Datenbank |
| Laufzeit | Node.js 22 im schreibgeschützten Container |

## Lizenz

- **Programmcode:** [GNU Affero General Public License 3.0](LICENSE).
  Wer das Grundschulbuch verändert und anderen als Dienst bereitstellt, muss
  den veränderten Quellcode ebenfalls zugänglich machen.
- **Vorlagen, Lineaturen und andere mitgelieferte Inhalte:**
  [CC BY 4.0](LICENSE-CONTENT).
- **Schriften:** jeweils SIL Open Font License 1.1 (siehe Schriftverzeichnisse).

Die Idee eines digitalen Heftes ist vom
[Lernsachen-Heft](https://github.com/Majort0m0/Lernsachen-Heft) inspiriert.
Die interaktiven Musikwerkzeuge und einige weitere Lernwerkzeuge basieren auf der
mitgelieferten Referenzdatei. Die Musikvorlagen verwenden den Kassettenrekorder
des Grundschulbuchs; Einzelheiten: [Musikwerkzeuge](docs/musikwerkzeuge.md).
