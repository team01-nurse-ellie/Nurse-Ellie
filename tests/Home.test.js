import React from 'react';
import renderer from 'react-test-renderer';

import { FirebaseAuthContext } from '../components/Firebase/FirebaseAuthContext';
import MedicationListScreen from '../screens/MedicationListScreen';

import { firebase } from '../components/Firebase/config';

const navigationProp = {
    navigate: jest.fn(),
    openDrawer: jest.fn(),
};

const firestoreMock = {
    collection: jest.fn().mockReturnThis(),
    doc: jest.fn().mockReturnThis(),
    onSnapshot: jest.fn().mockResolvedValueOnce(),
  };

export const FirebaseAuthProvider = ({ children }) => (
    <FirebaseAuthContext.Provider value={{ currentUser: { uid: 'test' } }}>
        {children}
    </FirebaseAuthContext.Provider>
);

test('Home Screen renders correctly', async () => {
    const wrapper = renderer.create(
        <FirebaseAuthProvider>
            <MedicationListScreen navigation={navigationProp} />
        </FirebaseAuthProvider>
    );
    expect(wrapper.toJSON()).toMatchSnapshot();
});