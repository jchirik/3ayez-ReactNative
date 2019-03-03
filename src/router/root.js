import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Scene,
  Router,
  Lightbox,
  Stack,
  Actions
} from 'react-native-router-flux';

import * as components from '../components'

import { loadBaskets, loadLocale, listenCustomerAuthStatus } from '../actions';
const sceneKeys = components.sceneKeys

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
    console.log('currentScene', Actions.currentScene);
    if (Actions.currentScene === sceneKeys.homepage) {
      console.log('closing app');
      return false;
    }
    navigateBack();
    return true;
  };

  render() {
    return (
      <Router
        sceneStyle={{ paddingTop: 0 }}
        backAndroidHandler={this.onBackPress}
      >
        <Lightbox>
          <Stack animationEnabled={true} modal headerMode={'none'}>
            <Stack
              key={sceneKeys.main}
              hideNavBar
              initial
              animationEnabled={true}
              modal={false}
              panHandlers={null}
            >
              <Scene
                hideNavBar
                key={sceneKeys.homepage}
                component={components.Homepage}
                initial
              />
              <Scene key={sceneKeys.storePage} component={components.StorePage} />
              <Scene key={sceneKeys.storeSearch} component={components.StoreSearch} />
              <Scene key={sceneKeys.storeAisle} component={components.StoreAisle} />
              <Scene key={sceneKeys.storeShelf} component={components.StoreShelf} />
              <Scene key={sceneKeys.itemPage} component={components.ItemPage} />
              <Scene key={sceneKeys.itemImageView} component={components.ItemImageView} />

              <Scene key={sceneKeys.settings} component={components.SettingsMenu} />
              <Scene key={sceneKeys.orderHistory} component={components.OrderHistory} />

              <Scene key={sceneKeys.supportDetail} component={components.SupportDetail} />

              <Scene
                key={sceneKeys.creditCardManager}
                component={components.CreditCardManager}
              />

              <Scene key={sceneKeys.orderTracker} component={components.OrderTracker} />
              <Scene key={sceneKeys.orderSummary} component={components.OrderSummary} />
              <Scene key={sceneKeys.orderProblem} component={components.OrderProblem} />
              <Scene key={sceneKeys.driverTracker} component={components.DriverTracker} />
              <Scene
                key={sceneKeys.addressManager}
                component={components.AddressManager}
              />
            </Stack>

            {/* any modals */}

            <Stack key={sceneKeys.tutorial} hideNavBar panHandlers={null}>
              <Scene
                key={sceneKeys.languageSelect}
                component={components.LanguageSelect}
              />
              <Scene key={sceneKeys.tutorialSwipe} component={components.TutorialSwipe} />
            </Stack>

            <Stack
              key={sceneKeys.checkoutFlow}
              headerMode={'none'}
              animationEnabled={true}
            >
              <Scene key={sceneKeys.workingBasket} component={components.WorkingBasket} />
              <Scene
                key={sceneKeys.yallaTimeSelect}
                component={components.YallaTimeSelect}
              />
              <Scene
                key={sceneKeys.timeslotSelect}
                component={components.TimeslotSelect}
                panHandlers={null}
              />
              <Scene
                key={sceneKeys.checkout}
                component={components.Checkout}
                panHandlers={null}
              />
            </Stack>

            <Scene
              key={sceneKeys.additionalNotes}
              component={components.AdditionalNotes}
            />

            <Stack key={sceneKeys.auth} hideNavBar panHandlers={null}>
              <Scene key={sceneKeys.phoneEntry} component={components.PhoneEntry} />
              <Scene key={sceneKeys.verifyCode} component={components.VerifyCode} />
            </Stack>

            <Stack key={sceneKeys.addressCreate} hideNavBar panHandlers={null}>
              <Scene
                key={sceneKeys.currentLocationSelect}
                component={components.CurrentLocationSelect}
              />
              <Scene key={sceneKeys.addressSearch} component={components.AddressSearch} />
              <Scene
                key={sceneKeys.refineLocation}
                component={components.RefineLocation}
              />
              <Scene
                key={sceneKeys.addressDetails}
                component={components.AddressDetails}
              />
            </Stack>
            <Scene key={sceneKeys.customProduct} component={components.CustomProduct} />
            <Scene
              key={sceneKeys.creditCardCreate}
              component={components.CreditCardCreate}
            />
            <Scene
              key={sceneKeys.orderReview}
              component={components.OrderReview}
              panHandlers={null}
            />
            <Scene key={sceneKeys.supportChat} component={components.SupportChat} />
            <Scene
              key={sceneKeys.customerFeedback}
              component={components.CustomerFeedback}
              panHandlers={null}
            />
          </Stack>

          {/* Any global modals (in Lightbox) */}
          <Scene key={sceneKeys.couponModal} component={components.CouponModal} />
        </Lightbox>
      </Router>
    );
  }
}

export default connect(
  null,
  {
    loadBaskets,
    loadLocale,
    listenCustomerAuthStatus
  }
)(RouterComponent);
