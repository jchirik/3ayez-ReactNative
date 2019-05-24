import { Sentry } from 'react-native-sentry';
import DeviceInfo from 'react-native-device-info';
import createRavenMiddleware from 'raven-for-redux';
import Config from 'react-native-config';

export function setupSentry() {
  Sentry.config(Config.SENTRY_DSN).install();
}

export const ravenMiddleware = createRavenMiddleware(Sentry);

