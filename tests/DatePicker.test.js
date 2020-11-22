import React from 'react';
import renderer from 'react-test-renderer';
import Enzyme, {shallow} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import DatePicker from '../components/DatePicker';

Enzyme.configure({ adapter: new Adapter() });

let wrapper, instance;
const defaultProps = {
    selected: 0, 
    placeholder: 'Start Date'
};

const renderDatePicker = (props = defaultProps) => {
    wrapper = shallow(<DatePicker {...props} />);
    instance = wrapper.instance();
}

describe('DatePicker', () => {
    beforeEach(()=>{
        renderDatePicker();
    });
    it('should print a default text of "Start Date"', () => {
        wrapper = renderer.create(<DatePicker {...defaultProps} />);
        expect(wrapper.toJSON()).toMatchSnapshot();
    });
    it('should print "November 21st, 2020"', () => {
        const selected = new Date(1605997087853).toISOString();
        wrapper = renderer.create(<DatePicker {...defaultProps} selected={selected} />);
        expect(wrapper.toJSON()).toMatchSnapshot();
    });
});