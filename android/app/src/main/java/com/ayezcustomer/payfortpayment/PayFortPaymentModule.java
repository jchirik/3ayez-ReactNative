//  Created by react-native-create-bridge

package com.ayezcustomer.payfortpayment;

import android.app.Activity;
import android.content.Intent;
import android.support.annotation.Nullable;
import android.widget.Toast;

import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.payfort.fort.android.sdk.base.FortSdk;
import com.payfort.fort.android.sdk.base.callbacks.FortCallBackManager;
import com.payfort.fort.android.sdk.base.callbacks.FortCallback;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

public class PayFortPaymentModule extends ReactContextBaseJavaModule implements ActivityEventListener, IPaymentRequestCallBack {
  public static final String REACT_CLASS = "PayFortPayment";
  private static ReactApplicationContext reactContext = null;
  public FortCallBackManager fortCallback = null;

  private Callback successCallback = null;
  private Callback failureCallback = null;

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
    constants.put("COMMAND_KEY", PayFortPayment.COMMAND_KEY);
    constants.put("CURRENCY_KEY", PayFortPayment.CURRENCY_KEY);
    constants.put("CUSTOMER_EMAIL_KEY", PayFortPayment.CUSTOMER_EMAIL_KEY);
    constants.put("LANGUAGE_KEY", PayFortPayment.LANGUAGE_KEY);
    constants.put("MERCHANT_REFERENCE_KEY", PayFortPayment.MERCHANT_REFERENCE_KEY);
    constants.put("SDK_TOKEN_KEY", PayFortPayment.SDK_TOKEN_KEY);

    constants.put("AUTHORIZATION_COMMAND", PayFortPayment.AUTHORIZATION);
    constants.put("PURCHASE_COMMAND", PayFortPayment.PURCHASE);

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
  public void pay(ReadableMap rmap, Callback successCallback, Callback failureCallback) {

    this.successCallback = successCallback;
    this.failureCallback = failureCallback;

    HashMap<String, String> map = convertToStringHashMap(rmap);

    PayFortRequest payFortRequest = new PayFortRequest();

    payFortRequest.amount = new BigDecimal(map.get(PayFortPayment.AMOUNT_KEY)).multiply(BigDecimal.valueOf(100)).toString();// Multiplying with 100, bcz amount should not be in decimal format
    payFortRequest.command = map.get(PayFortPayment.COMMAND_KEY);
    payFortRequest.currency = map.get(PayFortPayment.CURRENCY_KEY);
    payFortRequest.customerEmail = map.get(PayFortPayment.CUSTOMER_EMAIL_KEY);
    payFortRequest.language = map.get(PayFortPayment.LANGUAGE_KEY);
    payFortRequest.merchantReference = map.get(PayFortPayment.MERCHANT_REFERENCE_KEY);
    payFortRequest.sdkToken = map.get(PayFortPayment.SDK_TOKEN_KEY);

    PayFortPayment payFortPayment = new PayFortPayment(getCurrentActivity(), this.fortCallback, this);
    payFortPayment.requestForPayment(payFortRequest);

  }

  @ReactMethod
  public void getDeviceID(Callback callback) {
    callback.invoke(FortSdk.getDeviceId(getReactApplicationContext()));
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
  public void onPaymentRequestResponse(int responseType, WritableMap responseMap) {
    if (responseType == PayFortPayment.RESPONSE_PAYMENT_CANCEL) {
      Toast.makeText(getCurrentActivity(), "Process cancelled", Toast.LENGTH_SHORT).show();
    } else if (responseType == PayFortPayment.RESPONSE_PAYMENT_FAILURE) {
      this.failureCallback.invoke(responseMap);
      Toast.makeText(getCurrentActivity(), "Process failed", Toast.LENGTH_SHORT).show();
    } else if (responseType == PayFortPayment.RESPONSE_PAYMENT_SUCCESS) {
      this.successCallback.invoke(responseMap);
      Toast.makeText(getCurrentActivity(), "Process succeed", Toast.LENGTH_SHORT).show();
    }
  }
}
