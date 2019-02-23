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
  RTLImage,
  AyezText
} from '../../_common';

import {
  strings,
  translate
} from '../../../i18n.js';
import {
  loadSupportManual
} from '../../../actions';

import images from '../../../theme/images'

class Support extends Component {

  constructor(props) {
    super(props);
  }
  componentDidMount() {

    this.props.loadSupportManual();
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
          }}>{strings('Support.contact3ayez')}</AyezText>
          <AyezText medium style={{
            fontSize: 22
          }}>{strings('Support.chatWithUs')}</AyezText>
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
            }}>{strings('Support.start')}</AyezText>
            <RTLImage
              source={images.supportStartSideArrow}
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
          source={images.supportTile}
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
        top: 7,
        right: 10,
        padding: 10,
        alignItems: 'center'
      }}
      onPress={() => Actions.settings()}
    >
      <RTLImage
        source={images.supportSilhouetteIcon}
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
        }}>{strings('Support.settings')}</AyezText>
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
              color: '#696A6C',
              marginLeft: 20,
              marginTop: 16,
              marginBottom: 16,
              marginRight: 20
            }}>{translate(item.title)}</AyezText>

            <RTLImage
              source={images.supportIssueSideArrow}
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
      }}>

        <AyezText bold style={{
          marginLeft: 4,
          fontSize: 32,
          padding: 16,
          alignSelf: 'flex-start'
        }}>{strings('Support.header')}</AyezText>


        <FlatList
          data={this.props.manual}
          renderItem={this.renderItem.bind(this)}
          style={{ flex: 1 }}
          removeClippedSubviews
          ListHeaderComponent={this.renderChatTile()}
          ListFooterComponent={null}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item, index) => `${index}`}
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

const mapStateToProps = ({ SupportManual }) => {
  const { manual } = SupportManual;
  return {
    manual
  };
};

export default connect(mapStateToProps, {
  loadSupportManual
})(Support);
