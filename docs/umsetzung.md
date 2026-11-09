# Umsetzung und Abnahme

Die Server-App umfasst den Hefteditor, Lehrkraft- und Kinderkonten sowie die
Erweiterungen aus dem erneuten Vergleich mit `Lernsachen-Heft.html`.
Der genaue Vergleich einschließlich verbleibender Unterschiede steht in
[Funktionsvergleich](funktionsvergleich.md). Die Abnahme auf echten Schulgeräten
und mit einer echten Anton-Karte steht weiterhin aus.

## Lehrkräfte

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

`GALLERY_ORIGIN` und `WOERTERBUCH_ORIGIN` stellen Links zu den Schulangeboten bereit.
Bilder werden dort heruntergeladen und anschließend hochgeladen; Wörter werden
in den Generator übernommen. Ein direkter Such-/Importadapter ist **noch nicht
implementiert**, weil das Repository keinen API-Vertrag dieser beiden Dienste
enthält. Es werden keine beliebigen Internet-URLs serverseitig abgerufen.

Die noch ungeklärte Originaldatei von **Gruschudru basic** ist nicht mitgeliefert.
Alle anderen im Konzept genannten Familien liegen einschließlich OFL und Herkunft
in [public/fonts/SOURCES.md](../public/fonts/SOURCES.md). Es wurde nichts aus dem
Lernsachen-Heft extrahiert.

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
