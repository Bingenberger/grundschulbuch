# Endlospapier

Unter „Neue Seite → Format → Endlospapier“ entsteht eine Fläche, die in alle
Richtungen offen ist. Bestehende Seiten können über „Seite → Papier →
Endlospapier“ umgestellt werden. Man kann links, rechts, oberhalb und unterhalb
des ersten Blatts schreiben, zeichnen und Elemente ablegen.

## Fläche und Koordinaten

- Die Elemente haben gewöhnliche Seitenkoordinaten in Millimetern. Auf
  Endlospapier dürfen sie auch negativ sein. Der Ursprung ist die linke obere
  Ecke des ersten Blatts (A4 quer).
- Sichtbar ist der Bereich aus erstem Blatt und allen Inhalten, ringsum mit
  200 mm Rand, auf 100 mm gerundet (`dimensions()` in `notebook-model.ts`
  liefert `left`, `top`, `width`, `height`). Eine leere Fläche ist also 700 ×
  700 mm groß und beginnt bei −200/−200.
- Der Bereich wächst mit den Inhalten in jede Richtung und schrumpft wieder,
  wenn Inhalte entfernt werden. Innerhalb von `.paper` verschiebt `World`
  (in `PageView.tsx`) die Inhalte um den Ursprung; A4-Seiten brauchen das
  nicht und bleiben unverändert.
- Lineaturen laufen nach allen Seiten weiter: Die Originalpapiere wiederholen
  eine Kachel aus ihrem Linienbereich, die eigenen Lineaturen ihr Muster.
  Texte rasten auch außerhalb des ersten Blatts in die Zeilen ein.
- Der Server erlaubt auf Endlospapier Positionen bis ±50 m. A4-Seiten behalten
  ihre bisherigen Grenzen.

## Bedienung

- Beim Öffnen zeigt die Ansicht das erste Blatt in der üblichen Breite einer
  A4-Seite. Endlospapier füllt den ganzen Arbeitsbereich ohne grauen Rand.
- Verschieben: zwei Finger, Mausrad (mit Umschalttaste seitwärts), mittlere
  Maustaste oder Leertaste + Ziehen. Zoomen wie bisher, „Ganze Seite“ zeigt
  alle Inhalte.
- Wächst die Fläche nach links oder oben, rückt die Ansicht mit. Was gerade
  gezeichnet wurde, bleibt also unter dem Stift.
- Neue Elemente (Text, Bild, Stempel, Lernwerkzeug, Einfügen aus der
  Zwischenablage oder Sammlung) landen im gerade sichtbaren Teil, wenn ihre
  vorgesehene Stelle außerhalb liegt. Lineal und Geodreieck erscheinen in der
  Mitte der Ansicht.
- Ein Seitenrahmen wird auf Endlospapier nicht gezeichnet.

## Speichern und Ausgabe

`paperMode: "endless"` wird pro Seite gespeichert und mit Heftdateien,
Schulvorlagen, Kopien und Verteilungen übernommen. Seiten eines Hefts dürfen
verschiedene Papiermodi verwenden.

Für Hefte mit Endlospapier werden Drucken und PDF nicht angeboten. Auch der
direkte Druckaufruf und PDF-Export verhindern eine versehentliche Ausgabe als
A4. Heftdatei und eigenständiges HTML bleiben verfügbar; der Lesemodus und das
HTML zeigen die ganze Fläche in voller Breite zum Scrollen. ePub übernimmt die
tatsächlichen Maße, soweit das Lesegerät sie unterstützt.

Zurück zu A4 (Hoch- oder Querformat) geht in den Seiteneinstellungen, sobald
alle Inhalte auf das gewählte Blatt passen, also auch keine links oder
oberhalb liegen. Inhalte werden dabei nicht abgeschnitten oder gelöscht.

## Prüfung

- `test/endless-paper.test.mjs`: Wachsen und Schrumpfen in alle Richtungen,
  Speichern weit links, oben und unten liegender Texte und Striche, Grenzen,
  Rückkehr zu A4, unveränderte A4-Maße.
- `test/e2e/endless-paper.spec.ts`: Auswahl, Anfangsansicht am ersten Blatt,
  Verschieben mit der mittleren Maustaste, Zeichnen links oberhalb (die Fläche
  wächst und die Zeichnung bleibt unter dem Stift) und rechts unterhalb,
  Neuladen, Lineatur über die ganze Fläche, Heftdatei, kein PDF und kein
  Druck.
