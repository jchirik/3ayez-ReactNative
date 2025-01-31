import React, { Component } from 'react'
import { ActivityIndicator, View, StyleSheet, Dimensions } from 'react-native'
import FastImage from 'react-native-fast-image'
import colors from '../../theme/colors';

const window = Dimensions.get('window');

class PlaceholderFastImage extends Component {
  constructor(props){
    super(props)

    this.state = {
      loaded: false,
      style: StyleSheet.flatten(props.style)
    }
  }
  onLoadEnd(){
    this.setState({loaded: true})
  }
  render() {
    const top = (this.state.style.height / 2) - 15
    const left = (this.state.style.width / 2) - 15

    return <View style={this.props.style}>
      {
        !this.state.loaded &&
        <View style={{ ...this.props.style, justifyContent: 'center', alignItems: 'center' }}>
          <FastImage
            source={null}
            style={{ backgroundColor: '#f7f7f7', width: 40, height: 40, borderRadius: 20 }}
          />
        </View>
      }
      <FastImage
        {...this.props}
        resizeMode={this.props.resizeMode || 'contain'}
        source={this.props.source}
        style={[
          {
            shadowColor: colors.warmGrey,
            shadowOpacity: 0.3,
            shadowRadius: 1,
            elevation: 2
          },
          this.props.style,
          this.state.loaded ? { opacity: 1 } : { opacity: 0}
        ]}
        onLoadEnd={this.onLoadEnd.bind(this)}
      />
    </View>
  }
}

export default PlaceholderFastImage
