import React, { Component } from "react";
import {
    View,
    BackHandler,
    StyleSheet
} from 'react-native';
import { strings } from '../../i18n.js';

import {
    AyezText,
    Header
} from "../_common";
import colors from "../../theme/colors.js";
import { navigateBack } from "../../router/index.js";

export default class TermsAndConditions extends Component {
    constructor(props) {
        super(props);
        BackHandler.addEventListener('hardwareBackPress', this.onAndroidBackPress);
    }

    onAndroidBackPress = () => {
        navigateBack()
    }

    render() {
        return (
          <View>
            <Header
                title={strings("Settings.termsConditions")}
                onBackButtonPress={navigateBack}
            />
            <AyezText style={styles.TermsAndConditionsTextStyle}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Sed a congue felis. Donec fringilla ultricies dignissim.
              Duis lobortis, eros sit amet fringilla gravida, eros dui
              pretium lorem, ut egestas arcu elit a sapien. In eros
              nibh, molestie a lorem sed, gravida varius lacus. Nulla
              nec turpis purus. Aliquam gravida massa nec quam
              vestibulum, eu ullamcorper massa laoreet. Etiam velit
              nulla, finibus at mattis eget, porttitor at dui. Sed
              egestas dolor est, et interdum metus venenatis efficitur.
              Morbi sed ornare velit, sed efficitur felis. Nullam id
              dapibus tortor, non semper justo. Mauris felis augue,
              condimentum ut sapien ac, ultricies tristique ante.
              Vestibulum aliquet ipsum non dictum rutrum. Nunc ligula
              risus, placerat a ligula eget, blandit auctor odio. Nullam
              magna nisl, hendrerit rutrum quam quis, eleifend hendrerit
              neque.
            </AyezText>
          </View>
        );
    }
}

let styles = StyleSheet.create({
  TermsAndConditionsTextStyle: {
    margin: 15,
    color: colors.warmGrey
  }
});