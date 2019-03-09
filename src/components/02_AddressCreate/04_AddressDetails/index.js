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
import { connect } from 'react-redux';
import {
  Header,
  BlockButton,
  LoadingOverlay,
  AyezText,
  InputRow
} from '../../_common';
import {
  createNewAddress,
  calculateAreaForLocation,
  setAddressDetail
} from '../../../actions';

import {
  strings,
  translate,
  FONT_MEDIUM
} from '../../../i18n.js';


class AddressDetails extends Component {

  constructor(props) {
    super(props);
  }

  createNewAddress() {
    const {
      location,
      title,
      street,
      building,
      apt,
      name,
      notes,
      type,
      area
    } = this.props;

    this.props.createNewAddress({
      location,
      title,
      street,
      building,
      apt,
      name,
      notes,
      type,
      area
    });
  }

  componentDidMount() {
    if (this.props.google_type === 'route') {
      this.props.setAddressDetail({ street: this.props.google_title });
    }
    this.props.calculateAreaForLocation(this.props.location);
  }

  onChangeText(key, value) {
    const update = {};
    update[key] = value;
    this.props.setAddressDetail(update);
  }

  renderTitle() {

    let loadingComponent = null;
    if (this.props.area_loading) {
      loadingComponent = (
        <ActivityIndicator size="small" style={{ marginLeft: 24 }} />
      )
    }

    return (
      <View style={{
        paddingLeft: 16,
        paddingTop: 16,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center'
      }}>
        <AyezText bold size={32}>{strings('AddressCreate.confirmDeliveringTo')}</AyezText>
        { loadingComponent }
      </View>
    )
  }

  renderArea() {
    if (this.props.area) {
      return (
        <View style={{
          paddingLeft: 16,
          flexDirection: 'row',
          alignItems: 'center',
        }}>
          <AyezText semibold size={13}>
            {strings('Address.region')}
          </AyezText>
          <AyezText semibold size={13} style={{
            alignItems: 'stretch',
            paddingLeft: 6,
            color: '#0094ff'
          }}>
            {translate(this.props.area.display_name)}
          </AyezText>
        </View>
      )
    }
    return null
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

  render() {
    return (
      <View style={{
        flex: 1,
        backgroundColor: '#FAFCFD'
      }}>
        <Header title={strings('AddressCreate.confirmHeader')}/>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : null}
        >
          <ScrollView style={{ flex: 1 }}>
            { this.renderTitle() }
            { this.renderArea() }


            <View style={{ height: 20 }} />

            <InputRow
              title={strings('Address.street')}
              value={this.props.street}
              onChangeText={this.onChangeText.bind(this, 'street')}
            />
            <InputRow
              title={strings('Address.building')}
              value={this.props.building}
              onChangeText={this.onChangeText.bind(this, 'building')}
            />
            <InputRow
              title={strings('Address.apt')}
              value={this.props.apt}
              onChangeText={this.onChangeText.bind(this, 'apt')}
            />
            <InputRow
              title={strings('Address.name')}
              value={this.props.name}
              onChangeText={this.onChangeText.bind(this, 'name')}
            />
            <InputRow
              title={strings('Address.instructions')}
              value={this.props.notes}
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
              onPress={this.createNewAddress.bind(this)}
              />
            </ScrollView>
          </KeyboardAvoidingView>

          <LoadingOverlay isVisible={this.props.is_loading} />
      </View>
    );
  }
}

const mapStateToProps = ({ AddressReverseSearch, AddressCreate, AddressArea }) => {
  const {
    location,
    title,
    street,
    building,
    apt,
    name,
    notes,
    type,
    area,

    is_loading,
    error
  } = AddressCreate;

  const area_loading = AddressArea.is_loading;

  return {
    location,
    title,
    street,
    building,
    apt,
    name,
    notes,
    type,
    area,
    area_loading,

    google_title: AddressReverseSearch.title,
    google_type: AddressReverseSearch.type,

    is_loading,
    error
  };
};

export default connect(mapStateToProps, {
  createNewAddress,
  calculateAreaForLocation,
  setAddressDetail
})(AddressDetails);
