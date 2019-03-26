//  Created by react-native-create-bridge

package com.ayezcustomer.weaccept;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.support.annotation.Nullable;
import android.util.Log;
import android.widget.Toast;

import com.ayez.ayezcustomer.R;
import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReadableType;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.paymob.acceptsdk.IntentConstants;
import com.paymob.acceptsdk.PayActivity;
import com.paymob.acceptsdk.PayActivityIntentKeys;
import com.paymob.acceptsdk.PayResponseKeys;
import com.paymob.acceptsdk.SaveCardResponseKeys;
import com.paymob.acceptsdk.ToastMaker;

import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

import static com.ayezcustomer.utils.ReadableMapUtils.convertToStringHashMap;
import static com.ayezcustomer.utils.ReadableMapUtils.hasValue;
import static com.ayezcustomer.utils.ReadableMapUtils.putIntentExtraFromRMap;

public class WeAcceptModule extends ReactContextBaseJavaModule implements ActivityEventListener {
  public static final String REACT_CLASS = "WeAccept";
  private static Intent sIntent;
  private static ReactApplicationContext reactContext = null;
  private static final int ACCEPT_PAYMENT_REQUEST = 10;
  private static final String USER_CANCELED = "USER_CANCELED";
  private static final String MISSING_ARGUMENT = "MISSING_ARGUMENT";
  private static final String TRANSACTION_ERROR = "TRANSACTION_ERROR";
  private static final String TRANSACTION_REJECTED = "TRANSACTION_REJECTED";
  private static final String TRANSACTION_REJECTED_PARSING_ISSUE = "TRANSACTION_REJECTED_PARSING_ISSUE";
  private static final String TRANSACTION_SUCCESSFUL = "TRANSACTION_SUCCESSFUL";
  private static final String TRANSACTION_SUCCESSFUL_PARSING_ISSUE = "TRANSACTION_SUCCESSFUL_PARSING_ISSUE";
  private static final String TRANSACTION_SUCCESSFUL_CARD_SAVED = "TRANSACTION_SUCCESSFUL_CARD_SAVED";
  private static final String USER_CANCELED_3D_SECURE_VERIFICATION = "USER_CANCELED_3D_SECURE_VERIFICATION";
  private static final String USER_CANCELED_3D_SECURE_VERIFICATION_PARSING_ISSUE = "USER_CANCELED_3D_SECURE_VERIFICATION_PARSING_ISSUE";
  private static final String RESPONSE_TOKEN = "RESPONSE_TOKEN";

  public WeAcceptModule(ReactApplicationContext context) {
    // Pass in the context to the constructor and save it so you can emit events
    // https://facebook.github.io/react-native/docs/native-modules-android.html#the-toast-module
    super(context);

    reactContext = context;
    reactContext.addActivityEventListener(this);
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
    constants.put("FIRST_NAME", PayActivityIntentKeys.FIRST_NAME);
    constants.put("LAST_NAME", PayActivityIntentKeys.LAST_NAME);
    constants.put("BUILDING", PayActivityIntentKeys.BUILDING);
    constants.put("FLOOR", PayActivityIntentKeys.FLOOR);
    constants.put("APARTMENT", PayActivityIntentKeys.APARTMENT);
    constants.put("CITY", PayActivityIntentKeys.CITY);
    constants.put("STATE", PayActivityIntentKeys.STATE);
    constants.put("COUNTRY", PayActivityIntentKeys.COUNTRY);
    constants.put("EMAIL", PayActivityIntentKeys.EMAIL);
    constants.put("PHONE_NUMBER", PayActivityIntentKeys.PHONE_NUMBER);
    constants.put("POSTAL_CODE", PayActivityIntentKeys.POSTAL_CODE);
    constants.put("PAYMENT_KEY", PayActivityIntentKeys.PAYMENT_KEY);
    constants.put("THREE_D_SECURE_ACTIVITY_TITLE", PayActivityIntentKeys.THREE_D_SECURE_ACTIVITY_TITLE);
    constants.put("SAVE_CARD_DEFAULT", PayActivityIntentKeys.SAVE_CARD_DEFAULT);
    constants.put("SHOW_ALERTS", PayActivityIntentKeys.SHOW_ALERTS);
    constants.put("SHOW_SAVE_CARD", PayActivityIntentKeys.SHOW_SAVE_CARD);
    constants.put("THEME_COLOR", PayActivityIntentKeys.THEME_COLOR);
    constants.put("TOKEN", PayActivityIntentKeys.TOKEN);
    constants.put("MASKED_PAN_NUMBER", PayActivityIntentKeys.MASKED_PAN_NUMBER);

    constants.put(USER_CANCELED, USER_CANCELED);
    constants.put(MISSING_ARGUMENT, MISSING_ARGUMENT);
    constants.put(TRANSACTION_ERROR, TRANSACTION_ERROR);
    constants.put(TRANSACTION_REJECTED, TRANSACTION_REJECTED);
    constants.put(TRANSACTION_REJECTED_PARSING_ISSUE, TRANSACTION_REJECTED_PARSING_ISSUE);
    constants.put(TRANSACTION_SUCCESSFUL, TRANSACTION_SUCCESSFUL);
    constants.put(TRANSACTION_SUCCESSFUL_PARSING_ISSUE, TRANSACTION_SUCCESSFUL_PARSING_ISSUE);
    constants.put(TRANSACTION_SUCCESSFUL_CARD_SAVED, TRANSACTION_SUCCESSFUL_CARD_SAVED);
    constants.put(USER_CANCELED_3D_SECURE_VERIFICATION, USER_CANCELED_3D_SECURE_VERIFICATION);
    constants.put(USER_CANCELED_3D_SECURE_VERIFICATION_PARSING_ISSUE, USER_CANCELED_3D_SECURE_VERIFICATION_PARSING_ISSUE);

    constants.put("MISSING_ARGUMENT_VALUE", IntentConstants.MISSING_ARGUMENT_VALUE);
    constants.put("RESPONSE_DATA_MESSAGE", PayResponseKeys.DATA_MESSAGE);
    constants.put("TRANSACTION_ERROR_REASON", IntentConstants.TRANSACTION_ERROR_REASON);
    constants.put("RAW_PAY_RESPONSE", IntentConstants.RAW_PAY_RESPONSE);
    constants.put("RESPONSE_TOKEN", SaveCardResponseKeys.TOKEN);
    constants.put("PENDING", PayResponseKeys.PENDING);

    return constants;
  }

  @ReactMethod
  public void start(ReadableMap rmap) {
    // An example native method that you will expose to React
    // https://facebook.github.io/react-native/docs/native-modules-android.html#the-toast-module

    sIntent = new Intent(reactContext, PayActivity.class);

    putNormalExtras(sIntent, rmap);
    putDefaultValues(sIntent);

    putIntentExtraFromRMap(rmap, PayActivityIntentKeys.SAVE_CARD_DEFAULT, sIntent);
    putIntentExtraFromRMap(rmap, PayActivityIntentKeys.SHOW_ALERTS, sIntent);
    putIntentExtraFromRMap(rmap, PayActivityIntentKeys.SHOW_SAVE_CARD, sIntent);

    if (rmap.hasKey(PayActivityIntentKeys.TOKEN) && !rmap.isNull(PayActivityIntentKeys.TOKEN)) {
      putIntentExtraFromRMap(rmap, PayActivityIntentKeys.TOKEN, sIntent);
      putIntentExtraFromRMap(rmap, PayActivityIntentKeys.MASKED_PAN_NUMBER, sIntent);
    }

    reactContext.startActivityForResult(sIntent, ACCEPT_PAYMENT_REQUEST, null);
  }

  private static void putDefaultValues(Intent intent) {
    intent.putExtra(PayActivityIntentKeys.THEME_COLOR, 0xFF2DD38F);
  }

  private void putNormalExtras(Intent intent, ReadableMap rmap) {
    putIntentExtraFromRMap(rmap, PayActivityIntentKeys.FIRST_NAME, intent);
    putIntentExtraFromRMap(rmap, PayActivityIntentKeys.LAST_NAME, intent);
    putIntentExtraFromRMap(rmap, PayActivityIntentKeys.BUILDING, intent);
    putIntentExtraFromRMap(rmap, PayActivityIntentKeys.FLOOR, intent);
    putIntentExtraFromRMap(rmap, PayActivityIntentKeys.APARTMENT, intent);
    putIntentExtraFromRMap(rmap, PayActivityIntentKeys.CITY, intent);
    putIntentExtraFromRMap(rmap, PayActivityIntentKeys.STATE, intent);
    putIntentExtraFromRMap(rmap, PayActivityIntentKeys.COUNTRY, intent);
    putIntentExtraFromRMap(rmap, PayActivityIntentKeys.EMAIL, intent);
    putIntentExtraFromRMap(rmap, PayActivityIntentKeys.PHONE_NUMBER, intent);
    putIntentExtraFromRMap(rmap, PayActivityIntentKeys.POSTAL_CODE, intent);
    putIntentExtraFromRMap(rmap, PayActivityIntentKeys.PAYMENT_KEY, intent);
    putIntentExtraFromRMap(rmap, PayActivityIntentKeys.THREE_D_SECURE_ACTIVITY_TITLE, intent);
  }

  private static void emitDeviceEvent(String eventName, @Nullable WritableMap eventData) {
    // A method for emitting from the native side to JS
    // https://facebook.github.io/react-native/docs/native-modules-android.html#sending-events-to-javascript
    reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(eventName, eventData);
  }

  @Override
  public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {
    Bundle extras = data.getExtras();
    Bundle givenExtras = sIntent.getExtras();

    if (requestCode == ACCEPT_PAYMENT_REQUEST) {
      WritableMap wMap = new WritableNativeMap();
      wMap.putString(PayActivityIntentKeys.FIRST_NAME, givenExtras.getString(PayActivityIntentKeys.FIRST_NAME));
      wMap.putString(PayActivityIntentKeys.LAST_NAME, givenExtras.getString(PayActivityIntentKeys.LAST_NAME));
      wMap.putString(PayActivityIntentKeys.BUILDING, givenExtras.getString(PayActivityIntentKeys.BUILDING));
      wMap.putString(PayActivityIntentKeys.FLOOR, givenExtras.getString(PayActivityIntentKeys.FLOOR));
      wMap.putString(PayActivityIntentKeys.APARTMENT, givenExtras.getString(PayActivityIntentKeys.APARTMENT));
      wMap.putString(PayActivityIntentKeys.CITY, givenExtras.getString(PayActivityIntentKeys.CITY));
      wMap.putString(PayActivityIntentKeys.STATE, givenExtras.getString(PayActivityIntentKeys.STATE));
      wMap.putString(PayActivityIntentKeys.COUNTRY, givenExtras.getString(PayActivityIntentKeys.COUNTRY));
      wMap.putString(PayActivityIntentKeys.EMAIL, givenExtras.getString(PayActivityIntentKeys.EMAIL));
      wMap.putString(PayActivityIntentKeys.PHONE_NUMBER, givenExtras.getString(PayActivityIntentKeys.PHONE_NUMBER));
      wMap.putString(PayActivityIntentKeys.POSTAL_CODE, givenExtras.getString(PayActivityIntentKeys.POSTAL_CODE));
      wMap.putString(PayActivityIntentKeys.PAYMENT_KEY, givenExtras.getString(PayActivityIntentKeys.PAYMENT_KEY));
      wMap.putString(PayActivityIntentKeys.THREE_D_SECURE_ACTIVITY_TITLE, givenExtras.getString(PayActivityIntentKeys.THREE_D_SECURE_ACTIVITY_TITLE));
      wMap.putBoolean(PayActivityIntentKeys.SAVE_CARD_DEFAULT, givenExtras.getBoolean(PayActivityIntentKeys.SAVE_CARD_DEFAULT));
      wMap.putBoolean(PayActivityIntentKeys.SHOW_ALERTS, givenExtras.getBoolean(PayActivityIntentKeys.SHOW_ALERTS));
      wMap.putBoolean(PayActivityIntentKeys.SHOW_SAVE_CARD, givenExtras.getBoolean(PayActivityIntentKeys.SHOW_SAVE_CARD));
      wMap.putString(PayActivityIntentKeys.TOKEN, givenExtras.getString(PayActivityIntentKeys.TOKEN));

      if (resultCode == IntentConstants.USER_CANCELED) {
//        // User canceled and did no payment request was fired
////        ToastMaker.displayShortToast(getCurrentActivity(), "User canceled!!");
        emitDeviceEvent(USER_CANCELED, wMap);
      } else if (resultCode == IntentConstants.MISSING_ARGUMENT) {
        // You forgot to pass an important key-value pair in the intent's extras
//        ToastMaker.displayShortToast(getCurrentActivity(), "Missing Argument == " + extras.getString(IntentConstants.MISSING_ARGUMENT_VALUE));
        wMap.putString(IntentConstants.MISSING_ARGUMENT_VALUE, extras.getString(IntentConstants.MISSING_ARGUMENT_VALUE));
        emitDeviceEvent(MISSING_ARGUMENT, wMap);
      } else if (resultCode == IntentConstants.TRANSACTION_ERROR) {
        // An error occurred while handling an API's response
//        ToastMaker.displayShortToast(getCurrentActivity(), "Reason == " + extras.getString(IntentConstants.TRANSACTION_ERROR_REASON));
        wMap.putString(IntentConstants.TRANSACTION_ERROR_REASON, extras.getString(IntentConstants.TRANSACTION_ERROR_REASON));
        emitDeviceEvent(TRANSACTION_ERROR, wMap);
      } else if (resultCode == IntentConstants.TRANSACTION_REJECTED) {
        // User attempted to pay but their transaction was rejected

        // Use the static keys declared in PayResponseKeys to extract the fields you want
//        ToastMaker.displayShortToast(getCurrentActivity(), extras.getString(PayResponseKeys.DATA_MESSAGE));
        wMap.putString(PayResponseKeys.DATA_MESSAGE, extras.getString(PayResponseKeys.DATA_MESSAGE));
        emitDeviceEvent(TRANSACTION_REJECTED, wMap);
      } else if (resultCode == IntentConstants.TRANSACTION_REJECTED_PARSING_ISSUE) {
        // User attempted to pay but their transaction was rejected. An error occured while reading the returned JSON
//        ToastMaker.displayShortToast(getCurrentActivity(), extras.getString(IntentConstants.RAW_PAY_RESPONSE));
        wMap.putString(IntentConstants.RAW_PAY_RESPONSE, extras.getString(IntentConstants.RAW_PAY_RESPONSE));
        emitDeviceEvent(TRANSACTION_REJECTED_PARSING_ISSUE, wMap);
      } else if (resultCode == IntentConstants.TRANSACTION_SUCCESSFUL) {
        // User finished their payment successfully

        // Use the static keys declared in PayResponseKeys to extract the fields you want
//        ToastMaker.displayShortToast(getCurrentActivity(), extras.getString(PayResponseKeys.DATA_MESSAGE));
        wMap.putString(PayResponseKeys.DATA_MESSAGE, extras.getString(PayResponseKeys.DATA_MESSAGE));
        emitDeviceEvent(TRANSACTION_SUCCESSFUL, wMap);
      } else if (resultCode == IntentConstants.TRANSACTION_SUCCESSFUL_PARSING_ISSUE) {
        // User finished their payment successfully. An error occured while reading the returned JSON.
//        ToastMaker.displayShortToast(getCurrentActivity(), "TRANSACTION_SUCCESSFUL - Parsing Issue");

//        // ToastMaker.displayShortToast(getCurrentActivity(), extras.getString(IntentConstants.RAW_PAY_RESPONSE));
//        ToastMaker.displayShortToast(getCurrentActivity(), extras.getString(IntentConstants.RAW_PAY_RESPONSE));
        wMap.putString(IntentConstants.RAW_PAY_RESPONSE, extras.getString(IntentConstants.RAW_PAY_RESPONSE));
        emitDeviceEvent(TRANSACTION_REJECTED_PARSING_ISSUE, wMap);
      } else if (resultCode == IntentConstants.TRANSACTION_SUCCESSFUL_CARD_SAVED) {
        // User finished their payment successfully and card was saved.

        // Use the static keys declared in PayResponseKeys to extract the fields you want
        // Use the static keys declared in SaveCardResponseKeys to extract the fields you want
//        ToastMaker.displayShortToast(getCurrentActivity(), "Token == " + extras.getString(SaveCardResponseKeys.TOKEN));
        wMap.putString(RESPONSE_TOKEN, extras.getString(SaveCardResponseKeys.TOKEN));
        emitDeviceEvent(TRANSACTION_SUCCESSFUL_CARD_SAVED, wMap);
      } else if (resultCode == IntentConstants.USER_CANCELED_3D_SECURE_VERIFICATION) {
//        ToastMaker.displayShortToast(getCurrentActivity(), "User canceled 3-d scure verification!!");

        // Note that a payment process was attempted. You can extract the original returned values
        // Use the static keys declared in PayResponseKeys to extract the fields you want
//        ToastMaker.displayShortToast(getCurrentActivity(), extras.getString(PayResponseKeys.PENDING));
        wMap.putString(PayResponseKeys.PENDING, extras.getString(PayResponseKeys.PENDING));
        emitDeviceEvent(USER_CANCELED_3D_SECURE_VERIFICATION, wMap);
      } else if (resultCode == IntentConstants.USER_CANCELED_3D_SECURE_VERIFICATION_PARSING_ISSUE) {
//        ToastMaker.displayShortToast(getCurrentActivity(), "User canceled 3-d scure verification - Parsing Issue!!");

        // Note that a payment process was attempted.
        // User finished their payment successfully. An error occured while reading the returned JSON.
//        ToastMaker.displayShortToast(getCurrentActivity(), extras.getString(IntentConstants.RAW_PAY_RESPONSE));
        wMap.putString(IntentConstants.RAW_PAY_RESPONSE, extras.getString(IntentConstants.RAW_PAY_RESPONSE));
        emitDeviceEvent(USER_CANCELED_3D_SECURE_VERIFICATION_PARSING_ISSUE, wMap);
      }
    }
  }

  @Override
  public void onNewIntent(Intent intent) {

  }
}
