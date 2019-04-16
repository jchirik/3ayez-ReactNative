//  Created by react-native-create-bridge

package com.ayezcustomer.payfortpayment;

import android.app.Activity;
import android.content.Intent;
import android.support.annotation.Nullable;
import android.text.TextUtils;
import android.util.Log;
import android.widget.Toast;

import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.payfort.fort.android.sdk.base.callbacks.FortCallBackManager;
import com.payfort.fort.android.sdk.base.callbacks.FortCallback;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

public class PayFortPaymentModule extends ReactContextBaseJavaModule implements ActivityEventListener, IPaymentRequestCallBack {
  public static final String REACT_CLASS = "PayFortPayment";
  private static ReactApplicationContext reactContext = null;
  public FortCallBackManager fortCallback = null;

  public PayFortPaymentModule(ReactApplicationContext context) {
    // Pass in the context to the constructor and save it so you can emit events
    // https://facebook.github.io/react-native/docs/native-modules-android.html#the-toast-module
    super(context);

    fortCallback = FortCallback.Factory.create();

    reactContext = context;
  }

  @Override
  public String getName() {
    // Tell React the name of the module
    // https://facebook.github.io/react-native/docs/native-modules-android.html#the-toast-module
    return REACT_CLASS;
  }

  @Override
  public Map<String, Object> getConstants() {
    // Export any constants to be used in your native module
    // https://facebook.github.io/react-native/docs/native-modules-android.html#the-toast-module
    final Map<String, Object> constants = new HashMap<>();
    constants.put("AMOUNT_KEY", PayFortPayment.AMOUNT_KEY);
    constants.put("CUSTOMER_EMAIL_KEY", PayFortPayment.CUSTOMER_EMAIL_KEY);
    constants.put("LANGUAGE_KEY", PayFortPayment.LANGUAGE_KEY);
    constants.put("SDK_TOKEN_KEY", PayFortPayment.SDK_TOKEN_KEY);

    return constants;
  }

  private HashMap<String, String> convertToStringHashMap(ReadableMap rmap) {
    HashMap<String, Object> map = rmap.toHashMap(); //Object is containing String
    HashMap<String, String> newMap = new HashMap<String, String>();
    for (Map.Entry<String, Object> entry : map.entrySet()) {
      if (entry.getValue() instanceof String) {
        newMap.put(entry.getKey(), (String) entry.getValue());
      }
    }
    return newMap;
  }

  @ReactMethod
  public void pay(ReadableMap rmap) {
    HashMap<String, String> map = convertToStringHashMap(rmap);

    PayFortData payFortData = new PayFortData();
    if (!TextUtils.isEmpty(map.get(PayFortPayment.AMOUNT_KEY))) {
      payFortData.amount = new BigDecimal(map.get(PayFortPayment.AMOUNT_KEY)).multiply(BigDecimal.valueOf(100)).toString();// Multiplying with 100, bcz amount should not be in decimal format
      payFortData.command = PayFortPayment.AUTHORIZATION;
      payFortData.currency = PayFortPayment.CURRENCY_TYPE;
      payFortData.customerEmail = map.get(PayFortPayment.CUSTOMER_EMAIL_KEY);
      String lang = map.get(PayFortPayment.LANGUAGE_KEY);
      lang = (lang == null || lang.isEmpty() ? PayFortPayment.LANGUAGE_TYPE : lang);
      payFortData.language = lang;
      payFortData.merchantReference = String.valueOf(System.currentTimeMillis());

      PayFortPayment payFortPayment = new PayFortPayment(getCurrentActivity(), this.fortCallback, this);
      payFortPayment.requestForPayment(payFortData);
    }
  }

  @ReactMethod
  public void exampleMethod() {
    // An example native method that you will expose to React
    // https://facebook.github.io/react-native/docs/native-modules-android.html#the-toast-module
  }

  private static void emitDeviceEvent(String eventName, @Nullable WritableMap eventData) {
    // A method for emitting from the native side to JS
    // https://facebook.github.io/react-native/docs/native-modules-android.html#sending-events-to-javascript
    reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(eventName, eventData);
  }

  @Override
  public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {
    if (resultCode == Activity.RESULT_CANCELED) {

    }
  }

  @Override
  public void onNewIntent(Intent intent) {

  }

  @Override
  public void onPaymentRequestResponse(int responseType, final PayFortData responseData) {
    if (responseType == PayFortPayment.RESPONSE_GET_TOKEN) {
      Toast.makeText(getCurrentActivity(), "Token not generated", Toast.LENGTH_SHORT).show();
      Log.e("onPaymentResponse", "Token not generated");
    } else if (responseType == PayFortPayment.RESPONSE_PURCHASE_CANCEL) {
      Toast.makeText(getCurrentActivity(), "Payment cancelled", Toast.LENGTH_SHORT).show();
      Log.e("onPaymentResponse", "Payment cancelled");
    } else if (responseType == PayFortPayment.RESPONSE_PURCHASE_FAILURE) {
      Toast.makeText(getCurrentActivity(), "Payment failed", Toast.LENGTH_SHORT).show();
      Log.e("onPaymentResponse", "Payment failed");
    } else {
      Toast.makeText(getCurrentActivity(), "Payment successful", Toast.LENGTH_SHORT).show();
      Log.e("onPaymentResponse", "Payment successful");
    }
  }
}
