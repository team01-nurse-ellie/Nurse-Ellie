import React from 'react';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';

import background from '../../components/background';
import backgroundHP from '../../components/backgroundHP';
import SplashScreen from '../../screens/SplashScreen';

test('Patient background component renders correctly', ()=>{
    const test = renderer.create(<background/>).toJSON();
    expect(test).toMatchSnapshot();
});

test('Health Professional background component renders correctly', ()=>{
    const test = renderer.create(<backgroundHP/>).toJSON();
    expect(test).toMatchSnapshot();
});

//test('Splash Screen renders correctly', ()=>{
    //const snapshot = renderer.create(<SplashScreen/>);
//})