import React, { Component } from 'react';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import {
  View,
  FlatList,
  Platform,
  Animated,
  Easing,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  BackHandler,
  ViewPagerAndroid,
  Dimensions,
  I18nManager
} from 'react-native';
// import { Circle } from 'react-native-progress';
import MapView, { Marker, Polygon, PROVIDER_GOOGLE } from 'react-native-maps';

import {
  fetchAllRegions,
  searchAreas,
  selectArea,

  calculateAreaForLocation
} from '../../actions';

import {
  BackButton,
  BlockButton,
  AyezText,
  RTLImage,
  LoadingOverlay,
  Header
} from '../_common';

import {
  AYEZ_GREEN,
  AYEZ_BACKGROUND_COLOR,
  STATUS_BAR_HEIGHT,
  checkIfOpen
} from '../../Helpers';

import {
  strings,
  translate,
  formatCurrency,
  formatDay,
  formatTimestamp
} from '../../i18n.js';

import colors from '../../theme/colors'
import images from '../../theme/images'
import { sceneKeys, navigateTo, navigateBack } from '../../router';

const window = Dimensions.get('window');


// fetchSavedAreas
// selectArea

// selected_area,
// saved_areas,
// is_loading_saved_areas

class AreaCreate extends Component {

  constructor(props) {
    super(props);
    this.state = {
      region: null
    };
  }

  componentDidMount() {
    this.props.fetchAllRegions(this.props.beta_tester)
  }

  selectRegion(id) {
    this.props.searchAreas('', id);
    this.props.calculateAreaForLocation(id);
    this.setState({ region: id });
  }

  renderRegionTile({ item, index }) {
    const { id, display_name, image_url } = item;
    return (
      <TouchableOpacity
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          width: (window.width/2) - 12,
          height: (window.width/2) * 1.3,
          paddingHorizontal: 10,
          paddingTop: 20
        }}
        onPress={() => this.selectRegion(id)}
      >
        <View style={{
          backgroundColor: 'white',
          width: '100%',
          height: '100%',
          borderRadius: 10,
          justifyContent: 'center',
          alignItems: 'center',
          ...Platform.select({
            ios: {
              shadowColor: colors.warmGrey,
              shadowOpacity: 0.25,
              shadowRadius: 5
            },
            android: {
              elevation: 2
            }
          })
        }}>
          <Image
            source={{ uri: image_url }}
            style={{
              width: '80%',
              height: '40%'
            }}
            resizeMode={'contain'}
          />
          <AyezText semibold size={18} color={colors.ayezGreen}
            style={{
              position: 'absolute',
              bottom: 20,
              left: 20
            }}>
            {translate(display_name)}
          </AyezText>
        </View>
      </TouchableOpacity>
    );
  }

  renderAreaCell({ item, index }) {
    return (
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          height: 60,
          backgroundColor: 'white',
          paddingHorizontal: 30,
          borderColor: '#eaeaea',
          borderBottomWidth: 1
        }}
        onPress={() => this.props.selectArea(item)}
      >
        <AyezText medium size={15} color={'black'} style={{ flex: 1 }}>
          {translate(item.display_name)}
        </AyezText>
        <RTLImage
          source={images.nextArrowIcon}
          style={{
            width: 16,
            height: 16,
            tintColor: '#4E4E4E'
          }}
          resizeMode={'contain'}
        />
      </TouchableOpacity>
    );
  }

  renderAutoArea() {
    const { auto_area, auto_area_loading } = this.props;

    if (auto_area_loading) {
      return (
        <ActivityIndicator size={'small'} style={{ height: 60, backgroundColor: 'white' }} />
      )
    }

    if (!auto_area) {
      return null;
    }
    return (
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          height: 60,
          backgroundColor: 'white',
          paddingHorizontal: 30,
          borderColor: '#eaeaea',
          borderBottomWidth: 1
        }}
        onPress={() => this.props.selectArea(auto_area)}
      >
        <AyezText medium size={15} color={'#0094ff'} style={{ flex: 1 }}>
          {translate(auto_area.display_name)}
        </AyezText>
        <RTLImage
          source={images.nextArrowIcon}
          style={{
            width: 16,
            height: 16,
            tintColor: '#0094ff'
          }}
          resizeMode={'contain'}
        />
      </TouchableOpacity>
    )
  }



  render() {

    if (this.props.is_loading_regions || this.props.is_loading_area_results) {
      return (
        <ActivityIndicator size="small" style={{ flex: 1, backgroundColor: colors.paleGrey }} />
      )
    }


    if (!this.state.region) {
      return (
        <View style={{
          flex: 1,
          backgroundColor: colors.paleGrey,
          paddingTop: STATUS_BAR_HEIGHT
        }}>
          <AyezText bold size={24} style={{ paddingTop: 54, paddingLeft: 44 }}>Select your city</AyezText>

          <FlatList
            key={'REGION_LIST'}
            data={this.props.regions}
            renderItem={this.renderRegionTile.bind(this)}
            style={{ flex: 1, marginHorizontal: 12 }}
            alwaysBounceVertical={false}
            ListHeaderComponent={<View style={{ height: 5 }} />}
            numColumns={2}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item, index) => item.id}
          />
          { this.props.saved_areas.length ? (<BackButton fixed />) : null }
        </View>
      )
    }

    // get this table from git -> the old version
    return (
      <View style={{
        backgroundColor: colors.paleGrey,
        alignItems: 'flex-start',
        flex: 1
       }}>
        <Header
          title={'Select your area'}
          onBackButtonPress={() => this.setState({ region: null })}
          />
        <FlatList
          key={'AREA_LIST'}
          data={this.props.area_results}
          renderItem={this.renderAreaCell.bind(this)}
          style={{ flex: 1, alignSelf: 'stretch' }}
          ListHeaderComponent={this.renderAutoArea()}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item, index) => item.id}
        />
      </View>
    )
  }
}

const mapStateToProps = ({ Customer, Areas, AreaCreate }) => {
  const { beta_tester } = Customer;

  const {
    selected_area,
    saved_areas
  } = Areas;

  const {
    regions,
    area_results,
    is_loading_regions,
    is_loading_area_results,

    auto_area,
    auto_area_loading
  } = AreaCreate;



  console.log('AUTO_AREA', auto_area)

  return {
    beta_tester,

    selected_area,
    saved_areas,

    regions,
    area_results,
    is_loading_regions,
    is_loading_area_results,

    auto_area,
    auto_area_loading
  };
};

export default connect(mapStateToProps, {
  fetchAllRegions,
  searchAreas,
  selectArea,

  calculateAreaForLocation
})(AreaCreate);
