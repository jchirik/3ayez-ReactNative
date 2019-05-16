import { Sentry } from 'react-native-sentry';
import DeviceInfo from 'react-native-device-info';
import createRavenMiddleware from 'raven-for-redux';
import Config from 'react-native-config';

export function setupSentry() {
  Sentry.config(Config.SENTRY_DSN).install();
  addBuildContext();
}

export const ravenMiddleware = createRavenMiddleware(Sentry);

const addBuildContext = () => {
  Sentry.setTagsContext({
    appVersion: DeviceInfo.getVersion(),
    buildNumber: DeviceInfo.getBuildNumber(),
    deviceInfo: {
      systemName: DeviceInfo.getSystemName(),
      systemVersion: DeviceInfo.getSystemVersion(),
      deviceName: DeviceInfo.getDeviceName()
    }
  });
};
