import React, { Component } from 'react';
import {
  View,
  Text,
   Image,
   ActivityIndicator,
   TouchableOpacity,
   SectionList,
   Platform,
   BackHandler,
   AsyncStorage
 } from 'react-native';

import { IndicatorViewPager, PagerDotIndicator } from 'rn-viewpager';

import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import {
  Header,
  BlockButton,
  BackButton
} from '../../_common';
import {
} from '../../../actions';

class TutorialSwipe extends Component {

  constructor(props) {
    super(props);
  }

  renderDotIndicator() {
    return (
      <PagerDotIndicator
        pageCount={3}
        dotStyle={{
          marginLeft: 10,
          marginRight: 10,
          height: 4,
          width: 4,
          backgroundColor: '#BBBBBB'
        }}
        selectedDotStyle={{
          marginLeft: 10,
          marginRight: 10,
          height: 10,
          width: 10,
          borderRadius: 5,
          backgroundColor: '#2DD38F'
        }}
      />
    );
  }

  render() {
    return (
      <View style={{
        flex: 1,
        backgroundColor: '#FAFCFD'
      }}>

        <IndicatorViewPager
            style={{ flex: 1 }}
            indicator={this.renderDotIndicator()}
          >
          <View style={{ backgroundColor: 'transparent', flex: 1 }}>
            <Text>Hello Swiper</Text>
          </View>
          <View style={{ backgroundColor: 'transparent', flex: 1}}>
            <Text >Beautiful</Text>
          </View>
          <View style={{ backgroundColor: 'transparent', flex: 1}}>
            <Text>And simple</Text>
          </View>
        </IndicatorViewPager>

        <BlockButton
          text={'REGISTER AS A CUSTOMER'}
          style={{
            marginTop: 10,
            marginBottom: 10,
            marginLeft: 18,
            marginRight: 18,
            alignSelf: 'stretch'
          }}
          onPress={() => Actions.auth()}
        />

        <TouchableOpacity
            style={{
              paddingTop: 12,
              paddingBottom: 16
            }}
            onPress={() => Actions.addressCreate()}
          >
          <Text style={{
            fontFamily: 'Poppins-Bold',
            fontSize: 14,
            textAlign: 'center'
          }}>
            CONTINUE AS GUEST
          </Text>
         </TouchableOpacity>
         <BackButton fixed />
      </View>
    );
  }
}

const mapStateToProps = ({ }) => {
  return {};
};

export default connect(mapStateToProps, {
})(TutorialSwipe);
