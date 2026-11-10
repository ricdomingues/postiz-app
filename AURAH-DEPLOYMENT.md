# Aurah Postiz fork

This AGPL-3.0 fork is based on upstream v2.25.3. Its source is available at
https://github.com/ricdomingues/postiz-app.

## Cookie isolation

The shared cookie-domain helper omits the `Domain` attribute. Authentication,
organization and tracking cookies are host-only, instead of being shared with
every application on the parent domain. HTTPS, HttpOnly and SameSite settings
remain controlled by the existing callers.

Serve the frontend and `/api` behind the same public origin. A separate public
API hostname is not supported by this patch: a host-only API cookie would not
reach the frontend. Do not enable cross-subdomain cookies to work around this.

Run the dependency-free regression check with Node 24:

    node --test libraries/helpers/src/subdomain/subdomain.management.test.mjs

## Rollout and existing sessions

This source patch alone does not change a running upstream container. Build a
versioned image in CI, publish its immutable digest and retain the old digest
for rollback. Back up the Postiz databases and uploads before replacing the
container; upstream startup can apply database changes.

Before login on the patched instance, expire the old parent-domain cookies
(`auth`, `org`, `showorg`, `track`, `_fbc`, `_fbp` and `fbclid`) using one-time
`Set-Cookie` headers with the original Domain and Path values. Inspect the
existing cookies first; do not clear unrelated applications' cookies. Clearing
only the new host-only cookie does not remove a legacy parent-domain cookie.
Users must sign in again. Do not reuse old session tokens.

Verify login, an authenticated API request, organization switching and logout.
Inspect every response's `Set-Cookie`: no cookie may contain `Domain=`. Confirm
in browser storage that the new cookies are host-only and that a request to a
sibling application sends no Postiz authentication cookie. After logout,
authenticated API requests must fail. Test an OAuth callback before enabling
social accounts.

Retain the AGPL license/notices and provide this source URL to network users
when deploying the modified service.
