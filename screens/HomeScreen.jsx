import React, { useRef } from 'react';
import { Animated, ScrollView, StyleSheet, Text, View, ImageBackground } from 'react-native';
import { useTheme } from 'react-native-paper';

const DATA = Array.from({ length: 10 }, (_, i) => ({ id: i + 1 }));

const Header_Max_Height = 120;
const Header_Min_Height = 60;
const Scroll_Distance = Header_Max_Height - Header_Min_Height;

const DynamicHeader = ({ value }) => {
  const theme = useTheme();

  const animatedHeaderHeight = value.interpolate({
    inputRange: [0, Scroll_Distance],
    outputRange: [Header_Max_Height, Header_Min_Height],
    extrapolate: 'clamp',
  });

  const animatedHeaderColor = value.interpolate({
    inputRange: [0, Scroll_Distance],
    outputRange: ['rgba(0,0,0,0)', theme.colors.primary], 
    extrapolate: 'clamp',
  });

  const animatedTitleColor = value.interpolate({
    inputRange: [0, Scroll_Distance],
    outputRange: ['black', 'white'], 
    extrapolate: 'clamp',
  });

  return (
    <Animated.View style={[styles.header, { height: animatedHeaderHeight }]}>
      <ImageBackground source={require('../assets/bg.jpg')} style={styles.imageBackground} resizeMode="cover">
        <Animated.View style={[styles.overlay, { backgroundColor: animatedHeaderColor }]} />
        <Animated.Text style={[styles.title, { fontFamily: theme.fonts.bold.fontFamily, color: animatedTitleColor }]}>
          Home
        </Animated.Text>
      </ImageBackground>
    </Animated.View>
  );
};

const HomeScreen = () => {
  const theme = useTheme();
  const scrollOffsetY = useRef(new Animated.Value(0)).current;

  return (
    <View style={styles.container}>
      <DynamicHeader value={scrollOffsetY} />
      <ScrollView
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollOffsetY } } }],
          { useNativeDriver: false }
        )}
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
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  header: {
    width: '100%',
    overflow: 'hidden',
  },
  imageBackground: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  title: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
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
