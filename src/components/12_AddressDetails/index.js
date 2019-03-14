import React, { Component } from 'react';
import {
  View,
  TextInput,
   Image,
   ActivityIndicator,
   TouchableOpacity,
   SectionList,
   Platform,
   BackHandler,
   KeyboardAvoidingView,
   AsyncStorage,
   ScrollView
 } from 'react-native';

import { Actions } from 'react-native-router-flux';

import MapView, { Marker, Polygon, PROVIDER_GOOGLE } from 'react-native-maps';
import { connect } from 'react-redux';
import {
  Header,
  BlockButton,
  LoadingOverlay,
  AyezText,
  InputRow
} from '../_common';
import {
  updateAddress
} from '../../actions';

import {
  strings,
  translate,
  FONT_MEDIUM
} from '../../i18n.js';

import images from '../../theme/images'


class AddressDetails extends Component {

  constructor(props) {
    super(props);
    this.state = {
      name: '',
      street: '',
      building: '',
      apt: '',
      notes: ''
    };
  }

  updateAddress() {
    const { address } = this.props;
    const {
      name,
      street,
      building,
      apt,
      notes
    } = this.state;
    this.props.updateAddress({
      ...address,
      name,
      street,
      building,
      apt,
      notes
    })
  }

  componentDidMount() {
    this.setState({
      street: this.props.address.street || this.props.address.title,
      apt: this.props.address.apt,
      building: this.props.address.building,
      name: this.props.address.name,
      notes: this.props.address.notes
    })
  }

  onChangeText(key, value) {
    const update = {};
    update[key] = value;
    this.setState(update);
  }


  renderError() {
    const { error } = this.props;
    if (error === 'INVALID_PARAMETERS') {
      return (
        <AyezText
          regular
          color={'red'}
          style={{ textAlign: 'center' }}
          >{strings('AddressCreate.confirmMissingInformation')}</AyezText>
      )
    } else if (error === 'BAD_CONNECTION') {
      <AyezText
      regular
      color={'red'}
      style={{ textAlign: 'center' }}
      >{strings('Common.noInternet')}</AyezText>
    }
    return null;
  }

  renderPinOverlay() {
    return (
      <View
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          right: 0,
          left: 0,
          justifyContent: 'center',
          alignItems: 'center'
        }}
        pointerEvents="none"
      >
        <Image
          source={images.pinIcon}
          style={{
              width: 36,
              height: 36,
              marginBottom: 36
            }}
          resizeMode={'contain'}
        />
      </View>
    );
  }

  render() {
    return (
      <View style={{
        flex: 1,
        backgroundColor: '#FAFCFD'
      }}>
        <Header
          title={strings('AddressCreate.confirmHeader')}
          blackStyle
        />
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : null}
        >
          <ScrollView style={{ flex: 1 }}>

            <View
              style={{
                height: 160,
                marginHorizontal: 15,
                marginTop: 10,
              }}
              pointerEvents="none"
            >
              <MapView
                style={{
                  flex: 1,
                  borderRadius: 10
                }}
                provider={ PROVIDER_GOOGLE }
                initialRegion={{
                  latitude: this.props.address.location.lat,
                  longitude: this.props.address.location.lng,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                }}
              />
              {this.renderPinOverlay()}
            </View>

            <AyezText semibold size={16} style={{
              paddingLeft: 16,
              paddingTop: 20,
              paddingBottom: 6
            }}>{'Please provide additional details'}</AyezText>

            <InputRow
              title={strings('Address.street')}
              value={this.state.street}
              onChangeText={this.onChangeText.bind(this, 'street')}
            />
            <InputRow
              title={strings('Address.building')}
              value={this.state.building}
              onChangeText={this.onChangeText.bind(this, 'building')}
            />
            <InputRow
              title={strings('Address.apt')}
              value={this.state.apt}
              onChangeText={this.onChangeText.bind(this, 'apt')}
            />
            <InputRow
              title={strings('Address.name')}
              value={this.state.name}
              onChangeText={this.onChangeText.bind(this, 'name')}
            />
            <InputRow
              title={strings('Address.instructions')}
              value={this.state.notes}
              onChangeText={this.onChangeText.bind(this, 'notes')}
              required={false}
              multiline={true}
            />

            <View style={{ height: 20 }} />

            {this.renderError() }
            <BlockButton
              text={strings('Common.confirm')}
              style={{
                marginTop: 4,
                marginBottom: 24,
                marginLeft: 18,
                marginRight: 18,
                alignSelf: 'stretch'
              }}
              onPress={this.updateAddress.bind(this)}
              />
            </ScrollView>
          </KeyboardAvoidingView>

          <LoadingOverlay isVisible={this.props.is_loading} />
      </View>
    );
  }
}

const mapStateToProps = ({ Addresses, AddressUpdate }) => {
  const {
    address
  } = Addresses;

  const {
    is_loading,
    error
  } = AddressUpdate;

  return {
    address,
    is_loading,
    error
  };
};

export default connect(mapStateToProps, {
  updateAddress
})(AddressDetails);
