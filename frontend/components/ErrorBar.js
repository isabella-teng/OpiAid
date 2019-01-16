import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

const ErrorBar = ({ error, style, textStyle }) => !!error && (
  <View style={[styles.container, style]}>
    <ScrollView>
      <Text style={[styles.text, textStyle]}>{error}</Text>
    </ScrollView>
  </View>
);

export default ErrorBar;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    maxHeight: 90,
    backgroundColor: '#ba2d2d',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 4,
    marginBottom: 10,
    marginTop: -10,
  },
  text: {
    color: '#fff',
    fontSize: 16,
  },
});
