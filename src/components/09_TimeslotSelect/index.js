import React, { Component } from 'react';
import {
  View,
  Image,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  SectionList,
  BackHandler
} from 'react-native';

import { Actions } from 'react-native-router-flux';
// import { Tabs } from 'antd-mobile';
import { connect } from 'react-redux';
import {
  resetCheckout,
  fetchTimeslots,
  setTimeslot
} from '../../actions';
import {
  Header,
  AyezText
} from '../_common';

import {
  strings,
  translate,
  formatTimestamp,
  formatCurrency
} from '../../i18n.js';



class TimeslotSelect extends Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.resetCheckout();
    this.props.fetchTimeslots(this.props.seller_id);
    //BackHandler.addEventListener('hardwareBackPress', this.onAndroidBackPress);
  }


  // componentWillUnmount() {
  //   BackHandler.removeEventListener('hardwareBackPress', this.onAndroidBackPress);
  // }
  //
  // onAndroidBackPress = () => {
  //   Actions.popTo('workingBasket'); // Android back press
  //   return true;
  // }

  setTimeslot(timeslot) {
    this.props.setTimeslot(timeslot);
    Actions.checkout();
  }

  renderSectionHeader({ section }) {
    return (
      <View style={{
        height: 54,
        backgroundColor: '#FAFCFD',
        flexDirection: 'row',
        paddingLeft: 30,
        alignItems: 'center'
      }}>
        <AyezText bold style={{
          fontSize: 20,
        }}>{section.title}</AyezText>
      </View>
    )
  }



  renderItem({ item, index }) {
    const startTime = formatTimestamp(item.start, "h:mm A")
    const endTime = formatTimestamp(item.end, "h:mm A")

    return (
      <TouchableOpacity
        style={{
          height: 54, backgroundColor: 'white', flexDirection: 'row',
          justifyContent: 'space-between', alignItems: 'center',
          borderBottomWidth: 1, borderColor: '#f7f7f7'
          }}
        onPress={this.setTimeslot.bind(this, item)}
        disabled={item.invalid}
      >
        <AyezText regular style={{
          marginLeft: 30,
          color: (item.invalid ? '#cecece' : 'black'),
          textDecorationLine: (item.invalid ? 'line-through' : 'none'),
          textDecorationStyle: 'solid'
        }} key={index}>{startTime} - {endTime}</AyezText>

        <AyezText light style={{
          marginRight: 30,
          color: (item.invalid ? '#cecece' : '#8E8E93')
        }}>{formatCurrency(item.delivery_fee)}</AyezText>
      </TouchableOpacity>
    )
  }

  // <Tabs
  //   style={{ flex: 0 }}
  //   tabs={this.props.delivery_times}
  //   tabBarActiveTextColor='#0094ff'
  //   tabBarTextStyle={{ fontFamily: 'Poppins', fontSize: 16 }}
  //   renderTabBar={props => <Tabs.DefaultTabBar { ...props } page={4} />}
  //   initialPage={0}
  //   onChange={(tab, index) => console.log(index)}
  // />

  render() {

    if (this.props.loading) {
      return (<ActivityIndicator size="small" style={{ flex: 1 }} />);
    }

    return (
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <Header
          title={strings('TimeslotSelect.header')}
          onBackButtonPress={() => Actions.pop()}
          blackStyle
        />
        <SectionList
          style={{ flex: 1 }}
          renderItem={this.renderItem.bind(this)}
          renderSectionHeader={this.renderSectionHeader.bind(this)}
          sections={this.props.timeslots}
          keyExtractor={(item, index) => index}
        />
      </View>
      );
    }
  }


  const mapStateToProps = ({ Seller, Timeslots }) => {
    const { id } = Seller;
    const { timeslots, loading, error } = Timeslots;

    return {
      seller_id: id,
      timeslots,
      loading,
      error
    };
  };


  export default connect(mapStateToProps,
    {
      resetCheckout,
      fetchTimeslots,
      setTimeslot
    }
  )(TimeslotSelect);
