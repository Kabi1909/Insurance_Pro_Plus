# Insurance Pro Plus frontend

Run `npm run dev` from this directory. Run `npm run build` to refresh the
production files in `dist`, then `npm run preview` to inspect that build.
Hosts serving the SPA must send unknown application paths to `index.html`.

## Verification

- `npm run lint`: checks undefined variables/components and React hook rules.
- `npm test`: tests default login credentials, role separation, session recovery,
  remember-me persistence, blocked storage, profile session updates, and demo data
  initialization without overwriting existing records.
- `npm run build`: verifies production compilation. The existing large bundle
  warning remains a performance improvement opportunity.

Admin credentials work at both `/login` and `/admin/login`. Login screens do not
display or prefill example credentials. Email matching ignores case and outer
whitespace; passwords remain case-sensitive and are matched exactly.
Remember me uses local storage; otherwise the session uses session storage.

## Current scope

This repository is a frontend demo: the backend directory has no implementation.
Browser-stored sessions and hardcoded demo credential checks are not production
authentication or authorization. Hiding credentials in the UI does not remove
them from the JavaScript bundle. Do not use this demo with real insurance records.

Registration, password changes, two-factor authentication, global settings,
real payments, document delivery, and several report/export/filter actions need
backend or further feature implementation. Registration and account/settings
controls now avoid claiming unsupported operations succeeded. Profile edits
persist in the current browser session, not in a server account database.

Browser verification covered both admin login entry points, customer login,
invalid passwords, reload/logout behavior, all 11 primary admin pages, 10 customer
and public navigation pages, business customer details, policy navigation, and
missing-record recovery. These checks do not establish
that every placeholder action is implemented.
