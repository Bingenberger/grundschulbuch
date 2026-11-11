# Konzept: Grundschulbuch

Stand: 9. November 2026 · Server-App mit erweiterten Lernwerkzeugen implementiert;
Referenzabgleich und verbleibende Unterschiede siehe [Funktionsvergleich](funktionsvergleich.md),
Geräteabnahme siehe [Umsetzung](umsetzung.md).

Die Grundschultafel ist für den Unterricht an der Tafel gebaut: Die Lehrkraft
zeigt, schreibt und nutzt Werkzeuge. Das [Lernsachen-Heft](https://github.com/Majort0m0/Lernsachen-Heft)
zeigt, wie ein digitales Heft aussehen kann: Seiten mit Lineaturen, frei
platzierbare Inhalte, ein großer Vorlagen-Katalog und viele Übungsformate.

Das **Grundschulbuch** ist eine eigene Server-App, die diese Idee für die Schule
umsetzt. Lehrkräfte gestalten Hefte und Arbeitsblätter, Kinder arbeiten mit
eigenem Zugang darin. Code oder Inhalte aus dem Lernsachen-Heft werden nicht
übernommen.

## Warum eine eigene App

- **Anderer Zweck.** Die Tafel ist ein unendliches Zeichenblatt für den Moment.
  Ein Heft hat feste Seiten (A4), Lineaturen und Vorlagen, wird gedruckt und
  über Wochen weitergeführt. Beides in einer Oberfläche würde die Tafel überladen.
- **Kinderzugang.** Die Tafel kennt nur Lehrkräfte. Das Grundschulbuch braucht
  Klassen, Kinderkonten und Rechte. Das gehört nicht in die Tafel.
- **Passt zur Schulplattform.** Die Plattform installiert jede App als eigenen
  Container mit eigener Subdomain, Sicherung und Release-Image. Das
  Grundschulbuch bekommt denselben Plattformvertrag wie die Tafel
  (siehe [PLATFORM.md](../PLATFORM.md)).
- **Offene Lizenz.** Die App entsteht in einem neuen Repository unter einer
  offenen Lizenz, unabhängig von der schulinternen Tafel.

## Ergänzung: Funktionsumfang des Lernsachen-Hefts

Maßgeblich ist auch der Funktionsumfang der im Repository bereitgestellten
`Lernsachen-Heft.html`: neben dem Hefteditor gehören interaktive Übungen,
Kommunikation, Schul- und Musikwerkzeuge, Präsentation/Animation, differenzierte
Generatoren, Ordner/Sicherungen und portable Dateiformate zum Zielumfang.
Die Umsetzung bleibt eigenständig; der Vergleich überträgt Funktionen und
Arbeitsabläufe. Originalcode, Beispielhefte, Piktogramm- und Klangpakete werden
nicht übernommen. Rollenregeln und Server-Speicherung dieses Konzepts gelten
weiterhin. [Funktionsvergleich](funktionsvergleich.md) beschreibt den erreichten
Stand und ausdrücklich noch fehlende Detailfunktionen.

## Rollen

| Rolle | Kann |
| --- | --- |
| **Admin** | Lehrkräfte anlegen, sperren, PIN zurücksetzen |
| **Lehrkraft** | Klassen und Kinder verwalten; Hefte, Vorlagen und Arbeitsblätter erstellen; Hefte an Klassen oder einzelne Kinder austeilen; Kinderhefte ansehen und kommentieren; Tafelmodus, Druck und PDF |
| **Kind** | Eigene und ausgeteilte Hefte öffnen und darin arbeiten; schreiben, zeichnen, Text tippen, Bilder aus freigegebenen Sammlungen einfügen; Seiten hinzufügen, wenn die Lehrkraft es erlaubt |

### Was Kinder nicht können

Der reduzierte Funktionsumfang ist eine eigene, schlichtere Oberfläche, nicht
nur ausgegraute Knöpfe:

- keine Hefte löschen (nur in den Papierkorb, den die Lehrkraft leeren kann)
- keine Vorlagen anlegen oder verwalten, keine Generatoren
- keine Dateien hochladen, keine Internetadressen, keine Videos oder Webseiten
- keine Bildersuche im Internet, nur freigegebene Sammlungen der Schule
- kein Teilen mit anderen Kindern, kein Einblick in fremde Hefte
- vorgegebene Elemente der Lehrkraft (Aufgabe, Lineatur, Bilder) sind gesperrt
  und lassen sich nicht verschieben oder löschen

Große Schaltflächen, Symbole mit kurzer Beschriftung, Vorlesen der Beschriftung
auf Wunsch.

### Anmeldung der Kinder

Die Kinder arbeiten mit **geteilten iPads** der Schule und melden sich mit
einer **persönlichen QR-Karte** an. Verwendet werden die **vorhandenen
Anmeldecodes der Anton-App**. Sie sind pro Kind individuell, die Kinder kennen
sie schon, und es braucht keine zweite Karte.

1. Die Lehrkraft legt eine Klasse an und trägt die Kinder mit **Vornamen oder
   Kürzel** ein.
2. **Karte zuordnen:** In der Klassenverwaltung scannt die Lehrkraft die
   Anton-Karte eines Kindes und ordnet sie ihm zu. Schneller geht es mit
   „Klasse einscannen“: Karten nacheinander vor die Kamera halten und jeweils
   den Namen antippen. Kinder ohne Anton-Karte bekommen eine vom
   Grundschulbuch erzeugte Karte zum Ausdrucken.
3. **Anmelden:** Das Kind öffnet das Grundschulbuch über das Symbol auf dem
   Home-Bildschirm, tippt auf „Anmelden“ und hält die Karte vor die Kamera.
   Der Scanner ist in die Seite eingebaut. Die Kamera-App des iPads würde bei
   fremden Codes sonst die andere App oder Webseite öffnen.

**Umgang mit den Anton-Codes (und anderen fremden QR-Codes):**

- Das Grundschulbuch speichert nie den Inhalt eines Codes. Das iPad bildet
  sofort eine Prüfsumme (SHA-256), der Server speichert davon nur einen
  verschlüsselten Hashwert (HMAC mit Serverschlüssel). Ist der fremde Code
  selbst ein Zugangsschlüssel für einen anderen Dienst, kommt er so nie auf
  den Server und nicht in Protokolle.
- Der Anton-Code ist zugleich der Zugang zur Anton-App. Deshalb ist es
  besonders wichtig, dass er nur als Prüfsumme das iPad verlässt. Wer eine
  Karte hat, kommt aber weiterhin in beide Apps. Das ist bei Anton heute schon
  so und ändert sich durch das Grundschulbuch nicht.
- Ein Code muss **eindeutig** sein: Ist er schon einem anderen Kind zugeordnet,
  lehnt die Zuordnung ab.
- Erneuert Anton einen Code (z. B. nach Verlust), funktioniert die alte Karte
  auch im Grundschulbuch nicht mehr. Die Lehrkraft ordnet die neue Karte zu.
- Enthält ein Code nur wenig oder erratbaren Inhalt (z. B. nur einen Vornamen
  oder eine kurze Nummer), warnt die Verwaltung und empfiehlt eine eigene Karte.
- Wer eine Karte hat, kann sich als dieses Kind anmelden. Verlorene Karten
  macht die Lehrkraft mit einem Tipp ungültig und ordnet eine neue zu.
- Die Lehrkraft kann ein Kind im Notfall auch von ihrem Gerät aus anmelden
  (kurzer Code zum Abtippen).

### Geteilte iPads

Viele Kinder nutzen nacheinander dasselbe Gerät. Daraus folgt:

- **Schneller Wechsel:** Die Startseite zeigt immer den Scanner. Eine neue
  Karte meldet das vorige Kind ab und das neue an. Ungespeichertes wird vorher
  gesichert.
- **Abmelden:** großer „Fertig“-Knopf, automatisches Abmelden nach z. B.
  10 Minuten ohne Eingabe und spätestens zum Schulschluss.
- **Nichts bleibt auf dem Gerät:** Hefte liegen nur auf dem Server, keine
  Kopien im Browser-Speicher. Nach dem Abmelden zeigt das iPad nichts mehr
  vom vorigen Kind, auch nicht über „Zurück“.
- **Verteilung:** Das Symbol für den Home-Bildschirm kann die iPad-Verwaltung
  (MDM) als Web-Clip auf alle Geräte bringen. Ist der Modus „Shared iPad“ von
  Apple aktiv, funktioniert das Grundschulbuch genauso.

### Datenschutz

Die Datenschutzfragen bleiben vorerst offen. Als Leitlinien für die Umsetzung gilt:

- Datensparsamkeit: Vorname oder Kürzel, Klasse, Hashwert der QR-Karte, Hefte.
  Keine E-Mail-Adresse, kein Geburtsdatum, keine Fotos der Kinder als Pflicht.
- Alles bleibt auf dem Schulserver, ohne externe Dienste für Kinder.
- Lehrkräfte sehen nur ihre eigenen Klassen.
- Löschkonzept: Klasse archivieren und am Schuljahresende löschen, Hefte vorher
  als PDF exportierbar.
- Vor dem Einsatz mit Kindern braucht es noch die Abstimmung mit Schulleitung
  und Datenschutzbeauftragter oder Datenschutzbeauftragtem
  (Verarbeitungsverzeichnis, ggf. Elterninformation).

## Funktionsumfang

### Phase 1 – Grundgerüst für Lehrkräfte

| Bereich | Inhalt |
| --- | --- |
| Regal | Übersicht aller eigenen Hefte mit Vorschaubild, Suche, neu, umbenennen, duplizieren, löschen |
| Seiten | A4 hoch/quer, Seitenleiste mit Vorschau, einfügen, verdoppeln, umsortieren, löschen |
| Lineaturen | Blanko, Grundschul-Lineaturen 1–4, kariert (5 mm / 1 cm), Rechenkästchen, Punkte, Notenlinien, Bild mit Schreibzeilen |
| Elemente | Text, Bild, Zeichnung (Stift, Textmarker, Radierer); frei verschieben, skalieren, drehen, Ebenenreihenfolge, sperren |
| Bilder | Upload, Kamera, Smartphone-QR, Platzhalter, Bildschirmfoto, ARASAAC, Wikimedia Commons, Schulgalerie (`GALLERY_ORIGIN`, JSON-API v1) |
| Vorlagen | Zum Start nur die Lineaturen als Seitenvorlagen; eigene Seite als Vorlage speichern |
| Schriften | Schulschriften (siehe [Schriften](#schriften)) für Textelemente |
| Bearbeiten | Rückgängig/Wiederholen, Kopieren/Einfügen, Mehrfachauswahl |
| Anzeigen | Tafelmodus: eine Seite im Vollbild, groß, mit Blättern |
| Ausgabe | Drucken und PDF-Export in echter Größe |

Das Datenmodell enthält von Anfang an Eigentümer, Rollen und gesperrte
Elemente, auch wenn die Kinderoberfläche erst in Phase 2 kommt.

### Phase 2 – Kinderzugang

- Klassen und Kinder verwalten, Anmeldung mit QR-Karte (vorhandene oder eigene)
- Kinderoberfläche mit reduziertem Funktionsumfang
- Hefte austeilen: Die Lehrkraft teilt ein Heft an eine Klasse aus, jedes Kind
  bekommt eine eigene Kopie
- Übersicht für die Lehrkraft: Wer hat welche Seite bearbeitet, Kinderhefte
  ansehen, mit Stift oder Stempel kommentieren
- Kinderheft an der Tafel zeigen (Tafelmodus)

### Phase 3 – Inhalte und Arbeitsblätter

- **Arbeitsblatt-Generatoren:** Zahlenhäuser, Rechenaufgaben mit Lösungsseite,
  Uhrzeiten, Buchstaben und Ziffern nachspuren, Silben rot/blau, Wörtersuchrätsel.
  Wörter und Bilder aus dem Grundschul-Wörterbuch (`WOERTERBUCH_ORIGIN`).
- **Ton:** Aufnahme oder Datei als Element, Vorlesen per Gerätestimme.
  Kinder können sich Aufgaben vorlesen lassen und, wenn erlaubt, selbst aufnehmen.
- **Vorlagen-Katalog** mit Kategorien und Suche (Steckbrief, Bildergeschichte,
  Stundenplan …).
- **Persönliches Regal:** eigene Bilder, Zeichnungen und Sticker heftübergreifend
  wiederverwenden.
- **Teilen im Kollegium:** Heft oder Vorlage für andere Lehrkräfte freigeben.

### Später, optional

- Interaktive Übungen mit Prüfen (Zuordnen, Lückentext)
- PDF-Seiten importieren und darauf schreiben

## Technik

### Stack

Gleicher Stack wie die Tafel, damit Wissen und Betrieb übertragbar bleiben:
Next.js 16 (App Router), React 19, Zustand, Node.js 22, Docker-Image nach dem
Plattformvertrag (schreibgeschütztes Root-Dateisystem, UID 10001, `/data`,
`/health/live` und `/health/ready`, `migrate.mjs`, `bootstrap.mjs`).

**Zielgeräte:**

- **iPads der Kinder (Safari):** Das Grundschulbuch lässt sich als Symbol auf
  den Home-Bildschirm legen und startet dann im Vollbild. Die Kamera für den
  QR-Scanner braucht HTTPS, das die Plattform bereitstellt. Safari kennt
  `BarcodeDetector` nicht, deshalb kommt eine Scanner-Bibliothek mit
  AGPL-verträglicher Lizenz zum Einsatz (z. B. `jsQR`, Apache-2.0).
  Für den Apple Pencil gibt es die Einstellung „Nur Stift zeichnet“, damit die
  aufgelegte Hand keine Striche macht.
- **iiyama-Tafeln:** Sie laufen mit einem älteren Browser. Neuere
  CSS-Funktionen wie `dvh` sind tabu oder brauchen einen Ersatz.

Jede Phase wird auf einem iPad und einer iiyama-Tafel abgenommen.

### Darstellung einer Seite

- Feste Seitenkoordinaten (A4 in Millimetern), die Ansicht skaliert nur.
  Dadurch sehen Tablet, Tafel und Ausdruck gleich aus.
- **Text und Bilder als HTML-Elemente:** gut editierbar, scharf im Druck,
  Vorlesen und Suche möglich.
- **Zeichnungen als Vektor-Striche** (Punktlisten), dargestellt als SVG.
  Sie bleiben beim Vergrößern und Drucken scharf und sind klein zu speichern.
- **Lineaturen als SVG-Muster**, selbst gezeichnet, je nach Lineatur parametrisiert.

Die Stifteingabe wird wie in der Tafel umgesetzt. Eine eigene Latenz-Optimierung
ist nicht geplant, weil sie auf den iiyama-Geräten keinen Gewinn gebracht hat.

### Speicherung

Dateibasiert wie bei der Tafel, aber ohne eingebettete Data-URLs:

```
/data/hefte/<heft-uuid>/
  heft.json          Name, Eigentümer, Klasse, Herkunft (Vorlage/ausgeteilt), Seitenreihenfolge
  seiten/<id>.json   Elemente einer Seite, gesperrte Elemente markiert
  vorschau.webp
/data/medien/<sha256>.webp|png|jpg|mp3 …
/data/klassen/<klassen-uuid>.json   Kinder (Kürzel, HMAC der QR-Karte), Lehrkräfte
```

- **Seitenweise speichern** statt das ganze Heft auf einmal. So bleiben Anfragen
  klein, und gleichzeitige Änderungen an verschiedenen Seiten überschreiben sich nicht.
- **Medien nach Prüfsumme** ablegen: Wird ein Heft an 25 Kinder ausgeteilt,
  liegt jedes Bild trotzdem nur einmal auf der Festplatte.
- Jeder Zugriff prüft serverseitig Rolle und Eigentum. Ein Kind erreicht nur
  die eigenen Hefte.
- Sperren und atomares Ersetzen wie in der Tafel.
- Schulvorlagen liegen unter `GRUNDSCHULBUCH_ASSET_DIR/vorlagen/` und werden
  vom Betreiber gepflegt.
- Das Grundgerüst nutzt JSON-Dateien. Sollten sie bei 25 Kindern pro Klasse
  und vielen Seiten zu langsam werden, kommt SQLite (`node:sqlite`) für
  Klassen, Konten und Übersichten in Frage. Medien bleiben in jedem Fall Dateien.

### Anmeldung der Lehrkräfte

Die Plattform sieht kein gemeinsames Login (OIDC) vor. Lehrkräfte haben eigene
Konten mit sechsstelliger PIN. Konten entstehen nur über einen Einmalcode, den
`scripts/bootstrap.mjs` auf dem Server ausgibt. Sitzungen liegen auf dem Server,
der Browser hält nur ein zufälliges Token. Fünf Fehlversuche sperren ein Konto
für 15 Minuten. Umgesetzt im Grundgerüst, Einzelheiten in [PLATFORM.md](../PLATFORM.md).

### Verbindung zur Tafel

Beide Apps laufen auf getrennten Subdomains mit eigenen Konten. Für den Anfang reicht:

- Der Tafelmodus des Grundschulbuchs ersetzt das Zeigen eines Heftes in der Tafel.
- Später: Export einer Heftseite als Bild, das die Tafel übernimmt.

## Lizenz und Repository

- **Repository:** [Bingenberger/grundschulbuch](https://github.com/Bingenberger/grundschulbuch).
- **Code: AGPL-3.0** (entschieden). Wer das Grundschulbuch verändert und als
  Dienst für andere betreibt, muss die Änderungen ebenfalls offenlegen.
- **Mitgelieferte Inhalte** (Lineaturen, Vorlagen, Symbole): **CC BY 4.0**
  (entschieden). Andere Schulen dürfen sie frei nutzen und anpassen,
  solange sie die Quelle nennen.
- **Keine Übernahme aus dem Lernsachen-Heft.** Dessen Lizenz (CC BY-NC-SA 4.0)
  ist wegen „nicht kommerziell“ mit keiner der genannten offenen Lizenzen
  vereinbar. Es dient nur als Ideengeber.
- **Kein ungeprüfter Code aus der Grundschultafel.** Die Tafel ist schulintern
  und nicht frei lizenziert. Login, Sitzungen und Dateispeicher sind deshalb
  neu geschrieben. Übernommen werden dürfen nur Teile, deren Urheber der
  offenen Lizenz ausdrücklich zustimmen.
- **Schriften:** nur Schriften unter SIL OFL 1.1 (siehe nächster Abschnitt).
- **Piktogramme** wie ARASAAC stehen unter NC-SA-Lizenzen. Sie gehören, wenn
  überhaupt, in die Bildergalerie der Schule, nicht ins Repository.
- **Abhängigkeiten** müssen zur gewählten Lizenz passen (MIT, BSD, Apache 2.0
  und ISC sind unproblematisch).

## Schriften

Es sollen dieselben Schriften wie im Lernsachen-Heft zur Verfügung stehen.
Alle stehen unter der **SIL Open Font License 1.1** und dürfen im
AGPL-Repository mitgeliefert werden (geprüft anhand der eingebetteten
Schriftdateien):

| Im Grundschulbuch | Schrift | Quelle |
| --- | --- | --- |
| Druckschrift (wie in Bayern) | Gruschudru basic (Florian Emrich, auf Basis von Andika) | beim Autor |
| Grundschrift | Playwrite DE Grund | github.com/TypeTogether/Playwrite |
| Schreibschrift VA | Playwrite DE VA | github.com/TypeTogether/Playwrite |
| Schreibschrift SAS | Playwrite DE SAS | github.com/TypeTogether/Playwrite |
| Leseschrift | Andika | SIL International |
| Weitere | Lexend, Nunito, Atkinson Hyperlegible, Merriweather, Caveat (Handschrift), Bangers (Comic) | Google Fonts / jeweilige GitHub-Projekte |

- Die Schriften werden aus den **Originalquellen** bezogen, nicht aus der
  Lernsachen-Heft-Datei herausgelöst. Dort liegen nur gekürzte Ausschnitte
  (nur lateinische Zeichen, teils nur eine Schriftstärke).
- Jede Schrift kommt mit ihrer `OFL.txt` in `public/fonts/<name>/`.
- Namensvorbehalte der OFL beachten: Wird eine Schrift verändert (z. B. gekürzt),
  darf sie den vorbehaltenen Namen („Andika“, „Merriweather“) nicht mehr tragen.
  Am einfachsten werden die Schriften unverändert ausgeliefert.

## Offene Fragen

1. **Anton-Code testen:** Mit einer echten Karte prüfen, ob der Code dauerhaft
   gleich bleibt und sich mit dem eingebauten Scanner zuverlässig lesen lässt.
2. **iPad-Verwaltung:** Welches MDM nutzt die Schule, und ist der Modus
   „Shared iPad“ aktiv?
3. **Datenschutz:** vorerst zurückgestellt; vor dem Einsatz mit Kindern zu
   klären, inklusive der Nutzung der Anton-Codes.
4. **Gruschudru basic:** Woher kommt die Originaldatei der Druckschrift?

## Nächste Schritte

1. ~~Repository mit `LICENSE` (AGPL-3.0) und `LICENSE-CONTENT` (CC BY 4.0)
   anlegen.~~ Erledigt.
2. ~~Plattformgerüst neu aufbauen (Login für Lehrkräfte, Health, Migration,
   Docker).~~ Erledigt. Offen: das Grundschulbuch in der Schulplattform als
   App eintragen, inklusive Schlüsseldatei für UID 10001.
3. Schriften mit ihren OFL-Dateien aus den Originalquellen einchecken. Erledigt außer der weiterhin ungeklärten Gruschudru-Originaldatei.
4. Regal, Seiten und Lineaturen: implementiert; Tests auf echten iPads und iiyama-Tafeln offen.
5. Elemente, Schriften, Tafelmodus und Druck: implementiert. Automatisierte Abnahme und Bedienübersicht siehe [Umsetzung](umsetzung.md).
6. QR-Anmeldung früh mit einer echten Anton-Karte auf einem geteilten iPad
   ausprobieren, weil sie für Phase 2 entscheidend ist.
