import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Actions } from 'react-native-router-flux';
import {
  statusBarMargin
} from '../../Helpers.js';
import { BackButton } from './BackButton';

import { strings } from '../../Helpers.js';

const searchIcon = require('../../../assets/magnifying_glass.png');

const Header = ({
  title = 'Title',
  hasSearchButton,
  hasBackButton=true,
  color='black',
  onBackButtonPress,
  backButtonType,

  leftButtonText,
  onLeftButtonPress
}) => {

  let leftButton = null;
  if (hasSearchButton) {
    leftButton = (
      <TouchableOpacity
        style={styles.leftButtonImageContainer}
        onPress={() => Actions.search()}
      >
        <Image
            source={searchIcon}
            style={[styles.leftButtonImage, { tintColor: color }]}
        />
        <Text style={[styles.leftButtonImageText, { color }]}>
          {strings('Header.searchButton')}
        </Text>
      </TouchableOpacity>
    );
  } else if (leftButtonText) {
    leftButton = (
      <TouchableOpacity
        style={styles.leftButtonContainer}
        onPress={() => onLeftButtonPress()}
      >
        <Text style={[styles.leftButtonText, { color }]}>
          {leftButtonText}
        </Text>
      </TouchableOpacity>
    );
  }

  return (
    <View
      style={{
        height: 46 + statusBarMargin,
        paddingTop: statusBarMargin,
        borderBottomWidth: 1,
        justifyContent: 'center',
        borderColor: '#EAEAEA'
      }}
    >
      <Text style={{ fontSize: 22, textAlign: 'center',
      fontFamily: 'BahijJanna', color: 'black' }}>{title}</Text>
      {leftButton}
      {hasBackButton ? (
        <BackButton onPress={onBackButtonPress} color={color} type={backButtonType} />
      ) : null}
    </View>
  );
};

const styles = {
  leftButtonContainer: {
    position: 'absolute',
    top: statusBarMargin + 2,
    paddingLeft: 10,
    width: 100,
    height: 39,
    justifyContent: 'center'
  },
  leftButtonImageContainer: {
    position: 'absolute',
    top: statusBarMargin + 2,
    left: 10,
    width: 40,
    height: 39,
    justifyContent: 'center',
    alignItems: 'center'
  },
  leftButtonImage: {
    width: 20,
    height: 20
  },
  leftButtonImageText: {
    fontSize: 11,
    fontFamily: 'BahijJanna-Bold'
  },
  leftButtonText: {
    fontSize: 16,
    fontFamily: 'BahijJanna-Bold'
  }
};


export { Header };
