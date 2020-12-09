import 'react-native-gesture-handler/jestSetup';

import { firebase } from '../components/Firebase/config';

// ==== Needed to use JSDOM for mount() to be used for react native. ===========
import { JSDOM } from 'jsdom';

const jsdom = new JSDOM('<!doctype html><html><body></body></html>', {
  url: 'http://localhost/',
});
const { window } = jsdom;

function copyProps(src, target) {
  Object.defineProperties(target, {
    ...Object.getOwnPropertyDescriptors(src),
    ...Object.getOwnPropertyDescriptors(target),
  });
}

global.window = window;
global.document = window.document;
global.navigator = {
  userAgent: 'node.js',
};
global.requestAnimationFrame = function (callback) {
  return setTimeout(callback, 0);
};
global.cancelAnimationFrame = function (id) {
  clearTimeout(id);
};
copyProps(window, global);
// =================


// ==== Needed to supress a long list of warnings when calling mount() on userlink screen. ============
const originalConsoleError = console.error;
console.error = (message) => {
  if (message.startsWith('Warning:')) {
    return;
  }

  originalConsoleError(message);
};
// ==============


jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');

  // The mock for `call` immediately calls the callback which is incorrect
  // So we override it with a no-op
  Reanimated.default.call = () => {};

  return Reanimated;
});

// Silence the warning: Animated: `useNativeDriver` is not supported because the native animated module is missing
jest.mock('react-native/Libraries/Animated/src/NativeAnimatedHelper');

const authMock = {
  signInWithEmailAndPassword: jest.fn().mockResolvedValue({ user: { uid: 'test' } }),
}

jest.spyOn(firebase, 'auth').mockImplementation(() => authMock);

const firestoreMock = {
  collection: jest.fn().mockReturnThis(),
  doc: jest.fn().mockReturnThis(),
  set: jest.fn().mockResolvedValue(),
  onSnapshot: jest.fn().mockImplementation(cb => cb([])),
};

jest.spyOn(firebase, 'firestore').mockImplementation(() => firestoreMock);
