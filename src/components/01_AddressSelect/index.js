import React, { PureComponent } from 'react';
import {
  View,
  Text,
   Image,
   ActivityIndicator,
   TouchableOpacity,
   SectionList,
   Platform,
   BackHandler,
   AsyncStorage
 } from 'react-native';

import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
// import { Circle } from 'react-native-progress';
// import MapView, { Marker, Polygon, PROVIDER_GOOGLE } from 'react-native-maps';
// import {
//   setArea,
//   fetchAreas,
//   detectCurrentLocation,
//   searchAreas
// } from '../../actions';
// import { BlockButton, SearchBar, ModalPanel, Header } from '../_reusable';
// import { fetchRegionDisplayName, fetchRegionImage, strings, localizeDN } from '../../Helpers.js';
// const comingSoonImage = require('../../../assets/images/coming_soon.png');






// add language select + very short tutorial

// steps:
// 1. request for current location. show a popup first, asking if should use
// current location. if available, skip to 4.
// -
// 2. IF NO LOCATION, pick city
// 3. text search for location
// -
// 4. refine pin
// 5. reverse fetch street, apt number (if not already provided)
// 6. present form for finalizing delivery, with prefilled street/building info

// each address should include notes from our driver console, so driver admins
// can attach additional info that makes it easier to find

// first time you open the app -> go to store tab to start
// every other time -> go to discover page to start



class AddressSelect extends PureComponent {

  render() {
    return (
      <View style={{
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <Text>HelloWorld</Text>
      </View>
    );
  }

  // constructor(props) {
  //   super(props);
  //
  //   // this.state = {
  //   //   selectedRegion: null
  //   // };
  //
  //   this.selectArea = this.selectArea.bind(this);
  // }
  //
  //
  // componentDidMount() {
  //   /*
  //     note: build this out s.t. the page is loading until we know whether
  //     the user is logged in or not.
  //     if yes, bypass this page and go to homescreen, otherwise stay
  //   */
  //   // this.props.fetchAreas(); // do this upon EVERY reopening?
  //   // this.props.detectCurrentLocation();
  //
  //   // this.setState({ selectedRegion: null });
  //   BackHandler.addEventListener('hardwareBackPress', this.onAndroidBackPress);
  // }
  //
  // componentWillUnmount() {
  //   if (this.props.onUnmount) { this.props.onUnmount(); }
  //   BackHandler.removeEventListener('hardwareBackPress', this.onAndroidBackPress);
  // }
  //
  // onAndroidBackPress = () => {
  //   if (this.props.area.id) {
  //     Actions.popTo('storeSelectorMain'); // Android back press
  //   }
  //   return true;
  // }
  //
  // selectArea(area) {
  //   console.log(area)
  //   // this.props.setArea(area);
  //   // AsyncStorage.setItem('LASTAREA', JSON.stringify(area), () => {
  //   //   console.log('set in async storage')
  //   // });
  //   // Actions.popTo('storeSelectorMain');
  // }
  //
  // // onQueryDidChange(searchQuery) {
  // //   this.props.searchAreas(searchQuery, this.props.allAreas);
  // // }
  // // renderRegion(region) {
  // //   console.log(region);
  // //   return (
  // //     <TouchableOpacity
  // //       style={styles.tileStyle}
  // //       activeOpacity={0.7}
  // //       disabled={!region.isEnabled}
  // //       onPress={() => { this.setState({ selectedRegion: region.key }); }}
  // //     >
  // //
  // //
  // //       <Text style={{
  // //         fontFamily: 'BahijJanna-Bold',
  // //         marginTop: 4,
  // //         fontSize: 26,
  // //         color: (region.isEnabled ? '#0094ff' : '#cecece')
  // //       }}>{fetchRegionDisplayName(region.key)}</Text>
  // //
  // //       { region.isEnabled ? null : (
  // //         <Image
  // //           style={{
  // //             position: 'absolute',
  // //             width: 120,
  // //             height: 120
  // //           }}
  // //           resizeMode={'contain'}
  // //           source={comingSoonImage}
  // //         />
  // //       )}
  // //     </TouchableOpacity>
  // //   );
  // // }
  //
  //
  // renderArea({ item, index }) {
  //   const displayName = item.display_name ? localizeDN(item.display_name) : item.id;
  //   return (
  //     <TouchableOpacity
  //       style={{
  //         flexDirection: 'column',
  //         justifyContent: 'center',
  //         alignItems: 'flex-end',
  //         borderBottomWidth: 0.5,
  //         borderColor: '#cecece',
  //         paddingRight: 15,
  //         height: 56,
  //         backgroundColor: 'white'
  //       }}
  //       activeOpacity={0.7}
  //       onPress={this.selectArea.bind(this, item)}
  //     >
  //       <Text style={{
  //         fontFamily: 'BahijJanna',
  //         color: 'black',
  //         fontSize: 18
  //       }}>{displayName}</Text>
  //     </TouchableOpacity>
  //   );
  // }
  //
  // renderSectionHeader({ section }) {
  //   return (
  //     <View style={{
  //       height: 56,
  //       flexDirection: 'row',
  //       alignItems: 'center',
  //       backgroundColor: '#f7f7f7',
  //       paddingLeft: 20,
  //       paddingRight: 20
  //     }}>
  //       <View style={{ flex: 1 }} />
  //       <Text style={{
  //         fontFamily: 'BahijJanna-Bold',
  //         color: 'black',
  //         fontSize: 18,
  //         marginRight: 10
  //       }}>{strings(`LocationSelector.${section.title}`)}</Text>
  //       <Image
  //         style={{
  //           width: 24,
  //           height: 24
  //         }}
  //         resizeMode={'contain'}
  //         source={fetchRegionImage(section.title)}
  //       />
  //     </View>
  //   );
  // }
  //
  //
  // renderCurrentLocationCell() {
  //   const {
  //     currentArea,
  //     currentAreaLoading,
  //     currentLocationError
  //   } = this.props;
  //
  //
  //   let disabled = true;
  //   let subtitleComponent = null;
  //   let mainText = '-';
  //
  //   if (currentArea && currentArea.display_name) {
  //     disabled = false;
  //     mainText = strings('LocationSelector.currentLocation')
  //     subtitleComponent = (
  //       <Text style={{
  //         fontFamily: 'BahijJanna',
  //         color: 'black',
  //         fontSize: 18
  //       }}>({localizeDN(currentArea.display_name)})</Text>
  //     );
  //   } else if (currentAreaLoading) {
  //     mainText = strings('LocationSelector.fetchingLocation')
  //     subtitleComponent = (
  //       <ActivityIndicator size="small"/>
  //     );
  //   } else {
  //     mainText = strings('LocationSelector.noLocationAvailable')
  //   }
  //
  //   return (
  //     <TouchableOpacity
  //       style={{
  //         flexDirection: 'row',
  //         justifyContent: 'flex-end',
  //         alignItems: 'center',
  //         borderBottomWidth: 0.5,
  //         borderTopWidth: 0.5,
  //         borderColor: '#cecece',
  //         height: 56,
  //         backgroundColor: 'white',
  //         paddingRight: 15,
  //         marginBottom: 5
  //       }}
  //       disabled={disabled}
  //       activeOpacity={0.7}
  //       onPress={this.selectArea.bind(this, currentArea)}
  //     >
  //       {subtitleComponent}
  //       <Text style={{
  //         fontFamily: 'BahijJanna',
  //         color: (disabled ? '#cecece' : '#0094ff'),
  //         fontSize: 18,
  //         marginLeft: 10
  //       }}>{mainText}</Text>
  //     </TouchableOpacity>
  //   );
  // }
  //
  //
  //
  // render() {
  //
  //   const {
  //     allAreasLoading,
  //     allAreas,
  //     areaSearchQuery,
  //     areaSectionedSearchResults
  //   } = this.props;
  //
  //
  // if (allAreasLoading) {
  //   return (
  //       <View style={{
  //         flex: 1,
  //         backgroundColor: 'white',
  //         justifyContent: 'center',
  //         alignItems: 'center'
  //       }}>
  //       <Circle
  //         color={'#20C74B'}
  //         indeterminate
  //         borderWidth={2}
  //         size={40}
  //       />
  //       </View>
  //     );
  // }
  //
  // // const regionPanels = regions.map(region => this.renderRegion(region));
  //
  // // if (!this.state.selectedRegion) {
  // //   return (
  // //     <View style={{ flex: 1, backgroundColor: 'white' }}>
  // //       <Header
  // //         title={strings('LocationSelector.selectRegion')}
  // //         hasBackButton={this.props.area.id}
  // //       />
  // //       { regionPanels }
  // //       <View style={{ height: 10 }} />
  // //     </View>
  // //   );
  // // }
  //
  //
  //         // <MapView
  //         //     ref={map => { this.map = map }}
  //         //     style={{ flex: 1 }}
  //         //     showsUserLocation
  //         //     provider={PROVIDER_GOOGLE}
  //         //   >
  //         //   </MapView>
  //         //
  //
  //
  //   return (
  //     <View style={{ flex: 1, backgroundColor: 'white' }}>
  //       <Header
  //         title={strings('LocationSelector.selectNeighborhood')}
  //         hasBackButton={this.props.area.id}
  //         onBackButtonPress={() => Actions.popTo('storeSelectorMain')}
  //       />
  //       <SearchBar
  //         color={'#0094ff'}
  //         containerStyle={{ marginLeft: 12, marginRight: 12, marginTop: 10, marginBottom: 10 }}
  //         reference={c => (this.searchInput = c)}
  //         placeholder={strings('LocationSelector.searchNeighborhood')}
  //         searchQuery={this.props.areaSearchQuery}
  //         onQueryDidChange={this.onQueryDidChange.bind(this)}
  //       />
  //       {this.renderCurrentLocationCell()}
  //       <SectionList
  //         sections={areaSectionedSearchResults}
  //         renderItem={this.renderArea.bind(this)}
  //         renderSectionHeader={this.renderSectionHeader.bind(this)}
  //         style={{ flex: 1 }}
  //         keyExtractor={(item, index) => item.display_name.en + index}
  //       />
  //     </View>
  //   );
  // }
}

// const styles = {
//
//     tileStyle: {
//       flex: 1,
//       flexDirection: 'column',
//       justifyContent: 'center',
//       alignItems: 'center',
//       marginTop: 10,
//       paddingLeft: 15,
//       paddingRight: 15,
//       backgroundColor: '#FBFBFB',
//       elevation: 3,
//       shadowColor: '#000',
//       shadowOffset: { width: 2, height: 3 },
//       shadowOpacity: 0.10,
//       shadowRadius: 8
//     }
// };

const mapStateToProps = ({ }) => {
  return {};
  // const {
  //   allAreas,
  //   allAreasLoading,
  //
  //   currentArea,
  //   currentAreaLoading,
  //   currentLocationError,
  //
  //   areaSearchQuery,
  //   areaSearchResults
  // } = LocationSearch;
  //
  // const area = CurrentArea;
  //
  // const areaSectionedSearchResults = [
  //   { title: 'ALEXANDRIA', data: areaSearchResults.filter(area => area.region === 'ALEXANDRIA') },
  //   { title: 'CAIRO', data: areaSearchResults.filter(area => area.region === 'CAIRO') }
  // ]
  //
  // // console.log(areaSearchResults, areaSectionedSearchResults)
  //
  // return {
  //   area,
  //   currentArea,
  //   currentAreaLoading,
  //   currentLocationError,
  //
  //   areaSearchQuery,
  //   areaSectionedSearchResults,
  //
  //   allAreas,
  //   allAreasLoading,
  // };
};

export default connect(mapStateToProps, {
})(AddressSelect);
