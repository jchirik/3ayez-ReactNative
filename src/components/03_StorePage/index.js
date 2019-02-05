import React, { Component } from 'react';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import {
  View,
  FlatList,
  Animated,
  TouchableOpacity,
  Image,
  Dimensions,
  TextInput,
  BackHandler,
  InteractionManager,
  findNodeHandle
} from 'react-native';
import FastImage from 'react-native-fast-image';

import { onSelectCategory } from '../../actions';

import SegmentedControlTab from 'react-native-segmented-control-tab';

import FeaturedBrowse from './01_FeaturedBrowse';

import {
  AnimatedCheckmarkOverlay,
  ItemTile,
  BasketBlockButton,
  BackButton,
  AyezText
} from '../_common';

import {
  strings,
  translate,
  FONT_LIGHT
} from '../../i18n.js';

import styles from './styles';
import colors from '../../theme/colors';

import {
  CollapsibleHeaderScrollView,
  PARALLAX_HEADER_HEIGHT,
  TAB_BAR_HEIGHT
} from './CollapsibleHeaderScrollView';
const window = Dimensions.get('window');
const STICKY_HEADER_HEIGHT = 86;
const SCROLL_HEIGHT = PARALLAX_HEADER_HEIGHT - STICKY_HEADER_HEIGHT;
const CATEGORY_COL_NUM = 2;
const CATEGORY_SCROLL_EVENT_THROTTLE = 16;


class StorePage extends Component {

  componentDidMount() {
    //listens to hardwareBackPress
    BackHandler.addEventListener('hardwareBackPress', () => {
      try {
        Actions.pop();
        return true;
      } catch (err) {
        console.debug("Can't pop. Exiting the app...");
        return false;
      }
    });
    InteractionManager.runAfterInteractions(() => {
      setTimeout(() => {
        this.setState({
          bluredViewRef: findNodeHandle(this.refs['03_StorePage'])
        });
      }, 100);
    });
  }

  componentWillUnmount() {
    console.log('Unmounting app, removing listeners');
    BackHandler.removeEventListener('hardwareBackPress');
  }

  nScroll = new Animated.Value(0);
  // Make tabs stop moving up
  tabY = this.nScroll.interpolate({
    inputRange: [0, SCROLL_HEIGHT, SCROLL_HEIGHT + 1],
    outputRange: [0, 0, 1]
  });

  tabsStylesAttributes = [
    {
      width: '20%',
      margin: '16%'
    },
    {
      width: '24%',
      margin: '63%'
    }
  ];

  constructor(props) {
    super(props);
    this.nScroll.addListener(
      Animated.event([{ value: this.scroll }], { useNativeDriver: false })
    );
    this.state = {
      selected_tab: 0,
      itemHeight: 0
    };
  }

  onSelectCategory(category) {
    this.props.onSelectCategory(this.props.seller_id, category);
    Actions.storeAisle();
  }


  // Categories tab
  renderItem({ item, index }) {
    return (
      <TouchableOpacity
        style={{
          marginBottom: 2,
          justifyContent: 'center',
          alignItems: 'center',
          width: window.width/2,
          height: 140,
          paddingLeft: index % 2 == 0 ? '5.3%' : '1.4%',
          paddingRight: index % 2 == 0 ? '1.4%' : '5.3%'
        }}
        onPress={this.onSelectCategory.bind(this, item)}
      >
        <View style={styles.categoryCard}>
          <FastImage
            source={{ uri: item.image_url }}
            style={styles.categoryImage}
            resizeMode={'cover'}
          />
        </View>

        <AyezText size={12}
          regular style={{ marginTop: 6 }}>{translate(item.name)}</AyezText>
      </TouchableOpacity>
    );
  }


  renderCategories() {
    console.log('CATEGORIES', this.props.categories);
    return (
      <FlatList
        data={this.props.categories}
        renderItem={this.renderItem.bind(this)}
        style={styles.categoryList}
        removeClippedSubviews
        ListHeaderComponent={null}
        numColumns={CATEGORY_COL_NUM}
        ListEmptyComponent={null}
        ListFooterComponent={null}
        scrollEventThrottle={CATEGORY_SCROLL_EVENT_THROTTLE}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item, index) => index.toString()}
      />
    );
  }

  renderTabs() {
    const tabs = [
      strings('StoreHome.featured'),
      strings('StoreHome.categories')
    ];
    return (
      <Animated.View
        style={{
          transform: [{ translateY: this.tabY }],
          zIndex: 1,
          width: '100%',
          height: TAB_BAR_HEIGHT,
          position: 'absolute',
          borderBottomWidth: 0.5,
          borderColor: 'rgba(0, 0, 0, 0.15)',
          bottom: 0
        }}
      >
        <SegmentedControlTab
          values={tabs}
          tabsContainerStyle={{
            height: '100%',
            backgroundColor: colors.paleGrey
          }}
          activeTabStyle={{ backgroundColor: colors.paleGrey }}
          tabStyle={{
            backgroundColor: colors.paleGrey,
            borderWidth: 0,
            borderColor: 'transparent'
          }}
          selectedIndex={this.state.selected_tab}
          onTabPress={index => {
            this.setState({ selected_tab: index });
          }}
          tabTextStyle={{
            fontSize: 14,
            color: '#8E8E93',
            fontFamily: FONT_LIGHT()
          }}
          activeTabTextStyle={{
            fontSize: 14,
            color: '#2DD38F',
            fontFamily: FONT_LIGHT()
          }}
        />
        <View
          style={{
            height: 3,
            backgroundColor: '#2DD38F',
            width: this.tabsStylesAttributes[this.state.selected_tab].width,
            marginLeft: this.tabsStylesAttributes[this.state.selected_tab].margin,
            marginTop: -3.5
          }}
        />
      </Animated.View>
    );
  }

  renderHeaderBackground() {
    return (
      <View key="background">
        <Image
          source={require('./storeImage.jpg')}
          style={{ width: window.width, height: PARALLAX_HEADER_HEIGHT }}
        />
        <View
          style={{
            position: 'absolute',
            top: 0,
            width: window.width,
            height: PARALLAX_HEADER_HEIGHT
          }}
        />
      </View>
    );
  }

  renderBasket() {
    return (
      <TouchableOpacity
        style={styles.basketIconStyle}
        onPress={() =>
          Actions.checkoutFlow({ bluredViewRef: this.state.bluredViewRef })
        }
      >
        <Image
          source={require('../../../assets/images_v2/basket_button.png')}
          style={{ width: 28, height: 28, tintColor: 'white' }}
          resizeMode={'contain'}
        />
        {this.props.basket_quantity > 0 ? (
          <View style={styles.basketQuantityBadgeTextStyle}>
            <AyezText regular size={10} color={'#2DD38F'}>
              {this.props.basket_quantity}
            </AyezText>
          </View>
        ) : null}
      </TouchableOpacity>
    );
  }

  render() {
    return (
      <View ref={'03_StorePage'} style={styles.container}>
        <CollapsibleHeaderScrollView
          headerHeight={PARALLAX_HEADER_HEIGHT + TAB_BAR_HEIGHT}
          statusBarHeight={STICKY_HEADER_HEIGHT + TAB_BAR_HEIGHT}
          disableHeaderSnap={true}
          displayName={this.props.display_name}
          logo_url={this.props.logo_url}
          delivery_time={this.props.delivery_time}
          delivery_fee={this.props.delivery_fee}
          Tabs={this.renderTabs()}
        >
          {this.state.selected_tab == 0
              ? <FeaturedBrowse />
              : this.renderCategories()}
        </CollapsibleHeaderScrollView>
        {this.renderBasket()}
        <BasketBlockButton bluredViewRef={this.state.bluredViewRef} />
        <AnimatedCheckmarkOverlay />
        <BackButton fixed />
      </View>
    );
  }
}

const mapStateToProps = state => {
  const {
    id,
    logo_url,
    promotions,
    featured,
    categories,
    delivery_fee,
    delivery_time,
    display_name
  } = state.Seller;
  const { basket_quantity } = state.Baskets.baskets[id];
  return {
    seller_id: id,
    logo_url,
    promotions,
    featured,
    categories,
    delivery_fee,
    delivery_time,
    display_name,
    basket_quantity
  };
};

const mapDispatchToProps = (dispatch, props) => {};

export default connect(
  mapStateToProps,
  {
    onSelectCategory
  }
)(StorePage);
