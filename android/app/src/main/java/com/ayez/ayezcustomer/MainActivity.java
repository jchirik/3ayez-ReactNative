package com.ayez.ayezcustomer;

import com.facebook.react.ReactActivity;
import com.zopim.android.sdk.api.ZopimChat;
import com.zopim.android.sdk.widget.ChatWidgetService;

import android.content.Intent;
import android.os.Build;
import android.os.Bundle;
import android.os.PersistableBundle;
import android.provider.Settings;
// react-native-splash-screen >= 0.3.1
import org.devio.rn.splashscreen.SplashScreen; // here

public class MainActivity extends ReactActivity {

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "ayezcustomer";
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        MainApplication.getCallbackManager().onActivityResult(requestCode, resultCode, data);
    }

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    SplashScreen.show(this, R.style.SplashScreenTheme);

    Boolean canDraw = Build.VERSION.SDK_INT < Build.VERSION_CODES.M || Settings.canDrawOverlays(this);

    if(canDraw) {
      ChatWidgetService.startService(this);
    }
    super.onCreate(savedInstanceState);
  }

  @Override
  protected void onDestroy() {
    super.onDestroy();
    ChatWidgetService.stopService(this);
  }
}
