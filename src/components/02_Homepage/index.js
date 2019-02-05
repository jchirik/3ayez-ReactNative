import React, { Component } from 'react';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import { TabView, TabBar, SceneMap } from 'react-native-tab-view';

import {
  View,
  FlatList,
  Image,
  ActivityIndicator,
  Dimensions
} from 'react-native';

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
  AYEZ_BACKGROUND_COLOR
} from '../../Helpers.js';

import {
  strings,
  translate
} from '../../i18n.js';

const stores_icon = require('../../../assets/images_v2/Home/stores.png');
const support_icon = require('../../../assets/images_v2/Home/support.png');

class Homepage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      index: 0,
      current_key: 'first',
      routes: [
        { key: 'first', title_key: 'HomeTabs.stores', icon: stores_icon },
        { key: 'second', title_key: 'HomeTabs.support', icon: support_icon },
      ],
    };
    // use title_key so strings fx can run during rendering
    // otherwise, language doesnt change
  }

  componentDidMount() {
    console.log('Homepage mounted')
  }

  componentDidUpdate(prevProps) {

    // MOVE THIS (later)
    // if addresses stop loading && addresses has 0 length
      // open create address
    // otherwise, open address selection

    if (this.props.review_order && !prevProps.review_order) {
      Actions.orderReview({ order: this.props.review_order });
    }

    if (this.props.feedback_order && !prevProps.feedback_order) {
      Actions.customerFeedback({ order: this.props.feedback_order });
    }
  }

  render() {

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
          initialLayout={{ width: Dimensions.get('window').width }}
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
                borderColor: '#e6e6e6'
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
