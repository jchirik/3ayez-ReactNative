import React, { Component } from 'react';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';

import {
  View,
  FlatList,
  Text,
  Platform,
  Animated,
  Easing,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  BackHandler
} from 'react-native';

import {
  STATUS_BAR_HEIGHT
} from '../../../Helpers.js';

// import {
// } from '../../../actions';

const support_tile = require('../../../../assets/images_v2/Support/support_tile.png');
const start_side_arrow = require('../../../../assets/images_v2/Support/start_side_arrow.png');


class Support extends Component {

  constructor(props) {
    super(props);
  }
  componentDidMount() {
    console.log('Support mounted')
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor:'white'}}>

        <Text style={{
          marginTop: STATUS_BAR_HEIGHT,
          marginLeft: 4,
          fontFamily: 'Poppins-Bold',
          fontSize: 32,
          padding: 16,
        }}>Support</Text>



        <TouchableOpacity
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: 'white',
            borderRadius: 8,
            marginTop: 10,
            marginBottom: 10,
            marginLeft: 16,
            marginRight: 16,

            shadowColor: '#000',
            shadowOffset: { width: -1, height: 3 },
            shadowOpacity: 0.15,
            shadowRadius: 4,
            elevation: 2,
          }}
          onPress={() => console.log('j')}
          >

          <View style={{
            flex: 1,
            alignSelf: 'stretch',
            paddingTop: 18,
            paddingBottom: 10,
            paddingLeft: 13
          }}>
            <Text style={{
              color: '#2DD38F',
              fontFamily: 'Poppins-SemiBold',
              fontSize: 11
            }}>CONTACT 3AYEZ</Text>
            <Text style={{
              color: 'black',
              fontFamily: 'Poppins-Medium',
              fontSize: 22
            }}>Chat with us</Text>
            <View style={{ flex: 1 }} />

            <View style={{
              alignSelf: 'flex-start',
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: '#2DD38F',
              paddingTop: 4,
              paddingBottom: 4,
              paddingLeft: 20,
              paddingRight: 16,
              borderRadius: 8
            }}>
              <Text style={{
                color: 'white',
                fontFamily: 'Poppins-SemiBold',
                fontSize: 10
              }}>START</Text>
              <Image
                source={start_side_arrow}
                style={{
                  width: 10,
                  height: 10,
                  marginLeft: 12,
                  tintColor: 'white'
                 }}
                resizeMode={'contain'}
                />
            </View>

          </View>

          <Image
            source={support_tile}
            style={{
              width: 160,
              height: 120
             }}
            resizeMode={'contain'}
            />
        </TouchableOpacity>



        <TouchableOpacity
          onPress={() => Actions.settings()}
        >
          <Text>Settings</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

// const mapStateToProps = ({ }) => {
//   return {
//   };
// };

export default connect(null, null)(Support);
