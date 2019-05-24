import { Dimensions } from 'react-native';
import { isIPhoneX } from '../Helpers';

const { height, width } = Dimensions.get('window');
const screenWidth = width;
const screenHeight = height;
const IS_DEV = __DEV__;

const iPhoneXHomeIndicatorMargin = isIPhoneX() ? 20 : 0;

const platform = {
  iPhoneXHomeIndicatorMargin,
  screenWidth,
  screenHeight,
  IS_DEV
};

export default platform;
