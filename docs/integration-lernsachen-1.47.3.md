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

## Sechste Ausbaustufe: Programmieren, Linksammlung, Figuren

80 der 89 Einträge sind integriert.

- **Programmieren** (neues Fach wie in der Vorlage, 20 Bausteine): ein
  Bodenroboter auf einem Teppich, gesteuert mit Pfeilkarten oder Tasten;
  Lektionen Zum Ziel, Wörter abfahren, Rechnen und fahren, Zahlen der Reihe
  nach, Sterne sammeln, Programme lesen (Wo kommt die Figur an?, Fehler
  finden, Was fehlt?), Schleifen, Stift, Musik, Bedingungen, Achtung Katze!,
  Punkte zählen, Pfeile programmieren. Der Dialog bietet alle Einstellungen der
  Vorlage mit spielbarer Vorschau, Figur und Teppich als Bilder; eigene
  Aufgaben auf dem Teppich zu zeichnen bietet er noch nicht.
- **Linksammlung** und **Nachrichten in leichter Sprache** (Medien &
  Präsentation): Karten, Liste, Kacheln oder Knöpfe, Farbe, Lernpfad. Links
  öffnen in einem neuen Fenster, bei Kindern nur mit eingeschaltetem
  „Internet“. Titel und Bild einer Seite holt die Vorlage selbst aus dem Netz;
  das entfällt hier, sie werden eingetragen bzw. gesucht.
- **Figur** (Für alle Fächer) und **Gefühle-Karten** (Klassenführung): der
  Figuren-Editor der Vorlage mit einem Bild der Figur je Auswahl (Kind oder
  Erwachsen, Haut, Haare, Kopfbedeckung, Gefühl, Augen, Mund, Bart, Brille,
  Kleidung, Schuhe) und dem Satz, den sie beim Antippen sagt; die Bewegungen
  des Editors fehlen noch.
- **Praktikumsmappe: Einschätzung** (Beruf & Praktikum) als Voreinstellung der
  Selbst- und Fremdeinschätzung.

## Siebte Ausbaustufe: Arbeitsblätter und Puppentheater

87 der 89 Einträge sind integriert.

- **Einstellbare Arbeitsblätter** (Vorlagen › Einstellbar): Laute hören,
  Karopapier: Symmetrie, Muster, Messen, Rechnen im Alltag: Lohn, Fahrplan,
  Geld, Programmieren: Arbeitsblatt und Etiketten. Die Generatoren der Vorlage
  sind unverändert übernommen (`src/lib/sheets/sheets-1473.ts`, vom
  Extraktionsskript), die Dialoge folgen ihnen mit unseren Bausteinen
  (Übungen, Stufe, Seiten, Lösungsseiten, Vorschau). Lösungskontrolle wie in
  der Vorlage (Stand 20.11.2026) für Karopapier, Rechnen im Alltag und Laute
  hören: „Keine“, „Sofort ✓ ✗“ oder „Knopf ‚Prüfen‘“ (zeigt ✓/✗ und „3 von 5
  richtig · …“; das Zeichen bleibt, bis die Antwort geändert wird). Vergleich
  in `lib/sheets/answers.ts` (7 = 7 cm = 70 mm, Uhrzeiten, Geld). Seiten mit
  Lineal-Aufgaben (Karopapier „Strecken messen/zeichnen“, `page.tool`): Stift
  an, Lineal unten links bereit, im Heft und im Kinderheft; auf anderen Seiten
  geht es wieder weg. Eintippkästchen lassen sich auch mit eingeschaltetem
  Stift antippen.
  „Laute hören“ nimmt die Anlautbilder des Hefts; weitere Bilder holt ein
  Knopf über den Schulserver bei ARASAAC, sonst steht das Wort da. Etiketten
  suchen ihre Bilder über die Bildsuche und werden mit „Vorlesen beim
  Antippen“ zu Sprechtasten. Die eingebauten Wortlisten der Vorlage fehlen
  noch; die Wörter werden eingetippt.
- **Puppentheater** (Medien & Präsentation): Bühne mit Figuren, Aufnahme von
  Stimme und Bewegungen, Abspielen und Video wie in der Vorlage. Die Aufnahme
  wird auf den Schulserver geladen (Kinder dürfen hier auch ohne Ton-Freigabe
  aufnehmen, wie beim Kassettenrekorder); Bewegungen und Figurenpositionen
  stehen in der Antwort des Elements. Im Dialog: Titel, Bühnenbild oder eigenes
  Bild, bis zu sechs Figuren mit dem Figuren-Editor, automatischer
  Seitenwechsel.

## Achte Ausbaustufe: Erklärbär

88 der 89 Einträge sind integriert; nur „KI-Partner bauen“ ist zurückgestellt.

- **Textsachen-Spieler 1.47.3**: TSPlayer kommt jetzt aus dem Paket
  `player-textsachen` von Lernsachen-Heft-komplett.html
  (`node scripts/extract-players.mjs Lernsachen-Heft-komplett.html - -`; „-“
  überspringt Schiebesachen und Quizsachen). Gegenüber der bisherigen Fassung
  ändert sich nur der Erklärbär: Eine leere Zeile beginnt eine neue Szene, auf
  ein Blatt kommen höchstens sechs Bilder, und die Option `autoScenes` schaltet
  das automatische Umblättern ab. Die übrigen Übungen bleiben gleich.
- **Erklärbär** (Medien & Präsentation, außerdem als Übungsart unter
  Lesen & Schreiben › Übungen mit dem Text): ein eigener Editor nach unseren
  UI-Regeln statt des eingebetteten Textsachen-Editors. Text mit Leerzeilen,
  Bildwörter antippen, Bilder suchen oder wählen; dann
  - **Szenen**: Übersicht wie in der Vorlage, „Szenen auch automatisch
    wechseln“;
  - **Aussehen**: 18 Hintergründe als Kacheln (Vorschaubilder vom Spieler
    selbst gezeichnet, `scripts/build-explain-backgrounds.mjs` →
    `public/previews/erklaerbaer`), Untertitel und Wörter unter den Bildern,
    jeweils mit Silben rot und blau, Hand hell/mittel/dunkel, Pause nach
    jedem Satz;
  - **Stimme**: Computerstimme oder eigene Aufnahmen, eine pro Satz
    (Aufnehmen, Anhören, Löschen; Ton auf dem Schulserver);
  - **Musik**: Ruhig, Fröhlich, Neugierig (vom Spieler erzeugt) oder eine
    eigene Datei bis 12 MB, Lautstärke;
  - **Vorschau und Video**: der Film im Dialog mit „Als Video speichern“. Wie
    in der Vorlage gibt es den Knopf im Heft nicht.

  Sätze und Szenen berechnet `src/lib/learning/erklaerbaer.ts` genau wie der
  Spieler (ein Test vergleicht mit dessen Tokenizer). Aufnahmen stehen als
  Liste `{ sentence, audio }` in den Einstellungen, weil der Server nur
  Bezeichner als Schlüssel zulässt und Medien unter `audio` prüft.

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
