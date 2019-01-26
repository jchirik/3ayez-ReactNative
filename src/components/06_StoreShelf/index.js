import React, { Component } from 'react';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import {
  View,
  Modal,
  FlatList,
  Text,
  Platform,
  Animated,
  ActivityIndicator,
  TouchableOpacity,
  KeyboardAvoidingView,
  TextInput,
  Dimensions,
  Image
} from 'react-native';

// import {
// } from '../../actions';
import { statusBarMargin } from '../../Helpers.js';

import { strings } from '../../i18n.js';

import AnimatedCheckmarkOverlay from './AnimatedCheckmarkOverlay';
import BasketBlockButton from './BasketBlockButton';
import ItemCell from './ItemCell';

import {
  BackButton
} from '../_common';

// const ITEM_HEIGHT = (Dimensions.get('window').width/3) + 42;

const window = Dimensions.get('window');



class StoreShelf extends Component {

  constructor(props) {
    super(props);

    this.state = {
      itemHeight: 0,
      scrollEnabled: true
    };
  }

  // for each subcategory, load 12 items
  // upon scroll to right, load more


  componentDidMount() {
    // animate table to the right column (timeout necessary due to React glitch)
    const { jumpToColumnIndex } = this.props;
    if (jumpToColumnIndex) {
      const wait = new Promise((resolve) => setTimeout(resolve, 100));
      wait.then(() => {
          this.tableRef.scrollToIndex({ animated: true, index: jumpToColumnIndex });
      });
    }
  }

  renderItem(items, { item, index }) {

    const { itemHeight } = this.state;
    const itemWidth = itemHeight * 0.58;

    console.log('RowHeight', itemHeight, 'RowWidth', itemWidth)

    // provide the SEARCH RESULTS
    const numRows = 2;
    if (index % numRows !== 0) return null;

    const topCell = (
      <ItemCell
        item={items[index]}
        height={itemHeight}
        width={itemWidth}
        row={0}
        onDragStart={() => this.tableRef.setNativeProps({ scrollEnabled: false })}
        onDragEnd={() => this.tableRef.setNativeProps({ scrollEnabled: true })}
      />
    );
    let bottomCell = null;
    if (index + 1 < items.length) {
      bottomCell = (
        <ItemCell
          item={items[index + 1]}
          height={itemHeight}
          width={itemWidth}
          row={1}
          onDragStart={() => this.tableRef.setNativeProps({ scrollEnabled: false })}
          onDragEnd={() => this.tableRef.setNativeProps({ scrollEnabled: true })}
        />
      );
    }

    return (
      <View style={{ height: itemHeight * 2, width: itemWidth }}>
        {topCell}
        {bottomCell}
      </View>
    );
  }

  render() {
    const {
      items
    } = this.props;

    const { itemHeight } = this.state;
    const itemWidth = itemHeight * 0.58;


// this is causing issues:
    // getItemLayout={(data, index) => (
    //   { length: itemWidth, offset: itemWidth * index, index }
    // )}
    return (
      <View style={{ flex: 1 }}>
      <FlatList
        ref={(ref) => this.tableRef = ref}
        style={{ flex: 1, backgroundColor: 'white', marginTop: 60 }}
        onLayout={(event) => {
          const { height } = event.nativeEvent.layout;
          this.setState({ itemHeight: height / 2 });
        }}
        horizontal
        renderItem={this.renderItem.bind(this, items)}
        ListEmptyComponent={
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', width: window.width}}>
            <Text style={{
              fontFamily: 'Poppins-Regular',
              color: 'black',
              fontSize: 20
            }}>{strings('StoreSubcategories.noItemsAvailable')}</Text>
            </View>
          }
        data={items}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, index) => index}
      />
      <BasketBlockButton />
      <AnimatedCheckmarkOverlay />

      <BackButton type='cross_circled' />
      </View>
    );
  }
}


// const styles = {
// };

export default connect(null, null)(StoreShelf);
