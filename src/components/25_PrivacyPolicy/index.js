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
import { navigateBack } from "../../router/index.js";

export default class PrivacyPolicy extends Component {
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
                title={strings("Settings.privacyPolicy")}
                onBackButtonPress={navigateBack}
            />
            <ScrollView style={{ flex: 1, paddingHorizontal: 20 }}>
            <View style={{ height: 5 }} />
            <AyezText regular color={colors.warmGrey}>
              This privacy policy ("Policy") describes how Mobile Application Developer ("Mobile Application Developer", "we", "us" or "our") collects, protects and uses the personally identifiable information ("Personal Information") you ("User", "you" or "your") may provide in the 3ayez mobile application and any of its products or services (collectively, "Mobile Application" or "Services"). It also describes the choices available to you regarding our use of your Personal Information and how you can access and update this information. This Policy does not apply to the practices of companies that we do not own or control, or to individuals that we do not employ or manage.            </AyezText>
            <AyezText medium color={colors.warmGrey} style={{ marginTop: 8 }}>
            Collection of personal information
            </AyezText>
            <AyezText regular color={colors.warmGrey}>
            We receive and store any information you knowingly provide to us when you create an account, fill any online forms in the Mobile Application. When required this information may include your name, phone number, address, credit card information, or other Personal Information. You can choose not to provide us with certain information, but then you may not be able to take advantage of some of the Mobile Application's features. Users who are uncertain about what information is mandatory are welcome to contact us.
            </AyezText>
            <AyezText medium color={colors.warmGrey} style={{ marginTop: 8 }}>
            Collection of non-personal information
            </AyezText>
            <AyezText regular color={colors.warmGrey}>
            When you open the Mobile Application our servers automatically record information that your device sends. This data may include information such as your device's IP address and location, device name and version, operating system type and version, language preferences, information you search for in our Mobile Application, access times and dates, and other statistics.
            </AyezText>
            <AyezText medium color={colors.warmGrey} style={{ marginTop: 8 }}>
            Managing personal information
            </AyezText>
            <AyezText regular color={colors.warmGrey}>
            You are able to access, add to, update and delete certain Personal Information about you. The information you can view, update, and delete may change as the Mobile Application or Services change. When you update information, however, we may maintain a copy of the unrevised information in our records. Some information may remain in our private records after your deletion of such information from your account. We will retain and use your information as necessary to comply with our legal obligations, resolve disputes, and enforce our agreements. We may use any aggregated data derived from or incorporating your Personal Information after you update or delete it, but not in a manner that would identify you personally. Once the retention period expires, Personal Information shall be deleted. Therefore, the right to access, the right to erasure, the right to rectification and the right to data portability cannot be enforced after the expiration of the retention period.
            </AyezText>
            <AyezText medium color={colors.warmGrey} style={{ marginTop: 8 }}>
            Use of collected information
            </AyezText>
            <AyezText regular color={colors.warmGrey}>
            Any of the information we collect from you may be used to improve our Mobile Application; improve customer service and respond to queries and emails of our customers; run and operate our Mobile Application and Services. Non-Personal Information collected is used only to identify potential cases of abuse and establish statistical information regarding Mobile Application traffic and usage. This statistical information is not otherwise aggregated in such a way that would identify any particular user of the system.
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
