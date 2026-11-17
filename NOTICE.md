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
  - **Unverändert übernommen (Regal › Zeit):** Uhr, Timer, Datum, Multi-Timer, Lärmampel, Applausometer, Bilder-Stundenplan, Karte, Sprechtaste, Satzleiste und die Kommunikationstafeln, Elevator Pitch, Diaschau, Animation, Das sprechende Kalenderblatt mit seinen Zeichnungen (`public/kalender/`; `src/lib/reference/class-runtime.ts`, erzeugt von `scripts/extract-class-reference.mjs`); das Wetter kommt von Open-Meteo.com (Daten CC BY 4.0) über den Schulserver.
  - **Unverändert übernommen aus Version 1.47.3:** Strichliste und Diagramm, Glücksrad und Würfel, Suchbild, Muster fortsetzen, Hör-Memory und Was hörst du?, die Werkzeuge für Alltag, Beruf & Praktikum und Klassenführung (Puppentheater, die Arbeitsblätter Laute hören, Karopapier, Rechnen im Alltag, Programmieren und Etiketten (`src/lib/sheets/sheets-1473.ts`), Programmieren mit seinen Lektionen, Linksammlung, Figuren und Gefühle-Karten, Geld-Planer und Kassenbuch, Fahrkarten-, Geld- und Getränkeautomat, Sortieren und Bild-Quiz mit ihren fertigen Sets, Nähe und Distanz, Wochen- und Dienstplan, Ablaufplan, Checkliste, Stressbarometer, Fußgängerampel, Telefon und Notruf, Körperbild, Einschätzung, Stückzähler, Gespräche üben, Gefühle, Abstimmung, Zeitleiste) mit ihren Vorlagenlisten mit ihren eingebauten Geräuschen und Instrumentenklängen (`src/lib/reference/tools-runtime.ts`, erzeugt von `scripts/extract-tools-reference.mjs`); die sechs neuen Kommunikationstafeln mit 69 weiteren ARASAAC-Bildern (`public/uk/`).
  - **Nachgebaut:** Gliederung und Abläufe weiterer Lernwerkzeuge, u. a. Einkaufen an der Kasse, Rechnen mit dem Taschenrechner und Mathe-Werkzeuge. Auch die Idee des digitalen Heftes stammt von hier.
  - **Originalgestaltung in bearbeitbare Elemente umgewandelt:** 84 statische Seitenvorlagen einschließlich ihrer Texte, Bildplatzhalter, Vorlesetasten und 2506 Vektor- und Rahmenbestandteile (`src/lib/reference/page-templates.json`, `template-vectors.json`). Enthält 18 neue Entwürfe aus Version 1.47.3 (Schülerzeitung, Praktikumsseiten, Lerntagebuch, Stundenplan, Kunstbetrachtung); das alte Lerntagebuch bleibt intern erhalten. Erzeugung aus `Lernsachen-Heft-komplett.html`: `scripts/extract-page-templates.mjs`; Anpassung an das Elementmodell des Grundschulbuchs: `src/lib/learning/page-designs.ts`.

### Textsachen – Lernsachen.blog

- Projekt: <https://majort0m0.github.io/Textsachen/Textsachen.html>
- Urheber: Lernsachen.blog (<https://lernsachen.blog>)
- Lizenz: CC BY-NC-SA 4.0
- Verwendet: der Spieler der Übungen (TSPlayer), unverändert
  (`src/lib/reference/textsachen-player.ts`, seit Nov. 2026 in der Fassung aus Lernsachen-Heft 1.47.3). Er spielt Lesen & Schreiben, Erklärbär, Memory mit Wörtern, Maus & Käse, Kreuzworträtsel, Suchsel und Wordle ab. Die Einstellungsseite folgt dem Editor von Textsachen. Satz- und Szenenbildung des Erklärbärs sind aus dem Spieler nachgebaut (`src/lib/learning/erklaerbaer.ts`); die Vorschaubilder der Hintergründe (`public/previews/erklaerbaer`) hat der Spieler selbst gezeichnet.

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
  Fächer des Bilder-Stundenplans (`public/stundenplan/`), Kommunikationstafeln
  (`public/uk/`), fertige Sets von Sortieren und Bild-Quiz (`public/sortieren/*.webp`;
  die Schilder und Wäschezeichen dort zeichnet Lernsachen-Heft selbst als SVG).
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
| Originalschriften der Vorlagen einschließlich Gruschudru basic | jeweilige Urheber laut eingebetteten Metadaten | SIL Open Font License 1.1 | `public/fonts/reference/` mit `OFL.txt` und [Herkunft](public/fonts/reference/SOURCES.md) |
| Schriften Andika, Atkinson Hyperlegible, Bangers, Caveat, Lexend, Merriweather, Nunito, Playwrite DE Grund/VA/SAS | jeweilige Urheber (Google Fonts) | SIL Open Font License 1.1 | `public/fonts/` mit `OFL.txt` und [Herkunft](public/fonts/SOURCES.md) |
| Flat Color Icons | icons8 | MIT | Symbole der Werkzeugleisten (`public/runtime/icons/`) |
| npm-Abhängigkeiten (Next.js, React, pdf.js …) | jeweilige Urheber | jeweils eigene Lizenz | Lizenztexte in `DEPENDENCY-LICENSES.json` im Quellcode-Archiv und unter „Lizenzen“ im exportierten Heft |

Fremdbestandteile mit eigener Lizenz behalten diese Lizenz. CC BY-NC-SA 4.0
gilt für das Grundschulbuch und die übernommenen Teile der Originalprojekte.
