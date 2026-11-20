// Hilfe für Lehrkräfte: Themen nach Kapiteln, häufige Fragen und eine Suche.
// Aufbau wie die Hilfe von Lernsachen-Heft, die Texte beschreiben Grundschulbuch.
import type { IconName } from '@/components/Icon';

export type HelpChapter = { id: string; title: string; sub: string; icon: IconName };
export type HelpTopic = { id: string; chapter: string; title: string; body: string[]; keywords?: string };
export type HelpQuestion = { q: string; topic: string; a: string };

export const helpChapters: HelpChapter[] = [
  { id: 'hefte', title: 'Regal und Hefte', sub: 'Neues Heft, Ordner, Öffnen, Sicherung', icon: 'library' },
  { id: 'seiten', title: 'Seiten und Vorlagen', sub: 'Neue Seite, Papier, Rahmen, Kachelansicht', icon: 'seiten' },
  { id: 'elemente', title: 'Text, Bild, Ton und Internet', sub: 'Einfügen, Hineinziehen, Beschreibung, Link', icon: 'add_image' },
  { id: 'bearbeiten', title: 'Anordnen und bearbeiten', sub: 'Auswählen, Gruppen, Kopieren, Rückgängig', icon: 'cursor' },
  { id: 'stift', title: 'Stift und Malen', sub: 'Stifte, Radierer, Lineal, Farbeimer, Formen', icon: 'buntstift' },
  { id: 'lernen', title: 'Lernwerkzeuge und Übungen', sub: 'Fächer, Übungen, Einstellbare Vorlagen', icon: 'puzzle' },
  { id: 'unterricht', title: 'Im Unterricht', sub: 'Tafelmodus, Vorlesen, Silben, Lesemodus', icon: 'video_projector' },
  { id: 'klassen', title: 'Klassen und Kinder', sub: 'Klassen, Karten, Austeilen, Freigaben', icon: 'conference_call' },
  { id: 'speichern', title: 'Speichern und teilen', sub: 'Dateien, PDF, Drucken, ePub, SCORM, Kollegium', icon: 'share' },
  { id: 'tastatur', title: 'Tastatur und Geräte', sub: 'Tastenkürzel, iPad, Pencil', icon: 'touchscreen_smartphone' },
];

export const helpTopics: HelpTopic[] = [
  // Regal und Hefte
  { id: 'neues-heft', chapter: 'hefte', title: 'Ein neues Heft anlegen', keywords: 'erstellen anlegen heft neu',
    body: [
      'Im Regal („Mein Regal“) legt „Neues Heft“ ein leeres Heft an – du gibst ihm einen Namen und eine Farbe für den Umschlag. Mit einem Tipp auf den Umschlag öffnest du es.',
      'Unter dem Umschlag stehen „Umbenennen“, „Duplizieren“, „Speichern …“ und „Löschen“. Die Suche über den Heften findet Hefte nach ihrem Namen.',
    ] },
  { id: 'ordner', chapter: 'hefte', title: 'Ordner', keywords: 'sortieren ordnen',
    body: [
      '„Neuer Ordner“ legt einen Ordner an. Ein Heft kommt hinein, wenn du es auf den Ordner ziehst oder unter dem Umschlag bei „Ohne Ordner“ einen Ordner wählst.',
      'Oben wählst du, welche Hefte du siehst: alle, nur die ohne Ordner oder die eines Ordners.',
    ] },
  { id: 'oeffnen', chapter: 'hefte', title: 'Heft, ePub oder PDF öffnen', keywords: 'import importieren datei laden pdf beschriften',
    body: [
      '„Heft, ePub oder PDF öffnen“ im Regal liest eine gespeicherte Heftdatei (.grundschulbuch), ein gespeichertes HTML-Heft oder ein ePub und legt daraus ein neues Heft an.',
      'Aus einer PDF wird ein Heft, in dem jede PDF-Seite festgemacht auf einer eigenen Seite liegt – zum Beschriften mit Stift, Text, Bild und Ton.',
      'Im offenen Heft ziehst du eine PDF einfach auf die Seite: Ihre Seiten kommen hinter die aktuelle Seite.',
    ] },
  { id: 'sicherung', chapter: 'hefte', title: 'Alles sichern und wiederherstellen', keywords: 'backup sicherung zip',
    body: [
      'Unter „Heft, ePub oder PDF öffnen“ sichert „Alle Hefte und Ordner sichern“ deine Hefte, Ordner, eigenen Vorlagen und deine Sammlung in einer ZIP-Datei. „Sicherung wiederherstellen“ liest sie wieder ein – auch auf einem anderen Grundschulbuch-Server.',
    ] },

  // Seiten und Vorlagen
  { id: 'neue-seite', chapter: 'seiten', title: 'Neue Seite und Vorlagen', keywords: 'vorlage seite hinzufügen lineatur kariert',
    body: [
      '„Neue Seite“ in der Seitenübersicht links öffnet die Vorlagen: Lineaturen, Karopapier, Notenlinien und viele gestaltete Seiten. Links stehen die Kategorien, oben die Suche; zuletzt benutzte Vorlagen stehen vorn.',
      'Unter „Einstellbar“ machen Vorlagen nach deinen Einstellungen fertige Arbeitsblätter – zum Beispiel Mathe-Aufgaben, Uhrzeiten, Geld, Buchstaben oder Labyrinthe, auf Wunsch mit Lösungsseiten.',
      'Bei Karopapier, Rechnen im Alltag und Laute hören gibt es eine Lösungskontrolle: Die Kinder tippen ihre Ergebnisse in die Kästchen, und daneben erscheint sofort ✓ oder ✗ – oder erst, wenn sie oben rechts auf „Prüfen“ tippen. Auf Seiten zum Messen und Zeichnen ist der Stift schon an, und das Lineal liegt unten links bereit; die Kästchen lassen sich trotzdem antippen.',
      'Eine Seite kann auch Endlospapier sein: Es wächst in alle Richtungen mit dem Inhalt. Endlospapier kommt nicht ins PDF und nicht auf den Drucker.',
    ] },
  { id: 'seite-einstellen', chapter: 'seiten', title: 'Seite einstellen: Papier, Farben, Rahmen', keywords: 'design hintergrund papierfarbe rahmen format hoch quer',
    body: [
      '„Seite“ links in der Werkzeugleiste öffnet unten die Einstellungen der Seite: Papier (Format hoch oder quer, Lineatur), Farben & Bild (Papier- und Linienfarbe, Hintergrundbild), Rahmen, Vorlage und Seiten.',
      'Unter „Vorlage“ wählst du eine andere Vorlage für diese Seite oder speicherst die Seite als eigene Vorlage.',
    ] },
  { id: 'seiten-verwalten', chapter: 'seiten', title: 'Seiten ordnen, kopieren und löschen', keywords: 'reihenfolge verschieben duplizieren seite kopieren einfügen anderes heft',
    body: [
      'Unter Seite → Seiten verschiebst du die Seite nach vorn oder hinten, duplizierst oder löschst sie. „Seite kopieren“ merkt sich die Seite; in einem anderen Heft setzt „Seite einfügen“ sie hinter die aktuelle Seite.',
      'Eine gelöschte Seite holst du mit „Rückgängig“ im Hinweis unten zurück.',
    ] },
  { id: 'kachelansicht', chapter: 'seiten', title: 'Kachelansicht', keywords: 'alle seiten übersicht mehrere seiten',
    body: [
      '„Kachelansicht“ in der Seitenübersicht zeigt alle Seiten als Kacheln. Antippen wählt eine Seite, „Mehrere“ oder Strg/Umschalt nimmt weitere dazu. Ziehen verschiebt Seiten, auch mehrere zusammen.',
      'Oben: Öffnen, Nach vorn, Nach hinten, Duplizieren, Kopieren, Speichern (nur die gewählten Seiten) und Löschen.',
    ] },

  // Elemente
  { id: 'text', chapter: 'elemente', title: 'Text', keywords: 'schreiben schrift fett kursiv textfeld sprechblase',
    body: [
      '„Text“ in der Werkzeugleiste setzt ein Textfeld auf die Seite – gleich zum Schreiben. Unten stellst du Schrift, Größe, Farbe, Ausrichtung und Rahmen ein (auch Sprechblasen).',
      'Auf Seiten mit Lineatur passt „Passend zur Lineatur“ den Text an die Linien an. „Silben rot und blau“ zeigt den Text in Silben (siehe „Silben rot und blau“).',
    ] },
  { id: 'bild', chapter: 'elemente', title: 'Bild', keywords: 'foto kamera arasaac piktogramm suche bildschirmfoto zuschneiden',
    body: [
      '„Bild“ öffnet: Hochladen, Kamera, Bildersuche (ARASAAC-Piktogramme, auf Wunsch Wikimedia Commons, die Schulgalerie), einen leeren Bildplatzhalter oder ein Bildschirmfoto der Seite.',
      'Ein ausgewähltes Bild lässt sich zuschneiden, drehen, spiegeln, mit Filtern und Rahmen versehen und an Stellen unkenntlich machen.',
      'Unter „Beschreibung“ schreibst du, was auf dem Bild ist – „Seite vorlesen“ liest es vor.',
    ] },
  { id: 'ton', chapter: 'elemente', title: 'Ton', keywords: 'aufnahme aufnehmen mikrofon lautsprecher kassettenrekorder',
    body: [
      '„Ton“ nimmt mit dem Mikrofon auf oder lädt eine Tondatei. Auf der Seite steht dann eine Tontaste. Du kannst den Ton zuschneiden und verbessern.',
      'Ein Ton-Platzhalter ist eine leere Tontaste mit Aufgabe – wer darauf tippt, nimmt selbst auf. Der Kassettenrekorder nimmt auf der Seite auf.',
    ] },
  { id: 'hineinziehen', chapter: 'elemente', title: 'Hineinziehen und aus anderen Apps einfügen', keywords: 'drag drop ziehen zwischenablage einfügen strg+v',
    body: [
      'Ziehe Dateien einfach auf die Seite („Loslassen zum Einfügen“): Bilder und Töne kommen auf die Seite, eine PDF wird zu Seiten hinter dieser, eine Heftdatei oder ein ePub wird geöffnet.',
      'Mit Strg+V (am Mac ⌘V) fügst du aus anderen Apps ein: ein Bild als Bild, eine Webadresse als Video oder Link, anderen Text als Textfeld.',
    ] },
  { id: 'internet', chapter: 'elemente', title: 'Internet: Video, Webseite, QR-Code', keywords: 'youtube video webseite qr link einbetten vimeo zdf ard mediathek logo kärtchen ändern fehler 153',
    body: [
      '„Internet“ öffnet „Video oder Webseite einfügen“. Gib die Internetadresse ein – das Heft erkennt selbst, ob es ein Video (YouTube, Vimeo, ARD- oder ZDF-Mediathek, Videodatei) oder eine Webseite ist, und holt Titel und Vorschaubild. Der Titel wird auch vorgelesen; „Ausprobieren“ öffnet die Adresse in einem neuen Fenster.',
      'Videos aus der ARD- und ZDF-Mediathek spielen im Heft mit dem Player des Senders – aber nur, wenn der Sender das für dieses Video erlaubt. Sonst erscheint ein Bild mit Titel; Antippen öffnet das Video in der Mediathek in einem neuen Fenster. Viele Mediathek-Videos sind nur eine Zeit lang abrufbar.',
      'Eine Webseite erscheint als Kärtchen mit Titel und Adresse oder mit „Webseite direkt im Heft zeigen“ auf der Seite selbst. Inhalte von außen laden erst, wenn jemand sie antippt. Ist das Element ausgewählt, ändert „Ändern“ unten Adresse, Art und Titel.',
      'Dazu gibt es „QR-Plakat“ (ein QR-Code zu einer Adresse) und für Lehrkräfte „Eigene HTML-App“.',
    ] },
  { id: 'videosuche', chapter: 'elemente', title: 'Videos auf YouTube suchen', keywords: 'youtube video suchen suche finden filme schlüssel api',
    body: [
      'Unter „Internet“ → „Video suchen“ suchst du direkt auf YouTube: Suchbegriff eingeben, nach Länge (kurz, mittel, lang) und Reihenfolge (passendste, neueste, meistgesehen) filtern. Ein Tipp auf das Vorschaubild spielt das Video im Dialog ab, „Auswählen“ übernimmt es mit Titel und Vorschaubild; „Mehr Ergebnisse“ lädt weitere.',
      'Gesucht wird mit SafeSearch „streng“ und nur nach Videos, die sich einbetten lassen. Sieh dir jedes Video trotzdem vorher selbst an.',
      'Die Suche braucht einen YouTube-Schlüssel, den die Verwaltung unter „Einstellungen“ einmal für die ganze Schule hinterlegt. Dort lässt sich auch erlauben, dass Kinder mit „Internet“ suchen.',
    ] },
  { id: 'link', chapter: 'elemente', title: 'Link zu einer Webseite oder Heftseite', keywords: 'verlinken verknüpfen sprung',
    body: [
      'Bei einem ausgewählten Element setzt „Link setzen“ oben einen Link zu einer Internetseite oder einer Seite des Hefts. Ein kleines Ketten-Zeichen zeigt den Link; antippen folgt ihm. Im PDF sind die Links anklickbar.',
    ] },
  { id: 'einfuegen', chapter: 'elemente', title: 'Einfügen: Formen, Sticker, Stempel, Sammlung', keywords: 'formen sticker stempel emoji sammlung',
    body: [
      '„Einfügen“ öffnet unten Formen, Sticker und Stempel. Ein Tipp setzt sie auf die Seite.',
      'In „Meine Sammlung“ legst du Bilder und Elemente ab, die du in vielen Heften brauchst.',
    ] },

  // Bearbeiten
  { id: 'auswaehlen', chapter: 'bearbeiten', title: 'Auswählen, verschieben, drehen', keywords: 'markieren größer kleiner drehen sperren festmachen',
    body: [
      'Mit „Auswahl“ tippst du ein Element an. Ziehen verschiebt es, die Griffe an den Ecken machen es größer oder kleiner, der Drehgriff dreht es. Hilfslinien zeigen, wo es einrastet.',
      'Gesperrte Elemente bleiben an ihrem Platz – praktisch für Arbeitsblätter, die Kinder nicht verschieben sollen.',
    ] },
  { id: 'mehrere', chapter: 'bearbeiten', title: 'Mehrere Elemente und Gruppen', keywords: 'gruppieren rahmen alles auswählen',
    body: [
      'Ziehe auf dem leeren Papier einen Rahmen um mehrere Elemente oder nutze „Mehrere antippen“. „Alles auswählen“ nimmt alle Elemente der Seite. Mit „Gruppieren“ bleiben sie zusammen.',
    ] },
  { id: 'kopieren', chapter: 'bearbeiten', title: 'Kopieren, Ausschneiden, Einfügen', keywords: 'zwischenablage duplizieren anderes heft',
    body: [
      'Oben stehen bei einer Auswahl Kopieren, Ausschneiden, Duplizieren und Löschen; „Einfügen“ setzt das Kopierte wieder ein – auch auf einer anderen Seite oder in einem anderen Heft (im selben Browser-Tab).',
    ] },
  { id: 'rueckgaengig', chapter: 'bearbeiten', title: 'Rückgängig und Speichern', keywords: 'zurück wiederholen speichern automatisch',
    body: [
      '„Zurück“ oben nimmt den letzten Schritt zurück, „Wiederholen“ macht ihn wieder. Das Heft speichert sich von selbst – oben steht „✓ Gespeichert“.',
    ] },

  // Stift
  { id: 'stifte', chapter: 'stift', title: 'Stifte und Farben', keywords: 'stift filzstift füller buntstift textmarker marker aquarell farbe dicke pipette',
    body: [
      '„Stift“ öffnet unten die Stiftarten: Filzstift, Füller, Buntstift, Textmarker, Aquarell und Farbeimer, dazu Farbe, Dicke und Deckkraft. Mit der Pipette nimmst du eine Farbe von der Seite auf.',
      'Unter „Malen mit“ wählst du „Stift und Finger“ oder „Nur Stift“ – dann malt nur der Eingabestift (z. B. Apple Pencil), und der Finger bedient das Heft.',
    ] },
  { id: 'radierer', chapter: 'stift', title: 'Radierer', keywords: 'radieren löschen',
    body: [
      '„Ganze Striche“ löscht jeden berührten Strich. „Fläche radieren“ wirkt wie ein Radiergummi – mit runder, eckiger oder schräger Spitze, harter oder weicher Kante. Bilder, Texte und PDF-Seiten bleiben.',
    ] },
  { id: 'hilfen', chapter: 'stift', title: 'Lineal, Geodreieck, Farbeimer, Formen', keywords: 'lineal geodreieck farbeimer ausmalen formen erkennen kreis',
    body: [
      'Unter „Zeichenhilfe“ legst du ein Lineal oder Geodreieck auf die Seite; Striche an der Kante werden gerade. Der Farbeimer (bei den Stiftarten) malt Flächen aus.',
      '„Formen erkennen“: Hältst du den Stift am Ende eines Strichs kurz still, wird daraus eine saubere Form – Linie, Kreis, Dreieck, Rechteck, Pfeil, Stern oder Herz.',
    ] },

  // Lernwerkzeuge
  { id: 'lernwerkzeuge', chapter: 'lernen', title: 'Lernwerkzeuge', keywords: 'übung werkzeug fach mathe deutsch musik timer quiz',
    body: [
      '„Lernwerkzeuge“ öffnet alle interaktiven Bausteine, nach Fächern geordnet: Deutsch, Mathematik, Sachunterricht, Musik, Medien & Präsentation, Klassenführung, Unterstützte Kommunikation, Alltag, Beruf & Praktikum, Programmieren und Für alle Fächer.',
      'Du stellst ein Werkzeug vor dem Einfügen ein; später öffnet „Aufgabe gestalten“ in der Leiste die Einstellungen wieder. Was Kinder in ausgeteilten Heften bearbeiten, bleibt in ihrem Heft gespeichert.',
    ] },
  { id: 'uebungen', chapter: 'lernen', title: 'Übungen: Quiz, Zuordnungen, Lesen & Schreiben', keywords: 'quiz zuordnung lückentext diktat memory kreuzworträtsel suchsel',
    body: [
      'Unter „Für alle Fächer“ und „Deutsch“ stehen Übungen wie Quiz, Zuordnungen, Lesen & Schreiben (Diktat, Lückentext, Blitzlesen), Memory, Kreuzworträtsel, Suchsel und Wordle. Du gibst Wörter oder Text ein, die Übung entsteht daraus.',
    ] },

  // Unterricht
  { id: 'tafel', chapter: 'unterricht', title: 'Tafelmodus', keywords: 'tafel beamer vollbild präsentation laser taschenlampe',
    body: [
      '„Tafelmodus“ oben zeigt die Seite groß ohne Leisten. Unten stehen Zeichnen, Laserpointer, Taschenlampe, Seite vorlesen und Blättern.',
      'Zum Beenden hältst du „Tafelmodus beenden“ 2 Sekunden gedrückt – so endet die Tafel nicht aus Versehen. Mit der Tastatur geht es sofort (Esc).',
    ] },
  { id: 'vorlesen', chapter: 'unterricht', title: 'Seite vorlesen', keywords: 'vorlesen stimme sprechen hören',
    body: [
      '„Seite vorlesen“ (unten rechts, an der Tafel und im Lesemodus) liest die Seite von oben nach unten vor: Texte Satz für Satz – der Satz leuchtet hell, das gesprochene Wort gelb –, Bilder, Sticker und Zeichnungen mit ihrer Beschreibung, Tontasten spielen ihren Ton. Nochmal tippen hält an.',
      'Gesprochen wird mit einer deutschen Stimme des Geräts. Fehlt sie, installiere sie in den Einstellungen des Geräts.',
    ] },
  { id: 'silben', chapter: 'unterricht', title: 'Silben rot und blau', keywords: 'silbenmethode silben lesen lernen farbig',
    body: [
      'Bei einem ausgewählten Text zeigt „Silben rot und blau“ (unter „Lesen“) den Text in Silben – jedes Wort beginnt blau. Beim Schreiben ist der Text schwarz.',
      'Die Trennung kennt die Wörter der Lehrlisten und trennt andere Wörter nach einer einfachen Regel. Schau bei schwierigen Wörtern nach.',
    ] },
  { id: 'lesemodus', chapter: 'unterricht', title: 'Lesemodus', keywords: 'lesen ansehen blättern',
    body: [
      '„Lesemodus“ zeigt das Heft zum Lesen und Üben, Seite für Seite, ohne Werkzeuge. Übungen lassen sich dort spielen.',
    ] },

  // Klassen
  { id: 'klassen', chapter: 'klassen', title: 'Klassen und Kinder anlegen', keywords: 'klasse kinder schüler anlegen',
    body: [
      'Unter „Meine Klassen“ legst du eine Klasse an und fügst Kinder mit Vornamen oder Kürzel hinzu.',
    ] },
  { id: 'karten', chapter: 'klassen', title: 'Anmelden mit Karte', keywords: 'karte qr code anmelden login kinder',
    body: [
      'Kinder melden sich mit ihrer Karte an: „Karte scannen“ und die Karte vor die Kamera halten. Die Karten der Kinder findest du unter „Meine Klassen“; „Wem gehört diese Karte?“ ordnet eine Karte einem Kind zu.',
    ] },
  { id: 'austeilen', chapter: 'klassen', title: 'Ein Heft austeilen', keywords: 'austeilen verteilen kopie kinderheft',
    body: [
      '„Ein Heft austeilen“ unter „Meine Klassen“: Jedes Kind erhält eine eigene Kopie. Du siehst die Hefte der Kinder und kannst sie öffnen.',
    ] },
  { id: 'einsammeln', chapter: 'klassen', title: 'Hefte einsammeln', keywords: 'einsammeln abgeben zurückgeben sammelheft sperren korrigieren pdf ausgeteilt',
    body: [
      'Unter „Meine Klassen“ → „Ausgeteilte Hefte“ steht jedes ausgeteilte Heft mit dem Stand der Kinder. „Kinder anzeigen“ listet jedes Kind mit seinen bearbeiteten Seiten; „Öffnen“ zeigt sein Heft im Editor, dort kannst du kommentieren.',
      '„Einsammeln“ sperrt die Hefte: Die Kinder können sie nur noch ansehen und vorlesen lassen. „Zurückgeben“ macht sie wieder beschreibbar. Beides geht für alle Kinder auf einmal oder einzeln.',
      '„Sammelheft anlegen“ legt alle Kinderhefte hintereinander, jeweils mit einer Seite mit dem Namen des Kindes, als neues Heft in dein Regal. Von dort kannst du es drucken oder als PDF speichern. Die Hefte der Kinder bleiben unverändert.',
    ] },
  { id: 'freigaben', chapter: 'klassen', title: 'Was die Kinder sehen', keywords: 'funktionen freigeben kinder einschränken',
    body: [
      'Unter „Was die Kinder im Heft sehen“ schaltest du für die Klasse oder ein einzelnes Kind Werkzeuge ein oder aus. Die Oberfläche der Kinder ist dieselbe wie deine, nur mit weniger Knöpfen.',
      '„Freigegebene Bilder“ sind eine Sammlung, die Kinder ohne eigenes Hochladen verwenden dürfen.',
    ] },

  // Speichern
  { id: 'speichern', chapter: 'speichern', title: 'Speichern und teilen', keywords: 'datei export html pdf epub scorm moodle mebis drucken',
    body: [
      '„Speichern“ oben öffnet „Speichern und teilen“. Zuerst wählst du die Seiten, dann das Format: bearbeitbare Heftdatei, HTML zum Ansehen, PDF, Drucker, SCORM-Paket (Moodle, mebis) oder ePub. Den Namen des Hefts kannst du dort noch ändern; nach ihm heißen die Dateien.',
      'Im Regal gibt es „Speichern …“ an jedem Heft, ohne es zu öffnen. In der Kachelansicht speichert „Speichern“ nur die gewählten Seiten.',
    ] },
  { id: 'drucken', chapter: 'speichern', title: 'Drucken und PDF', keywords: 'drucken ausdrucken pdf drucker',
    body: [
      'Unter „Speichern“ macht „PDF“ eine PDF-Datei – jede Seite in ihrer A4-Ausrichtung, Links bleiben anklickbar. „Am Drucker drucken“ öffnet die Druckansicht; stelle dort A4, Maßstab 100 %, Ränder „Keine“ und ohne Kopf- und Fußzeilen ein.',
    ] },
  { id: 'weitergeben', chapter: 'speichern', title: 'Im Kollegium weitergeben', keywords: 'kollegium kollegin teilen lehrkraft kopie',
    body: [
      '„Weitergeben“ schickt einer anderen Lehrkraft eine eigene, unabhängig bearbeitbare Kopie des Hefts oder einer eigenen Vorlage.',
    ] },

  // Tastatur
  { id: 'tastenkuerzel', chapter: 'tastatur', title: 'Tastenkürzel', keywords: 'tastatur shortcut kürzel',
    body: [
      'Viele Befehle gehen mit der Tastatur, zum Beispiel Strg+Z (Rückgängig), Strg+C und Strg+V (Kopieren, Einfügen), Pfeiltasten (verschieben), Tab (nächstes Element) und F1 (Hilfe). Am Mac steht ⌘ statt Strg.',
      'Alle Kürzel siehst und änderst du unter „Tastenkürzel ansehen und ändern …“.',
    ] },
  { id: 'ipad', chapter: 'tastatur', title: 'iPad und Apple Pencil', keywords: 'ipad tablet pencil finger zoomen',
    body: [
      'Mit zwei Fingern ziehst du die Seite größer oder kleiner. Mit „Nur Stift“ (unter Stift → Malen mit) malt nur der Pencil, und die Hand darf aufliegen.',
      'Die Leiste unten lässt sich mit „Einklappen“ klein machen, damit mehr Platz für die Seite bleibt.',
    ] },
];

export const helpQuestions: HelpQuestion[] = [
  { q: 'lege ich ein neues Heft an?', topic: 'neues-heft', a: 'Im Regal „Neues Heft“ – Name und Farbe wählen, fertig.' },
  { q: 'bekomme ich eine neue Seite?', topic: 'neue-seite', a: '„Neue Seite“ in der Seitenübersicht links – dann eine Vorlage wählen.' },
  { q: 'mache ich ein Mathe-Arbeitsblatt?', topic: 'neue-seite', a: '„Neue Seite“ → „Einstellbar“ → „Mathe-Aufgaben“: Zahlenraum und Übungen wählen.' },
  { q: 'füge ich ein Bild ein?', topic: 'bild', a: '„Bild“ links – hochladen, fotografieren oder suchen. Oder die Datei auf die Seite ziehen.' },
  { q: 'beschrifte ich ein PDF-Arbeitsblatt?', topic: 'oeffnen', a: 'Die PDF auf die Seite ziehen oder im Regal „Heft, ePub oder PDF öffnen“ – dann mit Stift und Text darauf schreiben.' },
  { q: 'nehme ich etwas auf?', topic: 'ton', a: '„Ton“ links – aufnehmen, anhören, übernehmen.' },
  { q: 'male ich eine Fläche aus?', topic: 'hilfen', a: '„Stift“ → Farbeimer, dann in die Fläche tippen.' },
  { q: 'mache ich etwas rückgängig?', topic: 'rueckgaengig', a: '„Zurück“ oben oder Strg+Z (⌘Z).' },
  { q: 'verhindere ich, dass Kinder etwas verschieben?', topic: 'auswaehlen', a: 'Element auswählen und sperren – es bleibt dann an seinem Platz.' },
  { q: 'zeige ich das Heft an der Tafel?', topic: 'tafel', a: '„Tafelmodus“ oben. Zum Beenden den Knopf 2 Sekunden halten oder Esc.' },
  { q: 'lasse ich eine Seite vorlesen?', topic: 'vorlesen', a: '„Seite vorlesen“ unten rechts – nochmal tippen hält an.' },
  { q: 'zeige ich Silben farbig?', topic: 'silben', a: 'Text antippen, unten „Silben rot und blau“.' },
  { q: 'gebe ich ein Heft an die Kinder weiter?', topic: 'austeilen', a: '„Meine Klassen“ → „Ein Heft austeilen“ – jedes Kind bekommt eine eigene Kopie.' },
  { q: 'sammle ich ausgeteilte Hefte wieder ein?', topic: 'einsammeln', a: '„Meine Klassen“ → „Ausgeteilte Hefte“ → „Einsammeln“; „Sammelheft anlegen“ holt alle Kinderhefte in dein Regal.' },
  { q: 'finde ich ein passendes Video?', topic: 'videosuche', a: '„Internet“ → „Video suchen“ – sucht auf YouTube mit SafeSearch „streng“.' },
  { q: 'drucke ich ein Heft aus?', topic: 'drucken', a: '„Speichern“ → „PDF“ oder „Am Drucker drucken“.' },
  { q: 'kopiere ich eine Seite in ein anderes Heft?', topic: 'seiten-verwalten', a: 'Seite → Seiten → „Seite kopieren“, dann im anderen Heft „Seite einfügen“.' },
  { q: 'bringe ich ein Heft auf einen anderen Server?', topic: 'speichern', a: '„Speichern“ → „Bearbeitbare Heftdatei“, dort im Regal „Heft, ePub oder PDF öffnen“.' },
  { q: 'gebe ich Kindern weniger Werkzeuge?', topic: 'freigaben', a: '„Meine Klassen“ → „Was die Kinder im Heft sehen“.' },
];

const fold = (s: string) =>
  s.toLocaleLowerCase('de').replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss');

/** Themen, die alle Suchwörter enthalten (Titel zählt mehr als Text). */
export function searchHelp(query: string): HelpTopic[] {
  const words = fold(query).split(/[\s,;]+/).filter((w) => w.length > 1);
  if (!words.length) return [];
  const scored = helpTopics
    .map((t) => {
      const title = fold(t.title), keys = fold(t.keywords ?? ''), body = fold(t.body.join(' '));
      let score = 0;
      for (const w of words) {
        if (title.includes(w)) score += 3;
        else if (keys.includes(w)) score += 2;
        else if (body.includes(w)) score += 1;
        else return null;
      }
      return { t, score };
    })
    .filter((x): x is { t: HelpTopic; score: number } => !!x);
  return scored.sort((a, b) => b.score - a.score).map((x) => x.t);
}
