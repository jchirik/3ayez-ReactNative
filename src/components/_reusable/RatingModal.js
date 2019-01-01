// <RatingModal
//   visible={this.state.ratingModal}
//   order={this.state.ratingModalOrder}
//   onClose={() => {
//     this.props.markOrderComplete(this.state.ratingModalOrder.id);
//     this.setState({
//       ratingModal: false,
//       ratingModalOrder: null })
//   }}
// />

import _ from 'lodash';
import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ActivityIndicator,
  Platform,
  FlatList,
  Modal
} from 'react-native';
import firebase from 'react-native-firebase';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import {
  setRating
} from '../../actions';

import { strings, localizeDN } from '../../Helpers.js';

import { ModalPanel, BlockButton } from '../_reusable';

const starIcon = require('../../../assets/images/stars/full_star.png');

class RatingModal extends Component {

  constructor(props) {
    super(props);
    this.state = { stars: 0, review_details: [], completed: false };
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.visible && this.props.visible) {
      this.setState({ stars: 0, review_details: [], completed: false });
    }
  }

  submitRating() {
    const stars = this.state.stars || null;
    this.props.setRating(this.props.order.id, stars, this.state.review_details);
    this.setState({ completed: true });
  }
// this.props.onClose()


  renderReviewDetails(detail, detailText) {
    let selected = false;
    if (this.state.review_details.includes(detail)) {
      selected = true;
    }
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        style={{
          backgroundColor: selected ? 'black' : 'white',
          borderWidth: 1,
          borderRadius: 4,
          borderColor: 'black',
          paddingTop: 4,
          paddingBottom: 4,
          paddingLeft: 12,
          paddingRight: 12,
          margin: 3
        }}
        onPress={() => {
          const review_details = [ ...this.state.review_details ]
          if (selected) {
            this.setState({ review_details: review_details.filter(item => item !== detail) });
          } else {
            review_details.push(detail);
            this.setState({ review_details });
          }
        }}
        >
        <Text style={{
          fontSize: 18,
          color: selected ? 'white' : 'black',
          fontFamily: 'BahijJanna'
        }}>{detailText}</Text>
      </TouchableOpacity>
    );
  }


  renderSubmitOptions() {
    switch (this.state.stars) {
      case 1:
        return (
          <View>
            <Text style={styles.ratingTextStyle}>{strings('Ratings.1stars')}</Text>
            <View style={{flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap', marginLeft: 10, marginRight: 10}}>
              { this.renderReviewDetails('neverReceived', strings('Ratings.neverReceived')) }
              { this.renderReviewDetails('rudeService', strings('Ratings.rudeService')) }
              { this.renderReviewDetails('wrongPrices', strings('Ratings.wrongPrices')) }
              { this.renderReviewDetails('slowDelivery', strings('Ratings.slowDelivery')) }
              { this.renderReviewDetails('wrongItem', strings('Ratings.wrongItem')) }
              { this.renderReviewDetails('badProduct', strings('Ratings.badProduct')) }
            </View>
            <BlockButton
              style={{ margin: 10 }}
              text={strings('Ratings.submitReview')}
              onPress={() => this.submitRating()}
            />
          </View>
        );
      case 2:
        return (
          <View>
            <Text style={styles.ratingTextStyle}>{strings('Ratings.2stars')}</Text>
              <View style={{flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap', marginLeft: 10, marginRight: 10}}>
              { this.renderReviewDetails('rudeService', strings('Ratings.rudeService')) }
              { this.renderReviewDetails('wrongPrices', strings('Ratings.wrongPrices')) }
              { this.renderReviewDetails('slowDelivery', strings('Ratings.slowDelivery')) }
              { this.renderReviewDetails('wrongItem', strings('Ratings.wrongItem')) }
              { this.renderReviewDetails('badProduct', strings('Ratings.badProduct')) }
            </View>
            <BlockButton
              style={{ margin: 10 }}
              text={strings('Ratings.submitReview')}
              onPress={() => this.submitRating()}
            />
          </View>
        );
      case 3:
        return (
          <View>
            <Text style={styles.ratingTextStyle}>{strings('Ratings.3stars')}</Text>
            <View style={{flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap', marginLeft: 10, marginRight: 10}}>
              { this.renderReviewDetails('rudeService', strings('Ratings.rudeService')) }
              { this.renderReviewDetails('wrongPrices', strings('Ratings.wrongPrices')) }
              { this.renderReviewDetails('slowDelivery', strings('Ratings.slowDelivery')) }
              { this.renderReviewDetails('wrongItem', strings('Ratings.wrongItem')) }
              { this.renderReviewDetails('badProduct', strings('Ratings.badProduct')) }
            </View>
            <BlockButton
              style={{ margin: 10 }}
              text={strings('Ratings.submitReview')}
              onPress={() => this.submitRating()}
            />
          </View>
        );
      case 4:
        return (
          <View>
            <Text style={styles.ratingTextStyle}>{strings('Ratings.4stars')}</Text>
            <View style={{flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap', marginLeft: 10, marginRight: 10}}>
              { this.renderReviewDetails('rudeService', strings('Ratings.rudeService')) }
              { this.renderReviewDetails('wrongPrices', strings('Ratings.wrongPrices')) }
              { this.renderReviewDetails('slowDelivery', strings('Ratings.slowDelivery')) }
              { this.renderReviewDetails('wrongItem', strings('Ratings.wrongItem')) }
              { this.renderReviewDetails('badProduct', strings('Ratings.badProduct')) }
            </View>
            <BlockButton
              style={{ margin: 10 }}
              text={strings('Ratings.submitReview')}
              onPress={() => this.submitRating()}
            />
          </View>
        );
      case 5:
        return (
          <View>
            <Text style={styles.ratingTextStyle}>{strings('Ratings.5stars')}</Text>
            <BlockButton
              style={{ margin: 10 }}
              text={strings('Ratings.submitReview')}
              onPress={() => this.submitRating()}
            />
          </View>
        );
      default:
        return <View style={{ height: 24 }} />;
    }
  }

// this.props.order
  render() {
    if (!this.props.visible) {
      return null;
    }
    const { order } = this.props;

    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <TouchableWithoutFeedback
          onPress={() => this.setState({ stars: i + 1, review_details: [] })}
        >
          <Image
            style={{
              width: 40,
              height: 40,
              margin: 4,
              tintColor: (i < this.state.stars) ? '#FFDD00' : '#E5E5E5'
            }}
            resizeMode={'contain'}
            source={starIcon}
          />
        </TouchableWithoutFeedback>
      );
    }

    let modalContent = (
      <View>
        <Text style={styles.modalHeaderText}>{strings('Ratings.rateLastOrder')} {order.seller.display_name ? localizeDN(order.seller.display_name) : order.seller.name}</Text>
        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
          {stars}
        </View>
        { this.renderSubmitOptions() }
      </View>
    );

    if (this.state.completed) {
      modalContent = (
        <View>
          <Text style={styles.modalHeaderText}>{strings('Ratings.thanksFeedback')}</Text>
          <BlockButton
            style={{ margin: 10 }}
            text={'OK'}
            onPress={() => this.props.onClose()}
          />
        </View>
      );
    }

    return (
      <ModalPanel
        onClose={() => {
          this.props.onClose();
        }}
      >
        {modalContent}
      </ModalPanel>
    );
  }
}


const styles = {
  modalHeaderText: {
    marginTop: 24,
    marginBottom: 10,
    color: 'black',
    textAlign: 'center',
    fontSize: 19,
    lineHeight: 26,
    fontFamily: 'BahijJanna'
  },
  ratingTextStyle: {
    marginTop: 10,
    marginBottom: 15,
    color: 'black',
    textAlign: 'center',
    fontSize: 19,
    lineHeight: 26,
    fontFamily: 'BahijJanna-Bold'
  },
  shadowPanelStyle: {
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 20,
    paddingRight: 20,
    marginTop: 20
  },
  headerTextStyle: {
    color: '#fff',
    fontSize: 20,
    backgroundColor: 'transparent',
    fontFamily: 'BahijJanna-Bold',
    textAlign: 'center'
  },
  pointsTextStyle: {
    color: '#fff',
    fontSize: 50,
    backgroundColor: 'transparent',
    fontFamily: 'BahijJanna-Bold',
    textAlign: 'center'
  },
  inputStyle: {
    color: '#000',
    padding: 5,
    margin: 40,
    marginTop: 20,
    marginBottom: 10,
    fontSize: 18,
    lineHeight: 30,
    height: 40,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#cecece',
    backgroundColor: 'white',
    fontFamily: 'BahijJanna',
    textAlign: 'right'
  },
  notesTitleStyle: {
    marginLeft: 50,
    marginRight: 50,
    fontSize: 16,
    fontFamily: 'BahijJanna',
  },
  notesTextStyle: {
    marginLeft: 45,
    marginRight: 45,
    marginTop: 8,
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: '#c5c5c5',
    backgroundColor: '#fbfbfb',
    fontSize: 16,
    fontFamily: 'BahijJanna',
    padding: 12,
    textAlign: 'right',
    textAlignVertical: 'top'
  },
  mainContainerStyle: {
    flexDirection: 'column',
    flex: 1,
    backgroundColor: '#8b25e8'
  },

  codeEntryTitle: {
    marginTop: 16,
    marginBottom: 6,
    textAlign: 'center',
    color: '#000',
    fontFamily: 'BahijJanna-Bold',
    fontSize: 22
  },
  codeEntrySubtitle: {
    textAlign: 'center',
    color: '#000',
    fontFamily: 'BahijJanna',
    fontSize: 15,
    marginLeft: 20,
    marginRight: 20
  },
};


const mapStateToProps = ({ CurrentSeller, CouponModal }) => {

  const seller = CurrentSeller;
  const { isLoading, isVisible, isFail } = CouponModal;
  return { seller, isLoading, isVisible, isFail };
};

export default connect(mapStateToProps,
  {
    setRating
  }
)(RatingModal);
