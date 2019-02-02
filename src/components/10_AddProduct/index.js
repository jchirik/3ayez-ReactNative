import React, { Component } from 'react';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import SegmentedControlTab from 'react-native-segmented-control-tab';
import {
  View,
  Text,
  ImageBackground,
  BackHandler,
  TextInput,
  TouchableOpacity,
  Image
} from 'react-native';
import addProductGradientMask from '../../../assets/images_v2/add_product_gradient_mask.png';
import closeCircle from '../../../assets/images_v2/close_add_product.png';
import { strings } from '../../i18n.js';
import styles, { TIPlaceholderColor } from './styles';
import { Divider, AddButton } from '../07_ItemPage/_components';
import { Incrementer } from '../_reusable';
import colors from '../../theme/colors';

class AddProduct extends Component {
  constructor(props) {
    super(props);
    this.state = {
      itemName: '',
      details: '',
      selected_tab: 0,
      quantity: [0, 0],
      unit: ['', 'g'],
      step: [1, 100]
    };
  }

  tabsStylesAttributes = [
    {
      width: '10%',
      margin: '20%'
    },
    {
      width: '12%',
      margin: '69%'
    }
  ];

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.onAndroidBackPress);
  }

  componentWillUnmount() {
    if (this.props.onUnmount) {
      this.props.onUnmount();
    }
    BackHandler.removeEventListener(
      'hardwareBackPress',
      this.onAndroidBackPress
    );
  }

  onAndroidBackPress = () => {
    Actions.pop(); // Android back press
    return true;
  };

  render() {
    return (
      <View style={styles.container}>
        <View>
          <ImageBackground
            style={styles.header}
            source={addProductGradientMask}
          >
            <View style={styles.headerContainer}>
              <Text style={styles.headerTitle}>
                {strings('AddProduct.headerTitle')}
              </Text>
              <Text style={styles.headerMessage}>
                {strings('AddProduct.headerMessage')}
              </Text>
            </View>
          </ImageBackground>
          <Divider style={styles.divider} />
          <View style={styles.inputProductContainer}>
            <Text style={styles.productNameInputLabel}>
              {strings('AddProduct.productNameInputLabel')}
            </Text>
            <TextInput
              style={styles.additionalInstructionsTextInputStyle}
              onChangeText={itemName => this.setState({ itemName })}
              value={this.state.itemName}
              placeholder={strings('AddProduct.productNameInputPlaceholder')}
              placeholderTextColor={TIPlaceholderColor}
            />
          </View>
          <Divider />
          <View style={styles.inputProductContainer}>
            <Text style={styles.productDetailsInputLabel}>
              {strings('AddProduct.productDescriptionInputLabel')}
            </Text>
            <TextInput
              style={styles.additionalInstructionsTextInputStyle}
              onChangeText={details => this.setState({ details })}
              value={this.state.details}
              placeholder={strings(
                'AddProduct.productDescriptionInputPlaceholder'
              )}
              placeholderTextColor={TIPlaceholderColor}
            />
          </View>
          <Divider style={styles.productDescriptionDivider} />
        </View>

        <View style={styles.footerStyle}>
          <Divider />

          <SegmentedControlTab
            values={[
              strings('AddProduct.unitTabHeader'),
              strings('AddProduct.weightTabHeader')
            ]}
            tabsContainerStyle={styles.tabContainerStyle}
            activeTabStyle={styles.activeTabStyle}
            tabStyle={styles.tabStyle}
            selectedIndex={this.state.selected_tab}
            onTabPress={index => {
              this.setState({ selected_tab: index });
            }}
            tabTextStyle={styles.tabTextStyle}
            activeTabTextStyle={styles.activeTextTabStyle}
          />
          <View
            style={[
              styles.bottomIndicator,
              {
                width: this.tabsStylesAttributes[this.state.selected_tab].width,
                marginLeft: this.tabsStylesAttributes[this.state.selected_tab]
                  .margin
              }
            ]}
          />
          <Divider />

          <View style={styles.footerButtonsContainer}>
            <Incrementer
              quantityText={
                this.state.quantity[this.state.selected_tab] +
                this.state.unit[this.state.selected_tab]
              }
              color={colors.greenBlue}
              fullscreen
              style={styles.incrementButton}
              onIncrement={() => {
                this.setState(prevState => {
                  let newQuantity = prevState.quantity;
                  newQuantity[prevState.selected_tab] +=
                    prevState.step[prevState.selected_tab];
                  return { quantity: newQuantity };
                });
              }}
              onDecrement={() => {
                this.setState(prevState => {
                  if (prevState.quantity[prevState.selected_tab] == 0) {
                    return;
                  }
                  let newQuantity = prevState.quantity;
                  newQuantity[prevState.selected_tab] -=
                    prevState.step[prevState.selected_tab];
                  return { quantity: newQuantity };
                });
              }}
            />
            <AddButton
              text={strings('AddProduct.addButtonLabel')}
              style={styles.addButton}
              textStyle={styles.addButtonTextStyle}
              onPress={() => {}}
            />
          </View>
        </View>

        <TouchableOpacity
          style={styles.closeButtonContainer}
          onPress={this.onAndroidBackPress}
        >
          <Image style={styles.closeButtonImage} source={closeCircle} />
        </TouchableOpacity>
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {};
};

export default connect(mapStateToProps)(AddProduct);
