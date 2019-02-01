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

import { Scene, Tabs, Router, Lightbox, Stack } from 'react-native-router-flux';

import LanguageSelect from './components/00_Tutorial/01_LanguageSelect';
import TutorialSwipe from './components/00_Tutorial/02_TutorialSwipe';

import PhoneEntry from './components/14_Authentication/01_PhoneEntry';
import VerifyCode from './components/14_Authentication/02_VerifyCode';

import CurrentLocationSelect from './components/01_AddressCreate/01_CurrentLocationSelect';
import AddressSearch from './components/01_AddressCreate/02_AddressSearch';
import RefineLocation from './components/01_AddressCreate/03_RefineLocation';
import AddressDetails from './components/01_AddressCreate/04_AddressDetails';
import AddressDetailEdit from './components/01_AddressCreate/05_AddressDetailEdit';
import AddressConfirm from './components/01_AddressCreate/06_AddressConfirm';

import Homepage from './components/02_Homepage';
// import Discovery from './components/02_Homepage/01_Discovery';
// import StoreSelect from './components/02_Homepage/02_StoreSelect';
// import Support from './components/02_Homepage/03_Support';
// import UniversalSearch from './components/02_Homepage/04_UniversalSearch';

import StorePage from './components/03_StorePage';
import StoreSearch from './components/04_StoreSearch';
import StoreCategory from './components/05_StoreCategory';
import StoreShelf from './components/06_StoreShelf';
import ItemPage from './components/07_ItemPage';
import WorkingBasket from './components/08_WorkingBasket';


import TimeslotSelect from './components/09_TimeslotSelect';
import Checkout from './components/10_Checkout';
import CheckoutNotesDetail from './components/10_Checkout/01_CheckoutNotesDetail';


import OrderTracker from './components/10_OrderTracker';
import OrderSummary from './components/10_OrderTracker/01_OrderSummary';
import DriverTracker from './components/10_OrderTracker/02_DriverTracker';
import OrderProblem from './components/10_OrderTracker/03_OrderProblem';


import SettingsMenu from './components/11_Settings/01_SettingsMenu';
import OrderHistory from './components/11_Settings/02_OrderHistory';


import CouponModal from './components/12_CouponModal';
import OrderReview from './components/13_OrderReview';

import SupportChat from './components/15_SupportChat';

import SupportDetail from './components/16_SupportDetail';
import CreditCardManager from './components/17_CreditCardManager';
import CreditCardCreate from './components/18_CreditCardCreate';


import AddressManager from './components/19_AddressManager';

import CustomerFeedback from './components/20_CustomerFeedback';
// import LocationDetails from './components/02_LocationDetails';
// import StoreSelector from './components/03_StoreSelector';







// run all app listening HERE
// ** look this up, to make sure it works
// --> where do listeners go for apps like this? service?
// listenCustomerAuthStatus,
// listenToActiveOrders,
// endListeningToActiveOrders,

// import TimerCountdown from 'react-native-timer-countdown';





// AsyncStorage.getItem('LASTAREA', (err, area_t) => {
//   if (area_t) {
//     const area = JSON.parse(area_t);
//     // console.log('LAST AREA', area);
//     this.props.setArea(area);
//   } else {
//     Actions.locationSelect();
//   }
// });
//


  // componentDidUpdate(prevProps) {
  //   if (this.props.area && (this.props.area.id !== prevProps.area.id)) {
  //     this.setState({ currentIndex: 0 });
  //     // console.log('UPDATED AREA!!!!!')
  //     this.props.findStoresForLocation(this.props.area.id);
  //   }
  //
  //   if (!prevProps.isLoggedIn && this.props.isLoggedIn) {
  //     this.props.listenToActiveOrders();
  //   }
  //
  //   if ((this.props.substitutionOrder !== prevProps.substitutionOrder) && this.props.substitutionOrder) {
  //     this.setState({ substitutionModal: true });
  //   } else if ((this.props.substitutionOrder !== prevProps.substitutionOrder) && !this.props.substitutionOrder) {
  //     this.setState({ substitutionModal: false });
  //   }
  //
  //   // if (prevProps.activeOrders !== this.props.activeOrders) {
  //   //   this.checkRelevantOrders();
  //   // }
  // }
  //
  //
  //
  // componentWillUnmount() {
  // //  AppState.removeEventListener('change', this.handleAppReopen);
  //   console.log('unmounting');
  //   this.props.endListeningToActiveOrders()
  // }


















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
// const verticalTransitionConfig = () => {
//   return {
//     transitionSpec: {
//       duration: 400,
//       easing: Easing.out(Easing.poly(4)),
//       timing: Animated.timing,
//       useNativeDriver: true,
//     },
//     screenInterpolator: sceneProps => {
//       const { layout, position, scene } = sceneProps;
//
//       const thisSceneIndex = scene.index;
//
//       const height = layout.initHeight;
//
//       const translateY = position.interpolate({
//         inputRange: [thisSceneIndex - 1, thisSceneIndex],
//         outputRange: [height, 0],
//       });
//
//       return { transform: [{ translateY }] };
//     },
//   };
// };
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
  // <Scene
  //   hideNavBar
  //   title="Today"
  //   key="discovery"
  //   component={Discovery}
  // />

  // <Scene
  //   hideNavBar
  //   title="Search"
  //   key="universalSearch"
  //   component={UniversalSearch}
  // />


  render() {
    return (
      <Router
        sceneStyle={{ paddingTop: 0 }}
      >
        <Lightbox>
          <Stack
            key="main"
            hideNavBar
            initial
            panHandlers={null}
            animationEnabled={true}
          >
            <Scene
              hideNavBar
              key="homepage"
              component={Homepage}
              initial
            />
            <Scene
              key="storePage"
              component={StorePage}
            />
            <Scene
              key="storeSearch"
              component={StoreSearch}
            />
            <Scene
              key="storeCategory"
              component={StoreCategory}
            />
            <Scene
              key="storeShelf"
              component={StoreShelf}
            />
            <Scene
              key="itemPage"
              component={ItemPage}
            />
            <Scene
              key="workingBasket"
              component={WorkingBasket}
            />

            <Scene
              key="timeslotSelect"
              component={TimeslotSelect}
            />

            <Scene
              key="checkout"
              component={Checkout}
            />
            <Scene
              key="checkoutNotesDetail"
              component={CheckoutNotesDetail}
            />



            <Scene
              key="settings"
              component={SettingsMenu}
            />
            <Scene
              key="orderHistory"
              component={OrderHistory}
            />



            <Stack
              key="tutorial"
              hideNavBar
            >
              <Scene
                key="languageSelect"
                component={LanguageSelect}
              />
              <Scene
                key="tutorialSwipe"
                component={TutorialSwipe}
              />
            </Stack>

            <Stack
              key="auth"
              hideNavBar
            >
              <Scene
                key="phoneEntry"
                component={PhoneEntry}
              />
              <Scene
                key="verifyCode"
                component={VerifyCode}
              />
            </Stack>

          <Scene
            key="supportChat"
            component={SupportChat}
          />
          <Scene
            key="supportDetail"
            component={SupportDetail}
          />

          <Scene
            key="creditCardManager"
            component={CreditCardManager}
          />
          <Scene
            key="creditCardCreate"
            component={CreditCardCreate}
          />


          <Scene
            key="orderTracker"
            component={OrderTracker}
          />
          <Scene
            key="orderSummary"
            component={OrderSummary}
          />
          <Scene
            key="orderProblem"
            component={OrderProblem}
          />
          <Scene
            key="driverTracker"
            component={DriverTracker}
          />
          <Scene
            key="addressManager"
            component={AddressManager}
          />



          <Scene
            key="couponModal"
            component={CouponModal}
          />

          <Scene
            key="orderReview"
            component={OrderReview}
          />





          <Stack
            key="addressCreate"
            hideNavBar
          >
            <Scene
              key="currentLocationSelect"
              component={CurrentLocationSelect}
            />
            <Scene
              key="addressSearch"
              component={AddressSearch}
            />
            <Scene
              key="refineLocation"
              component={RefineLocation}
            />
            <Scene
              key="addressDetails"
              component={AddressDetails}
            />
            <Scene
              key="addressDetailEdit"
              component={AddressDetailEdit}
            />
            <Scene
              key="addressConfirm"
              component={AddressConfirm}
            />
          </Stack>


          <Scene
            key="customerFeedback"
            component={CustomerFeedback}
          />

          </Stack>
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
