import assert from 'node:assert/strict';
import { test } from 'node:test';
import { getCookieUrlFromDomain } from './subdomain.management.ts';

for (const frontendUrl of [
  'https://social.staging.example.com',
  'https://social.example.co.uk',
  'https://example.com',
  'http://localhost:4200',
  'http://127.0.0.1:4200',
  'http://[::1]:4200',
]) {
  test(`does not widen cookies beyond the response host: ${frontendUrl}`, () => {
    const options = { domain: getCookieUrlFromDomain(frontendUrl) };
    // Both Express and Next omit the Domain attribute for undefined. In
    // particular, never return .example.com for social.staging.example.com.
    assert.equal(options.domain, undefined);
    assert.equal(JSON.stringify(options), '{}');
  });
}
