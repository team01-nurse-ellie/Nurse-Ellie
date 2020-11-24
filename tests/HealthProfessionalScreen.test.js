import React from 'react';
import renderer from 'react-test-renderer';
import HealthProfessionalScreen from '../screens/HealthProfessionalScreen';


test('HealthProfessionalScreen renders correctly', ()=>{
    const wrapper = renderer.create(<HealthProfessionalScreen/>);
    expect(wrapper.toJSON()).toMatchSnapshot();
});

