import React, { Component } from 'react';
import {
  View,
  Text,
  TextInput,
   Image,
   ActivityIndicator,
   TouchableOpacity,
   SectionList,
   Platform,
   BackHandler,
   AsyncStorage
 } from 'react-native';

import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import {
  BottomChoiceSelection,
  Header,
  BlockButton
} from '../../_common';

import {
  setLocale,
  logoutUser,
  onCompleteAuth
} from '../../../actions';

// { text: 'Credit Cards', action: null, icon: '' },

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
  setLocaleEnglish() {
    this.closeLanguageSelect();
    this.props.setLocale('en');
  }
  setLocaleArabic() {
    this.closeLanguageSelect();
    this.props.setLocale('ar');
  }

  openLogoutConfirm() { this.setState({ logoutConfirm: true }); }
  closeLogoutConfirm() { this.setState({ logoutConfirm: false }); }

  logoutUser() {
    this.closeLogoutConfirm();
    this.props.logoutUser();
  }

  loginUser() {
    this.props.onCompleteAuth(() => Actions.popTo('homepage'))
    Actions.auth();
  }

  renderHeader() {
    if (!this.props.phone) {
      return (
        <BlockButton
          onPress={this.loginUser.bind(this)}
          text={'Login'}
          color={'#0094ff'}
          style={{
            marginLeft: 20,
            marginRight: 20,
            marginTop: 30,
            marginBottom: 10
          }}
          />
      )
    }
    return (
      <View style={{
        marginLeft: 20,
        marginRight: 20,
        marginTop: 30,
        marginBottom: 10
      }}>
        <Text style={{
          fontFamily: 'Poppins-SemiBold',
          fontSize: 22,
          color: 'black',
        }}>Welcome {this.props.name}</Text>
      </View>
    );
  }

  renderFooter() {
    return (
      <View>
        <Text style={{
          fontFamily: 'Poppins-Regular',
          fontSize: 10,
          color: 'black',
          textAlign: 'center',
          marginTop: 30,
          marginBottom: 30
        }}>Made in 🇪🇬</Text>
      </View>
    )
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
        <Text style={{
          fontFamily: 'Poppins-Light',
          fontSize: 12,
          color: '#4E4E4E',
        }}>{text}</Text>
      </TouchableOpacity>
    );
  }

  renderSectionHeader({section: { title }}) {
    return (
      <View style={{
        height: 60,
        paddingLeft: 20,
        paddingBottom: 10,
        backgroundColor: '#FAFCFD',
        justifyContent: 'flex-end',
        borderColor: '#f7f7f7',
        borderBottomWidth: 1
      }}>
        <Text style={{
          fontFamily: 'Poppins-Medium',
          fontSize: 12,
          color: 'black',
        }}>{title.toUpperCase()}</Text>
      </View>
    );
  }

  render() {

    const accountSection = {title: 'My Account', data: [
      { text: 'Address Book', action: null, icon: '' },
      { text: 'Language', action: this.openLanguageSelect.bind(this), icon: '' },
      { text: 'Previous Orders', action: () => Actions.orderHistory(), icon: '' },
      { text: 'Logout', action: this.openLogoutConfirm.bind(this), icon: ''}
    ]};

    const infoSection = {title: 'Information', data: [
      { text: 'Terms & Conditions', action: null },
      { text: 'Privacy Policy', action: null },
    ]};


    // different sections based on logged in/out
    let sections = [infoSection];
    if (this.props.phone) {
      sections = [accountSection, infoSection];
    }

    return (
      <View style={{
        flex: 1,
        backgroundColor: '#FAFCFD'
      }}>
        <Header title={'SETTINGS'}/>
        <SectionList
          ListHeaderComponent={this.renderHeader.bind(this)}
          ListFooterComponent={this.renderFooter.bind(this)}
          renderItem={this.renderItem.bind(this)}
          renderSectionHeader={this.renderSectionHeader.bind(this)}
          sections={sections}
          keyExtractor={(item, index) => item + index}
        />




        <BottomChoiceSelection
          isVisible={this.state.languageSelect}
          onClose={this.closeLanguageSelect.bind(this)}
          title='Select your language'
          buttons={[
            { text: 'Arabic', action: this.setLocaleArabic.bind(this) },
            { text: 'English', action: this.setLocaleEnglish.bind(this) }
          ]}
        />

        <BottomChoiceSelection
          isVisible={this.state.logoutConfirm}
          onClose={this.closeLogoutConfirm.bind(this)}
          title='Are you sure you want to log out?'
          backgroundColor='#E64E47'
          buttons={[
            { text: 'Yes, sure', action: this.logoutUser.bind(this) },
            { text: 'No, cancel', action: this.closeLogoutConfirm.bind(this) }
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
