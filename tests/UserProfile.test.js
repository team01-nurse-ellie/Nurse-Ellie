import 'react-native';
import React from 'react';
import UserProfileScreen from '../screens/UserProfileScreen';

import renderer from 'react-test-renderer';

it('renders correctly', () => {
  const tree = renderer.create(
    <UserProfileScreen />
    ).toJSON();
  expect(tree).toMatchSnapshot();
});