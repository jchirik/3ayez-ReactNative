import React, { Component } from 'react';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';

import {
  View,
  FlatList,
  Text,
  Platform,
  Animated,
  Easing,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  BackHandler
} from 'react-native';
// import { Circle } from 'react-native-progress';

import {
  onSelectCategory
} from '../../actions';

import {
  BackButton
} from '../_common';


class StorePage extends Component {

  constructor(props) {
    super(props);
  }

  onSelectCategory(category) {
    this.props.onSelectCategory(this.props.seller_id, category);
    Actions.storeCategory();
  }

  renderItem({ item, index }) {
      return (
        <TouchableOpacity
          style={{ height: 50 }}
          onPress={this.onSelectCategory.bind(this, item)}
          >
          <Text>{item.filter}</Text>
        </TouchableOpacity>
      );
  }

  render() {
    return (
      <View style={{ flex: 1, marginTop: 30, backgroundColor:'white'}}>
        <Text>{this.props.seller_id}</Text>
        <FlatList
          data={this.props.categories}
          renderItem={this.renderItem.bind(this)}
            style={{ marginTop: 46, flex: 1, backgroundColor: '#f7f7f7' }}

            removeClippedSubviews
            ListHeaderComponent={null}
            ListEmptyComponent={null}
            ListFooterComponent={null}


            scrollEventThrottle={16}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item, index) => index}
          />
        <BackButton type='cross_circled' />
      </View>
    );
  }
}

const mapStateToProps = ({ Seller }) => {
  const { id, promotions, recents, home, categories} = Seller;
  return {
    seller_id: id,
    promotions,
    recents,
    home,
    categories
  };
};

export default connect(mapStateToProps, {
  onSelectCategory
})(StorePage);
