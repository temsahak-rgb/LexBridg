# LexBridge AI — portfolio prototype v0.2

An **accessible, multilingual legal operations workspace** that will support modular jurisdictions and replaceable AI model providers. Current UI languages: **English, Deutsch, Français**. First planned law module: **Switzerland**; EU law is a separate module, **not** part of the Swiss legal sources.

> **IMPORTANT:** No AI is connected. No Swiss/EU source has been ingested or validated. The current form is an intake demo and does **not** perform legal analysis. Do not use real/confidential client documents.

## Run in GitHub Codespaces
Open a **private** GitHub repository and upload the files (keep folder structure). Start two terminals from the repository root:

**Terminal 1 — API**
```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

**Terminal 2 — UI**
```bash
cd frontend
npm install
npm run dev
```

Open forwarded port **5173**. Keep **5173 and 8000 visibility private** in Codespaces. The Vite dev server proxies `/api` to `8000`.

## Tests
```bash
python -m pytest -q tests
```
The GitHub Actions backend-check workflow runs these tests on pushes and pull requests.

## Implementation status
| Capability | Status |
| --- | --- |
| Three-language task-first UI | Initial demo |
| Intake / structured response API | Demo only, no persistence |
| Switzerland and EU separate legal module manifests | Included, **research disabled** |
| Real statute ingestion, citations, dated versions | Not implemented |
| BYOK, model adapters, agent messaging | Not implemented |
| Local file parsing, PWA installation | Not implemented |
| Authentication, permissions, rate limiting | Not implemented |

## Privacy boundary
Pasted text currently travels from your browser to the FastAPI development server; this prototype does **not** save it, send it to an external model or return it in the response. It is **not** a fully local-only browser app yet. Infrastructure access logs and browser/dev tooling may have their own behavior. Do not test with confidential materials.

## Documentation
- [Architecture and jurisdiction boundaries](ARCHITECTURE.md)
- [Copilot instructions](.github/copilot-instructions.md)

## Roadmap
1. Browser-local text intake and clear privacy indicator
2. Official Swiss legal sources: immutable snapshots, article IDs, language, validity metadata
3. Evidence-linked research with abstention when sources are missing
4. Company playbooks and contract-risk review with human approval
5. Provider adapters and carefully designed BYOK
6. Browser-local DOCX/PDF parsing; PWA; secure private demo

**This prototype is not legal advice.**
