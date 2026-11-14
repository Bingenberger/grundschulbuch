# Herkunft und Fremdbestandteile

Das Grundschulbuch steht als Ganzes unter **CC BY-NC-SA 4.0** (siehe
[LICENSE](LICENSE)). Viele Teile sind aus den folgenden Originalprojekten
übernommen oder ihnen nachgebaut. Diese stehen selbst unter CC BY-NC-SA 4.0;
ihre Urheber werden hier genannt.

## Originalprojekte (CC BY-NC-SA 4.0)

### Lernsachen-Heft – Lernsachen.blog

- Projekt: <https://github.com/Majort0m0/Lernsachen-Heft> · <https://majort0m0.github.io/Lernsachen-Heft/>
- Urheber: Lernsachen.blog (<https://lernsachen.blog>)
- Lizenz: CC BY-NC-SA 4.0
- Verwendet:
  - **Unverändert übernommen:**
    - Lernwerkzeuge der Vorlage: Anlaut-Tastatur, Silben klatschen, Silben verbinden, Monsternamen lesen, Musikwerkzeuge (`src/lib/reference/`).
    - Generatoren der einstellbaren Vorlagen: Buchstaben üben, Mathe-Aufgaben, Uhrzeiten üben, Rechnen mit Geld, Ziffern üben, Labyrinth, Noten lernen (`src/lib/sheets/reference-sheets.ts`).
    - Zeichnungen der Stickerbibliothek (`src/lib/sheets/letter-pictures.json`).
    - Laut- und Silbenaufnahmen (`public/laute/`, `src/lib/reference/recordings.json`).
  - **Unverändert übernommen (Regal › Zeit):** Uhr, Timer, Datum, Multi-Timer, Lärmampel, Applausometer, Bilder-Stundenplan, Karte und Das sprechende Kalenderblatt mit seinen Zeichnungen (`public/kalender/`; `src/lib/reference/class-runtime.ts`, erzeugt von `scripts/extract-class-reference.mjs`); das Wetter kommt von Open-Meteo.com (Daten CC BY 4.0) über den Schulserver.
  - **Nachgebaut:** Gliederung und Abläufe weiterer Lernwerkzeuge, u. a. Einkaufen an der Kasse, Rechnen mit dem Taschenrechner und Mathe-Werkzeuge. Auch die Idee des digitalen Heftes stammt von hier.

### Textsachen – Lernsachen.blog

- Projekt: <https://majort0m0.github.io/Textsachen/Textsachen.html>
- Urheber: Lernsachen.blog (<https://lernsachen.blog>)
- Lizenz: CC BY-NC-SA 4.0
- Verwendet: der Spieler der Übungen (TSPlayer), unverändert
  (`src/lib/reference/textsachen-player.ts`). Er spielt Lesen & Schreiben, Memory mit Wörtern, Maus & Käse, Kreuzworträtsel, Suchsel und Wordle ab. Die Einstellungsseite folgt dem Editor von Textsachen.

### Schiebesachen – Lernsachen.blog

- Projekt: <https://majort0m0.github.io/Schiebesachen/Schiebesachen.html>
- Urheber: Lernsachen.blog (<https://lernsachen.blog>)
- Lizenz: CC BY-NC-SA 4.0
- Verwendet, jeweils unverändert:
  - der Spieler der Zuordnungen (DnDPlayer, `src/lib/reference/schiebesachen-player.ts`);
  - der Übungsbaukasten des Dialogs „Neue Übung“ (`src/lib/reference/schiebesachen-builder.ts`): Bild und Wort, Sortieren, Artikel, Reihenfolge, Paare, Buchstabieren, Silbenlesen.

### Quizsachen – Lernsachen.blog

- Projekt: <https://majort0m0.github.io/Quizsachen/Quizsachen.html>
- Urheber: Lernsachen.blog (<https://lernsachen.blog>)
- Lizenz: CC BY-NC-SA 4.0
- Verwendet, jeweils unverändert:
  - der Spieler der Quizze (QuizPlayer, `src/lib/reference/quizsachen-player.ts`);
  - die Vorlagen von „Neues Quiz“ (Bunte Kacheln, Bilderrätsel, Bilder auswählen, Hör-Quiz, Richtig oder falsch?, Reihenfolge, Zeitstrahl, Leicht lesen) und das Einlesen von „Fragen per Text eingeben“ samt Beispiel (`src/lib/reference/quizsachen-builder.ts`). Die Einstellungsseite folgt dem Ablauf-Menü von Quizsachen.

Die Lernsachen-Teile werden mit `scripts/extract-players.mjs`,
`scripts/extract-music-reference.mjs` und den Erläuterungen in den
Dateiköpfen aus den veröffentlichten Apps gewonnen.

### ARASAAC-Piktogramme

- Quelle: <https://arasaac.org>
- Urheber: Sergio Palao; Eigentümer: Gobierno de Aragón (Spanien)
- Lizenz: CC BY-NC-SA 4.0
- Verwendet: Bilder der Anlaut-Tastatur (`public/anlaut/`), Anlaut- und
  Mengenbilder (`public/bilder/`), Geld und Waren der Kasse (`public/kasse/`),
  Fächer des Bilder-Stundenplans (`public/stundenplan/`).
  Bilder, die zur Laufzeit über die Bildsuche geladen werden, erhalten ihren
  Bildnachweis automatisch.

### OpenStreetMap

- Kartendaten © OpenStreetMap-Mitwirkende, Lizenz ODbL (<https://www.openstreetmap.org/copyright>)
- Kartenbilder von tile.openstreetmap.de (FOSSGIS e. V.), ersatzweise tile.openstreetmap.org; Ortssuche über Nominatim. Beides fragt der Schulserver ab (`/api/karte`). Gespeicherte Kartenausschnitte tragen den Hinweis auf der Karte.

## Weitere Fremdbestandteile

| Bestandteil | Urheber | Lizenz | Wo |
| --- | --- | --- | --- |
| Deutsche Silbentrennmuster hyph-de-1996 (dehyphn-x-2011-06-01) | Werner Lemberg | LaTeX Project Public License 1.3c | in den übernommenen Teilen von Lernsachen-Heft und Schiebesachen, Lizenztext dort enthalten |
| Hypher 0.2.5 | Bram Stein | BSD-3-Clause | ebenda |
| Schriften Andika, Atkinson Hyperlegible, Bangers, Caveat, Lexend, Merriweather, Nunito, Playwrite DE Grund/VA/SAS | jeweilige Urheber (Google Fonts) | SIL Open Font License 1.1 | `public/fonts/` mit `OFL.txt` und [Herkunft](public/fonts/SOURCES.md) |
| Flat Color Icons | icons8 | MIT | Symbole der Werkzeugleisten (`public/runtime/icons/`) |
| npm-Abhängigkeiten (Next.js, React, pdf.js …) | jeweilige Urheber | jeweils eigene Lizenz | Lizenztexte in `DEPENDENCY-LICENSES.json` im Quellcode-Archiv und unter „Lizenzen“ im exportierten Heft |

Fremdbestandteile mit eigener Lizenz behalten diese Lizenz. CC BY-NC-SA 4.0
gilt für das Grundschulbuch und die übernommenen Teile der Originalprojekte.
