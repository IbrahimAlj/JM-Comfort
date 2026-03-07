import * as Sentry from '@sentry/react';

export function captureError(error, context = {}) {
  console.error(error);
  Sentry.captureException(error, { extra: context });
}

export function captureMessage(message, level = 'info') {
  Sentry.captureMessage(message, level);
}
