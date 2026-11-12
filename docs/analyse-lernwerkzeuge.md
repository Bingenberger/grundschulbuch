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
- Spiele: Vier in einer Reihe, Koordinaten-Spiel
- Mathe: Zahlenstrahl, Stellenwerttafel (als Rechenmaterial)
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
- **Für alle Fächer:** Quiz, Zuordnungen, Memory

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

**Schritt 2 – Fach für Fach (offen):** Mathematik, Deutsch, Sachunterricht/Zeit,
Klassenführung, Unterstützte Kommunikation, Musik, Medien – jeweils an der Vorlage
angleichen und fehlende Bausteine ergänzen (siehe 3.2).
