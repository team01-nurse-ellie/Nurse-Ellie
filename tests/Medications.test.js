import React from 'react';
import renderer from 'react-test-renderer';

import { FirebaseAuthContext } from '../components/Firebase/FirebaseAuthContext';
import MedicationListScreen from '../screens/MedicationListScreen';
import MedicationDetailScreen from '../screens/MedicationDetailScreen';
import MedicationSummaryScreen from '../screens/MedicationSummaryScreen';
import AddMedicationScreen from '../screens/MedicationSummaryScreen';

const navigationProp = {
    navigate: jest.fn(),
    openDrawer: jest.fn(),
};
const routeProp = {
    params: {
        item: {},
    },
};

export const FirebaseAuthProvider = ({ children }) => (
    <FirebaseAuthContext.Provider value={{ currentUser: { uid: 'test' } }}>
        {children}
    </FirebaseAuthContext.Provider>
);

test('Medication List Screen renders correctly', async () => {
    const wrapper = renderer.create(
        <FirebaseAuthProvider>
            <MedicationListScreen navigation={navigationProp} />
        </FirebaseAuthProvider>
    );
    expect(wrapper.toJSON()).toMatchSnapshot();
});

test('Medication Detail Screen renders correctly', ()=>{
    const wrapper = renderer.create(<MedicationDetailScreen navigation={navigationProp} route={routeProp} />);
    expect(wrapper.toJSON()).toMatchSnapshot();
});

test('Medication Summary Screen render correctly', ()=>{
    const wrapper = renderer.create(<MedicationSummaryScreen />);
    expect(wrapper.toJSON()).toMatchSnapshot();
});

test('Medication Add Screen renders correctly', ()=>{
    const wrapper = renderer.create(<MedicationSummaryScreen />);
    expect(wrapper.toJSON()).toMatchSnapshot();
});