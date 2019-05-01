import firebase from "react-native-firebase"
import { User } from "./constants"

export const getUID = () => {
  const { currentUser } = firebase.auth()
  return currentUser ? currentUser.uid : null
}

export const getEmail = () => {
  const uid = getUID()
  return uid ? uid + User.EMAIL_DOMAIN : null
}
