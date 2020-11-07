import React from 'react';
import renderer from 'react-test-renderer';

import Background from '../components/background';
import BackgroundHP from '../components/backgroundHP';
import SplashScreen from '../screens/SplashScreen';
import SignInScreen from '../screens/SignInScreen';
import SignUpScreen from '../screens/SignUpScreen';

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
    expect(wrapper).toMatchSnapshot();
});

test('Sign In Screen renders correctly', ()=>{
    const wrapper = renderer.create(<SignInScreen/>);
    expect(wrapper).toMatchSnapshot();
});

test('Sign Up Screen renders correctly', ()=>{
    const wrapper = renderer.create(<SignUpScreen/>);
    expect(wrapper).toMatchSnapshot();
})
