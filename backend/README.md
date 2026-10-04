# Content Bravio Backend — Phase 1

Development stack:

- FastAPI
- SQLite
- Uvicorn

## Run on Windows PowerShell

From the repository root:

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
.\.venv\Scripts\python.exe -m uvicorn main:app --reload --port 8000
```

The API will be available at:

- http://127.0.0.1:8000
- API docs: http://127.0.0.1:8000/docs
- Clients: http://127.0.0.1:8000/clients

In the root `script.js`, set:

```javascript
const BACKEND_URL = "http://127.0.0.1:8000";
```

For development, open the frontend through a local web server from a second
PowerShell window in the repository root:

```powershell
python -m http.server 5500
```

Then open:

http://127.0.0.1:5500/testing.html

Do not enter real/private client information yet. This phase is for test data.
