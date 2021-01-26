import DeviceInfo from 'react-native-device-info';
import { getUrlResponse, isIOS, isAndroid } from "../Helpers"
import { APP_STORE } from "./Constants"

/**
 * Gets the application bundle identifier at runtime.
 * If the running device is Android, returns the `Package name`.
 * If the running device is iOS, returns the `Bundle Identifier`.
 */
export const getBundleID = () => DeviceInfo.getBundleId()

export const getAppleID = async () => {
  let response = await getUrlResponse(
    `http://itunes.apple.com/lookup?bundleId=${getBundleID()}`
  )

  if (!response || response.resultCount == 0) return null

  let responseInfo = response.results[0]
    console.log("Apple ID response2: ", response)
  return responseInfo.trackId
}

const getIOSStoreURL = async () => {
  let appleID = await getAppleID()
  if (!appleID) return null

  return APP_STORE.IOS_URL + "id" + appleID
}

const getAndroidStoreURL = () => {
  let appID = getBundleID()
  return APP_STORE.ANDROID_URL + "details?id=" + appID
}

const getIOSStoreDirectLink = async () => {
  let appleID = await getAppleID()
  if (!appleID) return null

  return APP_STORE.IOS_DIRECT_URL + "id" + appleID
}

const getAndroidStoreDirectLink = () => {
  let appID = getBundleID()
  return APP_STORE.ANDROID_DIRECT_URL + "details?id=" + appID
}

export const getStoreURL = async () => {
  if (isIOS()) {
    return await getIOSStoreURL()
  } else if (isAndroid) {
    return getAndroidStoreURL()
  } else {
    return null
  }
}

/**
 * Return the application direct link in the store app.
 */
export const getStoreDirectLink = async () => {
  if (isIOS()) {
    return await getIOSStoreDirectLink()
  } else if (isAndroid) {
    return getAndroidStoreDirectLink()
  } else {
    return null
  }
}
