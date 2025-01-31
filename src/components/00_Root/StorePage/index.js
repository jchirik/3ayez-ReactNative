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

import { StorePopup } from './StorePopup';
import CategoriesBrowse from './02_CategoriesBrowse';

import {
  AnimatedCheckmarkOverlay,
  ItemTile,
  BasketBlockButton,
  BackButton,
  AyezText,
  OrderStatusBar
} from '../../_common';

import {
  strings,
  translate,
  FONT_MEDIUM
} from '../../../i18n.js';

import {
  STATUS_BAR_HEIGHT,
  AYEZ_GREEN
} from '../../../Helpers';

import {
  fetchStore
} from '../../../actions';

import styles from './styles';
import colors from '../../../theme/colors';
import images from '../../../theme/images'

const window = Dimensions.get('window');

import AddressSelection from './AddressSelection';

import {
  CollapsibleHeaderScrollView,
  PARALLAX_HEADER_HEIGHT
} from './CollapsibleHeaderScrollView';
import { sceneKeys, navigateTo, navigateBackTo } from '../../../router';
import NetworkErrorMessage from '../../_common/NetworkErrorMessage';
const STICKY_HEADER_HEIGHT = 68; // EDIT THIS 86
const SCROLL_HEIGHT = PARALLAX_HEADER_HEIGHT - STICKY_HEADER_HEIGHT;
const TAB_BAR_HEIGHT = 52;

class StorePage extends Component {

    constructor(props) {
      super(props);
      // this.nScroll.addListener(
      //   Animated.event([{ value: this.scroll }], { useNativeDriver: false })
      // );
      this.state = {
        tabs: [
          strings('StoreHome.categories')
        ],
        tabBarHeight: 0,
        selected_tab: 0,
        itemHeight: 0,

        popupVisible: false,
        isSideMenuOpen: false,
        isAddressSelectionVisible: false
      };
    }


  componentDidMount() {
    //listens to hardwareBackPress
    BackHandler.addEventListener('hardwareBackPress', () => {
      console.log("Can't pop. Exiting the app...");
      return false;
    });
  }

  componentDidUpdate(prevProps, prevState) {
    // this listener is STILL RUNNING IN FUTURE COMPONENTS
    if (!this.props.categories_loading && prevProps.categories_loading) {
      // if (this.props.featured.length) {
      //   this.setState({
      //     tabs: [ strings('StoreHome.featured'), strings('StoreHome.categories') ],
      //     tabBarHeight: TAB_BAR_HEIGHT
      //   })
      // } else {
      //   this.setState({
      //     tabs: [ strings('StoreHome.categories') ],
      //     tabBarHeight: 0
      //   })
      // }
      if (this.props.popup) {
        setTimeout(() => {
          this.setState({ popupVisible: true })
        }, 300)
      }
    }

    // console.log('SELLERID', this.props.seller_id, prevProps.seller_id)
    // if (this.props.popup && (this.props.seller_id !== prevProps.seller_id)) {

    // }
  }

  componentWillUnmount() {
    console.log('Unmounting app, removing listeners');
    BackHandler.removeEventListener('hardwareBackPress');
  }

  // nScroll = new Animated.Value(0);
  // Make tabs stop moving up
  // tabY = this.nScroll.interpolate({
  //   inputRange: [0, SCROLL_HEIGHT, SCROLL_HEIGHT + 1],
  //   outputRange: [0, 0, 1]
  // });
  //
  // tabsStylesAttributes = [
  //   {
  //     width: '20%',
  //     margin: '16%'
  //   },
  //   {
  //     width: '24%',
  //     margin: '63%'
  //   }
  // ];

  // renderTabs() {
  //   if (this.props.featured_loading || this.props.categories_loading || this.state.tabs.length < 2) {
  //     return null;
  //   }
  //   return (
  //     <Animated.View
  //       style={{
  //         transform: [{ translateY: this.tabY }],
  //         zIndex: 1,
  //         width: '100%',
  //         height: this.state.tabBarHeight,
  //         position: 'absolute',
  //         borderBottomWidth: 0.5,
  //         borderColor: 'rgba(0, 0, 0, 0.15)',
  //         bottom: 0
  //       }}
  //     >
  //       <SegmentedControlTab
  //         values={this.state.tabs}
  //         tabsContainerStyle={{
  //           height: '100%',
  //           backgroundColor: colors.paleGrey
  //         }}
  //         activeTabStyle={{
  //           backgroundColor: colors.paleGrey,
  //           borderBottomColor: AYEZ_GREEN
  //         }}
  //         tabStyle={{
  //           marginTop: 5,
  //           marginHorizontal: 20,
  //           borderWidth: 0,
  //           borderBottomWidth: 4,
  //           backgroundColor: colors.paleGrey,
  //           borderColor: 'transparent'
  //         }}
  //         selectedIndex={this.state.selected_tab}
  //         onTabPress={index => {
  //           this.setState({ selected_tab: index });
  //         }}
  //         tabTextStyle={{
  //           fontSize: 14,
  //           color: '#8E8E93',
  //           fontFamily: FONT_MEDIUM(),
  //         }}
  //         activeTabTextStyle={{
  //           fontSize: 14,
  //           color: '#2DD38F',
  //           fontFamily: FONT_MEDIUM()
  //         }}
  //         borderRadius={0}
  //       />
  //     </Animated.View>
  //   );
  // }

  renderBasket() {
    return (
      <TouchableOpacity
        style={styles.basketIconStyle}
        onPress={() => {
          navigateTo(sceneKeys.checkoutFlow, { bluredViewRef: this.state.bluredViewRef })
        }}
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

  renderAddressBar() {
    const { address, area } = this.props;

    if (!area) { return null; }

    return (
      <TouchableOpacity style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 9,
        paddingBottom: 8,
        backgroundColor: '#222222',
        paddingHorizontal: 20,
        zIndex: 2
      }}
        activeOpacity={1}
        onPress={() => this.setState({ isAddressSelectionVisible: true })}
      >
        <View style={{ alignItems: 'flex-start' }}>
          <AyezText medium color={'white'}>{strings('StoreSelect.deliveringTo')}</AyezText>
          <View style={{ flexDirection: 'row' }}>
            <AyezText regular color={'white'}>{address.building ? `${address.building} ` : ''}{address.street || address.title}</AyezText>
            <AyezText
              regular
              color={'#bababa'}
              style={{ marginLeft: 5 }}
              >{translate(area.display_name)}</AyezText>
          </View>
        </View>
        <View style={{ flex: 1 }} />
        <AyezText
          regular
          color={AYEZ_GREEN}
          >{'change'}</AyezText>
      </TouchableOpacity>
    )
  }

  render() {

    if (!this.props.seller_id) { return null; }

    const { selected_tab, tabs, tabBarHeight } = this.state;

    let mainScrollComponent = null;
    if (this.props.requestFailed === true) {
      mainScrollComponent = (
        <NetworkErrorMessage
          onPress={ () => {this.props.fetchStore(this.props.seller_id)} }
        />
      );
    }
    else if (this.props.categories_loading) {
      mainScrollComponent = (
        <ActivityIndicator size="small" style={{ flex: 1, marginTop: 50 }} />
      );
    } else {
      mainScrollComponent = (<CategoriesBrowse />);
    }

// {this.renderAddressBar()}
    return (
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <OrderStatusBar color={this.props.seller_color}/>

        <View style={styles.container}>
          <CollapsibleHeaderScrollView
            tabBarHeight={tabBarHeight}
            headerHeight={PARALLAX_HEADER_HEIGHT + tabBarHeight}
            statusBarHeight={STICKY_HEADER_HEIGHT + tabBarHeight}
            disableHeaderSnap={true}
            displayName={this.props.display_name}
            logo_url={this.props.logo_url}
            cover_url={this.props.cover_url}
            color={this.props.seller_color}
            location_text={this.props.location_text}
            Tabs={null}
          >
            {mainScrollComponent}
          </CollapsibleHeaderScrollView>

          {this.renderBasket()}
          <BasketBlockButton bluredViewRef={this.state.bluredViewRef} />

        </View>

        <BackButton
          fixed
          color={'white'}
          onPress={() => navigateTo(sceneKeys.storeSelect)}
          />

        <AnimatedCheckmarkOverlay />
        <AddressSelection
          onClose={() => this.setState({ isAddressSelectionVisible: false })}
          isVisible={this.state.isAddressSelectionVisible}
          />

        <View
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: 'black',
            opacity: (this.state.isSideMenuOpen ? 0.4 : 0)
          }}
          pointerEvents="none"
        />
        <StorePopup
          visible={this.state.popupVisible}
          onClose={() => this.setState({ popupVisible: false })}
          popup={this.props.popup}
        />
      </View>
    );
  }
}

const mapStateToProps = ({ Seller, Settings, Baskets, Addresses, SellerSearch }) => {
  const {
    id,
    color,
    logo_url,
    cover_url,
    promotions,
    categories_loading,
    location_text,
    display_name,
    popup,
    requestFailed
  } = Seller;

  const { locale } = Settings;

  const { address } = Addresses;
  const { area } = SellerSearch;

  let basket_quantity = 0;
  if (Seller.id && Baskets.baskets && Baskets.baskets[Seller.id]) {
    basket_quantity = Baskets.baskets[Seller.id].basket_quantity;
  }

  return {
    locale,
    address,
    area,
    seller_id: id,
    seller_color: color,
    popup,
    logo_url,
    cover_url,
    promotions,
    categories_loading,
    location_text,
    display_name,
    basket_quantity,
    requestFailed
  };
};

export default connect(
  mapStateToProps,
  {fetchStore}
)(StorePage);
