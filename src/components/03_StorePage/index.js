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
  ActivityIndicator,
  I18nManager,
  Platform,
  findNodeHandle
} from 'react-native';
import SegmentedControlTab from 'react-native-segmented-control-tab';

import FeaturedBrowse from './01_FeaturedBrowse';
import CategoriesBrowse from './02_CategoriesBrowse';

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

import {
  STATUS_BAR_HEIGHT,
  AYEZ_GREEN
} from '../../Helpers';


import styles from './styles';
import colors from '../../theme/colors';
import images from '../../theme/images'

import {
  CollapsibleHeaderScrollView,
  PARALLAX_HEADER_HEIGHT,
  TAB_BAR_HEIGHT
} from './CollapsibleHeaderScrollView';
const STICKY_HEADER_HEIGHT = 68 + STATUS_BAR_HEIGHT; // EDIT THIS 86
const SCROLL_HEIGHT = PARALLAX_HEADER_HEIGHT - STICKY_HEADER_HEIGHT;

class StorePage extends Component {

    constructor(props) {
      super(props);
      this.nScroll.addListener(
        Animated.event([{ value: this.scroll }], { useNativeDriver: false })
      );
      this.state = {
        tabs: [
          strings('StoreHome.categories')
        ],
        selected_tab: 0,
        itemHeight: 0
      };
    }


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

  componentDidUpdate(prevProps) {
    // this listener is STILL RUNNING IN FUTURE COMPONENTS
    if (!this.props.featured_loading && prevProps.featured_loading) {
      if (this.props.featured.length) {
        this.setState({
          tabs: [ strings('StoreHome.featured'), ...this.state.tabs ]
        })
      }
    }
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

  renderTabs() {
    if (this.props.featured_loading || this.props.categories_loading) {
      return null;
    }
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
          values={this.state.tabs}
          tabsContainerStyle={{
            height: '100%',
            backgroundColor: colors.paleGrey
          }}
          activeTabStyle={{
            backgroundColor: colors.paleGrey,
            borderBottomColor: AYEZ_GREEN
          }}
          tabStyle={{
            marginTop: 5,
            marginHorizontal: 20,
            borderWidth: 0,
            borderBottomWidth: 4,
            backgroundColor: colors.paleGrey,
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
          borderRadius={0}
        />
      </Animated.View>
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
          source={images.basket2Icon}
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
    const { selected_tab, tabs } = this.state;

    let mainScrollComponent = null;
    if (this.props.featured_loading || this.props.categories_loading) {
      mainScrollComponent = (
        <ActivityIndicator size="small" style={{ flex: 1 }} />
      );
    } else if (tabs[selected_tab] === strings('StoreHome.featured')) {
      mainScrollComponent = (<FeaturedBrowse />);
    } else {
      mainScrollComponent = (<CategoriesBrowse />);
    }

    return (
      <View ref={'03_StorePage'} style={styles.container}>
        <CollapsibleHeaderScrollView
          headerHeight={PARALLAX_HEADER_HEIGHT + TAB_BAR_HEIGHT}
          statusBarHeight={STICKY_HEADER_HEIGHT + TAB_BAR_HEIGHT}
          disableHeaderSnap={true}
          displayName={this.props.display_name}
          logo_url={this.props.logo_url}
          cover_url={this.props.cover_url}
          location_text={this.props.location_text}
          Tabs={this.renderTabs()}
        >
          {mainScrollComponent}
        </CollapsibleHeaderScrollView>
        {this.renderBasket()}
        <BasketBlockButton bluredViewRef={this.state.bluredViewRef} />
        <AnimatedCheckmarkOverlay />
        <BackButton fixed color={'white'} />
      </View>
    );
  }
}

const mapStateToProps = ({ Seller, Baskets }) => {
  const {
    id,
    logo_url,
    cover_url,
    promotions,
    featured_loading,
    featured,
    categories_loading,
    location_text,
    display_name
  } = Seller;

  const { basket_quantity } = Baskets.baskets[Seller.id];
  return {
    seller_id: id,
    logo_url,
    cover_url,
    promotions,
    featured_loading,
    featured,
    categories_loading,
    location_text,
    display_name,
    basket_quantity
  };
};

export default connect(
  mapStateToProps,
  null
)(StorePage);
