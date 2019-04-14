import { Sentry } from 'react-native-sentry'
import DeviceInfo from 'react-native-device-info'
import createRavenMiddleware from 'raven-for-redux'

let dsn =
    "https://35b44bf400d142f38fd1385cfb41c8cb:fdf921ec0d5a4ff09eaee8fa3044808d@sentry.io/1436918"

export function setupSentry() {
  Sentry.config(dsn).install()
  addBuildContext()
}

export const ravenMiddleware = createRavenMiddleware(Sentry)

const addBuildContext = () => {
  Sentry.setTagsContext({
    appVersion: DeviceInfo.getVersion(),
    buildNumber: DeviceInfo.getBuildNumber(),
    deviceInfo: {
      systemName: DeviceInfo.getSystemName(),
      systemVersion: DeviceInfo.getSystemVersion(),
      deviceName: DeviceInfo.getDeviceName()
    }
  })
}