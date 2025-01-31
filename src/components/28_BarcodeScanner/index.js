import React, { Component } from 'react';
import { View, Image, ActivityIndicator, BackHandler } from 'react-native';
import { RNCamera } from 'react-native-camera';
import BarcodeMask from 'react-native-barcode-mask';
import images from '../../theme/images';
import colors from '../../theme/colors';
import { BackButton, AyezText, BlockButton } from '../_common';
import styles from './styles';
import {
  onSelectSearchBarcode,
  resetBarcodeSearch
} from '../../actions/ItemSearch_Actions';
import { connect } from 'react-redux';
import { sceneKeys, navigateTo, navigateBack } from '../../router';
import { strings } from '../../i18n.js';

class BarcodeScanner extends Component {
  constructor(props) {
    super(props);
    this.camera = null;
    this.state = {
      barcode: strings('BarcodeScanner.itemBarcode'),
      barcodeAvailable: false,
      camera: {
        type: RNCamera.Constants.Type.back,
        flashMode: RNCamera.Constants.FlashMode.auto,
        barcodeFinderVisible: true
      }
    };
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.onAndroidBackPress);
  }
  componentWillUnmount() {
    BackHandler.removeEventListener(
      'hardwareBackPress',
      this.onAndroidBackPress
    );
  }
  onAndroidBackPress = () => {
    navigateBack();
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    const {
      resetBarcodeSearch,
      barcodeSearchResult: { success, items }
    } = nextProps;
    if (success && items.length >= 1) {
      const item = items[0];
      navigateTo(sceneKeys.itemPage, { item });
      resetBarcodeSearch();
    }
    if (success && items.length === 0) {
      resetBarcodeSearch();
      return {
        barcode: strings('BarcodeScanner.wrongBarcode'),
        barcodeAvailable: false
      };
    }
  }

  onBarCodeRead(scanResult) {
    if (scanResult.data != null) {
      if (this.state.barcode !== scanResult.data) {
        this.setState({ barcode: scanResult.data, barcodeAvailable: true }, 
          () => {
            if(!this.props.isSearchingItemBarcode) {
              this.props.onSelectSearchBarcode(this.props.sellerId, scanResult.data)
            }
          }  
        );
      }
    }
    return;
  }

  _renderTopOverlay = () => {
    return (
      <View style={[styles.overlay, styles.topOverlay]}>
        <BackButton />
      </View>
    );
  };

  _renderBottomOverlay = () => {
    let { barcode } = this.state;
    const {
      resetBarcodeSearch,
      barcodeSearchResult: { success, items }
    } = this.props;

    return (
      this.props.isSearchingItemBarcode ? <ActivityIndicator
      size="small"
      color={colors.ayezGreen}
      style={{ margin: 20 }}
    />:
      <View style={[styles.overlay, styles.bottomOverlay]}>
        <View style={styles.barcodeView}>
          <Image
            source={images.barcodeImage}
            resizeMode={'contain'}
            style={styles.barcodeImage}
          />
          <AyezText regular numberOfLines={1} style={styles.barcodeText}>
            {barcode}
          </AyezText>
        </View>
      </View>
    );
  };

  render() {
    return (
      <View style={styles.container}>
        <RNCamera
          ref={ref => {
            this.camera = ref;
          }}
          defaultTouchToFocus
          flashMode={this.state.camera.flashMode}
          mirrorImage={false}
          onBarCodeRead={this.onBarCodeRead.bind(this)}
          onFocusChanged={() => {}}
          onZoomChanged={() => {}}
          permissionDialogTitle={strings('BarcodeScanner.cameraPermission')}
          permissionDialogMessage={strings(
            'BarcodeScanner.cameraPermissionMsg'
          )}
          style={styles.camera}
          type={this.state.camera.type}
        >
          <BarcodeMask transparency={0.8} />
        </RNCamera>
        {this._renderBottomOverlay()}
        {this._renderTopOverlay()}
      </View>
    );
  }
}

const mapStateToProps = ({ Seller, ItemSearch }) => {
  const { id: sellerId } = Seller;
  const { isSearchingItemBarcode, barcodeSearchResult } = ItemSearch;
  return { sellerId, isSearchingItemBarcode, barcodeSearchResult };
};
export default connect(
  mapStateToProps,
  { onSelectSearchBarcode, resetBarcodeSearch }
)(BarcodeScanner);
