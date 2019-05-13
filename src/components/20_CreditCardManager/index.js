import React, { Component } from "react"
import { View, Image, TouchableOpacity, ActivityIndicator, FlatList } from "react-native"
import { connect } from "react-redux"
import { createCreditCard, deleteCreditCard } from "../../actions"
import { Header, BlockButton, BottomChoiceSelection, AyezText } from "../_common"
import { padNumberZeros, paymentIcon } from "../../Helpers.js"
import { strings } from "../../i18n.js"
import images from "../../theme/images"

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
        style={{
          height: 90,
          backgroundColor: "white",
          flexDirection: "row",
          borderBottomWidth: 1,
          borderColor: "#f7f7f7",
          alignItems: "center"
        }}>
        <Image
          source={paymentIcon(item.brand, "CREDIT")}
          style={{
            width: 50,
            height: 50,
            marginLeft: 24,
            marginRight: 24
          }}
          resizeMode={"contain"}
        />
        <View style={{ flex: 1, alignItems: "flex-start" }}>
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
          style={{ padding: 10, marginRight: 5 }}>
          <Image
            source={images.deleteIcon}
            style={{ width: 20, height: 20 }}
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
      return <ActivityIndicator size="small" style={{ flex: 1 }} />
    }

    return (
      <View style={{ flex: 1, backgroundColor: "white" }}>
        <Header title={strings("Settings.creditCards")} />
        <FlatList
          style={{ flex: 1 }}
          data={this.props.credit_cards}
          renderItem={this.renderItem.bind(this)}
          ListHeaderComponent={<View style={{ width: 8 }} />}
          keyExtractor={(item) => item.id}
        />
        <BlockButton
          style={{ margin: 20 }}
          text={strings("CreditCard.addCard")}
          onPress={() => {
            this.props.createCreditCard()
          }}
        />

        <BottomChoiceSelection
          isVisible={this.state.cardToDelete}
          onClose={this.closeDeleteCardConfirm.bind(this)}
          backgroundColor="#E64E47"
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
