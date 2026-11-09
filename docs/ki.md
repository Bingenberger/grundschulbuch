# Optionaler KI-Dienst

Der Dienst ist ohne Konfiguration ausgeschaltet. Nur angemeldete Lehrkräfte
können ihn ausdrücklich aufrufen. Die Anfrage enthält das ausgefüllte Themenfeld
und die Formatvorgaben der App. Kinderhefte, Namen und Medien werden nicht
automatisch übertragen. Der Entwurf wird vor der Übernahme angezeigt.

| Variable          | Bedeutung                                                                                                                                                   |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `AI_PROVIDER`     | `openai` für Responses, `compatible` für eine Chat-Completions-Schnittstelle oder `local` für einen schulinternen kompatiblen Dienst ohne Pflichtschlüssel. |
| `AI_BASE_URL`     | API-Basis inklusive Version, z. B. `https://api.openai.com/v1` oder die Basis des eigenen Servers.                                                          |
| `AI_MODEL`        | Vom Betreiber gewählte, beim Dienst verfügbare Modellkennung. Es gibt kein fest eingebautes Modell.                                                         |
| `AI_API_KEY_FILE` | Pfad zur im Container lesbaren Schlüsseldatei, z. B. `/run/secrets/ai-key`. Der Schlüssel wird nicht an Browser ausgeliefert.                               |

Für einen externen Dienst wird eine separate, nur lesbar eingehängte Schlüsseldatei
benötigt. Beispiel für eine **zusätzliche** Compose-Datei:

```yaml
services:
  app:
    environment:
      AI_PROVIDER: openai
      AI_BASE_URL: https://api.openai.com/v1
      AI_MODEL: ${AI_MODEL:?Modellkennung festlegen}
      AI_API_KEY_FILE: /run/secrets/ai-key
    volumes:
      - ${GRUNDSCHULBUCH_AI_KEY_FILE:?Schlüsseldatei festlegen}:/run/secrets/ai-key:ro
```

Die Schlüsseldatei muss für UID 10001 lesbar sein. Sie gehört außerhalb des
Repositorys in die geschützte Betreiberkonfiguration. Die App übernimmt keine
Schlüssel aus Lehrkraftformularen und speichert keinen Schlüssel in Heften oder
Sicherungen. Pro Lehrkraft sind höchstens zwanzig Entwurfsanfragen je Stunde
vorgesehen; das ist keine Kostenobergrenze des Anbieterkontos.

Der OpenAI-Adapter nutzt `POST /v1/responses` mit `store: false` und liest die
Textausgabe aus den Nachrichten der Antwort. Grundlage ist die offizielle
[Dokumentation zur Texterzeugung](https://developers.openai.com/api/docs/guides/text).
Das ersetzt keine Vereinbarung über Datenverarbeitung mit einem externen
Dienst. Die Freigabe des Dienstes und des gewählten Modells liegt beim Betreiber.

Die automatisierten Tests verwenden einen lokalen simulierten Server und einen
Testschlüssel. Eine echte Anbieteranbindung ist dadurch noch nicht abgenommen.
