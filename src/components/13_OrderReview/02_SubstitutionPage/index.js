
import React, { Component } from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  FlatList,
  Platform,
  BackHandler
} from 'react-native';

import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';

import {
  setReviewItemSubstitution
} from '../../../actions';

import {
  paymentIcon,
  AYEZ_GREEN
} from '../../../Helpers.js';

import {
  strings,
  translate
} from '../../../i18n.js';

import {
  Header,
  BlockButton,
  BackButton,
  AyezText,
  BottomChoiceSelection,
  LoadingOverlay,
  ItemTile,
  PlaceholderFastImage,

  ItemIncrementer
} from '../../_common';

const supportIcon = require('../../../../assets/images_v2/Support/icon.png');
const swapIcon = require('../../../../assets/images_v2/ReviewOrder/change.png');


class SubstitutionPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedItem: null,
      quantity: 0
    };
  }

  componentDidUpdate(prevProps) {
    // MOVE THIS (later)
    // if addresses stop loading && addresses has 0 length
      // open create address
    // otherwise, open address selection

    if (this.props.index !== prevProps.index) {
      this.setState({ selectedItem: null, quantity: 0 })
    }
  }





  renderSelectQuantity() {
    const itemHeight = 220;
    const itemWidth = itemHeight * 0.7;
    const item = this.state.selectedItem;
    const quantity = this.state.quantity;
    return (
      <View style={{ flex: 1 }}>
        <Image
          source={swapIcon}
          style={{
            alignSelf: 'center',
            height: 50,
            width: 50
           }}
          resizeMode={'contain'}
        />
        <View style={{
          alignItems: 'center',
          borderWidth: 2,
          borderRadius: 10,
          borderColor: AYEZ_GREEN,
          margin: 10,
          padding: 6
        }}>
        <ItemTile
          item={item}
          height={itemHeight}
          width={itemWidth}
          style={{ marginVertical: 10 }}
          customIncrementer={(
            <ItemIncrementer
              item={item}
              style={{ height: '100%' }}
              quantity={this.state.quantity}
              incrementFunction={() => this.setState({
                selectedItem: item,
                quantity: this.state.quantity + (item.incr || 1)
              })
              }
              decrementFunction={() => this.setState({
                quantity: this.state.quantity - (item.incr || 1)
              })}
            />
          )}
        />
        </View>

        <View style={{ flex: 1 }} />
        <BlockButton
          text={strings('OrderReview.confirmReplacement')}
          style={{ marginLeft: 24, marginRight: 24, marginTop: 20 }}
          onPress={() => {
            this.props.setReviewItemSubstitution(this.props.index, { ...item, quantity });
            this.props.onProceed();
          }}
        />
      </View>
    );
  }


  renderSubstitutionOption({ item, index }) {
    const itemHeight = 220;
    const itemWidth = itemHeight * 0.7;
    return (
      <ItemTile
        item={item}
        height={itemHeight}
        width={itemWidth}
        style={{ marginVertical: 10 }}
        customIncrementer={(
          <ItemIncrementer
            item={item}
            style={{ height: '100%' }}
            quantity={this.state.quantity}
            incrementFunction={() => this.setState({ selectedItem: item, quantity: (item.incr || 1) })}
            decrementFunction={() => console.log('decr')}
          />
        )}
      />
    );
  }


  renderSelectItem() {

    const {
      substitution_items
    } = this.props;

    return (
      <View style={{ flex: 1 }}>
        <AyezText regular style={{
          marginVertical: 12,
          marginLeft: 22
        }}>{strings('OrderReview.replaceInstruction')}</AyezText>
        <FlatList
          ref={ref => (this.tableRef = ref)}
          style={{
              backgroundColor: 'white',
              borderTopWidth: 1,
              borderBottomWidth: 1,
              borderColor: '#f7f7f7'
             }}
          horizontal
          renderItem={this.renderSubstitutionOption.bind(this)}
          data={substitution_items}
          showsHorizontalScrollIndicator={false}
          ListHeaderComponent={<View style={{ width: 16 }} />}
          ListFooterComponent={<View style={{ width: 16 }} />}
          keyExtractor={(item, index) => index.toString()}
          bounces={false}
        />
        <View style={{ flex: 1 }} />
        <BlockButton
          text={strings('OrderReview.skipItem')}
          style={{ marginLeft: 24, marginRight: 24, marginTop: 20 }}
          onPress={() => {
            this.props.setReviewItemSubstitution(this.props.index, null);
            this.props.onProceed()
          }}
        />
      </View>
    )
  }

  render() {
    const {
      item,
      index,
      review_items,
      onProceed,
      onBack,

      substitution_items,
      substitution_items_loading
    } = this.props;

    let isOutOfStock = (item.quantity === 0);

    return (
        <View style={{
          flex: 1,
          backgroundColor: 'white'
        }}>
          <Header
            title={strings('OrderReview.reviewItemHeader', { index: index+1, total: review_items.length})}
            blackStyle
            onBackButtonPress={() => {
              if (this.state.quantity > 0) {
                this.setState({ quantity: 0 })
              } else {
                onBack()
              }
            }}
            rightButton={{
              text: strings('Support.header').toUpperCase(),
              image_source: supportIcon,
              onPress: () => Actions.supportChat()
            }}
            />

          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            borderWidth: 2,
            borderRadius: 10,
            borderColor: 'red',
            margin: 10,
            padding: 14
          }}>
            <PlaceholderFastImage
              style={{ width: 60, height: 60 }}
              resizeMode={'contain'}
              source={{ uri: item.thumbnail_url }}
            />

            <View style={{ flex: 1, marginHorizontal: 10 }}>
              <AyezText regular>{translate(item)}</AyezText>
            </View>

            <AyezText regular color={'red'}>{strings('Items.outOfStock')}</AyezText>
          </View>


          { (this.state.quantity > 0) ? this.renderSelectQuantity() : this.renderSelectItem() }

          <LoadingOverlay isVisible={substitution_items_loading} />
        </View>
    );
  }
}




  const mapStateToProps = ({ ReviewOrder }) => {

    const {
      substitution_items,
      substitution_items_loading
    } = ReviewOrder;

    return {
      substitution_items,
      substitution_items_loading
    };
  };



  export default connect(mapStateToProps, {
    setReviewItemSubstitution
  })(SubstitutionPage);
