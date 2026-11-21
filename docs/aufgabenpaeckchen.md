# Aufgabenpäckchen und Aufgabensprache

Das Lernwerkzeug „Aufgabenpäckchen“ (Mathematik, Widget `paeckchen`) setzt einen Block Rechenaufgaben auf eine Heftseite. Die Aufgaben schreibt man in einer kleinen Aufgabensprache. Dieselbe Seite ist:

- **digital** ausfüllbar, mit Lösungskontrolle „Keine“, „Sofort ✓ ✗“ oder Knopf „Prüfen“;
- **gedruckt** ein normales Arbeitsblatt mit leeren Kästchen, ohne Haken und ohne Knopf.

Code:

- Sprache, Vorlagen und Layout: `src/lib/learning/paeckchen.ts`
- Seite: `src/components/learning/PaeckchenWidget.tsx`
- Einstellungen: `src/components/learning/PaeckchenOptions.tsx`
- Tests: `test/paeckchen.test.mjs`, `test/e2e/paeckchen.spec.ts`

## Beispiel: zu den Nachbarzehnern

```
# Von einer Zahl bis 100 zum Zehner davor abziehen
# und zum Zehner danach ergänzen
a = 11..99
wenn einer(a) ≠ 0
u = abrunden(a, 10)
o = aufrunden(a, 10)
a − [a − u] = u
a + [o − a] = o
```

Bei a = 47 ergibt ein Durchgang `47 − ▢ = 40` und `47 + ▢ = 50`. Die Anzahl in den Einstellungen zählt Durchgänge: 8 Durchgänge sind hier 16 Aufgaben. Die Aufgaben eines Durchgangs bleiben in einer Spalte zusammen, außer unter „Reihenfolge“ ist „Gemischt“ gewählt. Dieselbe Zahl kommt nur dann zweimal vor, wenn es zu wenige gibt.

## Zeilen

Jede Zeile hat eine dieser Formen:

| Zeile | Bedeutung |
|---|---|
| `a = 11..99` oder `a = 11 bis 99` | zufällige ganze Zahl von 11 bis 99 |
| `a = 0..100 schritt 5` | 0, 5, 10 … 100 |
| `b = 1..100 − a` | die Grenzen dürfen ausgerechnet werden |
| `b = 2, 5, 10` | eine dieser Zahlen (jede darf ausgerechnet werden) |
| `c = a · b` | ausrechnen |
| `wenn …` (auch `nur wenn …`) | nur Zahlen, die diese Bedingung erfüllen |
| Zeile mit `[ … ]` | eine Aufgabe |
| `# …` oder `// …` | Notiz, zählt nicht |

Eine Variable gilt ab der Zeile, in der sie festgelegt wird. Die Bedingungen werden geprüft, wenn alle Variablen gezogen sind. Ist eine nicht erfüllt, wird der ganze Durchgang neu gezogen, höchstens 2000-mal. Lässt sich so nichts finden, nennt der Dialog die Zeile, an der es am häufigsten scheiterte. Ein leerer Bereich (`b = 1..a − 20` bei a = 15) oder eine Division durch 0 führt ebenfalls zu einem neuen Durchgang.

## Aufgaben

- `[ausdruck]`: ein Kästchen, dessen Lösung der Wert des Ausdrucks ist. Eine Aufgabe darf mehrere Kästchen haben, zum Beispiel `a : b = [ganz(a / b)] R [rest(a, b)]`.
- Außerhalb der Klammern steht der Text so, wie er geschrieben ist. Namen von Variablen werden durch ihre Zahlen ersetzt, `{ausdruck}` wird ausgerechnet (`die Hälfte von {2 · a}`).
- Rechenzeichen werden gesetzt: `-` als `−`, `*` als `·`, `<=` als `≤`.
- Zahlen erscheinen in deutscher Schreibweise: `3,5` und `−4`. Kommazahlen werden auf drei Stellen gerundet.
- Die Kinder dürfen `3.5` statt `3,5` tippen. Geprüft wird mit `sameAnswer` aus der Lösungskontrolle der Arbeitsblätter.

## Ausdrücke

- Rechenzeichen: `+ − · : ( )`, ebenso `- * × /` und `mod` (auch `%`). Punkt geht vor Strich.
- Vergleiche: `= ≠ < > ≤ ≥`, ebenso `== != <= >=`.
- Verknüpfungen: `und`, `oder`, `nicht`.
- Bei Namen spielen Groß- und Kleinschreibung keine Rolle, und Umlaute dürfen ausgeschrieben werden: `Übergang_Plus` ist dasselbe wie `uebergang_plus`.

| Funktion | Beispiel |
|---|---|
| `einer(x)`, `zehner(x)`, `hunderter(x)`, `tausender(x)` | `zehner(347) = 4` (die Ziffer) |
| `abrunden(x, n)`, `aufrunden(x, n)`, `runden(x, n)` | `aufrunden(47, 10) = 50`; ohne n wird auf Zehner gerundet |
| `ganz(x)`, `rest(a, b)` | `ganz(17 / 5) = 3`, `rest(17, 5) = 2` |
| `teilbar(a, b)`, `gerade(x)`, `ungerade(x)` | `wenn nicht teilbar(a, 10)` |
| `übergang_plus(a, b)`, `übergang_minus(a, b)` | Zehnerübergang bei a + b bzw. a − b |
| `min(…)`, `max(…)`, `betrag(x)` | |
| `vergleich(a, b)` | ergibt `<`, `>` oder `=`, zum Beispiel für `a [vergleich(a, b)] b` |

## Gespeichert

Die Einstellungen liegen in `settings.paeckchen`:

- `script`, `count`, `columns`, `check`, `order`, `seed`;
- die gezogenen Aufgaben `tasks`.

Die Seite zeigt also genau das, was in der Vorschau stand, und der Druck stimmt mit dem Bildschirm überein. „Neue Zahlen“ wählt einen neuen `seed`.

Die Antworten der Kinder liegen in `response.pk`:

- `answers`: eine Liste über alle Kästchen;
- `checked`: der Stand beim letzten „Prüfen“;
- `key`: ein Fingerabdruck der Aufgaben. Neue Aufgaben beginnen deshalb leer.

Beim Ändern der Einstellungen wächst oder schrumpft der Block mit den Aufgaben und behält dabei seinen Maßstab.
