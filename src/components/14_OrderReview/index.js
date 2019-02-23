
/* Display this flow when an order is returned to the customer
due to missing items or changes quantities */

// Logic:
// for each item in_review:
//  allow customer to add, or edit.
//  keep track of page. cycle through all 'in_review' items.
//  fetch all items, save 'items' and 'review_items' array (where in_review === true)
//  new items maintained in an update_array
//  at the end, show all q == 0 items crossed out on the bottom, all in_review items where q > 0 at the top, and new items highlighted at the top
//  when timer finishes OR confirmed => push all updates, set all 'in_review' false, set 'requires_review' false, then close


  import React, { Component } from 'react';
  import {
    View,
    TextInput,
     Image,
     ActivityIndicator,
     TouchableOpacity,
     SectionList,
     KeyboardAvoidingView,
     Platform,
     BackHandler,
     AsyncStorage
   } from 'react-native';

  import { Actions } from 'react-native-router-flux';
  import { connect } from 'react-redux';
  import {
    Header,
    BlockButton,
    InputField,
    SubtleButton,
    LoadingOverlay,
    AyezText
  } from '../_common';

  import {
    padNumberZeros,
    AYEZ_BACKGROUND_COLOR
  } from '../../Helpers';

  const timer = require('react-native-timer');

  import {
    submitOrderChanges,
    fetchReviewOrderItems,
    fetchSubstitutionOptions
  } from '../../actions';

  import {
    strings,
    translate
  } from '../../i18n.js';

  import ReviewBegin from './01_ReviewBegin';
  import SubstitutionPage from './02_SubstitutionPage';
  import QuantityChangePage from './03_QuantityChangePage';
  import ReviewSummary from './04_ReviewSummary';

  class OrderReview extends Component {

    constructor(props) {
      super(props);
      this.state = {
        page_index: -1,
        timerText: '',
      };
    }



    // doing this because componentWillUnmount is glitching -
    // fires way too late after
    onPop() {
      console.log('OrderTracker exiting')
      Actions.pop(); // Android back press

      timer.clearTimeout(this);
    }

    componentDidMount() {
      BackHandler.addEventListener('hardwareBackPress', this.onAndroidBackPress);
      this.setState({ page_index: -1 });
      this.props.fetchReviewOrderItems(this.props.order.id);

      timer.setInterval(this, 'hideMsg', () => {
        if (!this.props.review_order) {
          return;
        }
        const { substitution_deadline } = this.props.review_order;
        if (!substitution_deadline) {
          this.setState({ timerText: '-' });
          return;
        }

        const remainingTime = substitution_deadline - Date.now();
        if (remainingTime < 0) {
          this.setState({ timerText: '-' });
          this.onPop();
          return;
        }
        let seconds = Math.round(remainingTime/1000);
        let minutes = Math.floor(seconds/60);
        seconds = seconds % 60;
        minutes = minutes % 60;
        let timerText = `${minutes}:${padNumberZeros(seconds, 2)}`;

        this.setState({ timerText })
      }, 1000);
    }

    componentWillUnmount() {
      console.log('removing orderReview back listener')
      BackHandler.removeEventListener('hardwareBackPress', this.onAndroidBackPress);
    }

    onAndroidBackPress = () => {
      if (Actions.currentScene === 'orderReview') {
        this.onBack();
        console.log('back disabled')
        return true;
      }
    }

    onProceed() {
      const { review_items, review_order, items } = this.props;
      const page_index = Math.min(this.state.page_index + 1, review_items.length);
      if (page_index < review_items.length) {
        this.props.fetchSubstitutionOptions(review_order.seller.id, review_items[page_index], items);
      }
      this.setState({ page_index })
    }

    onBack() {
      const page_index = Math.max(this.state.page_index - 1, -1);
      const { review_items, review_order, items } = this.props;
      if (page_index > -1) {
        this.props.fetchSubstitutionOptions(review_order.seller.id, review_items[page_index], items)
      }
      this.setState({ page_index })
    }

    submitOrderChanges() {
      this.props.submitOrderChanges(this.props.order.id, this.props.review_items, this.props.substitutions, this.onPop);
      // this FX will pop back, after submitting successful
    }

    render() {
      const {
        page_index
      } = this.state;
      const {
        review_order,
        items,
        review_items,
        substitutions,
        is_loading
      } = this.props;

      if (!review_order) {
        return <ActivityIndicator size="small" style={{ flex: 1 }} />
      }

      let mainComponent = null;

      if (page_index === -1) {
        // return the intro page
        mainComponent = (
          <ReviewBegin
            review_items={review_items}
            onProceed={this.onProceed.bind(this)}
          />
        )
      } else if (page_index < review_items.length) {
        const item = review_items[page_index];
        if (!item.quantity) {
          // return substitution if no quantity
          mainComponent = (
            <SubstitutionPage
              item={item}
              index={page_index}
              review_items={review_items}
              onProceed={this.onProceed.bind(this)}
              onBack={this.onBack.bind(this)}
            />
          )
        } else {
          // return quantity change
          mainComponent = (
            <QuantityChangePage
              item={item}
              index={page_index}
              review_items={review_items}
              onProceed={this.onProceed.bind(this)}
              onBack={this.onBack.bind(this)}
            />
          )
        }
      } else {
        // return the final overview page
        mainComponent = (
          <ReviewSummary
            items={items}
            substitutions={substitutions}
            onProceed={this.submitOrderChanges.bind(this)}
            onBack={this.onBack.bind(this)}
          />
        )
      }

      return (
        <View style={{
          flex: 1,
          backgroundColor: AYEZ_BACKGROUND_COLOR
        }}>
          {mainComponent}
          <AyezText regular style={{
            textAlign: 'center',
            marginTop: 4,
            marginBottom: 5
          }}>{strings('OrderReview.countdown', {time: this.state.timerText})}</AyezText>
          <LoadingOverlay isVisible={is_loading} />
        </View>
      )
    }
  }

  const mapStateToProps = ({ OngoingOrders, ReviewOrder }) => {

    const {
      review_order
    } = OngoingOrders;

    const {
      items,
      review_items,
      substitutions,
      is_loading
    } = ReviewOrder;

    return {
      review_order,

      items,
      review_items,
      substitutions,
      is_loading
    };
  };

  export default connect(mapStateToProps, {
    submitOrderChanges,
    fetchReviewOrderItems,
    fetchSubstitutionOptions
  })(OrderReview);
