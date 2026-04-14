/**
 * Jest environment polyfills
 * jest-environment-jsdom does not expose TextEncoder/TextDecoder from Node's
 * built-in `util` module. React Router v7 requires them at module load time.
 */
const { TextEncoder, TextDecoder } = require('util');
Object.defineProperty(globalThis, 'TextEncoder', { value: TextEncoder });
Object.defineProperty(globalThis, 'TextDecoder', { value: TextDecoder });
