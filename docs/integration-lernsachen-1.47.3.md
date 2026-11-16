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

## Noch offene Übernahmen

65 neue Katalogeinträge sind noch offen. Dazu gehören insbesondere:

- die neuen Hörwerkzeuge und „Laute hören“;
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
