import { StyleSheet } from "react-native"
import { CreditCardDimensions } from "./constants"
import colors from "../../theme/colors"

const styles = StyleSheet.create({
  creditCardItem: {
    height: CreditCardDimensions.creditCardHeight,
    backgroundColor: colors.white,
    flexDirection: "row",
    borderBottomWidth: CreditCardDimensions.creditCardBorderWidth,
    borderColor: colors.whiteSmokeBorder,
    alignItems: "center",
  },

  paymentIcon: {
    width: CreditCardDimensions.paymentIconDimension,
    height: CreditCardDimensions.paymentIconDimension,
    marginLeft: CreditCardDimensions.paymentIconMargin,
    marginRight: CreditCardDimensions.paymentIconMargin,
  },

  creditCardInfoContainer: { flex: 1, alignItems: "flex-start" },

  deleteCreditButton: {
    padding: CreditCardDimensions.deleteCreditButtonPadding,
    marginRight: CreditCardDimensions.deleteCreditButtonMarginRight,
  },

  deleteCreditIcon: {
    width: CreditCardDimensions.deleteCreditIconDimension,
    height: CreditCardDimensions.deleteCreditIconDimension,
  },

  creditCardManagerContainer: { flex: 1, backgroundColor: colors.white },

  creditCardList: { flex: 1 },

  creditCardListHeader: {
    width: CreditCardDimensions.creditCardListHeaderWidth,
  },

  addCreditCardButton: {
    margin: CreditCardDimensions.addCreditCardButtonMargin,
  },
})

export default styles
