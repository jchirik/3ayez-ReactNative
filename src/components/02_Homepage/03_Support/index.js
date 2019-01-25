import React, { Component } from 'react';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';

import {
  View,
  FlatList,
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

import {
  RTLImage,
  AyezText
} from '../../_common';

// import {
// } from '../../../actions';

const support_tile = require('../../../../assets/images_v2/Support/support_tile.png');
const start_side_arrow = require('../../../../assets/images_v2/Support/start_side_arrow.png');
const silhouette_icon = require('../../../../assets/images_v2/Support/silhouette_icon.png');
const issue_side_arrow = require('../../../../assets/images_v2/Support/issue_side_arrow.png');

const supportDictionary = [
  {
    title: {
      en: 'My order didnt deliver',
      ar: 'My order didnt deliver'
    },
    description: {
      en: 'Lorem ipsum dolores',
      ar: 'Lorem ipsum dolores'
    }
  },
  {
    title: {
      en: 'How do I resend back some items that came by mistake to me?',
      ar: 'How do I resend back some items that came by mistake to me?'
    },
    description: {
      en: 'Lorem ipsum dolores',
      ar: 'Lorem ipsum dolores'
    }
  }
];

class Support extends Component {

  constructor(props) {
    super(props);
  }
  componentDidMount() {
    console.log('Support mounted')
  }


  renderChatTile() {
    return (
      <TouchableOpacity
        style={styles.tileStyle}
        onPress={() => Actions.supportChat()}
        >

        <View style={{
          flex: 1,
          alignSelf: 'stretch',
          alignItems: 'flex-start',
          paddingTop: 18,
          paddingBottom: 10,
          paddingLeft: 13
        }}>
          <AyezText semibold style={{
            color: '#2DD38F',
            fontSize: 11
          }}>CONTACT 3AYEZ</AyezText>
          <AyezText medium style={{
            color: 'black',
            fontSize: 22
          }}>Chat with us</AyezText>
          <View style={{ flex: 1 }} />

          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#2DD38F',
            paddingTop: 4,
            paddingBottom: 4,
            paddingLeft: 20,
            paddingRight: 16,
            borderRadius: 8
          }}>
            <AyezText semibold style={{
              color: 'white',
              fontSize: 10
            }}>START</AyezText>
            <RTLImage
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

        <RTLImage
          source={support_tile}
          style={{
            width: 160,
            height: 120
           }}
          resizeMode={'contain'}
          />
      </TouchableOpacity>
    )
  }

  renderSettingsButton() {
    return (
      <TouchableOpacity
      style={{
        position: 'absolute',
        top: STATUS_BAR_HEIGHT+7,
        right: 10,
        padding: 10,
        alignItems: 'center'
      }}
      onPress={() => Actions.settings()}
    >
      <RTLImage
        source={silhouette_icon}
        style={{
          width: 30,
          height: 30,
          tintColor: '#0094ff'
         }}
        resizeMode={'contain'}
        />
        <AyezText semibold style={{
          color: '#0094ff',
          fontSize: 10
        }}>SETTINGS</AyezText>
    </TouchableOpacity>
  )
  }


  renderItem({ item, index }) {
      return (
        <TouchableOpacity
          style={styles.tileStyle}
          onPress={() => Actions.supportDetail({ data: item })}
        >
            <AyezText semibold style={{
              flex: 1,
              fontSize: 14,
              color: '#696A6C',
              marginLeft: 20,
              marginTop: 16,
              marginBottom: 16,
              marginRight: 20
            }}>{item.title.en}</AyezText>

            <RTLImage
              source={issue_side_arrow}
              style={{
                width: 10,
                height: 10,
                marginRight: 20,
                tintColor: '#696A6C'
               }}
              resizeMode={'contain'}
              />
        </TouchableOpacity>
      );
  }

  render() {
    return (
      <View style={{
        flex: 1,
        backgroundColor:'#FAFCFD'
      }}>

        <AyezText bold style={{
          marginTop: STATUS_BAR_HEIGHT,
          marginLeft: 4,
          fontSize: 32,
          padding: 16,
          alignSelf: 'flex-start'
        }}>Support</AyezText>


        <FlatList
          data={supportDictionary}
          renderItem={this.renderItem.bind(this)}
          style={{ flex: 1 }}
          removeClippedSubviews
          ListHeaderComponent={this.renderChatTile()}
          ListFooterComponent={null}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item, index) => index}
        />



        { this.renderSettingsButton() }
      </View>
    );
  }
}

const styles = {
  tileStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 8,
    marginTop: 5,
    marginBottom: 5,
    marginLeft: 16,
    marginRight: 16,

    shadowColor: '#000',
    shadowOffset: { width: -1, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  }
};

// const mapStateToProps = ({ }) => {
//   return {
//   };
// };

export default connect(null, null)(Support);
