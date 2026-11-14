# Analyse: Vorlagen und Regal der HTML-Vorlage (12. November 2026)

Grundlage: `Lernsachen-Heft.html`, im Browser ausgewertet. Jede der 148 Vorlagen
wurde auf eine neue Seite gelegt; bei „Einstellbar“-Vorlagen wurde der
Einstellungsdialog bestätigt. Danach wurde gezählt, welche Elemente auf der Seite
liegen (`lh-text`, `lh-image`, `lh-sticker`, `lh-embed`, `lh-talk`, `lh-widget lh-wg-…`).

Ziel der Neuordnung:

- **Vorlagen** = nur Gestaltung (Lineatur, Layout, Text- und Bildfelder).
- **Lernwerkzeuge** = nur interaktive Bausteine, nach Fächern gruppiert.
- „Arbeitsblatt erzeugen“ und „Mit KI entwerfen“ sind vorerst ausgeschaltet
  (`src/lib/paused.ts`).

## 1. Die 148 Vorlagen der HTML-Vorlage

Drei Arten:

| Art | Anzahl | Was entsteht |
|---|---:|---|
| Gestalterisch | 63 | Nur Lineatur, Text-, Bild- und Stickerfelder |
| Einstellbare Arbeitsblätter | 7 | Ein Dialog erzeugt eine **statische** Seite (Text, Sticker, Bilder) – nichts Interaktives |
| Interaktiv | 78 | Mindestens ein Baustein, der auf der Seite bedient wird |

### 1.1 Gestalterisch (63) → gehören zu „Vorlagen“

- **Lineaturen (9):** Leer, Lineatur 1–3, Linien, Linien eng, Kariert,
  Rechenkästchen, Gepunktet
- **Schreiben (8):** Bild und Linien, Tagebuch, Postkarte, 4 Bilder und Linien,
  Buchstabenzeilen, Wörter üben mit Bildern, Bilderbuch, Brief
- **Mathe (3):** Sudoku 4×4, Sudoku 9×9, Schiffe versenken (in der Vorlage nur
  Raster und Text, also zum Ausfüllen mit dem Stift)
- **Schule (8):** Steckbrief, Lerntagebuch, Mindmap, Stundenplan, Tagesplan, Heute,
  Urkunde, Experiment
- **Gestalten (5):** Titelseite, Zeitung, Instagram-Post, Bildersammlung, Plakat
- **Präsentation (11):** Titelfolie, Titel und Text, Zwei Spalten, Vergleich, Bild
  und Text, Großes Bild, Kapitel, Zitat, Gliederung, Nur Titel, Schluss
- **Comic & Film (8):** Comic mit 6, 4, 3, 5 Bildern, 1 großes + 2 kleine, Streifen,
  Storyboard, Drehbuch
- **Musik (3):** Notenlinien, Klanggeschichte, Playlist (in der Vorlage nur Bild-
  und Textfelder)
- **Alltag (5):** Einladung, Lebenslauf, Speisekarte, Veranstaltungsprogramm, Rezept
- **Wohnen (3):** Zimmer einrichten, Kinderzimmer, Küche einrichten (leere Räume;
  eingerichtet wird mit den Möbeln aus dem Regal)

### 1.2 Einstellbare Arbeitsblätter (7) → Generator, Ergebnis ist statisch

Buchstaben üben · Mathe-Aufgaben · Uhrzeiten üben · Rechnen mit Geld · Ziffern üben
(3 Seiten) · Labyrinth · Noten lernen

Unser „Arbeitsblatt erzeugen“ (48 Formate) ist eine stark erweiterte Fassung genau
dieser sieben. Es stammt also teilweise aus der Vorlage, ist aber kein
interaktiver Baustein. Diese sieben gehören eher zu den Vorlagen, als „einstellbare
Vorlagen“.

### 1.3 Interaktiv (78) → gehören zu „Lernwerkzeuge“

In Klammern der Baustein der Vorlage (`lh-wg-…`) bzw. die Elementart.

- **Mathe (3)**
  - Rechnen mit dem Taschenrechner (`receipt` Kassenzettel + `mathtool` Taschenrechner)
  - Geometrie: Formen zeichnen (`geometry`)
  - Einkaufen an der Kasse (`shop`)
- **Interaktive Übungen (14)**
  - Monsternamen lesen (`monster`), Silben verbinden (`synth`), Silben klatschen,
    Anlaut-Tastatur (`anlaut`)
  - Quiz, Zuordnungen, Lesen & Schreiben, Memory, Maus & Käse,
    Kreuzworträtsel, Suchsel, Wordle, Silbenlesen
  - Das sprechende Kalenderblatt (`calendar`)
- **Kommunikationsbuch (19):** Kommunikationstafel, Kommunikationsbuch mit allen
  Tafeln, Tafeln mit 2/4/6/9/12/20 Feldern, Satzleiste + 15 Felder sowie die
  Themen-Tafeln (Erste Wörter, Ich brauche …, Gefühle, Schule, Familie, Freizeit,
  Essen, Kernwörter, Gespräch, Orte). Sie bestehen aus **Sprechtasten** (`lh-talk`,
  sprechen beim Antippen), teils mit **Satzleiste** (`strip`).
- **Schule (5)**
  - Karte (`map`)
  - Bilder-Stundenplan (`timetable`)
  - Applausometer und Lärmampel (beide `applause`, mit verschiedenen Einstellungen)
  - Multi-Timer (`multitimer`)
- **Präsentation (3)**
  - Diaschau (`slideshow`)
  - Elevator Pitch (`pitch`)
  - Video mit Titel (Einbettung)
- **Comic & Film (1):** Animation (`anim`)
- **Musik (30)**
  - Instrumente mit Metronom und Kassettenrekorder: Klavier, Xylophon, Glockenspiel,
    Klangrohre, Synthesizer (`piano`) sowie Schlagzeug, Cajón, Bongos & Congas,
    Orff-Instrumente, Klang-Pads (`drums`)
  - Instrument einstellen
  - Tonfolgen-Spiel: 3 Vorlagen und einstellbar (`echo`)
  - Notenregen: 3 Vorlagen und einstellbar (`fall`)
  - Noten-Trainer: Namen, Klaviertasten, Bassschlüssel (`notequiz`)
  - Beat-, Melodie- und Klang-Baukasten (`sequencer`)
  - Hörspiel-Studio (`hoerspiel`)
  - Kassettenrekorder (`recorder`)
  - Metronom, Stimmgerät (`tuner`)
  - Karaoke-Liedblatt
- **Video & Web (3):** Video, Webseite (Einbettung), QR-Plakat (`qr`)

Ohne Varianten bleiben **etwa 45 verschiedene Bausteine**.

## 2. Das Regal der Vorlage

17 Kategorien. Nur vier enthalten interaktive Bausteine; alles andere sind Sticker,
Sprechblasen und Formen, also reine Gestaltung.

| Kategorie | Interaktive Bausteine | Gestaltung |
|---|---|---|
| Zeit & Kalender | Uhr (analog/digital, sagt die Uhrzeit an), Timer (bis 60 min, Zeit als rote Fläche), Datum (heute, mit Wetter), Multi-Timer (Phasen als Ringe) | 44 Sticker: Jahreszeiten, Tageszeiten, Wochentage, Monate … |
| Geräte | Lärmampel, Applausometer, Stimmgerät, Kassettenrekorder | – |
| Mathe | Rechenschiffchen 5, 10, 20 · Rechenrahmen 20, 100 · Lineal 15 cm, 30 cm (echte Größe beim Druck) · Taschenrechner | – |
| Kommunikation | Sprechtaste (Bild + Wort, spricht), Satzleiste (sammelt Wörter), Zurück-Taste (zur vorigen Tafel) | – |
| Sprechblasen, Comic, Figuren, Emojis, Wetter, Stundenplan, Schule, Natur & Tiere, Wohnen, Küche, Formen | – | alles (Sticker, Blasen, Formen) |
| Persönlich | – | eigene Sammlung |

## 3. Abgleich mit unserer App

### 3.1 Vorlagen bei uns (140)

Davon sind heute **80 interaktiv** und müssen in die Lernwerkzeuge umziehen:

| Kategorie | Interaktive Vorlagen |
|---|---|
| Musik | 25 |
| Kommunikation | 19 |
| Interaktive Übungen | 14 |
| Schule | 8 |
| Mathe | 7 |
| Lesen & Schreiben | 4 |
| Präsentation | 2 |
| Comic & Film | 1 |

Es bleiben 60 gestalterische Vorlagen. Gegenüber der Vorlage fehlen dort noch:

- Sudoku 4×4/9×9 und Schiffe versenken als Raster
- Bildersammlung, Instagram-Post
- Experiment, Urkunde
- Notenlinien, Klanggeschichte, Playlist (als Seite)
- Comic 5 Bilder und Streifen, Storyboard, Drehbuch

Ob jeweils eine gleichwertige Vorlage unter anderem Namen existiert, wird beim
Umbau Stück für Stück geprüft.

### 3.2 Bausteine: vorhanden, fehlend, zusätzlich

**Vorhanden, müssen aber an die Vorlage angeglichen werden:**

- Mathe: Taschenrechner, Kasse, Geometrie
- Lesen und Schreiben: Monsternamen, Silben verbinden, Silben klatschen,
  Anlaut-Tastatur, Silbenlesen
- Übungen: Quiz, Zuordnungen, Memory, Kreuzworträtsel, Suchsel, Wordle
- Schule und Zeit: Kalenderblatt, Karte, Bilder-Stundenplan, Lärmampel,
  Applausometer, Multi-Timer, Timer, Uhr
- Präsentation und Film: Diaschau, Kurzvortrag, Animation
- Musik: Instrumente, Tonfolgen, Notenregen, Noten-Trainer, Baukasten,
  Hörspiel-Studio, Kassettenrekorder, Metronom, Stimmgerät, Karaoke
- Kommunikationstafel

**Fehlen bei uns als eigener Baustein:**

- **Zeit:** Datum (heute, mit Wetter)
- **Mathe:**
  - Rechenschiffchen 5, 10 und 20
  - Rechenrahmen 20 und 100 als eigene Bausteine (bei uns im „Rechenmaterial“ zusammengefasst)
  - Lineal 15 cm und 30 cm in echter Größe
  - Kassenzettel getrennt vom Taschenrechner
- **Kommunikation:** Sprechtaste, Satzleiste und Zurück-Taste als einzelne
  Bausteine (bei uns nur die ganze Tafel)
- **Medien:** QR-Plakat als Baustein (bei uns über „Internet“)
- **Übung:** „Lesen & Schreiben“ als eine Übung (bei uns verteilt auf Lückentext,
  Abschreiben und Blitzlesen)

**Bei uns zusätzlich, nicht in der Vorlage:**

- Übungen: Lückentext, Abschreiben, Blitzlesen, Buchstaben raten
- Spiele: Vier in einer Reihe (das Koordinaten-Spiel ist seit 13.11.2026
  entfernt)
- Mathe – interaktives Lernmaterial (neu gebaut am 13.11.2026, jeweils mit
  Einstellungsseite aus Schaltern, Schiebereglern und Auswahlknöpfen):
  - Stellenwerttafel in Montessori-Farben (Einer grün, Zehner blau, Hunderter
    rot, ab Tausender wieder von vorn); einstellbar von Einer bis
    Hunderttausender; Plättchen legen, Ziffern mit + und −, Bündeln und
    Entbündeln, Zahl darunter, „Lege die Zahl …“ mit Prüfen
  - Dienes-Material: Einerwürfel, Zehnerstangen, Hunderterplatten,
    Tausenderwürfel aus der Kiste legen und tauschen; Holz- oder
    Montessori-Farben; Aufgaben
  - Zahlenstrahl: Bereich (bis 10 … 1000, Ausschnitt), Beschriftung; Punkte
    setzen und Rechensprünge (+7, −3) zeichnen oder „Wo liegt die 37?“
  - Hunderterfeld bzw. Zwanzigerfeld: frei färben (Rot, Blau, Radierer,
    Wischen), Abdeckwinkel oder „Zeige 37“ mit Prüfen
- Musik: Playlist als Baustein

**Auffällig:**

- „Maus & Käse“ heißt bei uns sowohl das Labyrinth als auch das Buchstabenraten.
  Das muss beim Nachbau mit der Vorlage abgeglichen werden.

## 4. Vorschlag für die Gliederung der Lernwerkzeuge nach Fächern

- **Deutsch:** Anlaut-Tastatur, Silben klatschen, Silben verbinden, Silbenlesen,
  Monsternamen, Lesen & Schreiben, Kreuzworträtsel, Suchsel, Wordle, Maus & Käse
- **Mathematik:** Rechenschiffchen 5/10/20, Rechenrahmen 20/100, Lineal,
  Taschenrechner, Kassenzettel, Kasse, Geometrie
- **Sachunterricht:** Karte, Uhr, Kalenderblatt, Datum
- **Musik:** Instrumente, Tonfolgen, Notenregen, Noten-Trainer, Baukasten,
  Metronom, Stimmgerät, Karaoke, Hörspiel-Studio
- **Medien & Präsentation:** Diaschau, Kurzvortrag, Animation, Kassettenrekorder,
  Video, Webseite, QR-Plakat
- **Klassenführung:** Timer, Multi-Timer, Lärmampel, Applausometer,
  Bilder-Stundenplan
- **Unterstützte Kommunikation:** Sprechtaste, Satzleiste, Zurück-Taste,
  Kommunikationstafeln (2–20 Felder, Themen-Tafeln)
- **Für alle Fächer:** Quiz, Zuordnungen, Memory (Quiz von Quizsachen, Memory von Textsachen)

## 5. Umsetzung

**Schritt 1 – Struktur (erledigt):**

- `src/lib/learning/blocks.ts` ist der Katalog der Lernwerkzeuge: 78 Bausteine in
  acht Fächern. Die Voreinstellungen (Instrument, Trommelart, Rechenmaterial,
  Kommunikationstafeln) stammen aus den bisherigen interaktiven Vorlagen.
- Der Dialog „Lernwerkzeuge & Übungen“ arbeitet in zwei Stufen: Fach und Baustein
  wählen (mit Suche über alle Fächer), dann einstellen („Andere Auswahl“ führt
  zurück). Das Kommunikationsbuch fügt seine Seiten direkt ein.
- Der Vorlagen-Dialog zeigt nur noch gestalterische Vorlagen. Neue Kategorie
  „Einstellbar“ mit den sieben einstellbaren Arbeitsblättern der HTML-Vorlage;
  sie öffnen den Arbeitsblatt-Dialog mit passendem Format und Titel.

**Schritt 2a – Mathematik, Werkzeuge und Kassenzettel (erledigt):**

- Neuer Baustein `mathtool` (`lib/learning/mathtool.ts`, `MathTool.tsx`) nach
  Regal › Mathe der Vorlage: Rechenschiffchen 5/10/20 (Plättchen der Reihe nach,
  blau → rot → weg am letzten), Rechenrahmen 20/100 (Kugel schiebt mit allen davor),
  Lineal 10–30 cm in echter Größe (Elementbreite in mm), Taschenrechner (spricht
  das Ergebnis). Gleiche Maße, Farben und Logik; „Alles weg“-Knopf. Der Zustand
  wird als Antwort gespeichert (bleibt in Kinderheften erhalten).
- Neuer Baustein `receipt` (`lib/learning/receipt.ts`, `Receipt.tsx`):
  Kassenzettel wie „Rechnen mit dem Taschenrechner“ – drei Warenlisten
  (Supermarkt, Kaufhaus, Kiosk), leichte oder krumme Preise, Summe mit
  Ziffernblock oder Tastatur, Rückgeld zu einem passenden Schein, Stempel
  „RICHTIG“, mehrere Zettel und Auswertung (Zeit, Fehler, Verbesserungen).
- Baustein „Rechnen mit dem Taschenrechner“ setzt wie die Vorlage eine Seite mit
  Kassenzettel und Taschenrechner ein. Neue Lernwerkzeuge erscheinen mittig und
  versetzt.
- Die alten Bausteine „Taschenrechner & Kassenzettel“ und „Zwanzigerfeld“ sind
  aus dem Katalog genommen; vorhandene Elemente funktionieren weiter.

**Schritt 2b – Geometrie: Formen zeichnen (erledigt):**

- Neuer Baustein `geodraw` (`lib/learning/geodraw.ts`, `GeoDraw.tsx`) wie die
  Vorlage: eine ganze Karoseite (5 mm), Aufgabenkasten mit Vorlesen, Vorschau und
  Überprüfen. Gezeichnet wird mit dem normalen Stift auf der Seite; „Start“ nimmt
  den Stift und legt Lineal oder (bei Winkeln) Geodreieck hin.
- Aufgaben nach Schwierigkeit (leicht, mittel, schwer, ansteigend) und Formen
  (Strecken, Vierecke, Dreiecke, weitere: Treppe, Haus …), Genauigkeit
  großzügig/normal/genau (3,5/2/1 mm, 5/3/2°), Vorschau 0–3 Sekunden.
- Prüfung wie in der Vorlage: Striche vereinfachen (Douglas–Peucker), Stücke auf
  einer Linie zusammenfassen, Strecken zuordnen; genaue Rückmeldung („Die linke
  Seite ist 3 mm zu kurz.“, „… ist schief“, „Eine Linie ist zu viel.“), farbige
  Markierung, „Lösung zeigen“ nach zwei Versuchen, Auswertung mit Mini-Zeichnungen.
- Die Editoren geben den Lernwerkzeugen dafür `drawing` (Striche lesen, Stift und
  Hilfe einschalten, Striche im Aufgabenbereich löschen; `Runtime.tsx`).
- Der alte Baustein „Geometrie mit Prüfen“ ist aus dem Katalog genommen; vorhandene
  Elemente funktionieren weiter.

**Schritt 2c – Einkaufen an der Kasse (erledigt):**

- Neuer Baustein `checkout` (`lib/learning/checkout.ts`, `checkout-people.ts`,
  `Checkout.tsx`, `CheckoutOptions.tsx`), Nachbau der Kasse der Vorlage auf einer
  ganzen Seite (Bühne 1400 × 990): Laden mit Schild und Tür, sieben gezeichnete
  Kunden, die hereinlaufen und mit eigener Stimme (Tonhöhe, Tempo) bestellen,
  Sprechblase mit Bildern und Anzahl, Regal, Einkaufszettel (Datum, Zeit, Anz,
  Einzel, Summe), „Kunde zahlt“ mit PRÜFEN, Rückgeld, Schublade mit Münzen und
  Scheinen, Auswertung (Zeit, ohne Fehler, Fehler nach Waren/Bezahlen/Rückgeld,
  Verbesserungen, Tabelle je Kunde).
- Gleiche Abläufe und Sätze wie die Vorlage („Das stimmt aber nicht. Ich möchte …“,
  „Es fehlen noch …“, „Das Wechselgeld beträgt …“), Münzen und Scheine werden
  gestapelt, Rückgeld der Kasse lässt sich durch Antippen wechseln.
- Einstellungen wie im Dialog der Vorlage: 9 Warenkörbe, 6 Preisstufen (Preise
  neu würfeln, Reihenfolge bleibt), Kunden 1–10, Waren je Kunde bis 1–5, mehrere
  Stück, Bilder in der Sprechblase, Vorlesen beim Antippen, Rückgeld selbst
  herausgeben, Schild, eigene Waren mit Bild, Preis, Artikel (einen/eine/ein),
  Einzahl und Mehrzahl; Vorschau oben.
- Bilder: die 81 ARASAAC-Warenbilder der Vorlage und 14 ARASAAC-Geldbilder liegen in
  `public/kasse/` (CC BY-NC-SA 4.0); beim Export werden sie mitgenommen. Eigene
  Bilder liegen auf dem Schulserver.
- Der alte Baustein „Einkaufen & Rückgeld“ ist aus dem Katalog genommen; vorhandene
  Elemente funktionieren weiter. Mathe-Werkzeuge mit festen Einstellungen
  (Rechenschiffchen, Rechenrahmen, Lineal, Taschenrechner) kommen ohne
  Einstellungsschritt direkt auf die Seite.

**Schritt 2d – Einstellbare Vorlagen mit den Dialogen der Vorlage (erledigt):**

- Die sieben einstellbaren Vorlagen öffnen jetzt die Einstellungsdialoge der
  Vorlage (`components/sheets/*SheetDialog.tsx`, gemeinsame Teile in
  `SheetParts.tsx`): nummerierte Abschnitte, Vorschau mit „Seite 1 von N“,
  „Andere Aufgaben“, „N Seiten einfügen“; Einstellungen bleiben im Browser.
- Die Generatoren der Vorlage sind unverändert übernommen
  (`lib/sheets/reference-sheets.ts`: Mathe-Aufgaben mit 27 Übungen, Uhrzeiten,
  Rechnen mit Geld, Labyrinth, Noten lernen, Buchstaben/Ziffern üben) und werden
  von `lib/sheets/convert.ts` in unsere Seiten umgerechnet (1400 × 990 → mm).
  Gezeichnete Teile werden beim Einfügen als Bild auf dem Schulserver gespeichert.
- Neu: Eintippkästchen. Ein Text mit Platzhalter ist ein Antwortfeld,
  in das Kinder und Lehrkräfte direkt tippen (`editor/AnswerField.tsx`); der
  Server erlaubt Kindern bei gesperrten Kästchen nur die Antwort (`lockedDesign`).
  Eingefügte Seiten sind nicht gesperrt und lassen sich nachträglich bearbeiten.
- Bilder: ARASAAC-Münzen/Scheine (`public/kasse/geld-*`), Anlaut- und Mengenbilder
  (`public/bilder/`), eigene Zeichnungen aus der Stickerbibliothek der Vorlage
  (`lib/sheets/letter-pictures.json`).
- Abweichungen: Druckschrift (Gruschudru) ist noch nicht in der App – Andika steht
  dafür ein (wie der Ersatz der Vorlage). Geld-Kombinationen, mit denen die
  Vorlage keine Aufgabe bilden kann (z. B. Nur Euro + Nur Münzen bei Wechselgeld),
  werden mit Hinweis weggelassen statt abzustürzen.

**Deutsch – Übungen von Textsachen (13.11.2026):** Lesen & Schreiben (Bild-,
Hör- und Wortdiktat, Blitzlesen, Lesen mit Bilder-Quiz, Lückentext, Abtippen),
Memory mit Wörtern, Maus & Käse, Kreuzworträtsel, Suchsel und Wordle laufen mit
dem Originalspieler von Textsachen (Lernsachen.blog, CC BY-NC-SA 4.0), genau wie
im Lernsachen-Heft – aber ohne Internet: `scripts/extract-players.mjs` löst den
Spieler aus der veröffentlichten App (`reference/textsachen-player.ts`),
`TextsachenFrame.tsx` startet ihn in einem eigenen Rahmen (Seite wie im
Lernsachen-Heft, Schriften der Seite, Bilder als Daten-Adressen) und speichert den
Spielstand je Kind. Die Einstellungen (`TextsachenOptions.tsx`) folgen dem Editor
von Textsachen: Wortliste oder Text mit Lernwörtern, Übungsart, Bilder (fehlende
werden in ARASAAC gesucht), Abschnitt zur Übung, Schrift, Hilfen, Vorlese-Stimme,
Checkliste. Die Übung kommt wie in der Vorlage auf eine eigene Seite. Die
früheren eigenen Übungen (Lückentext, Abschreiben, Blitzlesen, Buchstaben raten,
Kreuzworträtsel, Suchsel, Worträtsel) sind nicht mehr auswählbar; vorhandene
Seiten damit funktionieren weiter.

**Zuordnungen (Schiebesachen, 13.11.2026):** Wie im Lernsachen-Heft entstehen
Zuordnungen mit dem Baukasten des Schiebesachen-Dialogs „Neue Übung“ (Bild und
Wort, Oberbegriffe sortieren, Artikel, Reihenfolge, Paare, Buchstabieren,
Silbenlesen) und laufen mit dem Originalspieler. `scripts/extract-players.mjs`
übernimmt den Baukasten unverändert (nur die nötigen Deklarationen, per
Scope-Analyse ermittelt, samt Silbentrennung) nach
`reference/schiebesachen-builder.ts`. Der Dialog (`ZuordnungOptions.tsx`) folgt
„Neue Übung“: Format, Liste mit Beispiel und „So geht's“, Format-Optionen,
Bilder (ARASAAC-Suche), Design, Vorschau. Die Übung wird beim Einstellen gebaut
und gespeichert, damit der Spielstand der Kinder zu den Karten passt. „Zuordnungen“
steht unter „Für alle Fächer“; Silbenlesen, Buchstabieren, Artikel und Bild und
Wort zusätzlich unter Deutsch. „Bild beschriften“ fehlt noch (braucht das
Platzieren der Bereiche auf einem eigenen Bild). Die frühere eigene Zuordnung
und das frühere Silbenlesen sind nicht mehr auswählbar.

**Einstellungsseiten Deutsch:** Monsternamen, Silben verbinden, Anlaut-Tastatur
und Silben klatschen zeigen ihre Auswahl jetzt wie die neueren Seiten – Schalter
statt Ja/Nein-Kacheln, Schieberegler für Anzahlen, Auswahlknöpfe mit Überschrift
(`OptionControls.tsx`).

**Quiz (Quizsachen, 14.11.2026):** Wie im Lernsachen-Heft läuft das Quiz mit
dem Originalspieler von Quizsachen (QuizPlayer), ohne Internet.
`scripts/extract-players.mjs` übernimmt ihn unverändert
(`reference/quizsachen-player.ts`), dazu per Scope-Analyse die Vorlagen von
„Neues Quiz“ und das Einlesen von „Fragen per Text eingeben“
(`reference/quizsachen-builder.ts`; Quizsachen-Format, GIFT, Aiken). Der Dialog
(`QuizOptions.tsx`) bietet: Vorlage (Bunte Kacheln, Bilderrätsel, Bilder
auswählen, Hör-Quiz, Richtig oder falsch?, Reihenfolge, Zeitstrahl, Leicht
lesen, Schlicht), Fragen als Text mit Beispiel und „So geht's“, Bilder zu
`[Bild: …]` (ARASAAC-Suche oder eigenes Bild) und den Ablauf wie in Quizsachen
(Rückmeldung, Versuche, Lösung, Töne, Teilpunkte, Bestanden ab, Mischen,
Fortschritt, Startkarte, Vorlesen, Abschlusskarte), dazu eine Vorschau. Das Quiz
wird beim Einstellen gebaut und gespeichert (`lib/learning/quiz.ts`), der
Spielstand gilt je Kind. Es kommt auf eine eigene Seite. Unter „Für alle Fächer“
stehen jetzt Quiz, Zuordnungen, Memory (von Textsachen) und Vier in einer Reihe;
das frühere eigene Quiz, Memory und Labyrinth · Maus & Käse sind nicht mehr
auswählbar, vorhandene Seiten damit funktionieren weiter.

Hinweis zum Skript: Schiebesachen wurde inzwischen neu gebaut, die
Kurznamen in `BUILDER` passen nicht mehr. Das Skript lässt den Baukasten dann
unverändert und meldet das (ebenso für Quizsachen).

**Zeit: Uhr, Timer, Datum, Multi-Timer (14.11.2026):** Die Widgets aus Regal ›
Zeit und der Multi-Timer der Vorlage sind unverändert übernommen:
`scripts/extract-class-reference.mjs` löst sie samt Abhängigkeiten aus
`Lernsachen-Heft.html` (wie bei den Musikwerkzeugen) nach
`reference/class-runtime.ts`. Vom Widget-Schalter der Vorlage (HO) werden nur
die Fälle Uhr, Timer und Datum genommen; Antippen und Ticken folgen Xle/qle.
`TimeWidget.tsx` zeigt Uhr (analog/digital, sagt die Uhrzeit an), Timer (fest:
läuft beim Öffnen los; flexibel: jedes Antippen die nächsten 5 Minuten; Gong;
„Neu starten“/„Ausschalten“ wie in der Werkzeugleiste der Vorlage) und Datum
(heute, mit Wetter in einem Wort und Symbol). `MultiTimerWidget.tsx` zeigt den
Multi-Timer mit echter Uhrzeit und Phasen als Ringen, Start, Pause, Vollbild und
seiner eigenen „Timer Konfiguration“; Änderungen dort werden als Antwort des
Elements gespeichert. Einstellungsseiten (`TimeOptions.tsx`,
`MultiTimerOptions.tsx`) mit den Wahlmöglichkeiten der Dialoge der Vorlage.
Das Wetter (Open-Meteo, CC BY 4.0) fragt der Schulserver ab (`/api/wetter`,
nur angemeldet), die Geräte der Kinder sprechen keinen fremden Dienst an.
Uhr und Datum stehen unter Sachunterricht, Timer und Multi-Timer unter
Klassenführung. Die frühere Lernuhr, der eigene Timer und Multi-Timer sind nicht
mehr auswählbar; vorhandene Seiten damit funktionieren weiter.

**Schritt 2 – Fach für Fach (offen):** Mathematik, Deutsch, Musik und Für alle Fächer (fertig), Sachunterricht/Zeit,
Klassenführung, Unterstützte Kommunikation, Medien – jeweils an der Vorlage
angleichen und fehlende Bausteine ergänzen (siehe 3.2).
