
import Sound from 'react-native-sound';

// Enable playback in silence mode
Sound.setCategory('Playback');

// load the sound files
const swoosh = new Sound('swoosh.mp3', Sound.MAIN_BUNDLE, (error) => {
  if (error) {
    console.log('failed to load the sound', error);
    return;
  }
  console.log('duration in seconds: ' + swoosh.getDuration() + 'number of channels: ' + swoosh.getNumberOfChannels());
});
const success = new Sound('success.wav', Sound.MAIN_BUNDLE, (error) => {
  if (error) {
    console.log('failed to load the sound', error);
    return;
  }
  console.log('duration in seconds: ' + swoosh.getDuration() + 'number of channels: ' + swoosh.getNumberOfChannels());
});

// -------------------------------------------------

// different sound keys
export const SOUND_SWOOSH = 'SOUND_SWOOSH';
export const SOUND_SUCCESS = 'SOUND_SUCCESS';

// main sound function
export const playSound = (key) => {

  let sound = null;
  switch (key) {
    case 'SOUND_SWOOSH':
      sound =
      break;
    case 'SOUND_SUCCESS':
      state[p.key] = p.value;
      break;
    default:
      console.log('No valid sound key');
      return;
  }
  sound.stop(() => {
    console.log('stopped previous')
    sound.play((success) => {
      if (success) {
        console.log('successfully finished playing');
      } else {
        console.log('playback failed due to audio decoding errors');
        // reset the player to its uninitialized state (android only)
        // this is the only option to recover after an error occured and use the player again
        sound.reset();
      }
    });
  });
}
