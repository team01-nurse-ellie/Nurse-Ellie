import 'react-native-gesture-handler/jestSetup';

import { firebase } from '../components/Firebase/config';

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
