const { TextEncoder, TextDecoder } = require('util');
Object.defineProperty(globalThis, 'TextEncoder', { value: TextEncoder });
Object.defineProperty(globalThis, 'TextDecoder', { value: TextDecoder });
