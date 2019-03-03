import React, { Component } from 'react';
import { connect } from 'react-redux';

import colors from '../../theme/colors';
import styles from './styles';
import { Actions } from 'react-native-router-flux';
import {
  View,
  FlatList,
  Image,
  InteractionManager,
  findNodeHandle,
  TouchableOpacity,
  Platform,
  I18nManager
} from 'react-native';
import { strings, translate } from '../../i18n.js';
import {
  AyezText,
  ItemTile,
  BackButton,
  AnimatedCheckmarkOverlay,
  BasketBlockButton
} from '../_common';
import { DragContainer } from '../_common/DragComponent';

import images from '../../theme/images'
import { sceneKeys, navigateTo, navigateBack } from '../../router';

class StoreShelf extends Component {
  constructor(props) {
    super(props);
    this.state = {
      itemHeight: 0,
      scrollEnabled: true
    };
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      setTimeout(() => {
        const ref = findNodeHandle(this.refs['06_StoreShelf']);
        this.setState({
          bluredViewRef: ref
        });
      }, 100);
    });
  }
  _renderEmptyView() {
    return (
      <View style={styles.emptyComponentContainer}>
        <AyezText regular style={styles.emptyComponentText}>
          {strings('Common.noResults')}
        </AyezText>
      </View>
    );
  }

  _renderItem(items, { _, index }) {
    const itemHeight = this.state.itemHeight;
    const itemWidth = itemHeight * 0.58;
    const numRows = 2;

    if (index % numRows !== 0) return null;
    const topCell = <ItemTile item={items[index]} height={itemHeight} width={itemWidth} draggable />;
    let bottomCell = null;
    if (index + 1 < items.length) {
      bottomCell = <ItemTile item={items[index + 1]} height={itemHeight} width={itemWidth} draggable />;
    }

    return (
      <View style={[styles.itemCell]}>
        {topCell}
        {bottomCell}
      </View>
    );
  }
  _renderHeader() {
    const { title, parent_title } = this.props;
    return (
      <View style={styles.headerContainer}>
        <BackButton style={{ marginLeft: 5 }} />
        <View style={{ flex: 1, alignItems: 'flex-start' }}>
          <AyezText medium size={18}>
            {translate(title)}
          </AyezText>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => navigateBack()}
            style={{ flexDirection: 'row' }}
          >
            <AyezText regular size={13}>{strings('StoreShelf.backTo')}</AyezText>
            <AyezText regular size={13} color={'#0094ff'} style={{ marginLeft: 4 }}>{parent_title}</AyezText>
          </TouchableOpacity>
        </View>
        {this._renderMagnifyingImage()}
      </View>
    );
  }
  _renderMagnifyingImage() {
    return (
      <TouchableOpacity
        onPress={() => {
          navigateTo(sceneKeys.storeSearch);
        }}
      >
        <Image
          style={styles.magnifyingImage}
          resizeMode="contain"
          source={images.magnifying2Icon}
        />
      </TouchableOpacity>
    );
  }
  _onLayout(jumpIndex, event) {
    const { height } = event.nativeEvent.layout;
    this.setState({ itemHeight: height / 2 }, () => {
      console.log('jumpIndex', jumpIndex)
      this.tableRef.scrollToOffset({
        animated: true,
        offset: this.state.itemHeight * 0.58 * jumpIndex
      });
    });
  }
  _onScrollToIndexFailed(info) {
    this.tableRef.scrollToOffset({
      animated: true,
      offset: (this.state.itemHeight / 2) * 0.58 * info.index
    });
  }
  _renderItemList() {
    const { items, jumpIndex } = this.props;
    return (
      <FlatList
        disableVirtualization={I18nManager.isRTL}
        ref={ref => (this.tableRef = ref)}
        style={styles.container}
        onLayout={this._onLayout.bind(this, jumpIndex)}
        horizontal
        onScrollToIndexFailed={this._onScrollToIndexFailed.bind(this)}
        renderItem={this._renderItem.bind(this, items)}
        ListEmptyComponent={this._renderEmptyView.bind(this)}
        data={items}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, index) => index.toString()}
      />
    );
  }
  _renderDragComponent() {
    return (
      <DragContainer
        onDragStart={() =>
          this.tableRef.setNativeProps({ scrollEnabled: false })
        }
        onDragEnd={() => this.tableRef.setNativeProps({ scrollEnabled: true })}
        style={styles.container}
      >
        {this._renderItemList()}
      </DragContainer>
    );
  }
  render() {
    return (
      <View style={styles.container} ref={'06_StoreShelf'}>
        {this._renderHeader()}
        {this._renderDragComponent()}
        <BasketBlockButton
          bluredViewRef={this.state.bluredViewRef}
          showBasketImage={true}
        />
        <AnimatedCheckmarkOverlay />
      </View>
    );
  }
}

export default StoreShelf;
