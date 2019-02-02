import React from 'react';
// import { BlurView } from 'react-native-blur';
import { Modal, View } from 'react-native';
const FilterModal = ({ isVisible, bluredViewRef, view }) => (
  <Modal visible={isVisible} transparent={true}>
    {/*
      bluredViewRef && (
      <BlurView
        viewRef={bluredViewRef}
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          right: 0
        }}
        blurRadius={4}
        blurAmount={10}
        blurType={'dark'}
      />
    ) */}
    {view}
  </Modal>
);

export { FilterModal };
