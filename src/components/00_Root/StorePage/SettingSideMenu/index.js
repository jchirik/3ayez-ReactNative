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
   Dimensions,
   AsyncStorage
 } from 'react-native';

import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import {
  BottomChoiceSelection,
  Header,
  BlockButton,
  AyezText
} from '../../../_common';

import {
  setLocale,
  logoutUser,
  onCompleteAuth
} from '../../../../actions';

import {
  STATUS_BAR_HEIGHT
} from '../../../../Helpers.js';

import {
  strings,
  translate
} from '../../../../i18n.js';
import { sceneKeys, navigateTo, navigateBackTo } from '../../../../router';

import ChatButton from './ChatButton';
// { text: 'Credit Cards', action: null, icon: '' },

const window = Dimensions.get('window');

class SettingsMenu extends Component {

  constructor(props) {
    super(props);
    this.state = {
      logoutConfirm: false,
      languageSelect: false
    };
  }

  openLanguageSelect() { this.setState({ languageSelect: true }); }
  closeLanguageSelect() { this.setState({ languageSelect: false }); }
  setLocaleEnglish() { this.props.setLocale('en'); }
  setLocaleArabic() { this.props.setLocale('ar'); }

  openLogoutConfirm() { this.setState({ logoutConfirm: true }); }
  closeLogoutConfirm() { this.setState({ logoutConfirm: false }); }

  logoutUser() { this.props.logoutUser(); }

  loginUser() {
    this.props.onCompleteAuth(() => navigateBackTo(sceneKeys.root))
    navigateTo(sceneKeys.auth)
  }

  renderHeader() {
    let accountContent = (
      <AyezText semibold style={{
        marginTop: 5,
        fontSize: 20,
        alignSelf: 'flex-start'
      }}>{strings('Settings.welcome', {name: this.props.name})}</AyezText>
    )
    if (!this.props.phone) {
      accountContent = (
        <BlockButton
          onPress={this.loginUser.bind(this)}
          text={strings('Common.login')}
          color={'#0094ff'}
        />
      )
    }

    return (
      <View style={{
        marginLeft: 20,
        marginRight: 20,
        marginTop: STATUS_BAR_HEIGHT + 30,
        marginBottom: 10
      }}>
        <ChatButton />
        {accountContent}
      </View>
    );
  }


  renderItem({item: {text, action, icon}, index, section}) {
    return (
      <TouchableOpacity
        key={index}
        onPress={action}
        style={{
          height: 60,
          flexDirection: 'row',
          alignItems: 'center',
          paddingLeft: 20,
          backgroundColor: 'white',
          borderColor: '#f7f7f7',
          borderBottomWidth: 1
        }}
      >
        <AyezText light style={{
          fontSize: 12,
          color: '#4E4E4E',
        }}>{text}</AyezText>
      </TouchableOpacity>
    );
  }

  renderSectionHeader({section: { title }}) {
    return (
      <View style={{
        height: 60,
        paddingLeft: 20,
        paddingBottom: 10,
        alignItems: 'flex-start',
        justifyContent: 'flex-end',
        borderColor: '#f7f7f7',
        borderBottomWidth: 1
      }}>
        <AyezText medium style={{
          fontSize: 12,
          color: 'black',
        }}>{title.toUpperCase()}</AyezText>
      </View>
    );
  }

  render() {

    const accountSection = {title: strings('Settings.myAccount'), data: [
      { text: strings('Settings.addressBook'), action: () => {
          navigateTo(sceneKeys.addressManager)
      }, icon: '' },
      { text: strings('Settings.creditCards'), action: () => {
          navigateTo(sceneKeys.creditCardManager)
      }, icon: '' },
      { text: strings('Settings.previousOrders'), action: () => {
          navigateTo(sceneKeys.orderHistory)
      }, icon: '' },
      { text: strings('Common.logout'), action: this.openLogoutConfirm.bind(this), icon: ''}
    ]};

    const infoSection = {title: strings('Settings.information'), data: [
      { text: strings('Settings.language'), action: this.openLanguageSelect.bind(this), icon: '' },
      { text: strings('Settings.termsConditions'), action: null },
      { text: strings('Settings.privacyPolicy'), action: null },
    ]};


    // different sections based on logged in/out
    let sections = [infoSection];
    if (this.props.phone) {
      sections = [accountSection, infoSection];
    }

    return (
      <View style={{
        flex: 1,
        backgroundColor: 'white'
      }}>
        <SectionList
          ListHeaderComponent={this.renderHeader.bind(this)}
          renderItem={this.renderItem.bind(this)}
          renderSectionHeader={this.renderSectionHeader.bind(this)}
          sections={sections}
          keyExtractor={(item, index) => item + index}
        />


        <BottomChoiceSelection
          isVisible={this.state.languageSelect}
          onClose={this.closeLanguageSelect.bind(this)}
          title={strings('Settings.selectLanguage')}
          buttons={[
            { text: strings('Common.arabic'), action: this.setLocaleArabic.bind(this) },
            { text: strings('Common.english'), action: this.setLocaleEnglish.bind(this) }
          ]}
        />

        <BottomChoiceSelection
          isVisible={this.state.logoutConfirm}
          onClose={this.closeLogoutConfirm.bind(this)}
          title={strings('Settings.logoutModal')}
          backgroundColor='#E64E47'
          buttons={[
            { text: strings('Settings.logoutConfirm'), action: this.logoutUser.bind(this) },
            { text: strings('Settings.logoutCancel'), action: () => console.log('closing') }
          ]}
        />
      </View>
    );
  }
}

const mapStateToProps = ({ Customer, Settings }) => {
  const {
    locale
  } = Settings;
  const {
    name,
    phone
  } = Customer;
  return {
    locale,

    name,
    phone
  };
};

export default connect(mapStateToProps, {
  setLocale,
  logoutUser,
  onCompleteAuth
})(SettingsMenu);
