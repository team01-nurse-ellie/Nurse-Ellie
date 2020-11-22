import React from 'react';
import Enzyme, {shallow} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import TimePicker from '../components/TimePicker';

Enzyme.configure({ adapter: new Adapter() });

jest.mock('react-native-wheel-scroll-picker', () => "ScrollPicker");

let wrapper, instance;
const defaultProps = {value:0};

const renderTimePicker = (props = defaultProps) => {
    wrapper = shallow(<TimePicker {...props} />);
    instance = wrapper.instance();
}

describe('TimePicker', () => {

    beforeEach(()=>{
        renderTimePicker();
    });
    it('should properly update time from hour picker', () => {
        expect(wrapper.state('value')).toBe(0);
        instance.calculateTimeFromHourPicker('1');
        expect(wrapper.state('value')).toBe(3600);
    });
    it('should properly update time from minute picker', () => {
        expect(wrapper.state('value')).toBe(0);
        instance.calculateTimeFromMinutePicker('25');
        expect(wrapper.state('value')).toBe(1500);
    });
    it('should properly update time from am/pm picker', () => {
        renderTimePicker({value:3600});
        instance.calculateTimeFromAMPMPicker('AM');
        expect(wrapper.state('value')).toBe(3600);
        instance.calculateTimeFromAMPMPicker('PM');
        expect(wrapper.state('value')).toBe(46800);
    });
    it('should properly display time from seconds', () => {
        renderTimePicker({value:3600});
        instance.getValueFormatted()
        expect(instance.getValueFormatted()).toBe('1:00 AM');
    });
});