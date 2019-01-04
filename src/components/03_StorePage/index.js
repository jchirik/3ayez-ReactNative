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

  componentDidMount() {

  }

  onSelectCategory(category) {
    this.props.onSelectCategory(this.props.seller_id, category);
    Actions.storeCategory();
  }

  storeSearch() {
    Actions.storeSearch();
  }

  renderItem({ item, index }) {
    return (
      <TouchableOpacity
        style={{ height: 60, borderWidth: 1 }}
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
        <Image
          source={{ uri: this.props.logo_url }}
          resizeMode={'contain'}
          style={{
            width: 80,
            height: 80,
            margin: 8
          }}
        />

        <TouchableOpacity
          style={{ height: 60 }}
          onPress={this.storeSearch.bind(this)}
          >
          <Text style={{ color: '#0094ff', fontFamily: 'Poppins-Light' }}>Store Search --> </Text>
        </TouchableOpacity>

        <Text>CATEGORIES</Text>
        <FlatList
          data={this.props.categories}
          renderItem={this.renderItem.bind(this)}
          style={{ marginTop: 20, flex: 1, backgroundColor: '#f7f7f7' }}
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
  const {
    id,
    logo_url,
    promotions,
    featured,
    categories
  } = Seller;

  return {
    seller_id: id,
    logo_url,
    promotions,
    featured,
    categories
  };
};

export default connect(mapStateToProps, {
  onSelectCategory
})(StorePage);
