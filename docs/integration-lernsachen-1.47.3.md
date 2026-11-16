# Übernahme aus Lernsachen-Heft 1.47.3

Ausgangspunkt ist der [Versionsvergleich](vergleich-lernsachen-versionen.md).

## Erste Ausbaustufe: bearbeitbare Seitenvorlagen

18 der 89 neuen Katalogeinträge sind integriert:

- **Schule:** neues Lerntagebuch und farbiger Stundenplan.
- **Gestalten:** alle neun Schülerzeitungsseiten und „Ein Kunstwerk betrachten“.
- **Beruf & Praktikum:** Deckblatt, Mein Betrieb, Mein Arbeitsplatz, Tagesbericht,
  Wochenrückblick und Dankschreiben.

Die Vorlagen stehen in der Auswahl für neue Seiten und im Vorlageneditor zur
Verfügung. Ihre Vorschau wird direkt aus den tatsächlichen Seitenelementen
gezeichnet. Texte, Bildplätze, Linien, Formen und der Stern auf der Zeitung sind
einzeln bearbeitbar. Veröffentlichte Schulvorlagen bleiben erreichbar.

Die Vorlesetasten verwenden eine lokal installierte deutsche Stimme. Text, Name,
Farbe, Größe und Position sind bearbeitbar und werden mit der Seite gespeichert.
Im Tagesbericht ist außerdem der originale Aufnahmeplatzhalter enthalten; er
öffnet die vorhandene Tonaufnahme. Der bestehende Kassettenrekorder bleibt die
gemeinsame Aufnahmefunktion der App.

Das neue Lerntagebuch übernimmt den bestehenden Vorlagenschlüssel
`bp-diary-6-1`. Der bisherige Entwurf bleibt intern erhalten, erscheint aber nicht
mehr als zweite Vorlage gleichen Namens im Katalog. Insgesamt enthält das
Seitenregister nach dem [vollständigen statischen Originalabgleich vom 16.11.2026](vorlagenabgleich-2026-11-16.md) 84 Entwürfe, davon 83 sichtbar, und 2506 Vektor- und Rahmenbestandteile.

Die Übernahme erfolgt über `scripts/extract-page-templates.mjs` aus
`Lernsachen-Heft-komplett.html`. Das Skript erkennt Hauptmodul und normalisiertes
Vorlagenregister anhand ihrer Struktur, prüft die ausgewählten Kennungen und
bricht bei unbekannten Elementtypen ab. Die vollständigen eingebetteten Editoren
werden nicht versehentlich als Hauptprogramm gelesen.

## Zweite Ausbaustufe: Kommunikationsbuch

Die sechs neuen Themen-Tafeln sind integriert (24 der 89 Einträge): Arbeit und
Praktikum, Werkzeuge, Wohnen und Haushalt, Beim Arzt, Kochen und
Gesprächsrunde. Sie stehen unter Lernwerkzeuge › Unterstützte Kommunikation und
im Kommunikationsbuch, dessen Startseite nun alle 16 Tafeln im Raster 4 × 4
zeigt. `scripts/extract-class-reference.mjs` übernimmt Tafelliste, Buchsymbole
und Buch-Raster aus `Lernsachen-Heft-komplett.html`; Tasten, Satzleiste und
Layout sind in beiden Versionen gleich. Die Bildersammlung wächst von 121 auf
190 ARASAAC-Bilder; die bisherigen sind bytegleich.

## Dritte Ausbaustufe: Hörwerkzeuge und Werkzeug-Grundlage

Hör-Memory und Was hörst du? sind integriert (26 der 89 Einträge): ein
Werkzeug mit zwei Spielen unter Lernwerkzeuge › Musik. Geräusche aus Alltag
und Natur oder Instrumente (höchstens acht, beim Antippen im Dialog zu hören)
oder eigene Aufnahmen mit Wort und Bild. Die eingebauten Klänge entstehen auf
dem Gerät; eigene Aufnahmen und Bilder liegen auf dem Schulserver. Der
Einstellungsdialog zeigt das Spiel spielbar als Vorschau.

Grundlage ist der neue Werkzeug-Host der Vorlage (SVG mit antippbaren Teilen),
auf dem in 1.47.3 rund 20 weitere neue Werkzeuge aufbauen, etwa Strichliste,
Glücksrad, Suchbild, Muster, Ampel, Sortieren, Stressbarometer, Wochenplan,
Telefon, Automaten, Gefühle und die Praktikumseinschätzung.
`scripts/extract-tools-reference.mjs` übernimmt ihn unverändert nach
`src/lib/reference/tools-runtime.ts` und findet jedes Werkzeug über seine
Widget-Klasse statt über die (versionsabhängigen) Kurznamen. Weitere Werkzeuge
werden dort ergänzt.

## Vierte Ausbaustufe: Mathe-Werkzeuge

Strichliste und Diagramm, Glücksrad und Würfel, Suchbild und Muster fortsetzen
sind integriert (30 der 89 Einträge) und stehen unter Lernwerkzeuge ›
Mathematik. Alle Werkzeuge des neuen Werkzeug-Hosts teilen sich die
Widget-Art `werkzeug` (`settings.tool`, `settings.werkzeug` wie in der
Vorlage; `src/lib/learning/werkzeuge.ts`, `ToolWidget.tsx`). Die
Voreinstellungen und Größen stammen aus den Katalogeinträgen der Vorlage
(`src/lib/learning/werkzeug-presets.json`, erzeugt vom Extraktionsskript).

- Was ein Werkzeug sich merkt (z. B. die Striche der Strichliste), speichert
  die Vorlage über Rückrufe; bei uns landet es als Antwort des Elements, mit
  einem Fingerabdruck der Einstellungen. Neue Einstellungen gelten deshalb
  vor alten Strichen; der Dialog zeigt beim Öffnen die aktuellen Striche.
- Glücksrad und Würfel kommt wie in der Vorlage als Seite mit Rad und
  Strichliste; das Rad zählt in die Strichliste derselben Seite. Dafür sucht
  das Werkzeug seine Seite bei uns als Arbeitsfläche statt `.lh-page` (einzige
  Änderung am übernommenen Code, im Skript beschrieben). Anders als in der
  Vorlage passt das Bearbeiten des Rads die Felder der Strichliste nicht
  automatisch an; sie wird dafür selbst eingestellt.
- Die Einstellungsdialoge folgen den Dialogen der Vorlage mit spielbarer
  Vorschau, mit unseren Bedienelementen. Die Wortlisten-Auswahl des Glücksrads
  fehlt noch; die festen Feld-Vorschläge der Vorlage sind da.

## Fünfte Ausbaustufe: Alltag, Beruf & Praktikum, Klassenführung

Neue Fächer unter Lernwerkzeuge (Entscheidung vom 16.11.2026): **Alltag** und
**Beruf & Praktikum** wie in der Vorlage. Die Schul-Werkzeuge der Vorlage
kommen zu **Klassenführung**, die Zeitleiste (Gestalten) zu **Für alle
Fächer**. Integriert sind damit 45 der 89 Einträge:

- Alltag: Ablaufplan, Mein Weg (Wegeplan), Checkliste, Stressbarometer,
  Fußgängerampel, Telefonieren üben, Notruf üben, Wo tut es weh?
- Beruf & Praktikum: Selbst- und Fremdeinschätzung, Stückzähler, Gespräche üben
- Klassenführung: Wie geht es dir heute?, Abstimmung und Wahl, Rückmeldung zu
  meiner Arbeit
- Für alle Fächer: Zeitleiste (Lebenslauf)

Die Einstellungsdialoge entstehen aus einer Beschreibung der Felder
(`ToolForm.tsx`, `tool-forms.ts`): Überschrift, Auswahlen, Schalter, Farbe,
Listen mit Bild und Wort (Bildsuche, eigenes Bild, „Fehlende Bilder suchen“),
fertige Listen der Vorlage. Wie in der Vorlage arbeitet der Dialog mit einem
Entwurf, damit neue leere Zeilen stehen bleiben. Gespeichert werden die
Antworten der Checkliste, die Stimmen der Abstimmung, der Stückzähler und die
Gesichter der Einschätzung. Seiten der Vorlage mit Texten und Vorlesetasten
(Rückmeldung, Mein Weg) werden wie die Originalseitenvorlagen in bearbeitbare
Elemente umgewandelt.

Dazu kommen (48 der 89 Einträge) Nähe und Distanz (Kreise mit Regeln und
Farben, Personen mit Bild; wohin die Kinder sie legen, wird gespeichert) sowie
Wochenplan und Dienstplan (eine Liste pro Tag mit Uhrzeiten, Dienste und
Namen) unter Alltag.

Außerdem Sortieren (Alltag) und Bild-Quiz: Was bedeutet das? (Beruf &
Praktikum), 50 der 89 Einträge. Die zwölf fertigen Sets der Vorlage
(Ernährungsampel, Mülltrennung, Schilder, Wäsche-Symbole, Werkzeuge …) kommen
mit ihren Bildern: 99 ARASAAC-Bilder aus dem Paket „sort-pictos“ und die von
der Vorlage gezeichneten Schilder und Zeichen liegen in `public/sortieren/`,
die Sets in `src/lib/learning/sort-sets.json` (beides vom Extraktionsskript).
Wie in der Vorlage beginnt Sortieren mit der Ernährungsampel und das Bild-Quiz
mit den Schildern. Die Wahl des Kastens je Karte sind Knöpfe statt einer
Auswahlliste.

Schließlich Geld-Planer, Geld-Planer zum Ausfüllen, Kassenbuch und die drei
Automaten (Fahrkarten-, Geld- und Getränkeautomat), 56 der 89 Einträge.
Beträge werden im Dialog in Euro eingegeben und wie in der Vorlage in Cent
gespeichert. Füllen die Kinder den Geld-Planer auf der Seite aus, speichert
die Vorlage den ganzen Plan; bei uns ist das die Antwort des Elements. Bilder
dazu kommen aus unserer Bildsuche und liegen auf dem Schulserver.

## Noch offene Übernahmen

33 neue Katalogeinträge sind noch offen: Programmieren (21), „Laute hören“,
KI-Partner bauen (zurückgestellt), Nachrichten in leichter Sprache,
Linksammlung, Figuren, Puppentheater, Erklärbär und weitere einzelne Einträge. Dazu gehören insbesondere:

- „Laute hören“ (einstellbares Arbeitsblatt, gehört zu Vorlagen › Einstellbar);
- Programmieren sowie die interaktiven Werkzeuge für Alltag und Beruf;
- Gefühle-Karten und die interaktive Praktikumseinschätzung;
- die vollständige Zusammenstellung der Praktikumsmappe;
- Puppentheater, Erklärbär, Medien und KI.

Zusätzlich bleiben die gemeinsamen Erweiterungen des Bildquellenablaufs, der
Übungseditoren und des PDF-Arbeitsblattexports eigenständige Arbeitspakete.

## Prüfung

- Alle 84 Entwürfe werden in Hoch- und Querformat erzeugt und durch die
  serverseitige Seitenvalidierung geprüft.
- Katalogschlüssel, Übernahme des Lerntagebuchs, editierbare Vorlesetexte und
  der Stern werden gezielt geprüft.
- Ein Browservergleich stellt alle 84 Entwürfe sowie Papier- und Startervarianten (99 Vergleiche) den Original-SVGs und
  Originalelementen gegenüber. Die Toleranz für Rasterungsunterschiede liegt
  beim mittleren RGB-Fehler unter einem Prozent.
- Browserabläufe prüfen das Bearbeiten, Veröffentlichen, erneute Öffnen,
  Bildbefüllen und Vorlesen mit einer kontrollierten Teststimme. Die tatsächliche
  Stimmqualität hängt von den auf dem Gerät installierten Stimmen ab.
