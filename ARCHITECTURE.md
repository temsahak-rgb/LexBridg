# LexBridge architecture decisions (v0.2)

- **UI**: React + TypeScript + Vite, designed for task-first workflows and EN/DE/FR labels.
- **Prototype API**: FastAPI. In this stage, text is transmitted to the development API, but not written to disk/database or forwarded to an AI provider. This is **not** a client-only implementation.
- **Jurisdictions**: `ch` and `eu` are **independent** modules. Future `de` and `fr` have their own manifests, legal sources, validity metadata and tests. Adding a manifest makes a country visible, *not legally validated*.
- **Legal sources**: Trusted official links will be ingested, versioned, cited by article, effective date and language. No legal text is ingested yet.
- **Provider abstraction** (planned): OpenAI, Gemini or other user-supplied credentials via secure adapters; never put keys into a source repository. BYOK is NOT implemented.
- **Local-first** (planned): parse pasted text / DOCX / text PDFs in browser, with optional encrypted local persistence. PWA installation and local LLM execution are NOT yet implemented.
- **Human-in-the-loop**: findings must carry evidence, legal jurisdiction, validity date and review state. Never claim legal advice from an unverified model response.
- **Agent collaboration** (planned): bounded typed agent exchanges with evidence references and event log, rather than unbounded chat.
- **Security**: demo not for sensitive client contracts; private Codespaces ports, access control and security reviews required before exposure on the public internet.
