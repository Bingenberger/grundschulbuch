# Publisher-Dateien übernehmen

Alte Arbeitshefte aus Microsoft Publisher (`.pub`) lassen sich mit einem
eigenständigen Skript in Heftdateien (`.grundschulbuch`) umwandeln. Die
Heftdatei wird danach im Regal über „Heft, ePub oder PDF öffnen“ geladen, wie
jede andere exportierte Heftdatei. Die App selbst braucht dafür nichts
Zusätzliches.

## Voraussetzungen

- **LibreOffice** in einer aktuellen Version (getestet mit 25.8). Es liest
  Publisher-Dateien über die freie Bibliothek libmspub.
- **Python 3.9 oder neuer**, ohne weitere Pakete.
- Die Schriften der Publisher-Dateien sollten auf dem Rechner installiert sein,
  auf dem umgewandelt wird. Sonst setzt LibreOffice bei gerenderten Teilen eine
  Ersatzschrift ein.

## Aufruf

```sh
python3 scripts/publisher/pub2grundschulbuch.py Arbeitsheft.pub
python3 scripts/publisher/pub2grundschulbuch.py ~/Publisher-Hefte/ -o ~/Heftdateien/
```

Unter Windows: `py scripts\publisher\pub2grundschulbuch.py Arbeitsheft.pub`.
LibreOffice wird an den üblichen Orten gefunden, sonst `--soffice PFAD`.

Ein Ordner wandelt alle `.pub`-Dateien darin um. Jede Datei wird ein Heft mit
dem Dateinamen als Titel. Sehr große Hefte (über 95 MB oder 300 Seiten) werden
in „Teil 1“, „Teil 2“ … aufgeteilt, damit der Import sie annimmt.

| Option | Wirkung |
|---|---|
| `-o ORDNER` | Zielordner, Standard: neben der Publisher-Datei |
| `--groesse original` | Originalgröße statt „Seite füllt A4“; nur zu große Seiten werden verkleinert |
| `--schrift "ALT=NEU"` | Schriftzuordnung festlegen, z. B. `--schrift "Comic Sans MS=Andika"`; mehrfach möglich |
| `--als-bild SCHRIFT` | Texte in dieser Schrift als Bild übernehmen, etwa für Symbolschriften wie Lernwörterzeichen |
| `--nur-bilder` | jede Seite als ein einziges, gesperrtes Bild (wie der PDF-Import) |
| `--aufloesung N` | Pixel je mm für gerenderte Teile, Standard 8 (≈ 200 dpi) |
| `--behalten` | Zwischendateien zur Fehlersuche behalten |

## Was wird woraus?

| In Publisher | Im Grundschulbuch |
|---|---|
| Textfeld | Textfeld mit Schrift, Größe, Farbe, Fett/Kursiv/Unterstrichen je Abschnitt, Ausrichtung, Einzug, Zeilenabstand; Hintergrund und Rahmen bei rechteckigen Feldern |
| Absätze mit unterschiedlicher Schriftgröße | je Größe ein eigenes Textfeld, gemeinsam gruppiert |
| Tabelle | ein Textfeld je Zelle; Linien und Zellfarben als Bild darunter |
| Foto, Bild (PNG, JPEG, GIF) | Bild, unverändert und genau so gestreckt wie in Publisher |
| Linie, Rechteck, Kreis mit einfacher Füllung | Formen (Rechtecke mit Rahmen als gruppierte Kanten) |
| Kurven, Pfeile, Verläufe, Schatten, WordArt, ClipArt (WMF/EMF), zugeschnittene oder gefilterte Bilder | von LibreOffice gerendert, als PNG mit transparentem Hintergrund; nebeneinanderliegende Teile werden ein Bild |
| Seitenhintergrund | Papierfarbe oder gesperrtes Hintergrundbild |

Kleinere Publisher-Formate (Karten, A5, A6) werden auf A4 vergrößert und
zentriert; Querformat bleibt Querformat. Alle Elemente bleiben verschiebbar und
bearbeitbar.

Schriften werden auf die Schriften des Grundschulbuchs abgebildet, zum Beispiel
Grundschrift/GS → Grundschrift, Vereinfachte Ausgangsschrift → Schreibschrift VA,
Schulausgangsschrift → Schreibschrift SAS, Comic Sans → Andika, Serifenschriften
→ Merriweather und alles Übrige → Arial. Das Skript listet am Ende jede
Zuordnung auf.

## Grenzen

- Ein Textfeld des Grundschulbuchs hat eine Schriftart und eine Größe. Mischt ein
  Absatz Größen oder Schriften, gewinnt die häufigste.
- Die Schulschriften des Grundschulbuchs laufen etwas breiter als manche
  Publisher-Schrift. Text kann daher früher umbrechen; das Textfeld lässt sich
  danach anpassen.
- Größer als 150 pt geht nicht; solche Buchstaben werden auf 150 pt verkleinert.
- Symbolschriften (Wingdings u. ä.) werden als Bild übernommen. Eigene
  Symbolschriften (z. B. für Lernwörterzeichen) mit `--als-bild` angeben; die
  Schrift muss dafür installiert sein.
- Was LibreOffice selbst nicht richtig liest, etwa gedrehte Tabellen, fehlt
  auch im Heft. Zur Kontrolle hilft es, die `.pub`-Datei einmal in LibreOffice
  Draw zu öffnen.
- Interaktive Inhalte (Übungen, Ton) gibt es in Publisher nicht; sie werden im
  Grundschulbuch ergänzt.
