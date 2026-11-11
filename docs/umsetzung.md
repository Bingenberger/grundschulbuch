# Umsetzung und Abnahme

Die Server-App umfasst den Hefteditor, Lehrkraft- und Kinderkonten sowie die
Erweiterungen aus dem erneuten Vergleich mit `Lernsachen-Heft.html`.
Der genaue Vergleich einschließlich verbleibender Unterschiede steht in
[Funktionsvergleich](funktionsvergleich.md). Die Abnahme auf echten Schulgeräten
und mit einer echten Anton-Karte steht weiterhin aus.

## Oberfläche (Stand 11. November 2026)

- Editor für Lehrkräfte und Kinder mit demselben Aufbau: reduzierte
  Werkzeugleiste am linken Rand (Auswahl, Stift, Radierer, Text, Bild, Ton,
  Lernwerkzeuge, Einfügen, Seite), ausklappbare Seitenübersicht daneben und
  eine untere Leiste mit den Einstellungen zum gewählten Werkzeug, Element oder
  zur Seite. Lange Einstellungslisten sind dort in Bereiche gegliedert.
- Auswahl: Elemente antippen (Striche werden entlang ihrer Linie getroffen)
  oder auf freier Fläche einen Rahmen aufziehen, um mehrere Elemente zu wählen.
  Gesperrte Elemente und ein den Rahmen umschließender Hintergrund werden dabei
  nicht mitgewählt. Kinder können Elemente und Striche antippen.
- Auswahlrahmen: Anfasser an allen vier Ecken zum Vergrößern (die gegenüber
  liegende Ecke bleibt stehen, Bilder behalten ihr Seitenverhältnis, sonst mit
  Umschalttaste), ein Dreh-Anfasser über dem Rahmen (rastet nahe an 15°-Schritten
  ein, mit Umschalttaste immer) und die ganze Fläche zum Verschieben. Bei
  Lernwerkzeugen, Übungen, Ton und Einbettungen bleibt stattdessen die Leiste
  „Verschieben“, damit ihre Knöpfe bedienbar bleiben. Gilt auch für Kinder.
- Ist etwas ausgewählt, zeigt die Kopfzeile Kopieren, Ausschneiden, Einfügen,
  Duplizieren, Link und Löschen (Einfügen auch ohne Auswahl, sobald etwas
  kopiert ist). Kinder sehen davon nur Löschen.
- Links: Im Link-Fenster wird eine Internetseite (nur http/https) oder eine
  Seite des Hefts gewählt. Verlinkte Elemente tragen ein Link-Symbol, das im
  Editor, im Kinderheft, an der Tafel und im HTML-Export zum Ziel führt; beim
  Drucken ist es ausgeblendet. Beim Kopieren, Austeilen und Importieren eines
  Hefts werden Seitenlinks auf die neuen Seiten umgeschrieben.
- Text wird nur direkt im Textfeld auf der Seite geschrieben (nach dem
  Einfügen sofort, sonst ausgewähltes Textfeld erneut antippen, Doppelklick
  oder Eingabetaste). Ein dicker, blinkender roter Cursor zeigt die
  Schreibstelle; Escape oder ein Tipp daneben beendet das Schreiben, ein leeres
  Textfeld verschwindet wieder. Schriftart, -größe, Auszeichnung und
  Ausrichtung stehen unter „Gestalten“.
- Textkasten: Formen Kasten, Notizzettel, Sprechblase, Denkblase, Rufblase
  und Banner werden als SVG in Originalgröße gezeichnet (`TextFrame.tsx`),
  also gleich im Editor, im Druck und im HTML-Export. Hintergrundfarbe,
  Rahmenlinie (Ohne/Dünn/Mittel/Dick) und Rahmenfarbe sind für jedes
  Textfeld einstellbar, auch ohne Form. Nach einem Formwechsel wächst das
  Feld, bis der Text wieder hineinpasst.
- Auf Seiten mit Lineatur 1–4 und Bild mit Schreibzeilen passt sich Text der
  Lineatur an (`src/lib/text-fit.ts`): Die Kleinbuchstaben füllen das
  Mittelband, die Grundlinie liegt auf der roten Linie, jede neue Zeile
  rutscht in die nächste Lineatur-Zeile, und das Textfeld wächst zeilenweise.
  Beim Verschieben rastet der Text in die nächste Zeile ein. Gedrehte,
  gerahmte, gesperrte Texte und solche außerhalb des linierten Bereichs
  bleiben frei.
- Bilder einfügen: ein Dialog mit Reitern für Hochladen (auch Ziehen und
  Strg+V, Lehrkräfte zusätzlich per Smartphone-QR), Kamera, Platzhalter,
  Bildschirmfoto (diese Seite → neue Seite dahinter, oder ein anderes Fenster),
  ARASAAC, Wikimedia Commons und die Schulgalerie. Suchen, Vorschauen und
  Übernahmen laufen über den Server (`/api/bilder`, `src/lib/image-sources.mjs`):
  Geräte von Kindern sprechen keine fremden Server an, nur Adressen aus den
  eigenen Suchergebnissen werden geladen (Zeit- und Größenlimit, keine
  Umleitungen, nur Rasterbilder), und jedes gewählte Bild wird in den eigenen
  Medienspeicher kopiert. ARASAAC- und Wikimedia-Bilder bekommen ihren
  Bildnachweis (Urheber, Lizenz) als kleine Zeile am Bild; er lässt sich unter
  „Gestalten“ ändern.
- Kinder sehen „Eigene Bilder & Fotos“ (Hochladen, Kamera) und „Bilder suchen“
  (ARASAAC, Schulgalerie) nur, wenn die Lehrkraft sie freischaltet; Wikimedia,
  Platzhalter und Bildschirmfoto gibt es nur für Lehrkräfte. „Von der
  Lehrkraft“ zeigt die freigegebenen Bilder.
- Ton hinzufügen: ein Dialog mit Reitern wie bei Bildern; „Aufnehmen“ ist
  vorausgewählt (großer Aufnahmeknopf, Zeit, Pegel, höchstens fünf Minuten,
  danach bearbeiten und benennen). „Hochladen“ (auch Ziehen) führt ebenfalls
  in die Bearbeitung: Zuschneiden an der Wellenform (Griffe, auch per
  Pfeiltasten), „Stille entfernen“, Anhören des Ergebnisses und „Klang
  verbessern“ mit Lautstärke angleichen, Stimme klarer, Rauschen in Pausen
  leiser und Lange Pausen kürzen (`src/lib/audio-edit.mjs`, gespeichert als
  WAV; ohne Änderung bleibt die Originaldatei). „Ton bearbeiten“ (untere
  Leiste oder Doppelklick) öffnet dieselbe Bearbeitung für Töne auf der Seite.
  Auf der Seite ist ein Ton ein großer runder Knopf: Antippen spielt ab, noch
  einmal hält an, ein Ring zeigt den Fortschritt. Ausgewählt wird er an den
  Ecken seines Rahmens. „Platzhalter“ setzt einen leeren Ton-Knopf mit
  Aufgabe, „Kassettenrekorder“ das Lernwerkzeug Aufnahmegerät, gestaltet
  wie ein Spielzeug-Rekorder (Griff, Lautsprecher, Kassette mit drehenden
  Spulen, rote Aufnahmelampe, Anzeige) mit großen runden Farbtasten:
  Aufnehmen startet sofort mit dem Mikrofon (noch einmal = Fertig, höchstens
  fünf Minuten), Zurück/Vor (5 s), Abspielen/Pause, Stopp; dazu „Datei öffnen“
  und „Speichern“.
- Ton-Platzhalter und Kassettenrekorder einer Lehrkraft nehmen Aufnahmen von
  Kindern auch in gesperrten Seiten und ohne die Heft-Erlaubnis „Kinder dürfen
  Ton aufnehmen“ an; der Server prüft dazu, dass das Element im Heft des
  Kindes liegt (`/api/ton?book=…&element=…`).
- Bild bearbeiten (Doppelklick aufs Bild oder „Gestalten“ › „Bild bearbeiten“):
  Zuschneiden mit Seitenverhältnis (frei, Quadrat, 4:3, 3:4, 16:9), links/rechts
  drehen, spiegeln, Verpixeln mit Pinsel, schwarze Balken und Effekte, die sich
  kombinieren lassen (Heller, Kontrast, Kräftig/Blass, Arbeitsblatt/Schwarzweiß/
  Alt, Warm/Kalt, Umkehren), jeder mit eigenem Regler; Rückgängig für alle
  Schritte. Der Browser zeigt nur eine Vorschau; der Server rechnet das Ergebnis
  aus dem Original und den Schritten (`src/lib/image-edit.mjs`, gemeinsam
  genutzt) und speichert es als neues Bild – verpixelte Stellen sind damit im
  gespeicherten Bild wirklich unkenntlich. Bearbeiten darf nur, wer das Bild
  verwenden darf; Kinder brauchen „Bilder bearbeiten“, aber kein Hochladen.
  Ältere Bilder mit Filter, Ausschnitt oder Spiegelung übernehmen diese als
  erste Schritte. Ein Bildschirmfoto eines Fensters öffnet direkt im Editor.
- Foto-Platzhalter: ein leerer Bildrahmen mit Hinweis (quer, quadratisch, hoch,
  rund). Ein Tipp darauf öffnet bei Kindern Kamera und Hochladen – auch in
  gesperrten Arbeitsblättern und ohne „Eigene Bilder“; der Server erlaubt dann
  genau dieses Hochladen. Das Bild füllt den Rahmen, Lage und Größe bleiben.
- Neue Seite: „+“ (Seitenübersicht), „Neue Seite mit Vorlage“ und die
  Tastenkombination öffnen immer die Vorlagenauswahl wie in der HTML-Vorlage:
  Kategorien links (mit Anzahl), Suche, „Zuletzt benutzt“, echte Vorschauen
  (werden beim Hineinscrollen gezeichnet) und „Seiten aus einer Datei“.
  Vorlagen sind standardmäßig im Querformat; alle Lernvorlagen richten sich
  nach der Seitengröße (`blueprintPages(meta, orientation)`), gespeicherte
  Vorlagen behalten ihr Format. Kinder wählen nur Papier und Lineatur.
- Vorlage ändern („Seite“ › „Vorlage“ › „Andere Vorlage wählen“): Hintergrund,
  Lineatur, Papierfarbe und Rahmen kommen aus der Vorlage, alles auf der Seite
  bleibt erhalten; nur eine leere Seite bekommt auch den Inhalt der Vorlage.
  Die Seite merkt sich ihre Vorlage (`page.template`), die Auswahl markiert sie.
- Werkzeugleiste links: Auswahl, Stift, Radierer, Text, Bild, Ton, Internet,
  Lernwerkzeuge, Einfügen, unten Seite. „Einfügen“ öffnet die untere Leiste mit
  Formen, Sticker (Emojis nach Themen) und Stempel: Text- und Emoji-Stempel
  werden gewählt und dann mit jedem Tipp auf die Seite gesetzt (Escape oder
  erneutes Antippen beendet das Stempeln; Stempel sind gesperrt, damit Kinder
  sie nicht verschieben). „Arbeitsblatt erzeugen“ steht unter
  „Lernwerkzeuge“, neue Seiten mit Vorlage über „+“. Die Sammlung ist im
  Moment nur über die Tastenkombination erreichbar und bekommt später einen
  eigenen Platz (in der HTML-Vorlage: „Regal“ › „Persönlich“).
- „Seite“ in der Werkzeugleiste ist gegliedert in Papier (Lineatur, Format),
  Farben & Bild, Rahmen (Seitenrahmen und -farbe), Vorlage (wechseln, als
  eigene Vorlage speichern) und Seiten (Kachelansicht, neu, duplizieren,
  verschieben, löschen).
- Kachelansicht (Seitenübersicht oder „Seiten“): alle Seiten als große
  Kacheln in einem Overlay. Antippen wählt, „Mehrere“ oder Strg/Umschalt
  wählt dazu; Ziehen verschiebt (auch mehrere Seiten zusammen), dazu Nach
  vorn/hinten, Duplizieren (Kopie direkt dahinter), Löschen mit Rückgängig
  für alle gelöschten Seiten und Öffnen (auch Doppelklick).
- Seiten löschen: Papierkorb an jeder Miniatur der Seitenübersicht (bei
  Maus beim Darüberfahren und an der aktuellen Seite, auf Tablets immer
  sichtbar) oder „Seite verwalten“ › „Seite löschen“. Ohne Rückfrage; ein
  Hinweis bietet 15 Sekunden lang „Rückgängig“ an (die Seite wird mit ihrem
  Inhalt an der alten Stelle neu angelegt).
- Alle Einstellungen erscheinen als Knöpfe mit Icon und Text; es gibt keine
  Dropdown-Menüs mehr, auch nicht in den Dialogen der Lernwerkzeuge.
- Icons: Flat Color Icons (icons8, MIT, npm `flat-color-icons`); fehlende
  Motive sind im gleichen Stil unter `public/icons/` ergänzt.
- Was Kinder sehen, legen Lehrkräfte unter „Meine Klassen“ fest: als
  Vorgabe für die Klasse („Was die Kinder im Heft sehen“) und bei Bedarf als
  eigene Auswahl je Kind („Funktionen“). Ohne Einstellung gilt die Vorgabe aus
  `src/lib/child-features.mjs`. Ton aufnehmen und Seiten hinzufügen werden
  weiterhin pro Heft beim Austeilen erlaubt. Die Schalter steuern, was die
  Oberfläche anbietet; Speichern und Medienrechte prüft der Server unabhängig
  davon wie bisher.


- Regal mit Suche, farbigen Umschlägen, Seitenvorschau, Umbenennen, Kopie und Löschen.
- Seiten in A4 hoch/quer; einfügen, duplizieren, verschieben und entfernen.
- Alle elf Lineaturen aus dem Konzept, als selbst gezeichnete SVG-Muster.
- Text mit zehn lokal ausgelieferten Schriftfamilien; Bilder, Vektorzeichnungen,
  Textmarker, Radierer (entfernt ganze Striche), Ton und ein Rückmeldestempel.
- Auswahl, Mehrfachauswahl, Verschieben, Größe, Drehung, Ebenen, Sperren,
  Kopieren/Einfügen, Rückgängig/Wiederholen (50 Schritte pro geöffneter Seite).
- Automatisches seitenweises Speichern. Versionskonflikte überschreiben keine
  fremden Änderungen; die lokale Fassung kann als neue Seite gesichert werden.
- Smartphone-Upload mit QR-Link (zehn Minuten, maximal 20 Bilder).
- Vorlagen mit Suche und Kategorien; Steckbrief, Bildergeschichte und Stundenplan;
  eigene Seitenvorlagen und Vorlagen aus dem Betreiberverzeichnis.
- Persönliche Sammlung für ausgewählte Elemente; Heft- und Vorlagenkopien an
  andere bestehende Lehrkraftkonten weitergeben.
- 48 Arbeitsblatt-Formate mit bearbeitbaren Vektoren und separaten Lösungen:
  Arithmetik, Rechenmaterial, Geld, Zeit, Noten, Schreibübungen und Labyrinthe.
- Erweiterter Vorlagenkatalog für Kommunikation, Unterricht, Präsentation,
  Schreiben, Comic/Film, Musik, Alltag und Wohnen; keine übernommenen Referenzdateien.
- Interaktive Übungen und Lernwerkzeuge mit getrennten Vorgaben und Antworten.
  Details und Prüfumfang im [Funktionsvergleich](funktionsvergleich.md).
- Regalordner, ZIP-Sicherungen einschließlich eigener Vorlagen, Sammlungen und
  Medien; Wiederherstellen erzeugt eigene Kopien im angemeldeten Konto.
- Tafelmodus einschließlich Zeichnen, Zoom und frei belegbaren Tastaturkürzeln.
- Eigene Heftdatei, eigenständiges interaktives HTML, ePub mit festem Layout,
  SCORM 1.2 und direkter PDF-Download; PDF-Import als gesperrte Bildhintergründe.
  HTML-Kopien können ihre Antworten und Aufnahmen erneut als Datei speichern.


## Klassen und Kinder

Unter „Meine Klassen“ Klassen und Kinder anlegen, umbenennen, archivieren und
löschen. Ein Kind benötigt nur einen Vornamen oder ein Kürzel.

„Karte scannen“ ordnet einen fremden QR-Code zu. „Klasse einscannen“ ermöglicht
mehrere Zuordnungen nacheinander. Der Scanner nutzt jsQR auch in Safari. Rohinhalte
werden weder an den Server geschickt noch gespeichert: SHA-256 im Browser,
anschließend HMAC auf dem Server. Eine Prüfsumme kann nur einem Kind gehören;
bei kurzen bzw. rein numerischen Codes erscheint eine Empfehlung für eigene Karten.

Eigene Karten entstehen zufällig im Browser. Der Rohwert bleibt nur solange im
Arbeitsspeicher, bis der Druckdialog geschlossen bzw. die Seite verlassen wird.
Bei Verlust die Karte sperren und eine neue zuordnen. Der Widerruf beendet über
die Kartenversion auch bestehende Kinder-Sitzungen. Ein achtstelliger Hilfscode
gilt einmal für zwei Minuten.

Beim Austeilen entstehen unabhängige Heftkopien. Die ursprünglichen Elemente
werden für Kinder gesperrt. Lehrkräfte entscheiden über zusätzliche Seiten und
Tonaufnahmen. Interaktive Aufgaben bleiben bedienbar; ihre Inhalte, Antworten
und Platzierung werden serverseitig getrennt geprüft. Die Kinderoberfläche bietet Schreiben, Zeichnen, Bewegen, freigegebene
Bilder, Vorlesen und gegebenenfalls Aufnahme. Sie enthält keinen Upload, keinen
Vorlageneditor, keine Generatoren und keine Freigabe an andere Kinder. Vorgaben
und Eigentum werden bei jeder Änderung zusätzlich auf dem Server geprüft.

Lehrkräfte sehen die bearbeiteten Seiten und können Kinderhefte im vollständigen
Editor öffnen, mit Stift, Text oder Stempel kommentieren und an der Tafel zeigen.
Kinder legen Hefte nur in den Papierkorb; Lehrkräfte können sie zurückholen oder
endgültig löschen.

## Geteilte iPads

`/kinder` ist der Einstieg für Web-Clips und den Home-Bildschirm. Manifest und
Apple-Icon werden lokal ausgeliefert. Es gibt keinen Service Worker und keine
Heftkopien in Local Storage oder IndexedDB. Alle Heftdaten liegen auf dem Server.

„Fertig“ speichert und meldet ab. Vor einem Kontowechsel aus dem Heft über „Meine
Hefte“ werden ausstehende Änderungen gespeichert. Inaktivität beendet die Sitzung
nach knapp zehn Minuten; die Oberfläche speichert vorher. Der Server lehnt
Sitzungen nach zehn Minuten ohne Aktivität und ab der konfigurierten Schulschluss-
Stunde ab. Schulschluss richtet sich nach Europe/Berlin, standardmäßig 16 Uhr.
Auch die Regalansicht besitzt einen Inaktivitätstimer. Ein Safari-Seitenschnappschuss
wird vor dem Verlassen verdeckt; bei einer Wiederherstellung wird die Anmeldung
neu geprüft.

Vorlesen verwendet ausschließlich eine auf dem Gerät installierte deutsche Stimme
(`localService`). Wenn keine verfügbar ist, muss sie auf dem iPad installiert
werden. Kamera und Mikrofon brauchen HTTPS und die entsprechende Gerätefreigabe.

## Externe Sammlungen

`GALLERY_ORIGIN` bindet die Bildergalerie der Schulplattform an (JSON-API v1,
`/api/v1/images`); ist sie privat, liegt das Bearer-Token in der Datei aus
`GALLERY_TOKEN_FILE` (gleiche Namen wie bei der Grundschultafel).
`WOERTERBUCH_ORIGIN` stellt den Link zum Wörterbuch bereit.
Bilder werden dort heruntergeladen und anschließend hochgeladen; Wörter werden
in den Generator übernommen. Ein direkter Such-/Importadapter ist **noch nicht
implementiert**, weil das Repository keinen API-Vertrag dieser beiden Dienste
enthält. Es werden keine beliebigen Internet-URLs serverseitig abgerufen.

Die noch ungeklärte Originaldatei von **Gruschudru basic** ist nicht mitgeliefert.
Alle anderen im Konzept genannten Familien liegen einschließlich OFL und Herkunft
in [public/fonts/SOURCES.md](../public/fonts/SOURCES.md). Es wurde nichts aus dem
Lernsachen-Heft extrahiert.

## Zeichnen und Radieren: erste Überarbeitung vom 10. November 2026

Lehrkräfte- und Kindereditor verwenden jetzt gemeinsame Pinselparameter und
dieselbe Radierlogik. Nach Auswahl des Stifts erscheinen Stiftart, Stärke und
Deckkraft. Der Füller zeichnet eine zusammenhängende Kontur;
einzelne Punkte bleiben sichtbar. Neue Freihandlinien werden geglättet,
zusammengefasste Eingabeereignisse und der letzte Punkt beim Absetzen verarbeitet.
Kantige Striche ohne Pinselart, etwa aus Arbeitsblattgeneratoren, bleiben kantig.

Nach Auswahl des Radierers stehen diese Optionen bereit:

- **Fläche radieren:** entfernt nur die überfahrenen Teile einer Zeichnung.
- **Ganze Striche:** entfernt berührte Striche vollständig.
- **Größe:** Durchmesser 2, 5, 10 oder 20 mm, in beiden Editoren gleich.
- **Weiche Kante:** lässt den Rand des Radierbereichs weich auslaufen.
- **Stärke:** 25, 50 oder 100 Prozent; bei geringerer Stärke wird aufgehellt.
  Eine weitere Radierbewegung über dieselbe Stelle hellt erneut auf.

Bilder, Texte und gesperrte Zeichnungen bleiben erhalten. Eine abgeschlossene
Radierbewegung bildet einen Rückgängig-Schritt; eine abgebrochene Bewegung wird
verworfen. Masken werden mit dem Strich gespeichert und beim Verschieben,
Drehen, Vergrößern und Verkleinern mitgeführt. Bearbeitbare Heftdateien behalten
die Masken auch bei Export und Reimport. Ältere Programmversionen kennen dieses
neue optionale Feld nicht; solche Dateien mit der aktualisierten Version öffnen.

`node test/drawing.test.mjs` prüft die sichtbare Wirkung gerenderter Masken,
Füllerpunkte, gedrehte/vergrößerte Striche, Undo/Redo, Speicherung und
Heftdatei-Export/Reimport. Die zusätzlichen Browsertests in
`test/e2e/drawing.spec.ts` prüfen die Bedienwege für Lehrkräfte und Kinder.
Sie konnten in der eingeschränkten Entwicklungssitzung nicht ausgeführt werden.

Dies ist der erste Umsetzungsschritt, keine vollständige Angleichung der
Zeichenwerkzeuge. Die folgenden Abschnitte beschreiben die weiteren Schritte.
Die Stift-/Handflächenbedienung muss
weiterhin auf echten Geräten abgenommen werden.

### Stiftarten: anschließende Korrektur

Die erste Überarbeitung hatte die Stiftarten noch zu ähnlich behandelt. Die
Zeichenlogik der lokalen Vorlage wurde deshalb gesondert untersucht. Neue
Striche verwenden jetzt unterschiedliche Modelle:

| Stiftart | Verhalten |
| --- | --- |
| Stift | Runde Spitze; Druck beeinflusst die Breite. Bei Maus/Finger wird der Verlauf aus der Bewegung abgeleitet. |
| Füller | Schräge elliptische Feder; die Breite hängt von der Zeichenrichtung ab. „Schreibhand“ spiegelt die Feder. Geschwindigkeit beeinflusst die Federgröße, Druck bestimmt hier nicht die Strichbreite. |
| Buntstift | Reproduzierbare Papierkörnung und abgestufter Farbauftrag. Schnellere Bewegung zeichnet leichter; ein geneigter Eingabestift schraffiert breiter und heller. Die Neigungsrichtung beeinflusst die breite Spitze. |
| Marker | Gleichmäßige breite, runde Spitze ohne druckabhängige Breitenänderung. Überlappungen verschiedener Striche dunkeln nach. |
| Aquarell | Mehrere durchscheinende, unterschiedlich breite Schichten mit weichen Rändern und auslaufenden Spitzen. Liegt unter anderer Tinte, auch in der Vorschau, im Druck und im portablen Viewer. |

Jede Stiftart bietet passende Größen und eine eigene Standarddeckkraft. Beim
Werkzeugwechsel bleiben Farbe, Breite und Deckkraft je Stiftart während der
Editorsitzung erhalten. Breite und Deckkraft werden nicht mehr durch pauschale
Marker-/Aquarell-Multiplikatoren verändert.

Neue Striche speichern Pinselversion, gegebenenfalls Schreibhand und simulierte
Druckeingabe sowie Zeit-/Neigungswerte der Stiftpunkte. Bestehende Striche ohne
die neue Pinselversion behalten ihren bisherigen Zeichenpfad. Die Darstellung
ist eine eigenständige Implementierung der beobachteten Verhaltensweisen;
pixelgleiche Darstellung oder identisches Schreibgefühl zur Vorlage wird nicht
behauptet. Gerade das Verhalten auf einem echten Pencil muss praktisch verglichen
werden. Ohne Neigungssensor zeichnet der Buntstift mit aufrechter Spitze.

Die 20 gezielten Zeichentests prüfen zusätzlich Federdiagonalen und Schreibhand,
Druck-/Geschwindigkeitsunterschiede, Markerbreite, Buntstiftkörnung und -neigung,
Aquarellschichten/-reihenfolge sowie die Speicherung der Sensordaten. Reale
Browser-/Pencil-Abnahme bleibt offen.

Die Glättung arbeitet inzwischen in zwei Stufen: Eine von der Stiftart abhängige,
räumliche Beruhigung der Eingabepunkte dämpft kleine Zitterbewegungen, bevor die
Kurve und Federkontur berechnet werden. Anfang und Ende bleiben an der gezeichneten
Position; Rohpunkte, Druck-, Zeit- und Neigungswerte bleiben gespeichert.
Zusätzliche Tests prüfen die Zitterdämpfung, kurze Striche und gerade Lineallinien.

### Lineal und Geodreieck

Beide Editoren bieten jetzt ein verschiebbares 18-cm-Lineal und ein Geodreieck
mit Millimeter-/Zentimeterskala, Mittellinie und Winkelteilung. Die gesamte
Werkzeugfläche lässt sich mit Maus, Finger oder Stift anfassen und verschieben.
Zum Drehen am Drehgriff ziehen oder den Winkel in der Werkzeugleiste eingeben.
Der ×-Button direkt auf der Zeichenhilfe schließt sie. Zwei Finger
verschieben und drehen sie gemeinsam. Mit den Pfeiltasten lassen sich die
fokussierten Griffe ebenfalls bedienen. Umschalt vergrößert den Bewegungsschritt
auf 10 mm beziehungsweise den Winkelschritt auf 15 Grad.

Stift, Füller, Buntstift und Marker rasten ein, wenn ein Strich höchstens 3 mm
außerhalb neben einer tatsächlichen Kante beginnt. Direkt auf der Werkzeugfläche
wird die Zeichenhilfe verschoben. Der Abstand der Strichmitte zur Kante
berücksichtigt die halbe Strichbreite. Die gewählte Kante bleibt für diesen Strich
fest; die Linie endet an den Werkzeugenden. Beim Geodreieck sind alle drei Kanten
nutzbar. Weiter entfernt gezeichnete Striche bleiben frei. Aquarell und Farbeimer
werden nicht an einer Kante geführt.

Die Führung verwendet dieselben Positions- und Winkeldaten wie das sichtbare
Werkzeug. Die erzeugten Striche bleiben gewöhnliche bearbeitbare Zeichnungen;
Zeichenhilfen selbst sind temporär und werden nicht mitgedruckt oder exportiert.

26 gezielte Zeichentests bestehen, einschließlich aller Kanten bei verschiedenen
Winkeln, Verschiebung, Zwei-Finger-Berechnung, Strichbegrenzung, Sensordaten und
erneutem Öffnen geführter Striche. Der Browser-Bedienweg ist als zusätzlicher
Playwright-Test vorbereitet; reale Browser-/Touch-Abnahme bleibt in der
eingeschränkten Entwicklungssitzung offen.

### Pipette, Radierformen und Erkennung von Grundformen

Diese Funktionen sind ebenfalls in beiden Editoren eingebunden:

- **Pipette:** aktivieren und eine Farbe auf der Seite antippen. Die Farbe des
  gerenderten Seitenpixels wird als Zeichenfarbe übernommen, ohne einen Strich
  zu erzeugen. Bilder, Transparenz und Seitenzoom werden dabei berücksichtigt.
  Zeichenhilfen werden beim Auslesen ausgeblendet. Esc bricht die Aufnahme ab.
  Wenn der Browser die Seite nicht in eine lesbare Grafik umsetzen kann, wird
  eine Fehlermeldung angezeigt.
- **Radierform:** im Modus „Fläche radieren“ unter „Spitze“ zwischen Rund,
  Eckig und Schräg wählen. Auch die neuen Spitzen unterstützen weiche Kanten
  und teilweises Aufhellen. Ihre Form bleibt beim Speichern und beim Export
  einer bearbeitbaren Heftdatei erhalten.
- **Formen erkennen:** in den Stifteinstellungen einschalten. Am Ende eines
  Strichs ungefähr eine halbe Sekunde stillhalten. Erkannte Linien, Kreise/Ellipsen,
  Dreiecke oder Rechtecke erscheinen als Vorschau. Loslassen übernimmt die
  Form; Weiterzeichnen verwirft die Vorschau. Gedrehte Ellipsen und Rechtecke
  werden unterstützt. Das ist eine Erkennung von Grundformen, noch keine
  vollständige Übernahme aller Referenzformen wie Herzen, Sterne und Pfeile.

Die Formerkennung startet ausgeschaltet und greift weder bei Aquarell/Farbeimer
noch bei bereits an einer Zeichenhilfe geführten Strichen ein. Bereinigte Formen
bleiben Strichobjekte mit ihrer Stiftart, Farbe und Deckkraft. Ihre bereinigten
Punkte werden gespeichert; geometrische Ecken werden nicht erneut durch die
Freihandglättung verrundet. Radieren, Verschieben, Undo/Redo und Weitergabe bleiben
damit über dieselben Zeichenfunktionen verfügbar.

31 gezielte Zeichentests bestehen. Neu geprüft werden Farbumrechnung und Zoom,
die gerenderte Fläche eckiger/schräger Radiermasken, Grundformerkennung und die
Speicherung sowie Weitergabe der neuen Attribute. Zusätzliche Browser-Bedienwege
für Pipette und Stillhalten-Vorschau sind vorbereitet, konnten in dieser Sitzung
aber nicht ausgeführt werden.

Die Bedienlogik der Formerkennung wurde anschließend korrigiert: Die ursprünglichen
Grenzen von 0,3 mm beim Halten und 0,5 mm beim Loslassen waren zu empfindlich.
Die gemeinsame Haltesteuerung berücksichtigt jetzt die tatsächliche Darstellung
der Seite (7 Bildschirmpixel für die Haltezone, 14 für das Verlassen der Vorschau).
Eine Haltephase dauert 550 ms. Bewegungen innerhalb der Haltezone starten diese
Zeit nicht immer wieder neu; Sensorzittern am Ende wird vor der Erkennung
zusammengefasst. Kleine Bewegungen beim Absetzen erhalten die erkannte Form.
Bei verzögertem Timer kann die Haltezeit auch beim Loslassen ausgewertet werden.

Acht zusätzliche Tests prüfen den zeitlichen Ablauf mit einem steuerbaren Takt:
laufende Zitterereignisse, verschiedene Seitenmaßstäbe, vollständige Zeichenfolgen,
Absetzen, bewusstes Weiterzeichnen, verzögerte Timer, erneute Erkennungsversuche
und Abbruch. Auch schnelle Mauslinien mit nur zwei Eingabeereignissen werden
erkannt. Ein weiterer Browser-Regressionsfall führt die Maus während des
Haltens absichtlich weiter in kleinen Bewegungen. Die praktische Browser- und
Pencil-Prüfung steht weiterhin aus.

Die Formerkennung wurde um Pfeile, fünfzackige Sterne (Umriss oder durchgezogener
Stern) und geschlossene Herzen ergänzt. Drehrichtung, Startpunkt, Lage und Größe
werden beim Vergleich berücksichtigt. Bereinigte Ecken bleiben beim Verdichten
der Punkte exakt erhalten.

Pfeile können in einem Zug oder als Linie mit anschließender separater Spitze
gezeichnet werden. Für die zweite Variante muss die Linie der unmittelbar letzte,
unveränderte Strich mit derselben Stiftart, Farbe, Breite und Deckkraft sein.
Die Spitze wird als V am Ende der Linie gezeichnet und dort kurz gehalten.
Gesperrte, gruppierte, gefüllte oder bereits radierte Striche werden nicht verbunden.
Die Vorschau blendet die ursprüngliche Linie vorübergehend aus; erst beim Loslassen
entsteht der gemeinsame Pfeil. Einmal Rückgängig stellt die ursprüngliche Linie
wieder her. Weiterzeichnen oder Abbrechen verwirft die Zusammenfügung.

Aktueller Prüfstand: 36 Zeichentests und neun Tests der Haltesteuerung bestehen.
Die neuen Fälle prüfen beide Zeichenrichtungen, gedrehte Formen, getrennte
Pfeilspitzen, Undo/Redo und Speichern sowie Export/Reimport der neuen Geometrien.
Ein zusätzlicher Browserfall für die zweiteilige Pfeilgeste ist vorbereitet;
Browser- und Geräteprüfung bleiben in dieser Ausführungsumgebung ausstehend.

### Farbeimer

Der Farbeimer steht jetzt in beiden Editoren unter **Stiftart → Farbeimer** bereit:

- **Zusammenhängende Fläche:** Füllt den angeklickten, farblich zusammenhängenden
  Bereich der sichtbaren Seite. Auch mehrere einzelne Striche können eine Fläche
  begrenzen. Innenlöcher bleiben frei. Offene Konturen lassen Farbe hindurch.
  Die gewählte Deckkraft gilt für die neue Fläche.
- **Geschlossene Form:** Ändert die Füllfarbe einer vorhandenen Form oder eines
  geschlossenen, unbeschädigten Strichs. Die Trefferprüfung berücksichtigt die
  Drehung und bei SVG-Formen die tatsächlich gerenderte Kontur. Linien, offene
  Striche und Klicks außerhalb einer Form färben nicht mehr die gesamte Seite.

Flächenfüllungen werden als eigene Vektorpolygone ohne zusätzliche Randstriche
abgelegt. Sie lassen sich verschieben, skalieren, radieren und mit einem Schritt
rückgängig machen. Speichern sowie Heftdatei-Export/Reimport erhalten die Flächen
und ihre Innenlöcher. Die vorhandenen Konturen werden nicht verändert.
Gesperrte Objekte sind einschließlich ihrer gedrehten rechteckigen Objektfläche
für Flächenfüllungen ausgespart. Dies ist bei unregelmäßigen Formen bewusst
konservativer als nur der sichtbare Umriss.

Die Flächensuche verwendet vier Bildpunkte pro Millimeter und eine feste
Farbtoleranz. Sehr feine Lücken, Antialiasing und ähnliche Farben können das Ergebnis
beeinflussen. Stark detailreiche Flächen werden mit einer Meldung abgelehnt, ohne
Teile stillschweigend abzuschneiden. Esc bricht eine laufende Berechnung ab;
Seitenwechsel oder Änderungen am Seiteninhalt verwerfen ein veraltetes Ergebnis.
Eine zwischenzeitliche automatische Speicherung allein verwirft die Füllung nicht.

Zehn zusätzliche Tests prüfen Flächensuche, Konturen und Löcher, aus mehreren
real gerenderten Strichen gebildete Grenzen, gedrehte Treffer, Schutzbereiche,
Füllregeln, Radieren, Undo/Redo, Speicherrevisionen und Heftdatei-Export/Reimport.
Die bisherigen 36 Zeichentests und neun Tests der Haltesteuerung bestehen weiterhin.
Browserfälle für beide Editoren sind vorbereitet. Ihr Start scheitert in dieser
Sitzung bereits am Testserver: `spawnSync ... node EPERM`. Die tatsächliche
Browserbedienung ist damit noch nicht abgenommen.

### Laser und Taschenlampe im Tafelmodus

Im Tafelmodus stehen jetzt **Laserpointer** und **Taschenlampe** zur Verfügung.
Der Laser zeigt einen roten Punkt mit einer nach 750 ms ausblendenden Spur.
Die Taschenlampe dunkelt die Seite außerhalb eines weich begrenzten Lichtkreises
ab; dessen Größe lässt sich auf Klein, Mittel oder Groß einstellen.
Die Größe bleibt beim Wechsel der Zeigehilfe innerhalb der geöffneten Ansicht
erhalten. Eine Speicherung über das Neuladen hinaus ist noch nicht implementiert.

Mausbewegungen und Stifthover führen die Anzeige; Finger können sie durch Ziehen
verschieben. Bei mehreren gleichzeitigen Berührungen bleibt die erste aktive
Geste zuständig. Die fokussierte Zeigeebene lässt sich mit Pfeiltasten verschieben,
mit Umschalt in größeren Schritten. **Zeigehilfe beenden**, erneutes Antippen des
aktiven Werkzeugknopfs oder Escape schaltet die Hilfe aus. Der Browser kann mit
Escape zugleich den Vollbildmodus verlassen. Seitenwechsel setzen Punkt und Spur
zurück; Verlassen des Tafelmodus entfernt die Anzeige vollständig.

Die temporäre Ebene fängt Eingaben ab und ist von Seitenobjekten, Undo-Verlauf
und Speicherung getrennt. Lernwerkzeuge werden währenddessen nicht bedient.
Der Wechsel zu einer Zeigehilfe verwirft eine noch nicht abgeschlossene
Zeichengeste. **Auf der Tafel schreiben** beendet die Zeigehilfe und aktiviert
wieder einen Stift, auch wenn zuvor der Farbeimer gewählt war.
Druck und PDF-/Heftdatei-Export verwenden die Heftseite ohne Zeigeebene.
Die Bedienleiste liegt unterhalb des Seitenbereichs und kann auf kleinen
Bildschirmen umbrechen.

Vier neue Tests prüfen tatsächlich gerenderte SVGs: freie Lichtkreismitte,
Abdunklung und weiche Kante, Größenwechsel, Positionen am Seitenrand, Laserfarbe,
transparente Spur und getrennte Masken-IDs. Zwei vorbereitete Browserfälle prüfen
unveränderten Seiteninhalt/Undo-Verlauf, Tastaturbedienung, Seitenwechsel und den
Wechsel zurück zum Schreiben. Diese Browserfälle und echte Touch-/Pencil-Eingaben
sind weiterhin nicht praktisch abgenommen.

### Anlaut-Tastatur

Die Anlaut-Tastatur verwendet jetzt eine eigene gemeinsame Komponente im
Lehrkräfteeditor, Kinderheft und portablen Viewer. Im Gestaltungsdialog lassen
sich folgende Einstellungen wählen:

- Erste Tabelle mit 35 oder vollständige Tabelle mit 44 Tasten, einschließlich
  ß und den zusätzlichen Lautverbindungen äu, ie, sp, st, pf, ng, ck, tz und ai.
- ABC- oder QWERTZ-Anordnung; Groß und klein mit Umschalttaste, nur klein oder
  nur GROSS; Schrift und rote Kennzeichnung der Selbstlaute.
- Freies Schreiben oder Wörter üben, bis zu 40 Wörter mit je höchstens 80 Zeichen.
  Vorhandene thematische Wortlisten können übernommen werden. Bindestriche zur
  Silbentrennung werden für die Schreibaufgabe entfernt.
- Wortvorgabe als Wort, Bild, Wort und Bild oder nur zum Anhören. Eigene Wortbilder
  und Wortaufnahmen lassen sich hinterlegen. Ohne eigenes Wortbild wird, soweit
  passend, ein Bild aus der verwendeten Tastatur angeboten.

Ein Tipp schreibt die ausgewählte Taste; „sch“ bleibt dabei eine zusammengehörige
Eingabe und wird mit einmal Zurück gelöscht. Gedrückt halten erklärt die Taste
mit „M wie Maus“, ohne zu schreiben. Geschriebene Zeichen lassen sich zum erneuten
Anhören antippen; bei Tasten mit zwei Varianten bleibt die ausgewählte Variante
zugeordnet. Eine angeschlossene Tastatur und Unicode-Komposition werden ebenfalls
verarbeitet. Bereits vorhandene freie Texte, auch längere Alttexte, bleiben erhalten.

Das Worttraining prüft die tatsächliche Schreibweise einschließlich der gewählten
Groß-/Kleinschreibung. Fehlende oder zusätzliche Buchstaben verschieben nicht die
Bewertung aller nachfolgenden Buchstaben. Nach zwei erfolglosen Prüfungen erscheint
das Zielwort als Hilfe. Ein richtig geschriebenes Wort erhält einen Stern und
führt nach einer Sekunde automatisch zum nächsten Wort; alternativ ist „Weiter“
möglich. Nach zwei Fehlern kann ein Wort ohne Stern übersprungen werden. Am Ende
werden die Sterne angezeigt; „Nochmal“ beginnt eine neue Serie. Bearbeitungsstand
und Ergebnis werden als Antwort am Lernwerkzeug gespeichert, auch bei gesperrtem
Entwurf im Kinderheft. Änderungen an der Aufgabenliste oder Buchstabenart setzen
das Training zurück; Layout-/Medienänderungen erhalten den Fortschritt.

Unter „Tastenbilder und Laute anpassen“ können Bildwörter, eigene Bilder und
Lautaufnahmen je Taste geändert werden. Selbstlaute sowie ch und v haben getrennte
Varianten. Die Audioaufnahme nutzt den vorhandenen Aufnahmedialog; Tondateien können
auch hochgeladen und wieder entfernt werden. Diese Anpassungen gelten für das
jeweilige Lernwerkzeug und werden mit dem Heft gespeichert, ausgeteilt und exportiert.
Die für die Tastatur gewählte Schrift wird jetzt ebenfalls im HTML-/ePub-Export
berücksichtigt.

**Verbleibende Unterschiede zur Vorlage:** Es gibt noch keine mitgelieferten
Phonemaufnahmen. Ohne eigene Lautaufnahme spricht die lokale deutsche Gerätestimme
das Bildwort, nicht zuverlässig den einzelnen Laut. „Tastenklang einschalten“ steuert
die automatische Wiedergabe beim Schreiben; bewusstes Anhören bleibt möglich.
Eigene Aufnahmen gelten noch nicht automatisch für alle Tastaturen, und sie werden
noch nicht automatisch auf den Laut zugeschnitten. Silbenfärbung und die spezifischen
Wortlisten der Vorlage sind nicht übernommen. Emoji-Bilder ersetzen kein vollständiges
bebildertes Fibelmaterial.

14 neue Tests prüfen Tastenbestand/-anordnung, Schreibweisen, Löschschritte,
Wortprüfung, Korrekturzuordnung, Sterne/Abschluss, Alttexte, Lautvarianten,
Medienfreigaben an Kinder, Speicherung und Heftdatei-Export/Reimport sowie die
Schrifteinbettung. Die 18 allgemeinen Lernwerkzeugtests, acht Hefttests und vier
Klassentests bestehen weiterhin. Drei Browserfälle für lange Tastendrücke,
angeschlossene Tastatur, automatische Wortfolge und geschützte Kinderhefte sind
vorbereitet, in dieser Ausführungsumgebung aber noch nicht praktisch geprüft.

### Laute verbinden

„Laute verbinden“ verwendet jetzt einen Ziehablauf statt der bisherigen
Schaltfläche zum Zusammenrücken von Wortteilen. Links steht der Anfangslaut,
rechts der Selbstlaut. Die linke Karte wird auf einer waagerechten Bahn zur
rechten gezogen. Erst beim tatsächlichen Kontakt werden beide verbunden.
Ein kurzer Tipp lässt die Karte nur wackeln, ein zu früh beendeter oder
abgebrochener Zug setzt sie zurück und zählt nicht als Aufgabe.
Dehnbare Anfangslaute erhalten beim Ziehen eine sichtbare Lautspur; bei
Verschlusslauten wird keine künstlich gedehnte Spur angezeigt.

Die Ziehkoordinaten werden über die SVG-Transformation berechnet und berücksichtigen
damit Seitenzoom und Objektdrehung. Während einer Geste bleibt deren Pointer
zuständig; weitere Berührungen übernehmen sie nicht. Abbruch, Verlust des
Pointer-Captures, Fensterwechsel und das Abschalten der Lernbedienung stoppen
den Zug und die dazugehörige Lautaufnahme. Eingabe- oder Leertaste auf der
fokussierten Kartenfläche verbindet die Laute ebenfalls. Nach dem Transport
wird für die Tastaturbedienung die nächste Karte fokussiert.

Nach jeder Verbindung transportiert ein wechselndes Fahrzeug die Silbe in die
Sammelreihe. Erst nach diesem Transport steigt der Fortschritt. Nach der letzten
Silbe erscheint eine Abschlussansicht mit allen gesammelten Silben. „Nochmal“
beziehungsweise „Von vorn“ wiederholt dieselbe Serie; „Neue Silben“ erzeugt eine
neue Variante. Eigene Verbindungen können mit „Neu mischen“ umgeordnet werden.
Ein Neustart oder Seitenwechsel beendet einen laufenden Transport. Reduzierte
Bewegung wird berücksichtigt; Vorschau und Druck zeigen den Transport statisch.

Im Gestaltungsdialog stehen zur Verfügung:

- Gelernte Mitlaute und Selbstlaute als auswählbare Tasten. Dehnbare Mitlaute sind
  grün umrandet. Es werden nur Kombinationen aus dieser Auswahl erzeugt.
- Eine Serie mit einer bis zwölf Silben, klein, GROSS oder gemischt, sowie die
  vorhandenen Schriften. Bei sehr wenigen ausgewählten Lauten sind Wiederholungen
  innerhalb einer Serie möglich.
- Eigene Verbindungen mit zwei Teilen, etwa `m + a` oder `la + ma`.
  Vorhandene Wortlisten älterer Elemente bleiben als solche Verbindungen verfügbar:
  Trennstriche haben Vorrang; sonst werden Wortanfang und Rest getrennt.
  Die neue Serie beginnt zunächst von vorn, da der alte Klickzustand keinen
  verlässlichen Sammelfortschritt abbildete.
- Vorlesen der verbundenen Silbe über eine lokale deutsche Gerätestimme,
  einschließlich einstellbarer Stimme/Geschwindigkeit und eigener
  Aussprachekorrekturen in der Form `Silbe = Sprechweise`.
- Optionales Vorsprechen des Anfangslauts beim Ziehen, standardmäßig aus.
  Dafür können eigene Tondateien hochgeladen oder aufgenommen werden. Nur bei
  dehnbaren Lauten wird die Aufnahme wiederholt; Verschlusslaute erklingen einmal.

**Verbleibende Unterschiede:** Es gibt weiterhin keine mitgelieferten Phonem- oder
Silbenaufnahmen. Ohne eigene Aufnahme bleibt der Anfangslaut stumm, damit keine
Buchstabennamen als vermeintliche Laute vorgelesen werden. Silbenaussprache und
Korrekturen hängen von der lokalen Stimme ab. Eigene Lautaufnahmen gelten für
dieses Lernwerkzeug; die Aufnahmen der Anlaut-Tastatur werden noch nicht automatisch
übernommen. Automatischer Zuschnitt der Aufnahmen fehlt weiterhin.

Serienvariante, Position und Transport-/Abschlusszustand werden als Antwort am
Lernwerkzeug gespeichert. Auch gesperrte Übungen im Kinderheft dürfen diese Antwort
speichern, ohne den Entwurf zu ändern. Eigene Audiodateien werden beim Austeilen
freigegeben und kommen beim Heftdatei-Export mit. Eine zusätzliche Abbruchfunktion
für die Vorlesestimme verhindert, dass ein verlassenes Lernwerkzeug die neuere
Sprachausgabe eines anderen Werkzeugs abbricht.

Zwölf zusätzliche Tests prüfen Aufgabenbildung, alte und eigene Verbindungen,
Schreibweisen und Dehnbarkeit, Kontakt-/Fortschrittslogik, Wiederherstellung,
Vorschau, Validierung, Sprachabbruch, Medienfreigabe und Export/Reimport.
Die 14 Tests der Anlaut-Tastatur sowie die bisherigen Lernwerkzeug-, Heft- und
Klassentests bestehen weiterhin. Drei Browserfälle für gedrehte Karten,
abgebrochene Gesten, Neustart, automatische Tastaturfokussierung und Kinderhefte
sind vorbereitet; Browser- und echte Touch-/Pencil-Prüfung stehen weiterhin aus.

### Silben klatschen

„Silben klatschen“ verwendet jetzt eine endliche Serie von bis zu 16 Wörtern mit
Wortbildern, Silbenhilfen und gespeicherten Ergebnissen. Statt nach einem einzelnen
richtigen Wort bereits die gesamte Übung als abgeschlossen zu markieren, speichert
jedes „Weiter“ das Ergebnis dieses Wortes. Am Ende erscheinen alle Wörter mit Bild
und Ergebnis; „Nochmal“ beginnt eine neue Serie. Auch gesperrte Übungen im Kinderheft
speichern dabei nur die Antwort, ohne ihren Entwurf zu verändern.

Im Gestaltungsdialog können Wörter direkt eingetragen oder aus den vorhandenen
Themenlisten übernommen werden. Die Listenauswahl lässt sich nach Silbenzahl und
bekannten Lauten filtern; Lautverbindungen wie „sch“ und „äu“ werden dabei als
zusammengehörige Einheiten berücksichtigt. Die Wörter und ihre Trennungen bleiben
in einer Vorschau prüfbar. Eigene Bilder, Wortaufnahmen und Dateien für einzelne
Silben lassen sich hinterlegen. Bekannte Wörter haben auch einfache Emoji-Bilder;
fehlende oder ausdrücklich weggelassene Bilder werden durch das geschriebene Wort
ersetzt. Eine integrierte Bildsuche wie in der Referenz ist weiterhin offen.

**Silbentrennung:** Explizite Bindestriche und die bereits mit Silbengrenzen
hinterlegten Wortlisten haben Vorrang. Für unbekannte Wörter gibt es eine eigene
heuristische Vorschau. Diese ist kein vollständiges deutsches Silbentrennverfahren:
Sie muss im Gestaltungsdialog bestätigt oder korrigiert werden, bevor automatisch
bewertet wird. Einsilbige Wörter lassen sich ebenfalls bestätigen, ohne zusätzliche
Zeichen in das Wort einzufügen. Eine Änderung der Silbentrennung setzt die Serie
zurück. Wortbilder, Stimme und andere Hilfen verändern den gespeicherten Fortschritt
nicht. Gespeicherte Silbenaufnahmen sind an den zugehörigen Silbentext gebunden;
nach einer abweichenden Trennung wird keine unpassende Aufnahme abgespielt.

„Wort hören“ liest das Wort oder spielt die eigene Wortaufnahme ab. „Silben zeigen“
führt Silbe für Silbe vor: Blau und Rot, Silbenbogen, Punkt und aktive Markierung
begleiten die Wiedergabe mit einem lokal erzeugten Klatschimpuls. Eigene
Silbenaufnahmen haben Vorrang vor der lokalen deutschen Gerätestimme. Die Abfolge
orientiert sich am tatsächlichen Tonende und hat eine Zeitbegrenzung für fehlende
Endereignisse. Vorführung, Wortwechsel und Seitenwechsel sind abbrechbar; verspätete
Tonereignisse können eine neue Vorführung nicht fortsetzen. Die Vorführung zählt
keine Klatscher und vergibt keine Punkte. Punkte und Silbenschrift können auch von
Anfang an als Hilfen eingeblendet werden.

Zusätzlich zur Klatschtaste gibt es **Klatschen mit Mikrofon**. Erst dieser Knopf
fordert den Mikrofonzugriff an. Ein lokaler Detektor zählt kurze Lautstärkebursts,
sperrt Nachschwinger und bewertet die Folge nach ungefähr einer Sekunde Stille.
Dauerlärm gilt nicht als Stille. Bei einer zu langen oder nicht erkannten Folge
bleibt die manuelle Bedienung verfügbar. Die Empfindlichkeit ist im Gestaltungsdialog
wählbar. Sprache und Klassenlärm können ebenfalls Impulse auslösen; die Erkennung
ist deshalb ausdrücklich näherungsweise und muss am echten Gerät geprüft werden.

Zwischen Wörtern kann dieselbe Mikrofonverbindung offen bleiben, ohne erneute
Berechtigungsabfrage. „Mikrofon aus“, Verlassen der Seite, Fenster-/Tabwechsel und
das Abschalten der Lernbedienung beenden die Aufnahmequelle und ihren eigenen
AudioContext. Auch erst nach einem Abbruch erlaubte Zugriffe werden sofort
freigegeben. Während einer Vorführung wird nicht mitgezählt; das Mikrofon kann
dabei im sichtbaren Bereitschaftszustand offen bleiben. Es gibt keinen
MediaRecorder, keinen Tonupload und keine gespeicherte Mikrofonaufnahme – nur
Klatschzahl und Übungsergebnis werden als Antwort gespeichert.

16 zusätzliche Tests prüfen Silbengrenzen und deren Bestätigung, Wortlistenfilter,
Serienauswertung, Hilfen und Wiederherstellung, Darstellung, Impuls-/Stilleerkennung,
Wiedergabereihenfolge und Abbruch, verweigerte und verspätete Berechtigungen,
Ressourcenfreigabe sowie Medienweitergabe an Kinder und Heftdatei-Export/Reimport.
Die bisherigen Anlaut-, Lauteverbinden-, Lernwerkzeug-, Heft- und Klassentests
bestehen weiterhin. Drei Browserfälle für manuelle Serien, Vorführungsabbruch,
Berechtigungsverweigerung und Kinderhefte sind vorbereitet, aber in dieser
Ausführungsumgebung nicht praktisch geprüft. Echte Klatschgeräusche, Raumakustik
und die Browser-/Touchbedienung stehen als Geräteabnahme aus.

### Quiz, Zuordnungen und Memory mit Medien

Die drei Aufgabenformate unterstützen jetzt optionale Bild- und Tonfelder. Die
bisherigen Textfelder bleiben erhalten: Quizfragen und einzelne Antworten sowie
beide Seiten eines Zuordnungs-/Memory-Paars können Medien bekommen. Im
Gestaltungsdialog lassen sich Dateien hochladen, Ton aufnehmen und die sichtbare
Beschriftung ausblenden. Beschriftungen bleiben für Alternativtexte und die
Vorlesebedienung verfügbar. Die Bild-/Tonvorschau im Spiel ist getrennt von der
Quizantwort oder Zuordnung: Anhören ändert die Antwort nicht. Optional können
Texte mit einer lokalen deutschen Gerätestimme vorgelesen werden.

**Quiz:** Fragen können vorwärts und rückwärts durchgesehen werden. Nur tatsächlich
geprüfte richtige Antworten zählen zum Ergebnis. Eine nachträgliche Änderung einer
Antwort hebt die Prüfung dieser Frage auf; die anderen Prüfungen bleiben erhalten.
Rückmeldungen, Gesamtfortschritt und Neustart stehen im Spiel zur Verfügung.

**Zuordnungen:** Karten werden aus einer gemischten Ablage auf die passenden
Plätze gezogen. Alternativ kann zuerst eine Karte, dann der Zielplatz angeklickt
oder mit Tab/Eingabe ausgewählt werden. Eine Karte belegt nur einen Platz; beim
Verschieben wird ihr alter Platz frei und eine verdrängte Karte kehrt in die Ablage
zurück. Bereits abgelegte Karten sind ebenfalls ziehbar. Abbruch, Escape und
Neustart entfernen den temporären Ziehzustand. Die Trefferprüfung verwendet
Bildschirmkoordinaten und ist unabhängig von Seitenzoom und Objektdrehung.

Die Auswertung berücksichtigt den vollständigen Karteninhalt. Gleich beschriftete
Karten mit unterschiedlichen Bildern oder Tondateien gelten nicht automatisch als
dieselbe Antwort. Vollständig identische reine Textkarten bleiben austauschbar.
Bis zu zwölf Paare werden gespielt; weitere bereits gespeicherte Paare werden
nicht stillschweigend aus dem Heft gelöscht.

**Memory:** Bild/Bild-, Bild/Wort- und Bild/Ton-Paare können über die beiden Seiten
eines Paars gestaltet werden. Verdeckte Karten geben ihren Vorderseitentext nicht
über die zugängliche Beschriftung preis und rendern ihre Medien noch nicht. Beim
Aufdecken kann der Kartenton abgespielt und anschließend separat wiederholt werden.
Es sind höchstens zwei offene Karten erlaubt. Die Paarprüfung erfolgt über die
Paarzugehörigkeit, nicht über zufällig gleiche Texte. Tonkarten bleiben bis zum
Wiedergabeende offen; anschließend folgt eine kurze Merkpause, bevor unpassende
Karten wieder verdeckt werden. „Ton stoppen“ beendet die Wiedergabe, ein Neustart
beendet auch eine noch ausstehende Paarprüfung. Gefundene Paare, offene Karten und
Spielzüge werden gespeichert. Memory ist weiterhin ein Einzelspiel; ein eigener
Zweispielermodus wie in der Referenz fehlt noch.

Alte Quiz- und Zuordnungsantworten bleiben als Auswahl erhalten und werden erst
nach erneuter Prüfung bewertet. Bereits gefundene Paare bestehender Memory-Aufgaben
bleiben erhalten, sofern die Paardaten vorhanden sind. Änderungen am eigentlichen
Aufgabeninhalt oder an seinen Medien setzen den Aufgabenstand zurück; die gewählte
Vorlesestimme verändert ihn nicht. Ein kompakter Inhaltsstempel vermeidet, den
gesamten Aufgabeninhalt nochmals als Antwort zu speichern.

Eigene Medien werden beim Austeilen für Kinder freigegeben und über den
Heftdatei-Export weitergegeben. Gesperrte Aufgaben erlauben die Bearbeitungsantwort,
aber keine Änderung des Entwurfs. Diese Erweiterung schafft noch keine
Dateikompatibilität mit Quizsachen-/Schiebesachen-Dateien der Referenz.

14 neue Tests prüfen geprüfte Quizantworten, eindeutige Kartenbewegungen,
Medienunterscheidung, Memory-Paaridentität und Spielzüge, Wiederherstellung und
Altstände, verdeckte Karten, zugängliche Medienbeschriftungen, Validierung und
Medienfreigabe einschließlich Export/Reimport. Die bisherigen Anlaut-,
Lauteverbinden-, Klatsch-, Lernwerkzeug-, Heft- und Klassentests bestehen weiterhin.
Vier Browserfälle für getrennte Tonvorschau, Ziehen/Tastatur, längere Tonkarten und
Kinderhefte sind vorbereitet; Browser-, Touch- und reale Tonprüfung stehen weiter aus.

### Buchstaben raten · Maus und Käse

„Buchstaben raten“ ist jetzt ein eigenes Aufgabenformat unter den interaktiven
Übungen. Das vorhandene Labyrinth bleibt als separates Format erhalten und heißt
im Katalog nun „Labyrinth · Maus & Käse“. Bereits gespeicherte Titel dieser
Labyrinthaufgaben werden nicht umgeschrieben.

Beim Buchstabenraten sind die Buchstaben des Zielworts zunächst verdeckt. Ein
richtiger Buchstabe deckt alle zugehörigen Stellen auf. Ein falscher bewegt die
Maus einen Schritt in Richtung Käse. Derselbe Buchstabe kann nicht mehrfach
Versuche verbrauchen. Nach der gewählten Zahl falscher Buchstaben wird das Wort
aufgedeckt; weitere Eingaben verändern diesen Versuch nicht mehr. „Lösung zeigen“
deckt das Wort ohne Stern auf, „Wort neu versuchen“ beginnt denselben Versuch neu.
Nur ein beendetes Wort kann weitergeschaltet werden. Am Ende einer Serie zeigt
eine Abschlussansicht die erratenen und nicht erratenen Wörter. „Nochmal“ beginnt
dieselbe Serie von vorn.

Die Gestaltung bietet bis zu 20 Wörter oder kurze Ausdrücke mit höchstens 40
Zeichen, vier bis zwölf Fehlversuche, ABC-/QWERTZ-Anordnung, große oder kleine
Buchstaben und die vorhandenen Schriften. Themenlisten lassen sich übernehmen;
Bindestriche aus Silbenlisten werden für dieses Spiel entfernt. Wortabstände
und Apostrophe stehen sichtbar fest. Umlaute und ß sind eigenständige Tasten;
die Großschreibung von ß wird als ẞ gezeigt. Eingaben über eine angeschlossene
Tastatur werden unabhängig von ihrer Groß-/Kleinschreibung ausgewertet,
einschließlich Unicode-Komposition. Nach einem Tastentipp oder Wortwechsel
bleibt der Fokus für das Weiterschreiben im Spiel.

Als Hinweis kann kein Hinweis, ein Wortbild, ein anhörbares Wort oder beides
gewählt werden. Einfache Bilder bekannter Wörter sind vorhanden; eigene Bilder
und Wortaufnahmen lassen sich ergänzen. Ohne eigene Wortaufnahme nutzt „Wort
anhören“ eine lokal installierte deutsche Stimme. Fehlt ein Bild, wird der
Lösungsbegriff während des Ratens nicht ersatzweise ausgeschrieben. In der
hinweislosen Ansicht enthalten auch die zugänglichen Bezeichnungen verdeckter
Felder keine Lösungsbuchstaben. Explizite Bildhinweise haben dagegen einen
passenden Alternativtext.

Geratene Buchstaben, aktuelle Wortposition und Serienergebnis werden als Antwort
am Lernwerkzeug gespeichert. Layout, Schrift und Hinweismedien können geändert
werden, ohne diesen Stand zu löschen. Neue Wörter oder eine geänderte
Versuchsgrenze beginnen eine neue Serie. Auch im gesperrten Kinderheft bleibt die
Antwort bearbeitbar; Entwurf und Vorgaben bleiben geschützt. Eigene Medien werden
beim Austeilen freigegeben und beim Heftdatei-Export/Reimport mitgeführt.
Wortwechsel, Neustart und Verlassen der Seite beenden eine laufende Wiedergabe.
Die Mausbewegung berücksichtigt reduzierte Bewegung.

13 neue Tests prüfen Katalog und Validierung, Tastaturen, doppelte und mehrfache
Treffer, Umlaute/ß, feste Wortabstände, Versuchsende, aufgedeckte Lösungen,
Serienabschluss, Wiederherstellung, verdeckte Lösungen, Mausdarstellung und
Medienweitergabe einschließlich geschützter Kinderantworten und Export/Reimport.
Die bisherigen allgemeinen Lernwerkzeug-, Heft-, Klassen- und Medienaufgabentests
sowie die Tests der vorherigen Sprachwerkzeuge bestehen weiterhin.
Drei Browserfälle für gemischte Bildschirm-/Tastaturbedienung, Verlust/Neustart
und Kinderhefte sind vorbereitet; die praktische Browser- und Touchprüfung
steht weiterhin aus. Dateien des entsprechenden Textsachen-Spiels aus der
Referenz können damit noch nicht direkt importiert werden.

## Silbenlesen: Wörter aus Silben zusammensetzen

Das vorhandene Format „Silbenlesen“ bietet jetzt gemischte Silbenkarten und
Ablagefelder. Karten lassen sich ziehen oder durch Auswahl von Karte und Feld
zuordnen; die Schaltflächen funktionieren auch mit Tab und Eingabetaste.
Bereits abgelegte Karten können verschoben oder zurückgelegt werden. Beim
Belegen eines besetzten Felds wird dessen bisherige Karte wieder frei.
Gleich geschriebene Silben sind bei der Prüfung austauschbar.

Die Prüfung ist erst bei vollständiger Belegung möglich. Eine falsche Reihenfolge
kann korrigiert werden; Änderungen verwerfen die vorherige Prüfung. Nur richtig
geprüfte Wörter erhalten einen Stern. Überspringen, aktuelles Wort neu legen,
Serienabschluss mit Wortliste und Neustart sind getrennte Schritte. Die Karten
bleiben neutral; abgelegte Silben und ein optionales geschriebenes Vorbild
können abwechselnd blau und rot erscheinen.

Als Hinweis stehen Bild, geschriebenes Wort, Ton oder Bild mit geschriebenem Wort
zur Verfügung. Eigene Wortbilder und Aufnahmen können hochgeladen, Wortaufnahmen
auch direkt aufgenommen werden. Ohne eigenes Audio wird eine vorhandene deutsche
Gerätestimme verwendet; ohne Bild gibt es einen Hinweis und die Hörmöglichkeit.
Im reinen Hörmodus wird die richtige Wortreihenfolge nicht zusätzlich ausgeschrieben.
Unbekannte automatische Silbentrennungen müssen in den Einstellungen geprüft und
übernommen werden, bevor automatisch bewertet wird. Explizite Bindestriche und
bekannte Unterrichtswortlisten haben Vorrang. Bis 30 Wörter mit höchstens 80
Zeichen und zwölf Silben werden unterstützt.

Platzierungen, Prüfungen und Serienergebnisse werden gespeichert, auch in
Kinderheften mit geschütztem Entwurf. Hinweis-, Farb- und Schriftänderungen
behalten den Stand; Änderungen an Wörtern oder Trennungen beginnen eine neue
Serie. Alte reine Weiterblätter-Stände werden nicht als gelöste Aufgaben gewertet.
Eigene Medien werden beim Austeilen freigegeben und beim Heftdatei-Export samt
Reimport mitgeführt. Ziehvorschau und Kartenauswahl werden nicht gespeichert.
Laufender Wortton endet bei Wortwechsel, Neustart und Verlassen der Seite.

13 neue Tests prüfen Platzierungen, doppelte Silben, Korrektur, Prüfung,
Bestätigung unbekannter Trennungen, Serienabschluss, Wiederherstellung, geschützte
Kinderantworten sowie Medienfreigabe und Export/Reimport. Allgemeine Lernwerkzeug-,
Heft-, Klassen-, Medienaufgaben-, Buchstabenraten- und Klatschtests bestehen ebenfalls.
Drei Browserfälle für Ziehen und Korrigieren, Tastatur und Abbruch sowie
Kinderfortschritt sind vorbereitet. Browser-, Touch- und Gerätestimmenprüfung
stehen weiterhin aus; die Ausführungsumgebung blockiert den Browser-Testserver.
Die externen Dateiformate der Referenz sind weiterhin nicht direkt importierbar.

## Karaoke: Musikzeit, Zeitplan und LRC

„Karaoke & Liedblatt“ verwendet jetzt die tatsächliche Abspielzeit seiner Musik
für die Textmarkierung. Start/Pause bedienen denselben Audioplayer; native
Audiosteuerung, Vor- und Zurückspulen sowie ein Sprung durch Antippen einer
Liedzeile verwenden dieselbe Position. Während einer Pause bleibt die aktuelle
Zeile markiert. Vor dem ersten Zeitstempel ist keine Zeile aktiv; am Liedende
endet die Markierung. Mehrere Zeilen mit derselben Startzeit werden gemeinsam
markiert. Leerzeilen mit eigenem Zeitstempel sind Instrumentalpausen.

Ohne Musik gibt es weiterhin eine Textbegleitung, jetzt mit einer monotonen Uhr,
erhaltener Pausenposition und endlichem Ablauf. Antippen einer Zeile setzt diese
Begleitung dort auf Pause. „Zum Anfang“ setzt die Wiedergabe zurück; optional
kann das Lied wiederholt werden. Seitenwechsel, geänderte Liedvorgaben,
Schreibschutz, Fensterwechsel und ausgeblendete Seite beenden beziehungsweise
pausieren die Wiedergabe. Abspielposition und Animation werden nicht laufend als
Kinderantwort gespeichert. Die vorhandene Aufnahmefunktion bleibt erreichbar;
das Anhören einer eigenen Aufnahme pausiert die Begleitung.

Im Einstellungsdialog lassen sich bis 300 Zeilen und deren Startzeiten bearbeiten.
Gleichmäßige Zeilenabstände dienen als Rückfall; neue Werkzeuge starten mit drei
Sekunden pro Zeile. Bestehende Sekundenwerte bleiben erhalten. Ein reiner
Textwechsel bei gleicher Zeilenzahl behält eigene Zeiten; eine geänderte
Zeilenzahl setzt sie zurück und meldet dies. Ein neuer KI-Liedtext setzt den
bisherigen Zeitplan ebenfalls zurück. Ungültige oder absteigende Zeiten werden
beim Übernehmen und serverseitig abgefangen.

Zeilenweise LRC-Dateien lassen sich laden und herunterladen. Der Import zeigt
eine Vorschau und ersetzt Text und Zeiten erst durch „Liedtext und Zeiten
übernehmen“. Mehrfachzeitmarken, Millisekunden, übliche Metadaten und getimte
Leerzeilen werden berücksichtigt. Nicht unterstützte wortweise Zeitmarken und
von null abweichende offset-Tags werden ausdrücklich abgelehnt. Die Musik wird
beim Übernehmen eines LRC nicht verändert. Eigene Musikdateien, Aufnahmen und
Zeitpläne werden mit Heftdateien weitergegeben und beim Austeilen freigegeben.
Karaoke nutzt wie zuvor die erste Tonspur; weitere gespeicherte Spuren werden
im Dialog erklärt und bleiben erhalten.

Zwölf neue Tests prüfen Zeitmarken und Rundung, Rückwärtssprünge, gemeinsame
Zeilenstarts, Pausen, Importfehler, Export/Reimport, alte Einstellungen,
Schreibschutz und die Medienweitergabe in Kinderhefte. Allgemeine Lernwerkzeug-,
Silbenlesen-, Heft- und Klassentests bestehen weiterhin. Drei Browserfälle für
Mediensteuerung, LRC-Übernahme und Textbegleitung sind vorbereitet; sie sind in
der eingeschränkten Ausführungsumgebung nicht gelaufen. Echte Musikwiedergabe,
iPad/Safari und Aufnahme müssen noch praktisch geprüft werden.

Bild-/Wortersatz einzelner Liedzeilen, Kanon-Durchläufe und eine gemeinsame
Mischung aus Musik und Klassenaufnahme entsprechen noch nicht der Referenz.
Der Druck blendet Wiedergabesteuerung und Markierungen aus; lange Liedblätter
benötigen weiterhin ausreichend Platz im Seitendesign. Eine automatische
Aufteilung langer Lieder auf mehrere Druckseiten ist nicht ergänzt.

## Diaschau: gemeinsame Folien- und Tonwiedergabe

Die automatische Diaschau startet nun den zur Folie gehörenden Ton mit.
Standardmäßig wartet ein Wechsel sowohl die eingestellte Mindestdauer als auch
das tatsächliche Tonende ab. Ein kurzer Ton verkürzt die Bilddauer nicht, ein
längerer wird vollständig abgespielt. Im Einstellungsdialog lässt sich das
Abwarten ausschalten; dann endet der Ton spätestens beim zeitgesteuerten Wechsel.
Folienton kann auch vollständig deaktiviert werden. Bestehende Folien mit eigenen
Bildern, Tondateien, Dauer, Übergang und Textposition bleiben nutzbar.

Pause hält die verbleibende Foliendauer und den Ton an. Fortsetzen verwendet
beide an ihrer bisherigen Position. Manuelles Blättern während der Wiedergabe
beendet die alte Tonspur und startet die neue Folie; im Pausenzustand bleibt es
stumm. „Zum Anfang“ setzt die Diaschau auf die erste Folie und pausiert.
Ohne Wiederholung endet die Serie auf der letzten Folie und lässt sich erneut
von vorn starten. Wiederholung funktioniert auch mit einer einzigen Folie.
Fensterwechsel, ausgeblendete Seite und Verlassen des Werkzeugs stoppen oder
pausieren die zugehörigen Timer und Töne. Eine reine Vorschau lädt keinen Ton.
Bewegungsreduzierung wird berücksichtigt; pausierte Vorschauen bleiben sichtbar.

Wenn der Browser den Tonstart ablehnt oder eine Tondatei nicht reagiert, pausiert
der Ablauf mit einem Hinweis. Erneutes Starten oder „Ohne Ton fortsetzen“ sind
möglich. Ausbleibende Tonfortschrittsereignisse werden nach 30 Sekunden gemeldet;
verspätete Ereignisse und Wiedergabeablehnungen einer verlassenen Folie können
keinen neuen Wechsel auslösen. Timer und Tonspur werden jeweils von einer
Ablaufsteuerung verwaltet, unabhängig von laufenden Speichervorgängen.

Die Folienposition und der Abschluss bleiben als Antwort gespeichert, auch im
Kinderheft mit geschütztem Entwurf. Erneutes Öffnen startet keinen Ton;
Rückgängig kann die gespeicherte Folie wiederherstellen. Übergangsanimationen
und verbleibende Millisekunden einer pausierten Folie werden nicht dauerhaft
gespeichert. Bild-/Tonwahl im Dialog ist ausdrücklich beschriftet; Medien können
entfernt werden. Während eines Uploads bleiben die betreffenden Folienfelder
gesperrt, damit die Datei nicht versehentlich einer inzwischen verschobenen
Folie zugeordnet wird. Die Medienfreigabe beim Austeilen und Heftdatei-Export
mit Reimport sind geprüft.

17 neue Tests prüfen den vollständigen Ablauf mit einer kontrollierten Uhr und
simulierten Audioereignissen, einschließlich Pause, Blättern, Wiederholung,
Abbruch, Fehlern, späteren Rückrufen, gespeicherter Position und Medienweitergabe.
Karaoke-, allgemeine Lernwerkzeug-, Heft- und Klassentests bestehen weiterhin.
Typprüfung, Lint und der Bau der Viewer-Assets sind erfolgreich. Drei Browserfälle
für Folienton, Pause/Blättern und Kinderposition sind vorbereitet, aber in der
eingeschränkten Ausführungsumgebung nicht gelaufen. Insbesondere Tonfreigabe und
Wiederanlauf auf iPad/Safari sowie die praktische Tafelbedienung bleiben zu prüfen.
Eine vollständige Gleichheit der Präsentationslayouts und Dateiformate mit der
Referenz wird damit nicht behauptet.

## Geometrie: Aufgabenserien, Vorschau und Zeichenhilfen

Das vorhandene Geometriewerkzeug bietet jetzt endliche Aufgabenserien mit drei
Schwierigkeitsstufen: waagerechte/senkrechte Strecken, schräge Drei-/Vierecke
und mehrteilige Konturen. Anzahl und Aufgabenvariante sind einstellbar. Ein
roter Punkt markiert den Anfang; die Aufgabenbeschreibung nennt Breite und Höhe
in Rasterkästchen. Die Vorlage wird auf Wunsch kurz eingeblendet und danach
verdeckt. Alternativ bleibt sie zum Nachzeichnen sichtbar. Weitere Vorschauen
und das Nachzeichnen werden im Ergebnis als Hilfe vermerkt, ohne gelöste Formen
vom Punktestand auszuschließen.

Strecken werden vom Anfang zum Ende gezogen; eine Vorschau folgt dem Zeiger.
Ohne Zeichenhilfe rasten Endpunkte im Raster ein. Lineal und Geodreieck können
am Körper verschoben, über einen Griff oder Winkelwert gedreht und über einen
eigenen Schließknopf entfernt werden. Ein in Kantennähe begonnener Strich folgt
der tatsächlichen, auch gedrehten Werkzeugkante. Eine einmal eingefangene Kante
bleibt für diese Strecke fest. Zeichenhilfen lassen sich auch per Pfeiltasten
bewegen, mit Umschalt/Pfeil drehen und über die Winkelangabe einstellen.
Die Zeichenfläche bietet eine Tastaturbedienung: Pfeile bewegen einen
Zeichenpunkt, Enter/Leertaste setzen Anfang und Ende, Umschalt erlaubt feinere
Schritte. Escape und abgebrochene Pointer-Gesten verwerfen die Vorschau.

Die Prüfung ordnet gezeichnete Strecken eindeutig den Zielkanten zu. Richtung
und Zeichenreihenfolge sind frei; doppelte Linien ersetzen keine fehlende Kante.
Passende Strecken werden grün, unpassende rot; fehlende und zusätzliche Strecken
werden gezählt. Ein Streckenradierer entfernt gezielt eine angetippte Linie,
„Letzte Strecke zurück“ und „Neu zeichnen“ ermöglichen weitere Korrekturen.
Änderungen verwerfen die alte Prüfung. Nach zwei Prüfversuchen kann die Lösung
angezeigt werden; dadurch wird die Form noch nicht als gelöst gewertet.
Überspringen, Weiter, Abschlussliste mit Hilfemarkierung und Neustart sind
getrennte Schritte.

Eigene Formen können weiterhin über Eckpunkte definiert werden. Bestehende
Formen und bereits gezeichnete alte Strecken werden übernommen; alte
Prüfergebnisse müssen wegen der verbesserten Zuordnung erneut geprüft werden.
Ungültige Texteingaben werden gemeldet. Neue Zeichnungen, Vorschau-/Hilfestand,
Prüfungen und Serienergebnisse werden gespeichert und bleiben im geschützten
Kinderheft bearbeitbar. Andere Aufgaben oder ein geänderter Hilfemodus beginnen
eine neue Serie; Titel und Vorschaudauer löschen den Stand nicht. Zeichenhilfen
und laufende Pointer-Gesten werden nicht dauerhaft gespeichert.

16 neue Tests prüfen Erzeugung, alte Formen, eindeutige Streckenzuordnung,
Korrektur und Radieren, Vorschau-/Lösungsregeln, Abschluss, Wiederherstellung,
Kantenprojektion, Validierung, Kinderantworten und Heftdatei-Export/Reimport.
Allgemeine Lernwerkzeug-, Heft- und Klassentests bestehen ebenfalls. Drei
Browserfälle für Zeichnen/Radieren, Vorschau/Tastatur und Zeichenhilfen sind
vorbereitet. Browser-, Touch-, Pencil- und Tafelprüfung stehen weiterhin aus.

Die Anzeige verwendet Rastereinheiten. Eine maßhaltige Zentimeter-/Millimeterskala,
Längenfehler in Millimetern, automatisches Einrasten des Linealnullpunkts an
Eckpunkten und das Vorlesen der Aufgaben sind noch nicht ergänzt. Innerhalb dieser
Übung werden gerade Strecken konstruiert; der Streckenradierer entfernt ganze
Strecken. Das flächenweise Radieren freier Zeichnungen im übrigen Editor bleibt
ein eigener Ablauf. Diese Umsetzung belegt noch keine vollständige Gleichheit
mit der Geometrievorlage.

## Prüfungen

```sh
npm ci
npm run typecheck
npm run lint
npm test
npm run build -- --webpack
npx playwright install chromium
npm run test:e2e
```

Die Browsertests starten einen Produktionsserver auf Port 3100 mit einem eigenen,
temporären Datenverzeichnis. Sie verwenden nur künstliche Konten und löschen die
Testdaten beim Beenden. Ein vorhandenes Chromium kann mit
`PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium` genutzt werden.

Die automatisierten Prüfungen ersetzen diese aus dem Konzept offenen Abnahmen nicht:

1. iPad/Safari: echte Anton-Karte, Kamerawechsel, Pencil mit aufgelegter Hand,
   Home-Bildschirm, Mikrofon und deutsche Offline-Stimme.
2. iiyama: Auswahl und Stift, Bildschirmgröße, Tafelmodus, Seitenwechsel und Druck.
3. A4-Maßhaltigkeit auf dem Schul-Drucker (100 %, keine Ränder/Kopf-/Fußzeilen).
4. Schulplattform: App registrieren, UID-10001-Schlüssel und Sicherung einrichten.
5. Die im Konzept genannte Datenschutzabstimmung vor dem Einsatz mit Kindern.
