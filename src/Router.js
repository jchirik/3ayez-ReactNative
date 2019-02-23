import React, { Component } from 'react';
import {
    Easing,
    StyleSheet,
    Animated,
    ActivityIndicator
} from 'react-native';

import { connect } from 'react-redux';

// all root-level functions should take place here
import {
  loadBaskets,
  loadLocale,
  listenCustomerAuthStatus
} from './actions';

import { Scene, Tabs, Router, Lightbox, Stack, Actions } from 'react-native-router-flux';

import LanguageSelect from './components/00_Tutorial/01_LanguageSelect';
import TutorialSwipe from './components/00_Tutorial/02_TutorialSwipe';

import CurrentLocationSelect from './components/01_AddressCreate/01_CurrentLocationSelect';
import AddressSearch from './components/01_AddressCreate/02_AddressSearch';
import RefineLocation from './components/01_AddressCreate/03_RefineLocation';
import AddressDetails from './components/01_AddressCreate/04_AddressDetails';

import Homepage from './components/02_Homepage';
import StorePage from './components/03_StorePage';
import StoreSearch from './components/04_StoreSearch';
import StoreAisle from './components/05_StoreAisle';
import StoreShelf from './components/06_StoreShelf';
import ItemPage from './components/07_ItemPage';
import ItemImageView from './components/07_ItemPage/_components/ItemImageView';
import CustomProduct from './components/08_CustomProduct';
import WorkingBasket from './components/09_WorkingBasket';
import YallaTimeSelect from './components/10_YallaTimeSelect';
import TimeslotSelect from './components/11_TimeslotSelect';
import Checkout from './components/12_Checkout';

import OrderTracker from './components/13_OrderTracker';
import OrderSummary from './components/13_OrderTracker/01_OrderSummary';
import DriverTracker from './components/13_OrderTracker/02_DriverTracker';
import OrderProblem from './components/13_OrderTracker/03_OrderProblem';

import OrderReview from './components/14_OrderReview';
import PhoneEntry from './components/15_Authentication/01_PhoneEntry';
import VerifyCode from './components/15_Authentication/02_VerifyCode';
import SettingsMenu from './components/16_Settings/01_SettingsMenu';
import OrderHistory from './components/16_Settings/02_OrderHistory';

import SupportDetail from './components/17_SupportDetail';
import CouponModal from './components/18_CouponModal';
import SupportChat from './components/19_SupportChat';
import CreditCardManager from './components/20_CreditCardManager';
import CreditCardCreate from './components/21_CreditCardCreate';
import AddressManager from './components/22_AddressManager';
import CustomerFeedback from './components/23_CustomerFeedback';
import AdditionalNotes from './components/24_AdditionalNotes';



// const horizontalTransitionConfig = () => {
//   return {
//     transitionSpec: {
//       duration: 350,
//       easing: Easing.out(Easing.poly(4)),
//       timing: Animated.timing,
//       useNativeDriver: true,
//     },
//     screenInterpolator: sceneProps => {
//       const { layout, position, scene } = sceneProps;
//       const thisSceneIndex = scene.index;
//       const width = layout.initWidth;
//
//       const translateX = position.interpolate({
//         inputRange: [thisSceneIndex - 1, thisSceneIndex],
//         outputRange: [-width, 0],
//       });
//
//       return { transform: [{ translateX }] };
//     },
//   };
// };
//
const verticalTransitionConfig = () => {
  return {
    transitionSpec: {
      duration: 400,
      easing: Easing.out(Easing.poly(4)),
      timing: Animated.timing,
      useNativeDriver: true,
    },
    screenInterpolator: sceneProps => {
      const { layout, position, scene } = sceneProps;

      const thisSceneIndex = scene.index;

      const height = layout.initHeight;

      const translateY = position.interpolate({
        inputRange: [thisSceneIndex - 1, thisSceneIndex],
        outputRange: [height, 0],
      });

      return { transform: [{ translateY }] };
    },
  };
};
//
//
// const zoomTransitionConfig = () => {
//   return {
//     transitionSpec: {
//       duration: 350,
//       easing: Easing.out(Easing.poly(4)),
//       timing: Animated.timing,
//       useNativeDriver: true,
//     },
//     screenInterpolator: sceneProps => {
//       const { layout, position, scene } = sceneProps;
//       const thisSceneIndex = scene.index;
//
//       const scale = position.interpolate({
//         inputRange: [thisSceneIndex - 1, thisSceneIndex],
//         outputRange: [0.5, 1],
//       });
//
//       const opacity = position.interpolate({
//         inputRange: [thisSceneIndex - 1, thisSceneIndex],
//         outputRange: [0, 1],
//       });
//
//       return { transform: [{ scale }], opacity };
//     },
//   };
// };

// <Scene
//   key="locationDetails"
//   component={LocationDetails}
// />

// <Scene
//   key="myTab"
//   title="My Tab"
//   icon={MyTabIcon}
//   onPress={()=> {
//     Actions.myTab_1({type: ActionConst.REFRESH});
//   }}
//  >
//     <Scene key="myTab_1" component={MyTabComponent} hideNavBar/>
// </Scene>



// <Scene
//   hideNavBar
//   title="Stores"
//   key="storeSelect"
//   component={StoreSelect}
// />
// <Scene
//   hideNavBar
//   title="Support"
//   key="support"
//   component={Support}
// />

class RouterComponent extends Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.loadBaskets();
    this.props.loadLocale();
    this.props.listenCustomerAuthStatus();
  }

  onBackPress = () => {
    console.log('currentScene', Actions.currentScene)
    if (Actions.currentScene === 'homepage') {
      console.log('closing app')
      return false
    }
    Actions.pop()
    return true
  }

  render() {
    return (
      <Router
        sceneStyle={{ paddingTop: 0 }}
        backAndroidHandler={this.onBackPress}
      >
        <Lightbox>

          <Stack animationEnabled={true} modal headerMode={'none'}>
                <Stack
                  key="main"
                  hideNavBar
                  initial
                  animationEnabled={true}
                  modal={false}
                  panHandlers={null}
                >
                    <Scene hideNavBar key="homepage" component={Homepage} initial />
                    <Scene key="storePage" component={StorePage} />
                    <Scene key="storeSearch" component={StoreSearch} />
                    <Scene key="storeAisle" component={StoreAisle} />
                    <Scene key="storeShelf" component={StoreShelf} />
                    <Scene key="itemPage" component={ItemPage} />
                    <Scene key="itemImageView" component={ItemImageView} />

                    <Scene key="settings" component={SettingsMenu} />
                    <Scene key="orderHistory" component={OrderHistory} />

                    <Scene key="supportDetail" component={SupportDetail} />

                  <Scene key="creditCardManager" component={CreditCardManager} />

                  <Scene key="orderTracker" component={OrderTracker} />
                  <Scene key="orderSummary" component={OrderSummary} />
                  <Scene key="orderProblem" component={OrderProblem} />
                  <Scene key="driverTracker" component={DriverTracker} />
                  <Scene key="addressManager" component={AddressManager} />

              </Stack>

          {/* any modals */}

          <Stack key="tutorial" hideNavBar panHandlers={null}>
            <Scene key="languageSelect" component={LanguageSelect} />
            <Scene key="tutorialSwipe" component={TutorialSwipe} />
          </Stack>

          <Stack key="checkoutFlow" headerMode={'none'} animationEnabled={true}>
            <Scene key="workingBasket" component={WorkingBasket} />
            <Scene key="yallaTimeSelect" component={YallaTimeSelect} />
            <Scene key="timeslotSelect" component={TimeslotSelect} panHandlers={null} />
            <Scene key="checkout" component={Checkout} panHandlers={null} />
          </Stack>

          <Scene key="additionalNotes" component={AdditionalNotes} />

          <Stack key="auth" hideNavBar panHandlers={null}>
            <Scene key="phoneEntry" component={PhoneEntry} />
            <Scene key="verifyCode" component={VerifyCode} />
          </Stack>

          <Stack key="addressCreate" hideNavBar panHandlers={null}>
            <Scene key="currentLocationSelect" component={CurrentLocationSelect} />
            <Scene key="addressSearch" component={AddressSearch} />
            <Scene key="refineLocation" component={RefineLocation} />
            <Scene key="addressDetails" component={AddressDetails} />
          </Stack>
          <Scene key="customProduct" component={CustomProduct} />
          <Scene key="creditCardCreate" component={CreditCardCreate} />
          <Scene key="orderReview" component={OrderReview} panHandlers={null}/>
          <Scene key="supportChat" component={SupportChat} />
          <Scene key="customerFeedback" component={CustomerFeedback} panHandlers={null}/>
        </Stack>

        {/* Any global modals (in Lightbox) */}
        <Scene
          key="couponModal"
          component={CouponModal}
        />
        </Lightbox>
      </Router>
    );
  }
};


export default connect(null, {
  loadBaskets,
  loadLocale,
  listenCustomerAuthStatus
})(RouterComponent);
