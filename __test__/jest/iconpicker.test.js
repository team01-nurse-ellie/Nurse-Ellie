import React from 'react';
import Enzyme, {shallow} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import IconPicker from '../../components/IconPicker';
import MedIconIndex from '../../components/MedicationImages';

Enzyme.configure({ adapter: new Adapter() });

let wrapper, instance;
const defaultProps = {value:0};

const renderIconPicker = (props = defaultProps) => {
    wrapper = shallow(<IconPicker {...props} />);
    instance = wrapper.instance();
}

describe('IconPicker', () => {

    beforeEach(()=>{
        renderIconPicker();
    });
    it('should be set to index of 1 by default', () => {
        expect(instance.onModalOpen()).toBe(1);
        instance.onModalOpen()
    });

});