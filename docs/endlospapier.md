# Endlospapier

Unter „Neue Seite → Format → Endlospapier“ entsteht eine nach unten wachsende Fläche. Bestehende Seiten können über „Seite → Papier → Endlospapier“ umgestellt werden. Die Breite entspricht zunächst A4 quer; unterhalb der Inhalte bleibt zusätzlicher Platz zum Weiterschreiben und Zeichnen.

Die Fläche beginnt bei 594 mm Höhe und wächst mit dem untersten Inhalt in 100-mm-Schritten mit 150 mm Reserve. Auch Lineaturen werden nach unten fortgesetzt. Die Inhalte bleiben einzelne bearbeitbare Elemente. Nach dem Entfernen unterster Inhalte richtet sich die sichtbare Höhe wieder nach den verbleibenden Inhalten.

Die Eigenschaft `paperMode: "endless"` wird pro Seite gespeichert und mit Heftdateien, Schulvorlagen, Kopien und Verteilungen übernommen. A4-Seiten behalten das bisherige Datenformat und ihre bisherigen Maße. Seiten eines Hefts dürfen verschiedene Papiermodi verwenden.

Für Hefte mit Endlospapier werden Drucken und PDF nicht angeboten. Auch der direkte Druckaufruf und PDF-Export verhindern eine versehentliche Ausgabe als A4. Heftdatei und eigenständiges HTML bleiben verfügbar. Der HTML-Lesemodus zeigt Endlospapier zum Scrollen; ePub übernimmt die tatsächlichen Seitenmaße, soweit das Lesegerät sie unterstützt.

Ein Wechsel zurück zu A4 ist in den Seiteneinstellungen möglich, sobald alle Inhalte auf das gewählte Format passen. Inhalte werden dabei nicht abgeschnitten oder gelöscht.

Prüfung: Backendtests für Wachstum, Speicherung weit unten liegender Texte und Striche sowie unveränderte A4-Maße; Browsertest für Auswahl, Zeichnen, Wachstum, Neuladen, fortgesetzte Lineatur, Heftdatei-Download und ausgeblendeten PDF-/Druckexport.
