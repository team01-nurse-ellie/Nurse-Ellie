import React from 'react';
import renderer from 'react-test-renderer';

import Background from '../components/background';
import BackgroundHP from '../components/backgroundHP';
import SplashScreen from '../screens/SplashScreen';

test('Patient background component renders correctly', ()=>{
    const wrapper = renderer.create(<Background/>).toJSON();
    expect(wrapper).toMatchSnapshot();
});

test('Health Professional background component renders correctly', ()=>{
    const wrapper = renderer.create(<BackgroundHP/>).toJSON();
    expect(wrapper).toMatchSnapshot();
});

test('Splash Screen renders correctly', ()=>{
    const wrapper = renderer.create(<SplashScreen/>);
});
