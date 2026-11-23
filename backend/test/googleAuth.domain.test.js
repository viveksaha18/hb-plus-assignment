const test = require('node:test');
const assert = require('node:assert/strict');
const { OAuth2Client } = require('google-auth-library');
const { verifyGoogleIdToken } = require('../src/services/googleAuth.ts');
const { env } = require('../src/config/env.ts');

const originalVerifyIdToken = OAuth2Client.prototype.verifyIdToken;

function mockVerifiedPayload(payload) {
  OAuth2Client.prototype.verifyIdToken = async function (options) {
    assert.deepEqual(
      options.audience,
      [
        env.googleWebClientId,
        env.googleAndroidClientId,
        env.googleIosClientId,
      ].filter(Boolean),
    );
    return { getPayload: () => payload };
  };
}

test.afterEach(() => {
  OAuth2Client.prototype.verifyIdToken = originalVerifyIdToken;
});

test('allows a verified HB Plus email case-insensitively', async () => {
  mockVerifiedPayload({
    email: 'USER@HBPLUS.FIT',
    email_verified: true,
  });

  const payload = await verifyGoogleIdToken('test-id-token');
  assert.equal(payload.email, 'USER@HBPLUS.FIT');
});

test('rejects Gmail and lookalike domains with the required message', async () => {
  for (const email of ['user@gmail.com', 'user@hbplus.fit.example.com']) {
    mockVerifiedPayload({ email, email_verified: true });

    await assert.rejects(
      verifyGoogleIdToken('test-id-token'),
      (error) => error.statusCode === 403
        && error.message === 'Access restricted. Please login using your official domain email.',
    );
  }
});

test('rejects an unverified Google email', async () => {
  mockVerifiedPayload({
    email: 'user@hbplus.fit',
    email_verified: false,
  });

  await assert.rejects(
    verifyGoogleIdToken('test-id-token'),
    (error) => error.statusCode === 403 && error.message === 'Your Google email must be verified',
  );
});
