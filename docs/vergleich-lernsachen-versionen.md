# Vergleich der beiden Lernsachen-Heft-Versionen

Stand: 16. November 2026. Verglichen wurden die lokalen Dateien [Lernsachen-Heft.html](../Lernsachen-Heft.html) und [Lernsachen-Heft-komplett.html](../Lernsachen-Heft-komplett.html).

Die neue Datei enthält sowohl einen deutlich erweiterten Funktionsumfang als auch zusätzlich vollständig eingebettete Programme. Der Zusatz „komplett“ beschreibt daher nur einen Teil des Unterschieds.

## Umfang und Zählweise

| Merkmal | Bisherige Datei | Neue Datei |
| --- | --- | --- |
| Angegebene Programmversion | 1.34.1 | 1.47.3 |
| Dateigröße in Bytes | 9.466.019 | 24.759.755 |
| Vorlagen-/Werkzeugkennungen insgesamt | 163 | 252 |
| Davon im Katalog sichtbar | 148 | 236 |
| Davon intern ausgeblendet | 15 | 16 |
| Eingebettete Zusatzpakete (lh-pack) | 23 | 30 |

Die Datei wächst um **15.293.736 Bytes bzw. 161,6 %**. Rund **80,2 % dieses Zuwachses** entfallen allein auf die drei neu eingebetteten vollständigen Editoren von Quizsachen, Schiebesachen und Textsachen.

Die Katalogzahlen umfassen Seitenvorlagen, Lineaturen, interaktive Generatoren und deren vorgegebene Varianten. Sie sind keine Anzahl eigenständiger Programme und nicht direkt mit der Anzahl der Lernwerkzeug-Karten in Grundschulbuch vergleichbar.

**89 Kennungen kommen hinzu, keine bisherige Kennung fällt weg.** Von den 163 bisherigen Katalogdefinitionen sind 159 im normalisierten Vergleich unverändert. Vier Definitionen unterscheiden sich; Details stehen unten. Gleiche Vorlagendaten bedeuten nicht automatisch gleiche Laufzeitfunktionen: Gemeinsame Editoren und Player wurden ebenfalls geändert.

## Wesentliche funktionale Erweiterungen

### Vollständige Editoren für interaktive Übungen

Quizsachen, Schiebesachen und Textsachen liegen nun zusätzlich als vollständige eingebettete Editoren vor. Übungen können darin erstellt, mit „Ins Heft übernehmen“ eingefügt und später wieder bearbeitet werden. In der bisherigen Datei waren die entsprechenden Player vorhanden; die drei vollständigen Editorpakete fehlen dort.

Das macht die enthaltenen Editoren lokal verfügbar. Netzabhängige Zusatzangebote wie externe Bildsuche, verlinkte Webseiten und KI-Dienste bleiben davon getrennt.

### Programmieren als neuer Vorlagenbereich

21 Katalogeinträge: 20 Varianten des Programmierwerkzeugs und ein Arbeitsblatt. Enthalten sind Bodenroboter-Steuerung, Pfeilkarten, Hindernisse, Wörter und Zahlen abfahren, Vorhersagen, Fehlersuche, Lücken, Schleifen, Zeichnen, Musik, Bedingungen und Punkte zählen. Die Varianten teilen sich einen Generator; es sind keine 21 unabhängig entwickelten Programme.

### Alltag sowie Beruf und Praktikum

Der Bereich Alltag erhält 16 Einträge, Beruf und Praktikum entsteht mit 14 Einträgen neu. Beispiele sind Ablauf-/Wochen-/Dienstpläne, Telefon- und Notrufübungen, Fußgängerampel, Sortieren, Stressbarometer, Körper-/Schmerzkommunikation, Nähe und Distanz, Geldplanung sowie Automatenübungen.

Für Praktika gibt es sieben einzelne gestaltete Seiten und eine zusammenstellbare Praktikumsmappe, außerdem Einschätzungen, Stückzähler, Kassenbuch und Gesprächsübungen. Telefon- und Notrufvorlagen simulieren Gespräche; sie lösen keine echten Anrufe aus.

### Musik, Sprache und Mathematik

- Musik: **Hör-Memory** und **Was hörst du?**. Beide beruhen auf demselben Hörwerkzeug mit Geräuschauswahl, eingebauten Klängen sowie eigenen Aufnahmen und Bildern.
- Schreiben: **Laute hören**, mit Aufgaben zu Lauten, Silben und Reimen.
- Mathematik: sechs neue Einträge für Strichliste/Diagramm, Glücksrad/Würfel, Suchbild, Muster, Karopapier-Aufgaben und Rechnen im Alltag.

Die bisherigen Musik-Vorlageneinträge bleiben erhalten. Dass deren Katalogdefinitionen unverändert sind, schließt Änderungen an gemeinsam genutzter Bildsuche oder Bedienung nicht aus.

### Gestaltete Seiten und Kommunikationsbuch

Neu sind neun Schülerzeitungsseiten, sieben Praktikumsmappenseiten, ein neues Lerntagebuch, ein weiterer Stundenplan, Gefühle-Karten, Kunstbetrachtung und weitere Vorlagen. Alle 89 neuen Kennungen sind im Anhang aufgeführt.

Das Kommunikationsbuch erhält sechs Themen: Arbeit und Praktikum, Werkzeuge, Wohnen und Haushalt, Beim Arzt, Kochen und Gesprächsrunde. Sein eingebetteter Piktogrammvorrat steigt von 121 auf 190; alle bisherigen 121 Bilder bleiben dabei bytegleich erhalten.

### Figuren, Puppentheater und Erklärbär

- Figuren lassen sich hinsichtlich Aussehen, Haaren und Kleidung zusammenstellen; sprechende Figuren und Fotos erhalten zusätzliche Darstellungsmöglichkeiten und Mundanimationen.
- Das neue Puppentheater verbindet Figurenbewegungen und Aufnahmen mit einer Abspiel-/Videoausgabe.
- **Erklärbär** erweitert Textsachen um Erklärfilme mit Wortbildern, Handanimationen und Szenen/Hintergründen. Für Ton im Videoexport sind eigene Aufnahmen vorgesehen; die Computer-Sprachausgabe wird nicht als Audiospur mit exportiert.

### Bildsuche und automatische Bildzuordnung

Zusätzlich zu ARASAAC und Wikimedia kommt **BildWort** hinzu, über die im Quelltext hinterlegte Schnittstelle `https://symbole.urff.app/api/v1` (als Beta bezeichnet, CC BY 4.0).

Die neue Version verwaltet Bildquellen gemeinsam für Heft und Übungseditoren. Reihenfolge und Aktivierung sind einstellbar. Die voreingestellte Reihenfolge ist BildWort → ARASAAC → Wikimedia; Wikimedia wird für die automatische Suche nicht verwendet und bleibt eine manuelle Quelle.

Das betrifft auch die automatische Bebilderung des Karaoke-Liedblatts: Der Ablauf richtet sich nun nach den gemeinsamen Bildquelleneinstellungen und ist nicht mehr ausschließlich auf ARASAAC ausgerichtet. ARASAAC bleibt verfügbar.

### Export, Zeichnen und Hilfe

- Neue Arbeitsblatt-Generatorpakete für Quizsachen, Schiebesachen und Textsachen erzeugen im PDF-Export aus Übungen druckbare Aufgaben; Lösungen und Umfang pro Übung sind einstellbar. Bei einem Fehler ist ein Rückfall auf die bisherige Kartendarstellung vorgesehen. Diese Erweiterung gilt nicht pauschal für sämtliche Exportformate.
- Geometrie-Arbeitsblätter ergänzen Druckhilfen, darunter eine 5-cm-Kontrollstrecke und Lösungen.
- Eine schwebende Stiftleiste und eine Scheren-/Lassofunktion ergänzen das Zeichnen. Die Schere kann einen umfahrenen Bereich aus einer Zeichnung als eigenes verschiebbares Element herauslösen.
- Hilfe mit Suche, thematischen Anleitungen, „Wie mache ich eigentlich …?“ und Lehrplanbezügen. Letztere verweisen insbesondere auf den bayerischen Lehrplan für den Förderschwerpunkt geistige Entwicklung.
- Zusätzliche Symbolsammlungen für Alltag, Sicherheit und Beruf sowie gemeinsame Übungseinstellungen ergänzen die Oberfläche.

### Medien und KI

**KI-Partner bauen** unterstützt das Zusammenstellen eines Prompts und die Übergabe an externe KI-Angebote. Es ist kein vollständig eingebauter Chatdienst. **Nachrichten in leichter Sprache** ist eine vorbereitete Sammlung externer Nachrichtenlinks, kein eigener Nachrichtenfeed.

## Änderungen an bisherigen Katalogeinträgen

| Kennung | Unterschied |
| --- | --- |
| `learning` | Das alte Lerntagebuch wird im Katalog ausgeblendet. Seine Definition bleibt erhalten; das neue sichtbare Lerntagebuch hat die Kennung `learning-diary`. |
| `timetable` | Bisher „Stundenplan“, jetzt „Stundenplan (schlicht)“. SVG und Elemente bleiben gleich; daneben kommt `timetable-days` hinzu. |
| `picture-timetable` | Neue Vorgabe `tt.dayColors: true`: farbige Wochentage im Bilder-Stundenplan. |
| `talk-book` | Die Übersichtsseite erweitert sich von zehn auf 16 Themenverweise, Anordnung von 5 × 2 auf 4 × 4. Die sechs neuen Themen sind eingebunden. |

**Die 50 zuletzt in Grundschulbuch übernommenen statischen Seitenlayouts haben in beiden Referenzdateien dieselben SVG- und Elementdefinitionen.** Sie müssen aufgrund dieser Dateiaktualisierung nicht grundsätzlich neu gestaltet werden. Zu beachten ist die neue Sichtbarkeit des alten Lerntagebuchs und die Umbenennung des schlichten Stundenplans.

## Sichtbare Einträge nach Kategorie

| Kategorie | Bisher | Neu | Differenz |
| --- | ---: | ---: | ---: |
| Lineaturen | 9 | 9 | 0 |
| Schreiben | 9 | 10 | +1 |
| Musik | 34 | 36 | +2 |
| Gestalten | 5 | 16 | +11 |
| Comic & Film | 9 | 11 | +2 |
| Schule | 13 | 19 | +6 |
| Mathe | 11 | 17 | +6 |
| Alltag | 5 | 21 | +16 |
| Wohnen | 3 | 3 | 0 |
| Präsentation | 14 | 14 | 0 |
| Interaktive Übungen | 14 | 14 | 0 |
| Kommunikationsbuch | 19 | 25 | +6 |
| Video & Web | 3 | 4 | +1 |
| Programmieren | 0 | 21 | +21 |
| Medien & KI | 0 | 2 | +2 |
| Beruf & Praktikum | 0 | 14 | +14 |

Schule erhält sieben neue Einträge, wächst aber nur um sechs sichtbare Einträge, weil das alte Lerntagebuch ausgeblendet wird.

## Eingebettete Programme und Medien

Von den 23 bisherigen Zusatzpaketen sind **17 bytegleich und sechs geändert**; sieben kommen neu hinzu. Kein bisheriges Paket wurde entfernt.

Bytegleich bleiben alle elf Schriftpakete, PDF.js und die Bildpakete `picto`, `anlaut-pictos`, `shop-pictos`, `timetable-pictos` und `calendar-pics`.

| Paket | Bisher (Bytes) | Neu (Bytes) | Status |
| --- | ---: | ---: | --- |
| `talk-pictos` | 661.521 | 1.051.299 | Geändert |
| `sort-pictos` | – | 482.102 | Neu |
| `voice` | 888.233 | 1.266.540 | Geändert |
| `viewer` | 928.660 | 1.414.228 | Geändert |
| `player-quizsachen` | 174.540 | 176.983 | Geändert |
| `player-schiebesachen` | 178.905 | 181.611 | Geändert |
| `player-textsachen` | 229.903 | 273.557 | Geändert |
| `worksheet-quizsachen` | – | 110.662 | Neu |
| `worksheet-schiebesachen` | – | 121.665 | Neu |
| `worksheet-textsachen` | – | 133.791 | Neu |
| `editor-quizsachen` | – | 5.159.292 | Neu |
| `editor-schiebesachen` | – | 5.221.668 | Neu |
| `editor-textsachen` | – | 1.892.172 | Neu |

Das Paket `sort-pictos` enthält 99 Bilder. Das überarbeitete `voice`-Paket enthält nun 49 statt 44 Lautaufnahmen; hinzu kommen die Kennungen `ä2`, `c`, `ß`, `v` und `v2`. Die 206 Silbenkennungen bleiben erhalten. Auch die Daten aller bisherigen Laut- und Silbenaufnahmen unterscheiden sich; daraus allein lässt sich keine Aussage über die hörbare Qualität oder Ursache der Änderung ableiten.

Die drei neuen Editorpakete sind komprimiert und Base64-kodiert eingebettet. Zusammen belegen sie 12.273.132 Bytes in der HTML-Datei. Zusätzlich wurden der Heft-Viewer und alle drei Übungsplayer aktualisiert.

## Bedeutung für die weitere Arbeit an Grundschulbuch

1. **Seitenvorlagen:** Bestehende 50 Layouts weiterverwenden; neue gestaltete Seiten gezielt ergänzen und weiterhin als einzeln editierbare Elemente abbilden. Das neue Lerntagebuch und beide Stundenpläne getrennt behandeln.
2. **Musik:** Zwei neue Hörwerkzeuge prüfen und die geänderte Bildquellenlogik beim Karaoke-Liedblatt berücksichtigen. Die unveränderten alten Katalogeinträge ersetzen keinen Funktionsvergleich der Einstellungsdialoge.
3. **Weitere Lernwerkzeuge:** Neue Kategorien Programmieren, Beruf und Praktikum sowie Medien und KI ergänzen; vorhandene Kategorien um die gelisteten Vorlagen erweitern.
4. **Gemeinsame Infrastruktur:** Bildquellenreihenfolge, Figuren-/Theaterdaten, erweiterte Player und PDF-Arbeitsblätter sind eigenständige Arbeitspakete zusätzlich zur Vorlagenübernahme.
5. **Import-/Extraktionsskripte:** Die minimierten Variablennamen haben sich geändert, beispielsweise `nj` → `NL` und `Mde` → `pTe`. Bestehende Skripte dürfen nicht allein durch Austausch des Eingabedateinamens auf die neue Version umgestellt werden; ihre Einstiegspunkte müssen angepasst und geprüft werden.

Dieser Vergleich nimmt keine neuen Funktionen in die App auf. Anwendungsdateien und beide Referenzdateien wurden für die Analyse nicht verändert.

## Vollständige Liste der 89 neuen Katalogeinträge

### Schreiben (1)

- Laute hören — `phon`

### Musik (2)

- Hör-Memory — `listen`
- Was hörst du? — `listen-quiz`

### Gestalten (11)

- Schülerzeitung: Titelseite — `mag-cover`
- Schülerzeitung: Vorwort und Inhalt — `mag-editorial`
- Schülerzeitung: Artikel in drei Spalten — `mag-columns`
- Schülerzeitung: Großes Bild — `mag-bigpic`
- Schülerzeitung: Interview — `mag-interview`
- Schülerzeitung: Kurz notiert — `mag-news`
- Schülerzeitung: Umfrage — `mag-survey`
- Schülerzeitung: Rätsel und Witze — `mag-fun`
- Schülerzeitung: Termine und Impressum — `mag-imprint`
- Ein Kunstwerk betrachten — `artwork`
- Zeitleiste (Lebenslauf) — `timeline`

### Comic & Film (2)

- Puppentheater — `theater`
- Erklärbär — `explainer`

### Schule (7)

- Lerntagebuch — `learning-diary`
- Stundenplan — `timetable-days`
- Etiketten — `labels`
- Wie geht es dir heute? — `mood`
- Gefühle-Karten — `feelings`
- Rückmeldung zu meiner Arbeit — `feedback`
- Abstimmung und Wahl — `vote`

### Mathe (6)

- Strichliste und Diagramm — `tally`
- Glücksrad und Würfel — `spinner`
- Suchbild — `seek`
- Muster fortsetzen — `pattern`
- Karopapier: Symmetrie, Muster, Messen — `grid-tasks`
- Rechnen im Alltag: Lohn, Fahrplan, Geld — `life-math`

### Alltag (16)

- Ablaufplan — `steps`
- Telefonieren üben — `phone`
- Notruf üben — `phone-sos`
- Fußgängerampel — `traffic`
- Checkliste — `checklist`
- Stressbarometer: Was hilft mir? — `stress`
- Wochenplan — `weekplan`
- Dienstplan — `dutyplan`
- Sortieren — `sort`
- Wo tut es weh? — `body`
- Nähe und Distanz: Kreise — `circles`
- Geld-Planer: Mein Monat — `budget`
- Geld-Planer zum Ausfüllen — `budget-fill`
- Mein Weg (Wegeplan) — `my-way`
- Fahrkartenautomat üben — `machine-ticket`
- Geldautomat üben — `machine-atm`

### Kommunikationsbuch (6)

- Arbeit und Praktikum — `talk-arbeit`
- Werkzeuge — `talk-werkzeug`
- Wohnen und Haushalt — `talk-wohnen`
- Beim Arzt — `talk-arzt`
- Kochen — `talk-kochen`
- Gesprächsrunde — `talk-runde`

### Video & Web (1)

- Linksammlung — `bookmarks`

### Programmieren (21)

- Programmieren — `coding`
- Wie ein Bodenroboter: Tasten — `coding-pad`
- Zum Ziel: Pfeilkarten legen — `coding-cards`
- Hindernisse umfahren — `coding-walls`
- Wörter abfahren — `coding-word`
- Rechnen und fahren — `coding-math`
- Zahlen der Reihe nach — `coding-numbers`
- Sterne sammeln — `coding-collect`
- Wo kommt die Figur an? — `coding-predict`
- Fehler finden — `coding-fix`
- Was fehlt? — `coding-gap`
- Schleifen: wiederhole — `coding-loop`
- Zeichnen mit dem Stift — `coding-pen`
- Freies Malen — `coding-paint`
- Musik-Teppich — `coding-music`
- Bedingungen: Farbweg — `coding-cond`
- Labyrinth mit „falls“ — `coding-maze`
- Achtung, Katze! — `coding-cat`
- Punkte zählen — `coding-count`
- Pfeile programmieren — `coding-events`
- Programmieren: Arbeitsblatt — `coding-sheet`

### Medien & KI (2)

- KI-Partner bauen — `kipartner`
- Nachrichten in leichter Sprache — `easy-news`

### Beruf & Praktikum (14)

- Praktikumsmappe: Deckblatt — `pm-cover`
- Praktikumsmappe: Mein Betrieb — `pm-company`
- Praktikumsmappe: Mein Arbeitsplatz — `pm-workplace`
- Praktikumsmappe: Tagesbericht — `pm-day`
- Praktikumsmappe: Wochenrückblick — `pm-week`
- Praktikumsmappe: Dankschreiben — `pm-thanks`
- Praktikumsmappe: Einschätzung — `pm-rating`
- Selbst- und Fremdeinschätzung — `rating`
- Stückzähler (Serienfertigung) — `pieces`
- Bild-Quiz: Was bedeutet das? — `sort-quiz`
- Kassenbuch — `cashbook`
- Getränkeautomat üben — `machine-drinks`
- Gespräche üben — `practice`
- Praktikumsmappe (alle Seiten) — `pm-all`

## Methode und Grenzen

Verglichen wurden Hauptprogramm, Vorlagenregister und eingebettete Pakete. Die Vorlagenregister wurden über ihre Abhängigkeiten ausgewertet und nach Kennung verglichen: Bezeichnung, Kategorie, Sichtbarkeit, Generator, Papier-/Linienvorgaben, Raster, SVG und voreingestellte Elemente. Zufällige Elementkennungen wurden entfernt und Zufallsfolgen für den Vergleich festgelegt. Beide Register ließen sich ohne Auswertungsfehler erzeugen. Die eingebetteten Pakete wurden anhand ihres Inhalts verglichen; die drei vollständigen Editorpakete wurden zusätzlich entpackt.

Die funktionalen Beschreibungen beruhen auf Quelltext und den enthaltenen Hilfetexten. Es wurde kein vollständiger Browser-, Geräte-, Audio- oder Exportfunktionstest aller neuen Werkzeuge durchgeführt. Ein vollständiges Änderungsprotokoll jeder internen Fehlerkorrektur lässt sich aus den beiden gebündelten Dateien nicht belastbar ableiten.

Die [maschinenlesbare Bestandsaufnahme](vergleich-lernsachen-versionen.json) enthält Dateiprüfsummen, Zählwerte, alle neuen Kennungen, die vier geänderten Definitionen sowie Paketgrößen und Änderungen an Bildkennungen.
