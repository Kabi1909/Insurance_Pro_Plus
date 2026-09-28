# Insurance Pro Plus

React frontend with a Node.js API and persistent SQLite storage. Public Home, insurance, About, news and offer information remains available without signing in. Customer dashboards require registration and authentication. Payments default to a **local PayHere demo simulation**, with a separate hosted PayHere Sandbox mode for later deployment. Live payments are not supported.

## Run locally

Use Node.js **22.14 or later** (the backend uses built-in `node:sqlite`). No backend packages or separate database installation are needed.

From the project root, start the API:

```powershell
Copy-Item backend/.env.example backend/.env
npm --prefix backend start
```

In a second terminal:

```powershell
npm --prefix frontend install
npm --prefix frontend run dev
```

Open `http://localhost:5173`. Vite proxies `/api` to port 3001. If using another frontend origin, set `APP_ORIGIN` to it in `backend/.env`. Restart the API after environment changes. Keep secrets in the ignored `.env` file, never in frontend `VITE_*` variables.

The database is created at `backend/data/insurance.sqlite` when launched with the command above. It starts with **only** the default administrator:

- Email: `admin@insuranceproplus.com`
- Password: `Admin@123`

Both `/login` and `/admin/login` accept this administrator. The password is hashed on first startup. Existing passwords and records are preserved on restart; `ADMIN_PASSWORD` only overrides the initial seed. Customer accounts must register. Old browser mock sessions and records are discarded.

## Local demo payments (default)

Set `PAYMENT_MODE=demo` in `backend/.env`, then restart the backend. Local development defaults to this mode even without `.env`. No deployment, merchant account, callback URL, card details or external payment request is needed.

1. Register/sign in, request an estimate and select a plan. The policy is **Pending Payment**.
2. Open Payments and select the policy, then choose **Continue to Demo Checkout**.
3. Review the server-calculated amount and select **Complete Demo Payment**. Cancelling the dialog leaves the policy pending.
4. The server saves a simulated payment and activates the policy in one transaction. Customer payment history displays **Completed**, and the policy displays **Active**. Repeated clicks do not extend coverage twice.

Payment records carry `provider: demo`, `simulated: true` and the method **PayHere Demo (Simulated)**. Internally the existing settlement status is `Paid`, displayed as `Completed` in the customer UI. Receipts explicitly say no money was charged. This is demonstration data, not real payment or insurance cover.

## Switch to hosted PayHere Sandbox after deployment

Set these server environment variables using your sandbox merchant account:

```dotenv
PAYMENT_MODE=payhere-sandbox
PAYHERE_MERCHANT_ID=your-sandbox-merchant-id
PAYHERE_MERCHANT_SECRET=your-domain-specific-sandbox-secret
PAYHERE_NOTIFY_URL=https://your-public-test-host/api/payhere/notify
APP_ORIGIN=https://your-public-test-host
```

Restart the backend after switching modes. The local completion endpoint is disabled in `payhere-sandbox` mode, and PayHere callbacks cannot settle simulated orders. `NODE_ENV=production` rejects demo mode. The provider adapters in `backend/src/payments.js` share settlement logic, so the quote, policy and dashboard flows do not need replacement.

The notification URL must be reachable by PayHere; localhost alone cannot receive its callbacks. Register the corresponding test domain/app in PayHere and use its merchant secret. See the [official Checkout API documentation](https://support.payhere.lk/api-%26-mobile-sdk/checkout-api).

Select a plan, open Payments, supply test billing details, and continue to PayHere's hosted sandbox checkout. Card data is entered only on PayHere. The API calculates the checkout hash and verifies the callback signature, merchant, amount and currency before updating records. A return/cancel redirect **never** marks a payment successful. Refresh payment history while a notification is pending. Duplicate callbacks are idempotent. Refunded payments suspend the associated test policy. Cancelling a policy does not issue a gateway refund.

In hosted sandbox mode, missing credentials return a configuration error; there is no silent fallback to simulation. Automated tests cover both the explicitly selected demo flow and signed sandbox callbacks. They do not establish that your merchant account or public callback URL works. Complete a hosted sandbox payment after configuration to verify that connection, using only PayHere's sandbox test details.

## Implemented workflows

- Registration, hashed passwords, HTTP-only cookie sessions, remember-me, logout, profile and photo updates, password changes, administrator password resets and required first-login password changes for staff.
- Public product details; authenticated estimates and Basic/Plus/Premium selection; pending policies; monthly or annual premiums; cancellation and premium reminders.
- Configurable estimated rates in Admin → Settings → Insurance Categories. Default Business Property Plus: USD 250,000 coverage, USD 250/month. Annual estimates charge ten monthly premiums. The advertised business bundle discount applies to a new complementary property/vehicle quote when the customer already has active, paid cover for the other product.
- Verified sandbox premium payments, downloadable PDF receipts/policy records, policy activation and paid-through dates. Payments are customer-initiated; no automatic recurring billing is enabled.
- Claims for active paid policies, attachment uploads/downloads, officer assignments, information requests, customer conversations, internal notes and final approve/reject decisions.
- Customer/staff administration, document verification, support requests and replies, in-app notifications, actual dashboard/report statistics, filters, pagination, search and PDF/CSV exports.

Support replies are stored in the portal; this implementation does not send email/SMS. Anonymous visitors can submit an enquiry; staff can use its contact details to reply outside the portal. Registered customers can read replies in Support. Claim approval records a decision; it does not send a bank payout. Two-factor authentication remains explicitly unconfigured. The public service notices describe sandbox behavior and need operator-approved replacement before live use.

## Authorization and storage

Customer APIs enforce record ownership on the server. All staff can read administrative operational records. System administrators manage settings, users, roles and access. Claims officers/managers handle claims; finance/policy officers and claims managers manage policies; support officers handle support; document review is available to claims/support staff. System administrators can perform all these actions. The default administrator and your own account cannot be suspended through account management.

SQLite stores accounts, hashed session tokens, records, attachments, settings, audit events and processed callbacks. Uploads are limited to 5 MB per document; avatars to 2 MB. Documents download as attachments. Back up the database using a SQLite-aware backup tool, or stop the service before copying the database and its WAL files. Do not delete `backend/data` to reset passwords.

## Build and verification

```powershell
npm --prefix backend test
npm --prefix frontend test
npm --prefix frontend run lint
npm --prefix frontend run build
```

The backend can serve `frontend/dist` directly after building. Set `APP_ORIGIN=http://localhost:3001` for that local mode and browse port 3001. `FRONTEND_DIST` can override the static directory. SPA routes fall back to `index.html`; API paths remain API responses. For an HTTPS deployment, place the service behind a reverse proxy and set `NODE_ENV=production` for secure session cookies, with the exact public `APP_ORIGIN`. The payment integration remains sandbox-only.

API integration tests cover authentication, ownership, CSRF checks, session revocation, estimates, plan-selection races, signatures, repeated/out-of-order callbacks, receipts, claims, uploads, support, staff permissions, rate limits and persistence. UI visual verification was interrupted by an automatic approval-review usage limit; no complete browser pass is claimed for this backend integration.
