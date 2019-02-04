// const { substitutionOrder } = this.props;
//
//   if (!substitutionOrder) { return null }
//
//
//   const itemsToSubstitute = substitutionOrder.items_array.filter(item => item.invalid);
//   const imageComponents = itemsToSubstitute.map(item => (
//     <CachedImage
//       style={{
//         width: 80,
//         height: 80,
//         margin: 8
//       }}
//       resizeMode={'contain'}
//       source={{ uri: item.thumbnail_url || item.image_url }}
//     />
//   ));
//
//     // if more than 4 items to replace, truncate and show an ellpises image
//
// // {itemsToSubstitute.length} products</Text> from your order are out of stock
//
//   return (
//     <Modal
//       animationType="fade"
//       visible={this.state.substitutionModal}
//     >
//     <View style={{ backgroundColor: '#f25400', padding: 20, paddingTop: (statusBarMargin + 10), alignItems: 'center' }}>
//       <Image
//         style={{
//           width: 100,
//           height: 100,
//           tintColor: 'white'
//         }}
//         resizeMode={'contain'}
//         source={warningIcon}
//       />
//       <Text style={{ fontFamily: 'BahijJanna-Bold', color: 'white', fontSize: 22, marginTop: 8 }}>{strings('Substitution.header')}</Text>
//     </View>
//
//     <View style={{ flex: 1, backgroundColor: 'white', padding: 20 }}>
//       <Text style={{ fontFamily: 'BahijJanna', textAlign: 'center', color: 'black', fontSize: 18, marginBottom: 10 }}>
//         {strings('Substitution.subheader')}
//       </Text>
//       <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }}>
//         {imageComponents}
//       </View>
//       <View style={{ position: 'absolute', backgroundColor: 'transparent', bottom: 0, left: 0, right: 0 }}>
//         <BlockButton
//           text={strings('Substitution.goButton')}
//           color={'#F05C64'}
//           onPress={() => {
//             this.setState({ substitutionModal: false });
//             Actions.substitution({ itemsToSubstitute });
//           }}
//         />
//         <TimerCountdown
//             initialSecondsRemaining={substitutionOrder.substitution_deadline - Date.now()}
//             onTimeElapsed={() => {
//               this.setState({ substitutionModal: false });
//               // skip substitutions (show a confirmation before this)
//               this.props.submitOrderSubstitutions(substitutionOrder, []);
//             }}
//             style={{
//               textAlign: 'center',
//               fontFamily: 'BahijJanna',
//               color: 'black',
//               fontSize: 18,
//               marginBottom: 10
//             }}
//             formatSecondsRemaining={(milliseconds) => {
//               let seconds = Math.round(milliseconds/1000);
//               let minutes = Math.floor(seconds/60);
//               seconds = seconds % 60;
//               return `${minutes}:${padNumberZeros(seconds, 2)}`
//             }}
//         />
//       </View>
//     </View>
//     </Modal>
//   );



  // <TimerCountdown
  //     initialSecondsRemaining={substitutionOrder.substitution_deadline - Date.now()}
  //     onTimeElapsed={() => {
  //       this.setState({ substitutionModal: false });
  //       // skip substitutions (show a confirmation before this)
  //       this.props.submitOrderSubstitutions(substitutionOrder, []);
  //     }}
  //     style={{
  //       textAlign: 'center',
  //       fontFamily: 'BahijJanna',
  //       color: 'black',
  //       fontSize: 18,
  //       marginBottom: 10
  //     }}
  //     formatSecondsRemaining={(milliseconds) => {
  //       let seconds = Math.round(milliseconds/1000);
  //       let minutes = Math.floor(seconds/60);
  //       seconds = seconds % 60;
  //       return `${minutes}:${padNumberZeros(seconds, 2)}`
  //     }}
  // />




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
    AYEZ_BACKGROUND_COLOR
  } from '../../Helpers';

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
  import ReviewSummary from './03_ReviewSummary';

  class OrderReview extends Component {

    constructor(props) {
      super(props);
      this.state = {
        page_index: -1
      };
    }

    componentDidMount() {
      this.setState({ page_index: -1 });
      this.props.fetchReviewOrderItems(this.props.order.id)
    }

    onProceed() {
      const page_index = this.state.page_index + 1;
      const { review_items, review_order } = this.props;
      if (page_index < review_items.length) {
        this.props.fetchSubstitutionOptions(review_order.seller.id, review_items[page_index]);
      }
      this.setState({ page_index })
    }

    onBack() {
      const page_index = this.state.page_index - 1;
      const { review_items, review_order } = this.props;
      if (page_index > -1) {
        this.props.fetchSubstitutionOptions(review_order.seller.id, review_items[page_index])
      }
      this.setState({ page_index })
    }

    submitOrderChanges() {
      this.props.submitOrderChanges(this.props.order.id, this.props.review_items, this.props.substitutions);
      // this FX will pop back, after submitting successful
    }

    render() {
      const {
        page_index
      } = this.state;
      const {
        items,
        review_items,
        substitutions,
        is_loading
      } = this.props;


      if (is_loading) {
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
        // return the item page
        mainComponent = (
          <SubstitutionPage
            item={review_items[page_index]}
            index={page_index}
            review_items={review_items}
            onProceed={this.onProceed.bind(this)}
            onBack={this.onBack.bind(this)}
          />
        )
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
          <AyezText regular>{strings('OrderReview.countdown', {time: '0:00'})}</AyezText>
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
