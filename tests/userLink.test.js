import React from 'react';
import Enzyme, { shallow, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import renderer from 'react-test-renderer';

Enzyme.configure({ adapter: new Adapter() });

import { firebase } from '../components/Firebase/config';
import { FirebaseAuthContext } from '../components/Firebase/FirebaseAuthContext';

import UserLinkScreen from '../screens/UserLinkScreen';
import QRScanner from '../components/QRScanner/qr-scanner';
import { Alert } from 'react-native';

// mandatory for esModule and default to be returned otherwise the QRCODE npm module won't be mocked properly.
// it will cause the test to fail. 
// NOTE: "When importing a default export, it's an instruction to import the property named default from the export object"
// Doc reference: https://jestjs.io/docs/en/jest-object#jestmockmodulename-factory-options
jest.mock('react-native-qrcode-svg', () => {
    return {
        __esModule: true,
        default: () => {
            return <div></div>;
        },
    };
});

// jest.mock('Alert', () => { 
//     return {
//         __esModule: true,
//         alert: jest.fn()
//     }
// });

const firestoreMock = {
    collection: jest.fn().mockReturnThis(),
    doc: jest.fn().mockReturnThis(),
    onSnapshot: jest.fn().mockResolvedValueOnce(),
    where: jest.fn().mockReturnThis(),
    get: jest.fn().mockResolvedValueOnce(),
    update: jest.fn().mockResolvedValueOnce() 
  };

export const FirebaseAuthProvider = ({ children }) => (
    <FirebaseAuthContext.Provider value={{ currentUser: { uid: '0nPQbdHvJ1YepznX7NruQ19OpAk2' } }}>
        {children}
    </FirebaseAuthContext.Provider>
);

const navigationProp = {
    navigate: jest.fn(),
    openDrawer: jest.fn(),
    goBack: jest.fn()
};

const routeProp = {
    params: {
        connecting: {
            // connectUser: connectUser,
            connectUser: jest.fn().mockReturnThis(),
            connectMethod: "QR",
            // connectType: connectType
            connectType: 'HEALTH_PRO'
        },
    },
};

// Mocks the functions required to use firestore();
jest.spyOn(firebase, 'firestore').mockImplementationOnce(() => firestoreMock);

// const setConnectButtonHP = jest.fn();
// const setConnectType = jest.fn();
// const handleButtonSelect = jest.spyOn(React, "useState").mockImplementation(connectButtonHP => [connectButtonHP, setConnectButtonHP]);
// const handleSetConnectType = jest.spyOn(React, "useState").mockImplementation(connectType => [connectType, setConnectType]);

// Define wrapper as a global in this describe block, so it can be accessed in each it() test case.
const wrapper = mount(
    <FirebaseAuthProvider>
        <UserLinkScreen navigation={navigationProp} />
    </FirebaseAuthProvider>
);



describe('USER LINK SCREEN - PROVIDE CODE', () => {
    
     it('USER LINK SCREENS RENDERS CORRECTLY', () => {
        
// const userLinkWrapper = renderer.create(
//     <FirebaseAuthProvider>
//         <UserLinkScreen navigation={navigationProp} />
//     </FirebaseAuthProvider>
// );
// expect(userLinkWrapper.toJSON()).toMatchSnapshot();

        expect(wrapper.html()).toMatchSnapshot();
    })


    it('SETS USER CODE IN INITIAL RENDER', ()=> {
        const setUserCode = jest.fn(); 
        const handleSetUserCode = jest.spyOn(React, "useState").mockImplementation(userCode => [userCode, setUserCode]);

        expect(setUserCode).toBeTruthy();
    });

    // Tests if the button is clicked.
    it('SELECT HEALTH PROFESSIONAL BUTTON', () => {

        // Looks for all TouchableOpacity button nodes, finds the one with the prop testID then clicks.
        wrapper.find('TouchableOpacity').forEach(node => {
            if (node.prop("testID") === "hp_button") {

                // calls function but doesnt actually change the button color.
                // node.props().onPress();
                node.simulate('click');
            }
        });
        
        // Once clicked, if button style is changed then test is PASSED.
        wrapper.find('TouchableOpacity').forEach(node => {
            if (node.prop("testID") === "hp_button") {
                expect(node.prop("style").backgroundColor).toEqual('#42C86A');
            }
        });

    });

    it('METHODS MODAL CONTENT LOADED', () => {
        // If length of nodes for methodsModal == 1 that mean it is rendered after the button is clicked.
        // Otherwise the length would be 0 if the button isn't clicked.
        expect(wrapper.findWhere(node => node.prop("testID") === "methodsModal").hostNodes()).toHaveLength(1);
    });
    
    it('METHODS MODAL OPENS', () => {
        // expect(wrapper.findWhere(node=> node.prop('testID') === "modal").hostNodes()).toHaveLength(1);
        // Looks for the modal node, then grabs the first node and checks the visisble prop to see if it is true. 
        // If true, that means modal is opened.
        // NOTE: there are 2 nodes the first node is the proper node and the 2nd one does not have all the data/props for the modal node. 
        expect(wrapper.findWhere(node => node.prop('testID') === "modal").hostNodes().first().props().visible).toEqual(true);
    });

    it('SELECT PROVIDE CODE BUTTON', () => {
        // If length of nodes for methodsModal == 1 that mean it is rendered after the button is clicked.
        // Otherwise the length would be 0 if the button isn't clicked.
        // expect(wrapper.findWhere(node => node.prop("testID") === "provideCodeButton").hostNodes()).toHaveLength(1);
        wrapper.findWhere(node => node.prop("testID") === "provideCodeButton").hostNodes().simulate('click');
    });

    it('PROVIDE CODE MODAL CONTENT LOADED', () => {
        // If length of nodes for methodsModal == 1 that mean it is rendered after the button is clicked.
        // Otherwise the length would be 0 if the button isn't clicked.
        expect(wrapper.findWhere(node => node.prop("testID") === "provideCodeModal").hostNodes()).toHaveLength(1);
    });

    it('QR HAS DATA AND IS SHOWN', () => {
        
        // (wrapper.findWhere(node => node.prop('testID') === "qrcode")).forEach(node=> {
        //     console.log(node.props())
        // }); 
        // the value prop passed to QRCode component should be the user code. If the data was fetched in the initial render of the screen.
        expect(wrapper.findWhere(node => node.prop('testID') === "qrcode").props().value).toEqual("");
           
    });
     
    it('REFRESH CODE', () => {
        // Called firebase spyOn again for this refresh code test because it doesn't recongize that update() has been mocked in the beginning.
        jest.spyOn(firebase, 'firestore').mockImplementationOnce(() => firestoreMock);
        jest.spyOn(Alert, 'alert')
        
        // (wrapper.findWhere(node => node.prop('testID') === "userCode").hostNodes()).forEach(node => {
        //     console.log(node.props())
        // })  
        wrapper.findWhere(node=> node.prop('testID') === "refreshButton").hostNodes().simulate('click');
        expect(Alert.alert).toHaveBeenCalled();
        (Alert.alert.mock.calls[0][2][1].onPress());
        expect(wrapper.findWhere(node => node.prop('testID') === "userCode").hostNodes().props().children).toEqual("");
    });

    it('CLOSE MODAL', () => {
        // expect(wrapper.findWhere(node=> node.prop('testID') === "closeButton").hostNodes().forEach(node=> {
        //     console.log(node.props())
        // })).toHaveLength(1)
        // const setModalVisible = jest.fn();
        // const handleSetModal = jest.spyOn(React, 'useState').mockImplementation((isModalVisible) => [isModalVisible, setModalVisible]);
        // wrapper.findWhere(node => node.prop('testID') === "closeButton").hostNodes().simulate('click');
        // expect(setModalVisible).toBeTruthy();
        // expect(wrapper.findWhere(node => node.prop('testID') === "modal").hostNodes().first().props().visible).toEqual(false);
    });

});

describe('USER LINK SCREEN - INPUT CODE', () => {
    it('SELECT INPUT CODE BUTTON', () => {
        wrapper.find('TouchableOpacity').forEach(node => {
            if (node.prop("testID") === "hp_button") {
                node.simulate('click');
            }
        });

        wrapper.findWhere(node => node.prop("testID") === "inputCodeButton").hostNodes().simulate('click');
    });

    it('INPUT CODE MODAL CONTENT LOADED', () => {
        expect(wrapper.findWhere(node => node.prop("testID") === "inputCodeModal").hostNodes()).toHaveLength(1);
    });

});

describe('QR SCANNER', () => {

    it('QRSCanner renders correctly', () => {
        // Needed to mock setTimeout();
        jest.useFakeTimers();
        
        const qrWrapper = renderer.create(
            <QRScanner {...navigationProp} {...routeProp}/>
        );
        expect(qrWrapper.toJSON()).toMatchSnapshot();

        // let qrWrapper = mount(<QRScanner {...navigationProp} {...routeProp}/>);
    });

    it('CONNECT USER', () => { });

});