# Musikwerkzeuge

Unter **Lernwerkzeuge → Musik** stehen die Vorlagen aus dem Musikbereich der
mitgelieferten `Lernsachen-Heft.html` zur Verfügung. Notenlinien und
Klanggeschichte gehören nicht zu dieser Übernahme.

Die Vorlagen werden als vollständige Querformatseiten eingefügt. Hintergründe,
Instrumente, Tasten, Beispielmelodien und Spiele stammen aus der Referenz.
„Instrument einstellen“, „Tonfolgen-Spiel einstellen“, „Notenregen einstellen“
und „Karaoke-Liedblatt“ öffnen vorher die Einstellungen. Auch die in der Referenz
versteckten Glockenspiel- und Synthesizervarianten sind auffindbar. „Noten lernen“
öffnet den vorhandenen Notenblatt-Generator.

Der vorhandene Kassettenrekorder sitzt bei Instrumenten und Baukästen oben
rechts. Seine rote Taste nimmt direkt den Instrumentenklang auf, ohne
Mikrofonfreigabe. Mit **Mikrofon dazu** werden Instrumente und Mikrofon gemeinsam
aufgenommen. Die Freigabe wird erst beim Aufnahmestart angefragt; beim Beenden
wird das Mikrofon wieder ausgeschaltet. Die eigenständige Rekorderseite nimmt über das Mikrofon auf.
Aufnahmen werden mit dem Heft gespeichert und können heruntergeladen werden.

Die Baukästen speichern geänderte Muster als Antwort des jeweiligen Hefts.
Im Hörspiel-Studio lassen sich Geräusche, erzeugte Hintergrundmusik und eigene
Tondateien hinzufügen. Sprachaufnahmen verwenden ebenfalls den vorhandenen
Kassettenrekorder. Teile können verschoben, benannt, gekürzt, in der Lautstärke
geändert und gelöscht werden. Das fertige Hörspiel lässt sich als WAV speichern.
Karaoke bietet die Bedienung und das voreingestellte Lied der Referenz; eigene
Liedtexte und Musik sind über die Einstellungen möglich. Karaoke-Aufnahmen lassen sich herunterladen oder als Liedbegleitung übernehmen;
von Hand aufgezeichnete Zeitpläne werden im jeweiligen Heft gespeichert.

Die ursprünglichen, einfacheren Musikwidgets bleiben für bestehende Hefte
verfügbar. Ihre gespeicherten Einstellungen werden nicht umgeschrieben.

Die Referenzanteile werden mit `node scripts/extract-music-reference.mjs`
reproduzierbar aus der lokalen HTML-Datei erzeugt. Das Skript übernimmt nur die
benötigten Deklarationen, keine Initialisierung der ursprünglichen App.
Generiert werden `src/lib/reference/music-runtime.ts` und
`src/lib/learning/music-presets.json`. Die React-Anbindung, Einstellungen und
Speicherung befinden sich in `MusicTemplate.tsx`, `MusicOptions.tsx` und
`src/lib/learning/music*.ts`.

Die Auswahl zeigt statische Vorschaubilder der tatsächlichen Musikwerkzeuge.
Spiele und Hörspiel-Studio zeigen beispielhafte Inhalte. Die komprimierten
WebP-Dateien liegen in `public/previews/music`; die Auswahl startet keine
Instrumente oder Aufnahmen. Nach einem Produktionsbuild lassen sie sich mit
`node scripts/build-music-previews.mjs` neu erstellen. Das Skript verwendet den
isolierten Abnahmeserver und Chromium, keine Schuldaten. Ein vorhandenes
Chromium kann über `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` angegeben werden.

## Einstellungsseiten

Lehrkräfte öffnen die Einstellungen über **⚙ Einstellen** am eingefügten
Musikwerkzeug. Änderungen werden in einer spielbaren Vorschau gezeigt und erst
mit „Auf die Seite übernehmen“ gespeichert. Bereits auf der Seite geänderte
Baukastenmuster und Hörspielteile werden beim Öffnen übernommen. Kinder erhalten
keinen Zugriff auf die Gestaltungseinstellungen.

Die folgenden Dialoge wurden anhand der lokalen Referenz geprüft:

| Werkzeug | Einstellungen |
| --- | --- |
| Klavier und Klanginstrumente | Aussehen, neun Klangfarben, sechs Tonleitern, Grundton, Umfang, Beschriftung, Farben, spielbare Vorschau |
| Schlagzeug und Percussion | Fünf Instrumentgruppen, Namen, zwei bis zwölf Pads mit Farben, Namen, eingebauten Klängen, eigenen Aufnahmen und Hörprobe |
| Tonfolgen-Spiel | Acht Lieder oder Zufall, MIDI-Import mit Spurauswahl, Tonvorrat, Startlänge, Tempo, Ansagen, Instrument und Beschriftung |
| Notenregen | Acht Lieder, MIDI-Import mit Spurauswahl, Warten oder Taktspiel, Tempo, leise Melodiebegleitung, Instrument und Beschriftung |
| Beat-, Melodie- und Klang-Baukasten | Acht oder sechzehn Schritte, Tempo, Tonleiter und Grundton, zehn Beats und zehn Beispielmelodien, bis acht Spuren mit Farben, Namen, Schlagzeug, Tönen oder Aufnahmen |
| Noten-Trainer | Notenschlüssel, Tonraum mit oder ohne Hilfslinien, Namen oder Klaviertasten, fünf, zehn oder zwanzig Fragen |
| Metronom | Tempo und fünf Vorgaben, fünf Taktarten einschließlich 5/4, fünf Klickklänge, Hörprobe |
| Stimmgerät | Sechs Instrumente einschließlich Cello, Kammerton 430–450 Hz, fünf Empfindlichkeitsstufen |
| Hörspiel-Studio | Fünf Längen, Sprachverbesserung, automatische Musikabsenkung samt Pegel, widerrufbares Leeren der Teile |
| Karaoke-Liedblatt | Liedbibliothek, eigene Texte, Strophen, Gestaltung, Wortbilder, Ablauf, Musik und Zeitpläne; siehe unten |

Der eigenständige Kassettenrekorder und die Playlist haben in der Referenz
keinen eigenen Gestaltungsdialog. Der vorhandene Notenblatt-Generator bildet
die Referenzeinstellungen von „Noten lernen“ bereits ab. Das kleine Metronom
auf Instrumentenseiten kann zusätzlich in deren Einstellungsdialog geändert
werden.

Karaoke verwendet die vier Bereiche der Referenz:

- **Lied:** 31 Liedvorlagen in fünf Gruppen mit Suche, eigene Titel, Urheberangabe
  und Texte bis 20.000 Zeichen, Strophenauswahl und mehrere Lieder als einzelne
  Seiten. Refrains, Rollen, Zwischenspiele und Bildwörter werden unterstützt.
- **Aussehen:** acht Gestaltungen mit Bildvorschau, sieben Schriften,
  Schriftgröße, Silbenfarben und fortlaufende Wortmarkierung; wahlweise eine
  spielbare Karaoke- oder eine Druckvorschau.
- **Bilder:** Wortsuche, Bildvorschläge über die vorhandene ARASAAC-Anbindung,
  eigene Bilder oder Bilder aus der Schulgalerie, Bilder über oder anstelle
  eines Worts und Ausschluss einzelner Wörter von weiteren Vorschlägen.
- **Ablauf & Musik:** automatische oder manuelle Zeilenwechsel, Zeilendauer,
  Vorspiel einschließlich Null, Wiederholungen für Kanons, eigene Musik und
  Mikrofonaufnahmen, Hörprobe, Zeitplanstatus und Löschen, LRC-Import mit
  Übernahmevorschau und LRC-Export sowie Raum- oder Mischaufnahme.

Die Einstellungsbibliotheken werden aus der Referenz nach
`src/lib/learning/music-options-data.json` extrahiert. Wortbilder werden als
Liste gespeichert, damit Umlaute und längere Wörter keine ungültigen
JSON-Schlüssel erzeugen. Mehrfachauswahl, Bildadressen, Zeitpläne und gespeicherte
Baukastenmuster werden serverseitig validiert und von den Tests abgedeckt.

Die ARASAAC-Suche startet wie in der Vorlage automatisch bei der Liedauswahl.
Beim Anlegen mehrerer Liedseiten werden die Bilder für jedes Lied vor dem
Einfügen ergänzt. Die originalen Suchhinweise der Liedbibliothek (etwa
„Vögelein → Vogel“), Grundformen, Wortfilter und Trefferbewertung werden
übernommen. Bis zu 60 Wörter werden mit drei parallelen Suchen verarbeitet;
die Bilder werden dauerhaft im Medienbestand der Schule gespeichert.
Eigene Bilder und ausdrücklich entfernte Vorschläge bleiben erhalten.
Ein Liedwechsel oder eine Textänderung bricht die laufende Suche ab, damit
keine Bilder aus einem vorherigen Lied übernommen werden. Fehlende Bilder
können über „Bilder vorschlagen“ erneut gesucht werden. Normale Wortbilder
stehen über dem Text; `[Wort]` oder „statt Wort“ ersetzen das Wort durch sein Bild.
