import { AsyncStorage } from "react-native"
import { generateUUID } from "../Helpers"

/**
 * Get the stored credit cards from the storage.
 *
 * @return Array of credit cards
 */
export async function getCreditCards() {
  try {
    let cards = await AsyncStorage.getItem(CREDIT_CARDS_KEY)
    if (!cards) return []
    return JSON.parse(cards)
  } catch {
    return []
  }
}

/**
 * Saves a credit card to storage.
 *
 * @param key The card to store.
 * @return Card ID if save successfully or null
 */
export async function storeCard(card) {
  let id = generateUUID()

  try {
    let currentCards = await getCreditCards()
    currentCards.push({ id, data: card })
    return (await saveCards(currentCards)) ? id : null
  } catch {
    return null
  }
}

/**
 * Delete a credit card from storage.
 *
 * @param cardID The card ID to delete.
 * @return true if card is deleted successfully or false
 */
export async function removeCard(cardID) {
  try {
    let currentCards = await getCreditCards()
    let cardIndex = currentCards.findIndex(card => card.id == cardID)
    currentCards.splice(cardIndex, 1)
    return await saveCards(currentCards)
  } catch {
    return false
  }
}

/**
 * Get a credit card from storage.
 *
 * @param cardID The card ID to retrieve.
 * @return card if exist or null otherwise
 */
export async function getCard(cardID) {
  try {
    let currentCards = await getCreditCards()
    return currentCards.find(card => card.id == cardID)
  } catch {
    return null
  }
}

/**
 * Burn it all to the ground.
 */
export async function clear() {
  try {
    await AsyncStorage.removeItem(CREDIT_CARDS_KEY)
  } catch {}
}

const CREDIT_CARDS_KEY = "CREADIT_CARDS"

async function saveCards(cards) {
  try {
    await AsyncStorage.setItem(CREDIT_CARDS_KEY, JSON.stringify(cards))
    return true
  } catch {
    return false
  }
}
