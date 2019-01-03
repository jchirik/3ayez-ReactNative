import _ from 'lodash';
import React, { Component } from 'react';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import {
  View,
  Modal,
  SectionList,
  Text,
  Platform,
  Animated,
  ActivityIndicator,
  TouchableOpacity,
  KeyboardAvoidingView,
  TextInput,
  Dimensions,
  Image,
  BackHandler
} from 'react-native';

import { SearchBar, BackButton, ItemCell } from '../_reusable';

import {
  fetchQueryResults,
  resetQueryItems
} from '../../actions';
import { strings, statusBarMargin } from '../../Helpers.js';


// a big comoonent

class StoreSearch extends Component {

  constructor(props) {
    super(props);
    // this.debouncedfetchQueryItems = _.debounce(this.props.fetchQueryItems, 700);
  }

  componentDidMount() {
    this.props.resetQueryItems();
    this.searchInput.focus();
    BackHandler.addEventListener('hardwareBackPress', this.onAndroidBackPress);
  }


  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.onAndroidBackPress);
    if (this.props.onUnmount) {
      this.props.onUnmount();
    }
  }

  onAndroidBackPress = () => {
    Actions.pop(); // Android back press
    return true;
  }


  onQueryDidChange(searchQuery) {
    const seller = this.props.seller;
    console.log(searchQuery);
    if (seller.id) {
      this.props.fetchQueryResults({ sellerID: seller.id, query: searchQuery });
    }
  }


/*

  make one good search bar component (for reuse)

  search + debounce in this page

  no live search - provide live recommendations


*/


renderItem({ item, index }) {

  // derive quantity from working basket hash
  const foundItem = this.props.items_array.find((w_item) => (w_item.upc === item.upc));
  const quantity = foundItem ? foundItem.quantity : 0;

  const item_w_quantity = { ...item, quantity };

  console.log(item)
  return (
    <ItemCell
      item={item_w_quantity}
      isSearchResult
      mutableQuantity
      seller={this.props.seller}
    />

  );
}


  render() {
    const {
      searchQuery,
      isLoadingSearchData,
      results
    } = this.props;

    let overlayComponent = null;
    if (isLoadingSearchData) {
       overlayComponent = (
         <View style={styles.overlayContainer}>
           <ActivityIndicator size="large" />
         </View>
       );
    } else if (searchQuery === '') {
      overlayComponent = (<View style={styles.overlayContainer} />);
      // overlayComponent = (
      //   <View style={styles.overlayContainer}>
      //     <Text>3ayez eih?</Text>
      //   </View>
      // );
    }

    // add subcategory, category =>> pressing will let you add or delete those items



    const sections = [
      { title: 'Items', data: results }
    ]

    return (
      <KeyboardAvoidingView
        behavior={(Platform.OS === 'ios') ? 'padding' : null}
        style={{ flex: 1, backgroundColor: 'white'}}
      >
        <View style={{
          paddingTop: statusBarMargin,
          paddingBottom: 8,
          borderBottomWidth: 1,
          borderColor: '#f1f1f1',
          flexDirection: 'row'
        }}>
          <SearchBar
            color={'#0094ff'}
            containerStyle={{ flex: 1, marginLeft: 12, marginRight: 50 }}
            reference={c => (this.searchInput = c)}
            placeholder={strings('SearchBar.placeholder')}
            searchQuery={searchQuery}
            onQueryDidChange={this.onQueryDidChange.bind(this)}
          />
          <BackButton />
        </View>
        <View style={{flex: 1}}>
          <SectionList
            style={{ flex: 1 }}
            removeClippedSubviews
            renderItem={this.renderItem.bind(this)}
            sections={sections}
            keyExtractor={(item, index) => index}
          />
          {overlayComponent}
        </View>
      </KeyboardAvoidingView>
    );
  }

}

const styles = {
  overlayContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white'
  }
};

const mapStateToProps = ({ ItemSearch, Seller, Baskets }) => {

  const seller = Seller;
  const basket = Baskets.baskets[Seller.id];
  const { items_array } = basket;

  const {
    isLoadingSearchData,
    results,
    searchQuery
  } = ItemSearch;

  return {
    seller,
    items_array,
    isLoadingSearchData,
    results,
    searchQuery
  };
};

export default connect(mapStateToProps, {
  fetchQueryResults,
  resetQueryItems
})(StoreSearch);
