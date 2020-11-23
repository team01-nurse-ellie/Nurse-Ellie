import React from 'react';
import renderer from 'react-test-renderer';
import { renderHook } from '@testing-library/react-hooks'

import { FirebaseAuthContext } from '../components/Firebase/FirebaseAuthContext';
import MedicationListScreen from '../screens/MedicationListScreen';
import MedicationDetailScreen from '../screens/MedicationDetailScreen';
import MedicationSummaryScreen from '../screens/MedicationSummaryScreen';
import AddMedicationScreen from '../screens/AddMedicationScreen';
import EditMedicationScreen from '../screens/EditMedicationScreen';
import { firebase } from '../components/Firebase/config';

const navigationProp = {
    navigate: jest.fn(),
    openDrawer: jest.fn(),
};
const routeProp = {
    params: {
        item: {
            medication: {
                adverseEvents: ['nausea','constipation'],
                directions: 'Take with or without food',
                doseForm: 'Oral pill',
                information: 'Cymbalta is indicated for',
                intakeTime: 62160,
                medIcon: '1',
                nameDisplay: 'Cymbalta',
                strength: '1 mg',
            }
        },
    },
};

jest.mock("../components/TimePicker", () => {
    return {
        __esModule: true,
        default: () => {
          return <div></div>;
        },
      };
});

jest.mock("../utils/medication", () => {
    return {
        //__esModule: true,
        getAllByConcepts: () => {
          return [];
        },
      };
});

jest.mock("react-native-gesture-handler", () => {
    return {
        __esModule: true,
        ScrollView: () => {
          return <div></div>;
        },
      };
});


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

test('Medication List Screen renders correctly', async () => {
    const wrapper = renderer.create(
        <FirebaseAuthProvider>
            <MedicationListScreen navigation={navigationProp} />
        </FirebaseAuthProvider>
    );
    expect(wrapper.toJSON()).toMatchSnapshot();
});

test('Medication Summary Screen render correctly', ()=>{
    const wrapper = renderer.create(<MedicationSummaryScreen />);
    expect(wrapper.toJSON()).toMatchSnapshot();
});
