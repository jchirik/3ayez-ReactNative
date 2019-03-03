import React, { Component } from 'react';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import { TabView, TabBar, SceneMap } from 'react-native-tab-view';
import SplashScreen from 'react-native-splash-screen'

import {
  View,
  FlatList,
  Image,
  ActivityIndicator,
  Dimensions
} from 'react-native';

import FBSDK from 'react-native-fbsdk';


// import Discovery from './components/02_Homepage/01_Discovery';
import StoreSelect from './02_StoreSelect';
import Support from './03_Support';
// import UniversalSearch from './components/02_Homepage/04_UniversalSearch';

import {
  AyezText,
  OrderStatusBar
} from '../_common';

import {
  AYEZ_GREEN,
  AYEZ_BACKGROUND_COLOR,
  isIPhoneX,
  SPLASH_SCREEN_TIME_OUT
} from '../../Helpers.js';

import {
  strings,
  translate
} from '../../i18n.js';

import images from '../../theme/images'
import { sceneKeys, navigateTo } from '../../router';

class Homepage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isSplashShown: true,
      index: 0,
      current_key: 'first',
      routes: [
        { key: 'first', title_key: 'HomeTabs.stores', icon: images.storesIcon },
        { key: 'second', title_key: 'HomeTabs.support', icon: images.supportIcon },
      ],
    };
    // use title_key so strings fx can run during rendering
    // otherwise, language doesnt change
  }

  componentDidMount() {
    console.log('Homepage mounted')
    console.log('FBSDK', FBSDK)
    console.log('AppEventsLogger', FBSDK.AppEventsLogger)

    let that = this;
    setTimeout(function(){that.setState({ isSplashShown: false })}, SPLASH_SCREEN_TIME_OUT);
  }

  componentDidUpdate(prevProps) {

    // MOVE THIS (later)
    // if addresses stop loading && addresses has 0 length
      // open create address
    // otherwise, open address selection

    if (this.props.review_order && !prevProps.review_order) {
      navigateTo(sceneKeys.orderReview, { order: this.props.review_order });
    }

    if (this.props.feedback_order && !prevProps.feedback_order) {
      navigateTo(sceneKeys.customerFeedback, { order: this.props.feedback_order });
    }
  }

  render() {

    if(!this.state.isSplashShown) {
      SplashScreen.hide();
    }

    if (this.props.is_loading || !this.props.locale) {
      return (
        <ActivityIndicator size="small" style={{ flex: 1, backgroundColor: 'white' }} />
      );
    }

    return (
      <View style={{ backgroundColor: AYEZ_BACKGROUND_COLOR, flex: 1 }}>
        <OrderStatusBar />
        <TabView
          navigationState={this.state}
          renderScene={SceneMap({
            first: StoreSelect,
            second: Support,
          })}
          onIndexChange={index => {
            const current_key = this.state.routes[index].key;
            this.setState({ index, current_key })
          }}
          swipeEnabled={false}
          animationEnabled={false}
          canJumpToTab={() => true}
          initialLayout={{ width: Dimensions.get('window').width, height: 80 }}
          tabBarPosition={'bottom'}
          renderTabBar={props =>
            <TabBar
              {...props}
              useNativeDriver
              renderLabel={({ route }) => {
                const { title_key, key, icon } = route;
                return (
                  <View style={{ alignItems: 'center' }}>
                  <Image
                    source={icon}
                    style={{
                      width: 24,
                      height: 24,
                      tintColor: (key === this.state.current_key) ? AYEZ_GREEN : '#8E8E93'
                     }}
                    resizeMode={'contain'}
                    />
                  <AyezText
                    regular
                    size={12}
                    color={(key === this.state.current_key) ? AYEZ_GREEN : '#8E8E93'}
                    >{strings(title_key)}</AyezText>
                  </View>
                )
              }}
              style={{ backgroundColor: 'white',
                borderTopWidth: 1,
                borderColor: '#e6e6e6',
                paddingBottom: isIPhoneX() ? 20 : 0
               }}
              renderIndicator={() => null}
              // indicatorStyle={{ backgroundColor: AYEZ_GREEN }}
            />
          }
        />
      </View>
    )
  }
}

const mapStateToProps = ({ Addresses, Settings, OngoingOrders }) => {
  const { address, is_loading } = Addresses;
  const { review_order, feedback_order } = OngoingOrders;
  const { locale } = Settings;
  return {
    locale,
    address,
    is_loading,

    review_order,
    feedback_order
  };
};

export default connect(mapStateToProps, {
})(Homepage);
