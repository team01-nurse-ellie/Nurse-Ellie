import React, { useState } from 'react';
import { Button, Text, View } from 'react-native';
import { Formik } from 'formik';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';

export default function Example() {
  return (
    <Formik initialValues={{ myDate: moment().format('YYYY-MM-DD') }} onSubmit={values => console.log(values)}>
      {({ handleSubmit, values, setFieldValue }) => (
        <DateSelect values={values} setFieldValue={setFieldValue} handleSubmit={handleSubmit} />
      )}
    </Formik>
  );
}

export const DateSelect = props => {
  const { handleSubmit, values, setFieldValue } = props;
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [date, setDate] = useState(new Date(1598051730000));

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = date => {
    setFieldValue('myDate', moment(date).format('YYYY-MM-DD'))
    setDate(date);

    hideDatePicker();
  };

  return (
    <View>
      <Text onPress={showDatePicker}>{moment(values.myDate).format('YYYY-MM-DD')}</Text>
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
        date={moment(values.myDate).toDate()}
      />
    </View>
  );
}