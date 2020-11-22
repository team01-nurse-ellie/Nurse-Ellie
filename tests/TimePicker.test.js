import React from 'react';
import Enzyme, {shallow} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import TimePicker from '../components/TimePicker';

Enzyme.configure({ adapter: new Adapter() });

jest.mock('react-native-wheel-scroll-picker', () => "ScrollPicker");

let wrapper, instance, onSelectValue;
const defaultProps = {
    value: 0,
    onSelect: value => {
        onSelectValue = value;
    },
};

const renderTimePicker = (props = defaultProps) => {
    wrapper = shallow(<TimePicker {...props} />);
    instance = wrapper.instance();
}

describe('TimePicker', () => {

    beforeEach(()=>{
        renderTimePicker();
    });
    it('should properly update time from hour picker', () => {
        renderTimePicker({ ...defaultProps, value: 3600 })
        instance.calculateTimeFromHourPicker('1');
        expect(onSelectValue).toBe(3600);
    });
    it('should properly update time from minute picker', () => {
        instance.calculateTimeFromMinutePicker('25');
        expect(onSelectValue).toBe(1500);
    });
    it('should properly update time from am/pm picker', () => {
        renderTimePicker({ ...defaultProps, value: 3600 });
        instance.calculateTimeFromAMPMPicker('AM');
        expect(onSelectValue).toBe(3600);
        instance.calculateTimeFromAMPMPicker('PM');
        expect(onSelectValue).toBe(46800);
    });
    it('should properly display time from seconds', () => {
        renderTimePicker({ ...defaultProps, value: 3600 });
        instance.getValueFormatted()
        expect(instance.getValueFormatted()).toBe('1:00 AM');
    });
});