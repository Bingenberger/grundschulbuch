# Freigabe und Einfügeart von Vorlagen

Unter **Verwaltung → Vorlagen für alle** lassen sich die Einstellungen für jede
eingebaute Vorlage und veröffentlichte Schulvorlage festlegen. Dazu gehören auch
„Papier & Lineatur“ und die einstellbaren Arbeitsblattvorlagen.

Die Vorlagen erscheinen standardmäßig in aufklappbaren Kategoriegruppen mit
Vorschau. Einzelne Gruppen oder alle Gruppen lassen sich öffnen und schließen.
Über **Gruppen / Liste** kann zur kompakten Gesamtliste gewechselt werden. Suche, Kategorie und
Freigabefilter lassen sich kombinieren. Bei Klassen können gezielt nur
Klassen-Ausnahmen angezeigt werden. Die Gesamtliste zeigt höchstens 20 Vorlagen pro
Seite; die Seitenwahl steht oberhalb und unterhalb der Ergebnisse. Hinweise zur
Bedienung lassen sich bei Bedarf aufklappen.

## Schule und Klassen

Bei **Vorgaben für** wird die ganze Schule oder eine einzelne Klasse gewählt.
„Freigegeben“ und „Gesperrt“ steuern die Auswahl für neue Seiten. Klassen erben
zunächst die schulweiten Vorgaben; mit einer ausdrücklichen Auswahl können sie
davon abweichen. „Schulvorgabe“ entfernt die jeweilige Klassen-Ausnahme wieder.
Freigabe und Einfügeart werden unabhängig voneinander vererbt.

Im Lehrkrafteditor gibt es in der Vorlagenauswahl **Vorlagen für Klasse**. Ohne
Klassenwahl gelten die schulweiten Vorgaben. Bei einem Kinderheft gilt automatisch
die tatsächliche Klasse des Kindes, auch wenn eine Lehrkraft das Heft bearbeitet.
Kinder sehen weiterhin nur die für ihre Oberfläche vorgesehenen Papiervorlagen;
die Freigaberegeln gelten auch dort.

## Beim Einfügen

- **Wie in der Vorlage:** behält die in der Vorlage gestalteten
  Sperren bei. Das ist der Standard und entspricht dem bisherigen Verhalten.
- **Bearbeitbar:** die übernommenen Elemente sind entsperrt.
- **Fest positioniert:** die übernommenen Elemente sind gesperrt und lassen sich
  nicht verschieben oder in ihrer Größe ändern. Die vorgesehenen Bild-, Antwort-
  und Aufnahmefelder bleiben im Rahmen der vorhandenen Kinderfunktionen nutzbar.

Die Vorlage bleibt aus einzelnen Elementen aufgebaut. Es wird kein flaches
Hintergrundbild daraus gemacht. Lehrkräfte können die vorhandenen
Bearbeitungsfunktionen zum gezielten Entsperren weiterhin verwenden.

Die Einstellungen wirken auf neue Übernahmen, einschließlich der nach einem
Einstellungsdialog erzeugten Arbeitsblätter und beim Austeilen neu erzeugter
Kinderhefte. Bestehende Seiten werden nicht nachträglich verändert. Ein
Vorlagenwechsel auf einer bereits gefüllten Seite erhält deren Elemente.

## Speicherung und Prüfung

Regeln werden in `schulvorlagen.json` unter `policies.global` und
`policies.classes` gespeichert. Bisherige Ausblendungen bleiben kompatibel.
Änderungen an den Regeln sind über die Verwaltungs-API ausschließlich für
Administratoren erlaubt. Der Server prüft Freigabe, tatsächliche Kinderklasse,
Lehrkraftzugriff und Einfügeart beim Einfügen erneut. Ein bereits geöffneter Editor
übernimmt vom Server gesetzte Sperren auch in seine sichtbare Seite.

Beim Bearbeiten eines Vorlagenentwurfs aus der Verwaltung gelten die
Einfügevorgaben nicht, damit auch gesperrte Vorlagen gepflegt werden können.

## Vorlagen direkt bearbeiten

„Bearbeiten“ öffnet einen eigenen Vorlageneditor unter
`/verwaltung/vorlagen/…`. Es wird kein Heft angelegt und kein Eintrag im Regal
erzeugt. Änderungen an Inhalt, Name und Kategorie werden direkt in der Vorlage
gespeichert; zusätzlich gibt es „Vorlage speichern“. Eine eingebaute Vorlage wird
an ihrem bisherigen Katalogplatz ersetzt, eine eigene Schulvorlage unter ihrer
bisherigen Kennung aktualisiert. Freigaben und Klassen-Ausnahmen bleiben erhalten.

Nach dem Speichern lässt sich die Vorlage über dieselbe Adresse erneut öffnen.
„Vorlagenverwaltung“ führt zurück zur Übersicht. Wird dieselbe Vorlage in mehreren
Fenstern bearbeitet, verhindert eine Versionsprüfung das Überschreiben einer
zwischenzeitlich gespeicherten Fassung. Die ungespeicherten Änderungen bleiben im
Editor sichtbar; bestehende Hefte werden durch eine Vorlagenänderung nicht verändert.
