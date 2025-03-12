import React, { useRef } from 'react';
import { Animated, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import { DynamicHeader } from '../components/DynamicHeader';

const DATA = Array.from({ length: 10 }, (_, i) => ({ id: i + 1 }));

const HomeScreen = () => {
  const theme = useTheme();
  const scrollOffsetY = useRef(new Animated.Value(0)).current;

  return (
    <View style={styles.container}>
      {/* Header */}
      <DynamicHeader value={scrollOffsetY} title={"Home"} />

      {/* ScrollView with Rounded Corners */}
      <View style={styles.scrollViewWrapper}>
        <ScrollView
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollOffsetY } } }],
            { useNativeDriver: false }
          )}
          contentContainerStyle={styles.scrollViewContent}
        >
          {DATA.map(val => (
            <View key={val.id} style={[styles.card, { backgroundColor: theme.colors.lightWhite }]}>
              <Text style={[styles.subtitle, { color: theme.colors.primary, fontFamily: theme.fonts.medium.fontFamily }]}>
                ({val.id})
              </Text>
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollViewWrapper: {
    flex: 1,
    marginTop: -10, 
    borderTopLeftRadius: 20, 
    borderTopRightRadius: 20,
    overflow: 'hidden', 
    backgroundColor: '#fff', 
  },
  scrollViewContent: {
    paddingTop: 20, 
    paddingBottom: 20, 
  },
  card: {
    height: 100,
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  subtitle: {
    fontWeight: 'bold',
  },
});