import React from 'react';
import renderer from 'react-test-renderer';
import UserProfileScreen from '../screens/UserProfileScreen';
import EditUserProfileScreen from '../screens/EditUserProfileScreen';


test('UserProfileScreen renders correctly', ()=>{
    const wrapper = renderer.create(<UserProfileScreen/>);
    expect(wrapper.toJSON()).toMatchSnapshot();
});

test('EditUserProfileScreen renders correctly', ()=>{
    const wrapper = renderer.create(<EditUserProfileScreen/>);
    expect(wrapper.toJSON()).toMatchSnapshot();
});



