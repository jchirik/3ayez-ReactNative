import React, { Component } from "react";
import {
    View,
    BackHandler,
    ScrollView,
    StyleSheet
} from 'react-native';
import { strings } from '../../i18n.js';

import {
    AyezText,
    Header
} from "../_common";
import colors from "../../theme/colors.js";
import { navigateBack } from "../../router";

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
          <View style={{ flex: 1 }}>
            <Header
                title={strings("Settings.termsConditions")}
                onBackButtonPress={navigateBack}
            />
            <ScrollView style={{ flex: 1, paddingHorizontal: 20 }}>
            <View style={{ height: 5 }} />
            <AyezText regular color={colors.warmGrey}>
              These terms and conditions ("Terms", "Agreement") are an agreement between Mobile Application Developer ("Mobile Application Developer", "us", "we" or "our") and you ("User", "you" or "your"). This Agreement sets forth the general terms and conditions of your use of the 3ayez mobile application and any of its products or services (collectively, "Mobile Application" or "Services").
            </AyezText>
            <AyezText medium color={colors.warmGrey} style={{ marginTop: 8 }}>
            Accounts and Membership
            </AyezText>
            <AyezText regular color={colors.warmGrey}>
            If you create an account in 3ayez, you are responsible for maintaining the security of your account and you are fully responsible for all activities that occur under the account and any other actions taken in connection with it. Providing false contact information of any kind may result in the termination of your account. You must immediately notify us of any unauthorized uses of your account or any other breaches of security. We will not be liable for any acts or omissions by you, including any damages of any kind incurred as a result of such acts or omissions.
            </AyezText>
            <AyezText medium color={colors.warmGrey} style={{ marginTop: 8 }}>
            Backups
            </AyezText>
            <AyezText regular color={colors.warmGrey}>
            We are not responsible for Content residing in the Mobile Application. In no event shall we be held liable for any loss of any Content. It is your sole responsibility to maintain appropriate backup of your Content. Notwithstanding the foregoing, on some occasions and in certain circumstances, with absolutely no obligation, we may be able to restore some or all of your data that has been deleted as of a certain date and time when we may have backed up data for our own purposes. We make no guarantee that the data you need will be available.
            </AyezText>
            <AyezText medium color={colors.warmGrey} style={{ marginTop: 8 }}>
            Changes and Amendments
            </AyezText>
            <AyezText regular color={colors.warmGrey}>
            We reserve the right to modify this Agreement or its policies relating to the Mobile Application or Services at any time, effective upon posting of an updated version of this Agreement in the Mobile Application. When we do, we will revise the updated date at the bottom of this page. Continued use of the Mobile Application after any such changes shall constitute your consent to such changes.
            </AyezText>
            <AyezText medium color={colors.warmGrey} style={{ marginTop: 8 }}>
            Acceptance of These Terms
            </AyezText>
            <AyezText regular color={colors.warmGrey}>
            You acknowledge that you have read this Agreement and agree to all its terms and conditions. By using 3ayez or its Services you agree to be bound by this Agreement. If you do not agree to abide by the terms of this Agreement, you are not authorized to use or access 3ayez and its Services.
            </AyezText>
            <AyezText medium color={colors.warmGrey} style={{ marginTop: 8 }}>
            Contacting Us
            </AyezText>
            <AyezText regular color={colors.warmGrey}>
            If you have any questions about this agreement, please contact us.
            </AyezText>
            <AyezText medium size={11} color={colors.warmGrey} style={{ marginTop: 8 }}>
            Terms & Conditions last updated on March 21, 2019
            </AyezText>
            <View style={{ height: 20 }} />
            </ScrollView>
          </View>
        );
    }
}
