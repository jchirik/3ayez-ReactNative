import React, { Component } from 'react';
import {
  View,
  Image,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  SectionList,
  BackHandler
} from 'react-native';

import { Actions } from 'react-native-router-flux';
// import { Tabs } from 'antd-mobile';
import { connect } from 'react-redux';
import {
  resetCheckout,
  setTimeslot
} from '../../actions';
import {
  Header,
  AyezText
} from '../_common';

import {
  strings,
  translate,
  formatTimestamp,
  formatCurrency
} from '../../i18n.js';
import {
  checkIfOpen
} from '../../Helpers.js';


import images from '../../theme/images'
import { sceneKeys, navigateTo } from '../../router';

class YallaTimeSelect extends Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.resetCheckout();
  }

  onYallaProceed() {
    const { seller } = this.props;

    this.props.setTimeslot({
      type: 'INSTANT',
      delivery_fee: seller.delivery_fee
    });

    if (this.props.address.is_completed) {
      navigateTo(sceneKeys.checkout);
    } else {
      navigateTo(sceneKeys.addressDetails);
    }
  }

  //
  //
  //
  //
  // renderItem({ item, index }) {
  //   const startTime = formatTimestamp(item.start, "h:mm A")
  //   const endTime = formatTimestamp(item.end, "h:mm A")
  //
  //   return (
  //     <TouchableOpacity
  //       style={{
  //         height: 54, backgroundColor: 'white', flexDirection: 'row',
  //         justifyContent: 'space-between', alignItems: 'center',
  //         borderBottomWidth: 1, borderColor: '#f7f7f7'
  //         }}
  //       onPress={this.setTimeslot.bind(this, item)}
  //       disabled={item.invalid}
  //     >
  //       <AyezText regular style={{
  //         marginLeft: 30,
  //         color: (item.invalid ? '#cecece' : 'black'),
  //         textDecorationLine: (item.invalid ? 'line-through' : 'none'),
  //         textDecorationStyle: 'solid'
  //       }} key={index}>{startTime} - {endTime}</AyezText>
  //
  //
  //     </TouchableOpacity>
  //   )
  // }


  render() {
    const { seller } = this.props;
    const isOpen = checkIfOpen(seller.hours);
    return (
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <Header
          title={strings('TimeslotSelect.header')}
          blackStyle
        />

        <TouchableOpacity
          style={{
            opacity: (isOpen ? 1.0 : 0.2),
            flex: 1,
            marginTop: 10,
            marginHorizontal: 10,
            borderRadius: 6,
            backgroundColor: 'white',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 4,
            elevation: 4,
            justifyContent: 'center',
            alignItems: 'center'
          }}
          disabled={!isOpen}
          onPress={() => this.onYallaProceed()}
        >
          <Image source={images.yallaFastIcon} style={{ width: 60, height: 60 }} />
          <AyezText regular size={18}>{strings('Common.yalla')}</AyezText>
          <AyezText regular color={'#8E8E93'}>{strings('StoreSelect.deliveryTime', { delivery_time: seller.delivery_time })}</AyezText>
          <AyezText regular color={'#8E8E93'}>{formatCurrency(seller.delivery_fee)}</AyezText>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            flex: 1,
            marginVertical: 10,
            marginHorizontal: 10,
            borderRadius: 6,
            backgroundColor: 'white',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 4,
            elevation: 4,

            justifyContent: 'center',
            alignItems: 'center'
          }}
          onPress={() => {
            navigateTo(sceneKeys.timeslotSelect)
          }}
        >
          <AyezText regular style={{
          }}>{strings('TimeslotSelect.selectLaterTime')}</AyezText>
        </TouchableOpacity>

      </View>
      );
    }
  }

  const mapStateToProps = ({ Seller, Addresses }) => {
    const { address } = Addresses;
    const seller = Seller;
    return {
      address,
      seller
    };
  };

  export default connect(mapStateToProps,
    {
      resetCheckout,
      setTimeslot
    }
  )(YallaTimeSelect);
