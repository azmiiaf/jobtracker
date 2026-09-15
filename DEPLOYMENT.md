# Deployment

Recommended production setup:

- Frontend: Vercel
- Backend: Render Web Service
- Database: Supabase

## 1. Deploy Backend to Render

Create a Render Web Service from this repository.

Set the service root directory to `backend`.

Commands:

```text
Build Command: npm install
Start Command: npm start
Health Check Path: /health
```

Set these environment variables in Render. Never commit real values:

```text
PORT=10000
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
JWT_SECRET=your-long-random-secret
FRONTEND_URL=https://your-frontend.vercel.app
```

After deploy, verify:

```text
https://your-backend.onrender.com/health
```

Expected response:

```json
{ "status": "ok" }
```

## 2. Deploy Frontend to Vercel

Import the same repository into Vercel.

Set the project root directory to `frontend`.

Build settings:

```text
Framework Preset: Vite
Build Command: npm run build
Output Directory: dist
```

Set this environment variable in Vercel:

```text
VITE_API_URL=https://your-backend.onrender.com/api
```

The `frontend/vercel.json` rewrite keeps React Router routes working after refresh.

## 3. Update CORS

After Vercel gives you the real production URL, set Render's `FRONTEND_URL` to that exact URL and redeploy the backend.

## Security

- Keep `SUPABASE_SERVICE_ROLE_KEY` only on the backend.
- Never put the service role key in Vercel frontend variables.
- Rotate any Supabase key that has been exposed in chat, screenshots, or committed files.
