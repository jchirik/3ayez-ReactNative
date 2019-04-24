package com.ayez.ayezcustomer;

import com.ayezcustomer.payfortpayment.PayFortPayment;
import com.facebook.react.ReactActivity;
import com.payfort.fort.android.sdk.base.callbacks.FortCallBackManager;
import com.payfort.fort.android.sdk.base.callbacks.FortCallback;

import android.content.Intent;
import android.os.Bundle;
// react-native-splash-screen >= 0.3.1
import org.devio.rn.splashscreen.SplashScreen; // here

public class MainActivity extends ReactActivity {

  public FortCallBackManager fortCallback = null;

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
        if (requestCode == PayFortPayment.REQUEST_PAYMENT) {
          fortCallback.onActivityResult(requestCode, resultCode, data);
        }
    }

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    SplashScreen.show(this, R.style.SplashScreenTheme);
    super.onCreate(savedInstanceState);
    initilizePayFortSDK();
  }

  private void initilizePayFortSDK() {
    fortCallback = FortCallback.Factory.create();
  }

  @Override
  protected void onDestroy() {
    super.onDestroy();
  }
}
