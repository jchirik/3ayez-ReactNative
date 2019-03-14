import React, { Component } from 'react';
import {
  View,
  TextInput,
   Image,
   ActivityIndicator,
   TouchableOpacity,
   FlatList,
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
  AyezText,
  RTLImage
} from '../../../_common';

import {
  setLocale,
  logoutUser,
  onCompleteAuth
} from '../../../../actions';

import {
  AYEZ_GREEN,
  AYEZ_BACKGROUND_COLOR,
  STATUS_BAR_HEIGHT
} from '../../../../Helpers.js';

import images from '../../../../theme/images'

import {
  strings,
  translate
} from '../../../../i18n.js';
// import LiveChat from '../../../../utils/livechat';
import { sceneKeys, navigateTo, navigateBackTo } from '../../../../router';

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

  componentWillMount() {
    // this.setState({
    //   visitorSDK: LiveChat.getInstance()
    // });
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


  renderLocationButton() {
    const {
      address,
      area
    } = this.props;
    return (
      <TouchableOpacity
        onPress={() => {
          this.props.onClose();
          navigateTo(sceneKeys.locationSelect);
        }}
        style={{
          paddingTop: 11,
          paddingBottom: 11,
          borderBottomWidth: 1,
          borderColor: '#f7f7f7',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'flex-end'
        }}
      >
        <View>
          <AyezText regular color={'#4E4E4E'}>{address.building ? `${address.building} ` : ''}{address.street || address.title}</AyezText>
          <AyezText regular color={'#4E4E4E'}>{area ? translate(area.display_name) : null}</AyezText>
        </View>
        <AyezText regular color={AYEZ_GREEN}>{strings('Common.edit')}</AyezText>
      </TouchableOpacity>
    )
  }

  renderStoreButton() {
    const {
      seller,
      sellers
    } = this.props;

    console.log('sellers', sellers)
    if (sellers.length <= 1) {
      return null;
    }

    return (
      <TouchableOpacity
        onPress={() => {
          this.props.onClose();
          navigateTo(sceneKeys.storeSelect);
        }}
        style={{
          paddingTop: 11,
          paddingBottom: 11,
          borderBottomWidth: 1,
          borderColor: '#f7f7f7',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <View>
          <AyezText medium color={'#4E4E4E'}>Change Store</AyezText>
          <AyezText regular color={'#4E4E4E'}>{translate(seller.display_name)}</AyezText>
          <AyezText regular color={'#4E4E4E'}>{translate(seller.location_text)}</AyezText>
        </View>
        <RTLImage
          source={images.nextArrowIcon}
          style={{
            width: 16,
            height: 16,
            tintColor: '#4E4E4E'
          }}
          resizeMode={'contain'}
        />
      </TouchableOpacity>
    )
  }

  renderHeader() {
    let topAccountHeader = (
      <AyezText semibold size={16} color={'#4E4E4E'} style={{
        alignSelf: 'flex-start'
      }}>{strings('Settings.welcome', {name: this.props.name})}</AyezText>
    )
    if (!this.props.phone) {
      topAccountHeader = (
        <TouchableOpacity
          onPress={this.loginUser.bind(this)}
          style={{
            height: 55,
            flexDirection: 'row',
            alignItems: 'center',
            borderColor: '#f7f7f7',
            borderBottomWidth: 1
          }}
        >
          <RTLImage
            source={images.settingsLoginArrow}
            style={{
              width: 16,
              height: 16,
              tintColor: AYEZ_GREEN,
              marginRight: 10
            }}
            resizeMode={'contain'}
          />
          <AyezText semibold color={AYEZ_GREEN}>Sign in/Sign up</AyezText>
        </TouchableOpacity>
      )
    }

    return (
      <View style={{
        paddingTop: STATUS_BAR_HEIGHT + 14,
        paddingLeft: 20,
        paddingRight: 20,
        alignItems: 'stretch',
        backgroundColor: 'white',
        marginBottom: 8
      }}>
        {topAccountHeader}
        {this.renderLocationButton()}
        {this.renderStoreButton()}

      </View>
    );
  }


  renderItem({item: {text, action, icon, color}, index, section}) {
    return (
      <TouchableOpacity
        key={index}
        onPress={action}
        style={{
          height: 55,
          flexDirection: 'row',
          alignItems: 'center',
          paddingLeft: 20,
          borderColor: '#f7f7f7',
          borderBottomWidth: 1
        }}
      >
        {icon ? (
          <RTLImage
            source={icon}
            style={{
              width: 16,
              height: 16,
              tintColor: color || '#4E4E4E',
              marginRight: 10
            }}
            resizeMode={'contain'}
          />
        ) : null }
        <AyezText regular style={{
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


    const chatTab = {
      text: strings('Support.contact3ayez'),
      action: () => {
        if (this.state.visitorSDK) {
          this.props.onClose();
          navigateTo(sceneKeys.supportChat, {
            visitorSDK: this.state.visitorSDK
          });
        }
      },
      icon: images.settingsChat,
      color: AYEZ_GREEN
    };

    const creditCardTab = {
      text: strings('Settings.creditCards'),
      action: () => {
        this.props.onClose();
        navigateTo(sceneKeys.creditCardManager)
      },
      icon: images.settingsCreditCard
    };
    const addressBookTab = {
      text: strings('Settings.addressBook'),
      action: () => {
        this.props.onClose();
        navigateTo(sceneKeys.addressManager)
      },
      icon: images.settingsAddressBook
    };
    const previousOrdersTab = {
      text: strings('Settings.previousOrders'),
      action: () => {
        this.props.onClose();
        navigateTo(sceneKeys.orderHistory)
      },
      icon: images.settingsOrderHistory
    };

    const languageTab = {
      text: strings('Settings.language'),
      action: this.openLanguageSelect.bind(this),
      icon: images.settingsLanguage
    };
    const termsConditionsTab = {
      text: strings('Settings.termsConditions'),
      action: null,
      icon: ''
    };
    const privacyPolicyTab = {
      text: strings('Settings.privacyPolicy'),
      action: null,
      icon: ''
    };
    const logoutTab = {
      text: strings('Common.logout'),
      action: this.openLogoutConfirm.bind(this),
      icon: ''
    };

    // different sections based on logged in/out
    let settingsTabs = [
      chatTab,
      languageTab,
      termsConditionsTab,
      privacyPolicyTab,
      logoutTab
    ];
    if (this.props.phone) {
      settingsTabs = [
        chatTab,
        creditCardTab,
        addressBookTab,
        previousOrdersTab,
        languageTab,
        termsConditionsTab,
        privacyPolicyTab,
        logoutTab
      ];
    }

    return (
      <View style={{
        flex: 1,
        backgroundColor: AYEZ_BACKGROUND_COLOR
      }}>
        <FlatList
          data={settingsTabs}
          style={{ flex: 1 }}
          ListHeaderComponent={this.renderHeader.bind(this)}
          renderItem={this.renderItem.bind(this)}
          ListFooterComponent={null}
          keyExtractor={(item, index) => `${index}`}
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

const mapStateToProps = ({ Seller, SellerSearch, Addresses, Customer, Settings }) => {
  const seller = Seller;
  const { address } = Addresses;
  const {
    locale
  } = Settings;
  const {
    name,
    phone
  } = Customer;
  const {
    sellers,
    area
  } = SellerSearch;
  return {
    seller,

    address,

    sellers,
    area,
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
