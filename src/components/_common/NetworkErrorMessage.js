import React from "react";
import { View, StyleSheet } from "react-native";
import { strings } from "../../i18n.js";
import { BlockButton, AyezText } from ".";
import colors from "../../theme/colors";

const NetworkErrorMessage = ({ onPress, color, text }) => {
  return (
    <View style={styles.failedMessageContainer}>
      <AyezText>{strings("Common.requestFailed")}</AyezText>
      <BlockButton
        onPress={onPress}
        text={text ? text : strings("Common.tryAgain")}
        color={color ? color : colors.warmGrey}
        style={styles.tryAgainButtonStyle}
        textStyle={styles.tryAgainButtonTextStyle}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  failedMessageContainer: {
    flex: 1,
    marginTop: 50,
    alignItems: "center",
    justifyContent: "center"
  },
  tryAgainButtonStyle: {
    marginTop: 15
  },
  tryAgainButtonTextStyle: {
    marginHorizontal: 15
  }
});

export default NetworkErrorMessage;
