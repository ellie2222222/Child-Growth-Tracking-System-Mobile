import React from 'react';
import { View, Text, Button, ScrollView } from 'react-native';
import { Card } from 'react-native-paper';

const ChildScreen = () => {
  return (
    <ScrollView style={{ padding: 16 }}>
      {/* Welcome & User Info */}
      <Card style={{ padding: 16, marginBottom: 10 }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Welcome, John!</Text>
        <Text>Tracking growth for: Emma (2 years old)</Text>
      </Card>

      {/* Growth Overview */}
      <Card style={{ padding: 16, marginBottom: 10 }}>
        <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Recent Growth</Text>
        <Text>Height: 85 cm (Last updated: 2 weeks ago)</Text>
        <Text>Weight: 12.5 kg</Text>
      </Card>

      {/* Reminders */}
      <Card style={{ padding: 16, marginBottom: 10 }}>
        <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Upcoming</Text>
        <Text>📅 Doctor Visit - Oct 15</Text>
        <Text>💉 Vaccine Due - Oct 20</Text>
      </Card>

      {/* Quick Actions */}
      <Button title="➕ Add Growth Data" onPress={() => {}} />
      <Button title="📊 View Growth Charts" onPress={() => {}} />
    </ScrollView>
  );
};

export default ChildScreen;
