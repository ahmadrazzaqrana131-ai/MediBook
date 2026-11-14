# MediBook

MediBook is a React/Vite healthcare booking demo with a separate Express API and an OpenRouter-powered general health information assistant.

## Project structure

```text
frontend/
  src/
    components/
    data/
    pages/
    assets/
  public/
  index.html
  vite.config.js
backend/
  src/server.js
  test/
  .env.example
package.json
```

## Run locally

Use Node.js 22 or later. Install each app's dependencies once:

```powershell
npm install --prefix frontend
npm install --prefix backend
```

Copy `backend/.env.example` to `backend/.env` if it does not exist, then set `OPENROUTER_API_KEY` to an API key from your OpenRouter account. The default `OPENROUTER_MODEL=openrouter/free` automatically selects only from available free models; you can alternatively select a specific free model whose ID ends in `:free`. Paid model IDs are rejected by the backend. Keep the API key private; `.env` files are ignored by Git.

OpenRouter's free models cost nothing per inference, but they are **not unlimited**: free-model requests have provider availability and rate limits. OpenRouter currently documents a 50-request-per-day free-model allowance for accounts that have not purchased credits, and 1,000 per day after purchasing at least $10 in credits. These limits can change. The app also limits each client to 12 requests per minute to protect the API. No software setting can remove OpenRouter's service limits.

Start the backend and frontend in separate terminals from the project root:

```powershell
npm run dev:backend
```

```powershell
npm run dev
```

The frontend runs at `http://localhost:5173` and proxies `/api` requests to the backend at `http://localhost:5000`. The assistant's API key is only used by the backend and is never sent to the browser. For a deployed frontend, set `VITE_API_URL` to the backend chat endpoint and set `CLIENT_ORIGIN` in the backend environment to the frontend's allowed origin.

## Checks

```powershell
npm run lint
npm run build
npm run test:backend
```

The assistant provides general educational information, not diagnosis or treatment. It is not for emergencies; users should contact local emergency services when in immediate danger. Do not send sensitive or identifying health details.

## Demo account limitation

The current signup, login, and appointment data are stored in browser `localStorage`; this is suitable only for a local demo. It is not secure authentication or storage for real patient data. A production launch requires server-side authentication, secure password hashing, authorization, and a protected database.
