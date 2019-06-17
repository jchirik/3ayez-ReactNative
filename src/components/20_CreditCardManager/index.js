import React, { Component } from "react"
import { View, Image, TouchableOpacity, ActivityIndicator, FlatList } from "react-native"
import { connect } from "react-redux"
import { createCreditCard, deleteCreditCard } from "../../actions"
import { Header, BlockButton, BottomChoiceSelection, AyezText } from "../_common"
import { padNumberZeros, paymentIcon } from "../../Helpers.js"
import { strings } from "../../i18n.js"
import images from "../../theme/images"
import styles from "./styles"
import sharedStyles from "../styles";
import colors from "../../theme/colors";
import stringConstants from "../../utils/string";

class CreditCardManager extends Component {
  constructor(props) {
    super(props)
    this.state = {
      cardToDelete: null
    }
  }

  renderItem({ item, index }) {
    return (
      <View
        style={styles.creditCardItem}>
        <Image
          source={paymentIcon(item.brand, stringConstants.creditType)}
          style={styles.paymentIcon}
          resizeMode={"contain"}
        />
        <View style={styles.creditCardInfoContainer}>
          <AyezText medium>
            {item.brand} (**** {item.last4})
          </AyezText>
          <AyezText regular>
            {strings("CreditCard.expiryText", {
              month: padNumberZeros(item.exp_month, 2),
              year: item.exp_year
            })}
          </AyezText>
          <AyezText regular>{item.name}</AyezText>
        </View>
        <TouchableOpacity
          onPress={() => this.setState({ cardToDelete: item.card_id })}
          style={styles.deleteCreditButton}>
          <Image
            source={images.deleteIcon}
            style={styles.deleteCreditIcon}
            resizeMode={"contain"}
          />
        </TouchableOpacity>
      </View>
    )
  }

  closeDeleteCardConfirm() {
    this.setState({ cardToDelete: null })
  }

  render() {
    if (this.props.loading) {
      return <ActivityIndicator size="small" style={sharedStyles.ActivityIndicator} />
    }

    return (
      <View style={styles.creditCardManagerContainer}>
        <Header title={strings("Settings.creditCards")} />
        <FlatList
          style={styles.creditCardList}
          data={this.props.credit_cards}
          renderItem={this.renderItem.bind(this)}
          ListHeaderComponent={<View style={styles.creditCardListHeader} />}
          keyExtractor={(item) => item.id}
        />
        <BlockButton
          style={styles.addCreditCardButton}
          text={strings("CreditCard.addCard")}
          onPress={() => {
            this.props.createCreditCard()
          }}
        />

        <BottomChoiceSelection
          isVisible={this.state.cardToDelete}
          onClose={this.closeDeleteCardConfirm.bind(this)}
          backgroundColor={colors.valenciaDelete}
          title={strings("DeleteConfirmation.query")}
          buttons={[
            {
              text: strings("DeleteConfirmation.confirm"),
              action: () => this.props.deleteCreditCard(this.state.cardToDelete)
            },
            { text: strings("DeleteConfirmation.cancel"), action: () => console.log("No") }
          ]}
        />
      </View>
    )
  }
}

const mapStateToProps = ({ CreditCards }) => {
  const { credit_cards, loading, toastMessage } = CreditCards
  return {
    credit_cards,
    loading,
    toastMessage
  }
}

export default connect(
  mapStateToProps,
  {
    deleteCreditCard,
    createCreditCard
  }
)(CreditCardManager)
