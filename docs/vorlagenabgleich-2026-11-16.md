# Originalabgleich der Seitenvorlagen · 16.11.2026

Referenz: die bereitgestellte `Lernsachen-Heft-komplett.html`, Version 1.47.3, SHA-256 `a1fe5274eadc71f39946cd34db91e1261cb2f18522920b744d3849c770ea52c6`.

## Umfang und Korrekturen

Alle 84 statischen Seitenentwürfe des Originals sind übernommen: einschließlich Papier und Lineaturen, Steckbrief, Stundenplänen, Schreibseiten, Comic, Gestaltungsseiten, Schülerzeitung und Praktikum. Darunter ist das ältere, intern weiter unterstützte Lerntagebuch. Einstellbare Generatoren und interaktive Lernwerkzeuge sind eigene Implementierungen und gehören nicht zu diesen 84 Seitenentwürfen.

- Querformat ist der Standard beim Einfügen; ausdrücklich gewähltes Hochformat bleibt möglich. Eigene gespeicherte Hochformatvorlagen werden beim Einfügen ins gewählte Format eingepasst.
- Originalschriftdateien, Schriftschnitte, Innenabstände, Text- und Sprechblasenrahmen sowie bislang fehlende Papierarten sind übernommen. 2506 Vektor- und Rahmenbestandteile liegen im lokalen Register.
- Die bisherigen Startervorlagen Steckbrief, Bildergeschichte und Stundenplan verwenden nun die tatsächlichen Originalentwürfe. Ihre Kennungen bleiben erhalten.
- Texthinweise bleiben als mehrzeilig bearbeitbare Textfelder erhalten. Auch bei fest eingefügten Seiten ist ihr Inhalt beschreibbar; die Geometrie bleibt gesperrt. Der Server prüft beide Fälle.
- Originalzeilenraster werden gespeichert. Textfelder auf Lineatur behalten deren Zeilenabstand auch nach einem Schriftwechsel und wachsen beim Schreiben um ganze Zeilen.
- Papier-Lineaturen erscheinen als Hintergrund; Inhalte der übrigen Entwürfe sind einzelne bearbeitbare Elemente. Exportierte HTML-/EPUB-Dateien erhalten die verwendeten Originalschriftdateien.

## Gespeicherte Altfassung

Die schulweite Ersatzvorlage „Steckbrief · Das bin ich“ enthielt noch die frühere sechs Elemente umfassende Hochformatgestaltung. Sie wurde auf den Originalentwurf mit 18 Elementen im Querformat aktualisiert. Die angepasste Überschrift, Vorlagenkennung und Zuordnung bleiben erhalten.

Sicherung: `data/sicherungen/vorlagen-originalabgleich-2026-11-16T10-50-38-171Z.json`.

`scripts/migrate-legacy-page-templates.mjs` zeigt erkannte Altfassungen zunächst nur an; erst `--apply` sichert und aktualisiert sie. Erkannt werden unveränderte frühere Starterentwürfe sowie der Steckbrief mit ausschließlich geänderter Überschrift. Andere individuell gestaltete Schulvorlagen werden nicht automatisch überschrieben.

## Prüfung

`test/e2e/reference-pages.ts` startet den tatsächlichen Renderer und die Schriften der Original-HTML. Die erwarteten Bilder werden nicht aus der App-Nachbildung erzeugt. Alle 84 Entwürfe sowie zwölf Papier-Katalogeinträge und drei Startereinträge wurden verglichen: 99 erfolgreiche Bildvergleiche. Grenzwert: mittlere absolute RGB-Abweichung unter 2,55 von 255 (1 %). Kleine Rasterisierungsabweichungen bleiben möglich; dies ist kein Nachweis vollständiger Pixelidentität.

Zusätzlich erfolgreich: Vorlagenauswahl, feste und bearbeitbare Einfügearten, Klassenfreigaben, Vorlageneditor ohne Regalheft, Text-/Rahmenbearbeitung, Bildplatzhalter und Vorlesetasten sowie mehrzeilige feste Textfelder bei Lehrkraft und Kind.

Die folgende Tabelle enthält den ersten Vergleich jedes Originalentwurfs (mittlere absolute RGB-Abweichung). Papier- und Starter-Katalogvarianten sind zusätzlich im Browsertest enthalten.

| Originalkennung | RGB-Abweichung / 255 |
| --- | ---: |
| blank | 0.0346 |
| lin1 | 1.0911 |
| lin2 | 1.2742 |
| lin3 | 2.1497 |
| lines | 0.9167 |
| lines-narrow | 1.1638 |
| picture-lines | 0.8461 |
| squares | 1.7439 |
| squares-big | 1.3930 |
| dots | 0.3671 |
| music | 2.5222 |
| cover | 0.8226 |
| diary | 0.9865 |
| newspaper | 1.0381 |
| instagram | 0.5921 |
| gallery | 1.1938 |
| comic | 0.8123 |
| profile | 1.1901 |
| learning | 2.0971 |
| learning-diary | 1.6354 |
| mindmap | 0.5388 |
| postcard | 0.6140 |
| pictures4-lines | 1.1366 |
| letters | 1.2459 |
| words | 1.1677 |
| picturebook | 0.7941 |
| sudoku4 | 0.9592 |
| sudoku9 | 2.4864 |
| battleship | 1.9564 |
| sound-story | 1.0754 |
| playlist | 0.9941 |
| comic4 | 0.7447 |
| comic3 | 0.3774 |
| comic-big | 0.5637 |
| comic5 | 0.8120 |
| comic-strip | 0.8829 |
| storyboard | 0.9793 |
| screenplay | 1.0059 |
| timetable-days | 1.6561 |
| timetable | 1.5817 |
| dayplan | 1.9895 |
| today | 0.7461 |
| letter | 0.4160 |
| invitation | 0.7046 |
| certificate | 1.1669 |
| cv | 0.9376 |
| experiment | 0.8774 |
| poster | 1.0628 |
| menu | 1.2226 |
| program | 0.7172 |
| recipe | 0.7344 |
| room | 0.1490 |
| room-blue | 0.1746 |
| kitchen | 0.3032 |
| slide-title | 0.2011 |
| slide-content | 0.1158 |
| slide-two | 0.1154 |
| slide-compare | 0.1971 |
| slide-picture | 0.3722 |
| slide-picture-big | 0.4863 |
| slide-section | 0.1268 |
| slide-quote | 0.4556 |
| slide-agenda | 0.3866 |
| slide-video | 0.6694 |
| slide-title-only | 0.0780 |
| slide-end | 0.3212 |
| mag-cover | 1.3045 |
| mag-editorial | 0.9424 |
| mag-columns | 0.7554 |
| mag-bigpic | 0.8530 |
| mag-interview | 0.6544 |
| mag-news | 1.6886 |
| mag-survey | 1.4325 |
| mag-fun | 0.8920 |
| mag-imprint | 0.9150 |
| pm-cover | 1.0556 |
| pm-company | 1.4163 |
| pm-workplace | 2.4007 |
| pm-day | 2.1816 |
| pm-week | 1.8952 |
| pm-thanks | 1.3220 |
| artwork | 2.4881 |
| video | 0.7953 |
| webpage | 1.1078 |

Abschlussprüfungen: 328 Node-Tests erfolgreich; 16 Vorlagen-Browsertests erfolgreich. TypeScript-Prüfung und Produktionsbuild erfolgreich; ESLint ohne Fehler (zehn bestehende Warnungen).
