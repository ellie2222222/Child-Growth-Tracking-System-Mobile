import React from 'react';
import { Text } from 'react-native-paper';

const Title = ({ text, style }) => {
  return (
    <Text 
      variant="medium" 
      style={[{ textAlign: 'center', marginVertical: 10 }, style]}
    >
      {text}
    </Text>
  );
};

export default Title;
