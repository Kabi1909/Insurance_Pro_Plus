# Insurance Pro Plus frontend

See the [project README](../README.md) for API startup, database behavior, default admin access, PayHere sandbox configuration and implemented workflows.

```powershell
npm install
npm run dev
```

Vite proxies `/api` to `http://127.0.0.1:3001`. Start the backend separately. Authentication and dashboard records come from the server; there is no client-side mock login or seeded customer data.

Checks: `npm run lint`, `npm test`, `npm run build`.
The existing page styling and public insurance content are retained. Functional dialogs use the existing components and styling.
