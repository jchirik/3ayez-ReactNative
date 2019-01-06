import React from 'react';
import { View, ActivityIndicator } from 'react-native';

const LoadingOverlay = ({
  isVisible,
  opacity = 0.6
}) => {
  if (!isVisible) { return null; }
  return (
    <View style={{
      position: 'absolute',
      top: 0,
      bottom: 0,
      right: 0,
      left: 0,
      backgroundColor: `rgba(255, 255, 255, ${opacity})`
    }}>
      <ActivityIndicator size="small" style={{ flex: 1 }} />
    </View>
  )
};

export { LoadingOverlay };
