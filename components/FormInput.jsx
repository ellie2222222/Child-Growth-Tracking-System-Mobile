import React from 'react';
import { TextInput } from 'react-native-paper';

const FormInput = ({ label, value, onChangeText, secureTextEntry }) => {
  return (
    <TextInput
      label={label}
      value={value}
      onChangeText={onChangeText}
      secureTextEntry={secureTextEntry}
      mode="outlined"
      style={{ marginVertical: 10 }}
    />
  );
};

export default FormInput;
