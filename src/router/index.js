
import { Actions } from 'react-native-router-flux';
import { sceneKeys } from '../components';

const NAVIGATION_COOL_DOWN_IN_MS = 500
var NAVIGATION_LOCK = 0

const navigateTo = (scene, props) => {
  console.log(NAVIGATION_LOCK)
  if (NAVIGATION_LOCK) return;

  if(Actions.currentScene != scene) Actions[scene](props)

  NAVIGATION_LOCK = setTimeout(() => {
    NAVIGATION_LOCK = 0;
  }, NAVIGATION_COOL_DOWN_IN_MS)
}

const navigateBack = () => {
    navigateTo('pop')
}

const navigateBackTo = (scene) => {
  navigateTo('popTo', scene)
}

export { sceneKeys, navigateTo, navigateBack, navigateBackTo };
