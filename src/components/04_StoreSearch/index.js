import React, { Component } from 'react';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import FastImage from 'react-native-fast-image';
import {
  View,
  Platform,
  ActivityIndicator,
  TouchableOpacity,
  KeyboardAvoidingView,
  Image,
  BackHandler,
  FlatList,
  InteractionManager,
  findNodeHandle,
  SectionList,
  Keyboard
} from 'react-native';
import { LoadingOverlay, BackButton, AyezText } from '../_common';
import {
  fetchQueryResults,
  resetQueryItems,
  onSelectCategory,
  onSelectSearchSubcategory
 } from '../../actions';
import {
  strings,
  translate
} from '../../i18n.js';

import { SearchHeader } from './_components/SearchHeader';


class StoreSearch extends Component {

  constructor(props) {
    super(props);
    // this.debouncedfetchQueryItems = _.debounce(this.props.fetchQueryItems, 700);
    this.state = { showFilter: false };
  }

  componentDidMount() {
    this.props.resetQueryItems();
    this.searchInput.focus();
    BackHandler.addEventListener('hardwareBackPress', this.onAndroidBackPress);
    // InteractionManager.runAfterInteractions(() => {
    //   setTimeout(() => {
    //     this.setState({
    //       bluredViewRef: findNodeHandle(this.refs.bluredViewRef)
    //     });
    //   }, 500);
    // });
  }

  componentWillUnmount() {
    BackHandler.removeEventListener(
      'hardwareBackPress',
      this.onAndroidBackPress
    );
    if (this.props.onUnmount) {
      this.props.onUnmount();
    }
  }

  onAndroidBackPress = () => {
    Actions.pop(); // Android back press
    return true;
  };

  onQueryDidChange(query) {
    const seller = this.props.seller;
    console.log(query);
    if (seller.id) {
      this.props.fetchQueryResults({ seller, query });
    }
  }

  renderSearchItem({ item }) {

    let onCellPress = null;
    let cellText = '';
    let cellColor = 'black';

    if (item.type === 'ITEM') {
      onCellPress = () => Actions.itemPage({ item });
      cellText = translate(item);
    } else if (item.type === 'SUBCATEGORY') {
      onCellPress = () => {
        this.props.onSelectSearchSubcategory(this.props.seller.id, item);
      }
      cellText = `${translate(item.parent_name)} / ${translate(item.name)}`;
      cellColor = '#0094ff';
    } else if (item.type === 'CATEGORY') {
      onCellPress = () => {
        this.props.onSelectCategory(this.props.seller.id, item);
        Actions.storeAisle();
      };
      cellText = translate(item.name);
      cellColor = '#0094ff';
    }

    return (
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          flex: 1,
          height: 45,
          marginHorizontal: 20,
          alignItems: 'center',
          borderBottomWidth: 2,
          borderBottomColor: '#F4F5F7'
        }}
        onPress={() => onCellPress()}
      >
        <Image
          style={{
            width: 20,
            height: 20,
            tintColor: '#8e8e93',
            marginRight: 20
          }}
          resizeMode="contain"
          source={require('../../../assets/images/magnifying_glass.png')}
        />
        <AyezText medium size={12} color={cellColor}>{cellText}</AyezText>
      </TouchableOpacity>
    );
  }


  renderSearchHeader() {
    const { query, seller } = this.props;
    return (
      <SearchHeader
        seller={seller}
        reference={c => (this.searchInput = c)}
        searchQuery={query}
        onQueryDidChange={this.onQueryDidChange.bind(this)}
      />
    );
  }

  renderResults() {
    const { subcategoryResults, categoryResults, itemResults, isLoadingSearchData } = this.props;

    const results = [];
    subcategoryResults.forEach(subcategory => results.push({ ...subcategory, type: 'SUBCATEGORY' }))
    categoryResults.forEach(category => results.push({ ...category, type: 'CATEGORY' }))
    itemResults.forEach(item => results.push({ ...item, type: 'ITEM' }))

    return (
      <View style={{ flex: 1 }}>
        <FlatList
          data={results}
          renderItem={this.renderSearchItem.bind(this)}
          keyExtractor={(item, index) => index.toString()}
        />
        <LoadingOverlay isVisible={isLoadingSearchData} />
      </View>
    );
  }

  render() {
    const { query } = this.props;
    const { showFilter, bluredViewRef } = this.state;



    // } else if (searchQuery === '') {
    //   overlayComponent = this.renderPopularSearches.bind(this)(popularSearchs);
    // }

    // add subcategory, category =>> pressing will let you add or delete those items

    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : null}
        style={{ flex: 1, backgroundColor: 'white' }}
      >
        {this.renderSearchHeader()}
        {this.renderResults()}
        <LoadingOverlay isVisible={this.props.subcategorySelectLoading} />
      </KeyboardAvoidingView>
    );
  }
}


// {this.renderSearchHeader.bind(this)()}
// <View style={{ flex: 1, backgroundColor: '#FBFCFE' }}>
//   {searchQuery === ''
//     ? overlayComponent
//     : this.renderResults.bind(this)()}
// </View>
// </View>
// <FilterModal
// isVisible={showFilter}
// bluredViewRef={bluredViewRef}
// view={this.renderSearchHeader.bind(this)(true)}
// />

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

  const { isLoadingSearchData, subcategoryResults, categoryResults, itemResults, query, subcategorySelectLoading } = ItemSearch;

  return {
    seller,
    items_array,
    isLoadingSearchData,
    subcategoryResults,
    categoryResults,
    itemResults,
    query,
    subcategorySelectLoading
  };
};

export default connect(
  mapStateToProps,
  {
    fetchQueryResults,
    resetQueryItems,

    onSelectCategory,
    onSelectSearchSubcategory
  }
)(StoreSearch);
