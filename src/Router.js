import React, { Component } from 'react';
import {
    Easing,
    StyleSheet,
    Animated
} from 'react-native';

import { connect } from 'react-redux';

// all root-level functions should take place here
import {
  loadBaskets,
  loadLocale
} from './actions';

import { Scene, Router, Modal, Stack } from 'react-native-router-flux';

import AddressSelect from './components/01_AddressSelect';

import StoreSelect from './components/02_Homepage/02_StoreSelect';
import StorePage from './components/03_StorePage';
import StoreCategory from './components/05_StoreCategory';
import StoreShelf from './components/06_StoreShelf';
import ItemPage from './components/07_ItemPage';
import WorkingBasket from './components/08_WorkingBasket';
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


class RouterComponent extends Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.loadBaskets();
    this.props.loadLocale();
  }

  render() {
    return (
      <Router
        sceneStyle={{ paddingTop: 0 }}
      >
        <Stack
          key="main"
          hideNavBar
          initial
          panHandlers={null}
          duration={0}
          animationEnabled={false}
        >
          <Scene
            key="storeSelect"
            component={StoreSelect}
          />
          <Scene
            key="storePage"
            component={StorePage}
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
            key="addressSelect"
            component={AddressSelect}
          />
        </Stack>
      </Router>
    );
  }
};

export default connect(null, {
  loadBaskets,
  loadLocale
})(RouterComponent);
