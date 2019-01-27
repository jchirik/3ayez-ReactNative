import React, { Component } from 'react';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import { TabView, TabBar, SceneMap } from 'react-native-tab-view';

import {
  View,
  FlatList,
  Text,
  ActivityIndicator,
  Dimensions
} from 'react-native';

// import Discovery from './components/02_Homepage/01_Discovery';
import StoreSelect from './02_StoreSelect';
import Support from './03_Support';
// import UniversalSearch from './components/02_Homepage/04_UniversalSearch';

import {
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

class Homepage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      index: 0,
      routes: [
        { key: 'first', title: 'Stores' },
        { key: 'second', title: 'Support' },
      ],
    };
  }

  componentDidMount() {
    console.log('Homepage mounted')
  }

  componentDidUpdate(prevProps) {

    // MOVE THIS (later)
    // if addresses stop loading && addresses has 0 length
      // open create address
    // otherwise, open address selection

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
          onIndexChange={index => this.setState({ index })}
          initialLayout={{ width: Dimensions.get('window').width }}
          tabBarPosition={'bottom'}
          renderTabBar={props =>
            <TabBar
              {...props}
              useNativeDriver
              style={{ backgroundColor: AYEZ_GREEN }}
              indicatorStyle={{ backgroundColor: 'pink' }}
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
