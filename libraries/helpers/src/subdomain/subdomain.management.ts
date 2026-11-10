export function getCookieUrlFromDomain(_domain: string): undefined {
  // Omit Domain to create host-only cookies. Deriving the registrable domain
  // shares session credentials with every sibling application on that domain.
  // This fork serves the frontend and API behind the same public origin.
  return undefined;
}
