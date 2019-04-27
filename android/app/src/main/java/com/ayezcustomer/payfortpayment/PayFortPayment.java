package com.ayezcustomer.payfortpayment;

import android.app.Activity;
import android.os.Bundle;
import android.util.Log;

import com.ayez.ayezcustomer.BuildConfig;
import com.facebook.internal.BundleJSONConverter;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;
import com.google.gson.Gson;
import com.payfort.fort.android.sdk.base.FortSdk;
import com.payfort.fort.android.sdk.base.callbacks.FortCallBackManager;
import com.payfort.sdk.android.dependancies.base.FortInterfaces;
import com.payfort.sdk.android.dependancies.models.FortRequest;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;

/**
 * Created by Ahmed Ghazy on 4/15/19.
 * https://github.com/afghazy
 * ahmedfathyghazy@gmail.com
 */

public class PayFortPayment {
  public static final String AMOUNT_KEY = "amount";
  public static final String COMMAND_KEY = "command";
  public static final String CURRENCY_KEY = "currency";
  public static final String CUSTOMER_EMAIL_KEY = "customer_email";
  public static final String LANGUAGE_KEY = "language";
  public static final String MERCHANT_REFERENCE_KEY = "merchant_reference";
  public static final String SDK_TOKEN_KEY = "sdk_token";


  //Request key for response
  public static final int REQUEST_PAYMENT = 111;
  public static final int RESPONSE_PAYMENT_CANCEL = 222;
  public static final int RESPONSE_PAYMENT_SUCCESS = 333;
  public static final int RESPONSE_PAYMENT_FAILURE = 444;

  //Commands
  public final static String AUTHORIZATION = "AUTHORIZATION";
  public final static String PURCHASE = "PURCHASE";

  // Environment mode
  public final static String TEST = "TEST";
  public final static String PROD = "PROD";

  //Test token url

  private final Gson gson;
  private Activity context;
  private IPaymentRequestCallBack iPaymentRequestCallBack;
  private FortCallBackManager fortCallback = null;
  private PayFortRequest payFortRequest;

  public PayFortPayment(Activity context, FortCallBackManager fortCallback, IPaymentRequestCallBack iPaymentRequestCallBack) {
    this.context = context;
    this.fortCallback = fortCallback;
    this.iPaymentRequestCallBack = iPaymentRequestCallBack;
    gson = new Gson();
  }

  public void requestForPayment(PayFortRequest payFortRequest) {
    this.payFortRequest = payFortRequest;
    requestPayment();
  }

  private void requestPayment() {
    try {
      String environment = (BuildConfig.ENVIRONMENT.equals(BuildConfig.DEV_ENVIRONMENT) ? FortSdk.ENVIRONMENT.TEST : FortSdk.ENVIRONMENT.PRODUCTION);
      FortSdk.getInstance().registerCallback(context, getPurchaseFortRequest(), environment, REQUEST_PAYMENT,
        fortCallback, true, new FortInterfaces.OnTnxProcessed() {
          @Override
          public void onCancel(Map<String, Object> requestParamsMap, Map<String,
            Object> fortResponseMap) {
            JSONObject responseJSON = new JSONObject(fortResponseMap);
            WritableMap responseMap = convertJsonToWritableMap(responseJSON);
            Log.d("Cancel Response", responseJSON.toString());
            if (iPaymentRequestCallBack != null) {
              iPaymentRequestCallBack.onPaymentRequestResponse(RESPONSE_PAYMENT_CANCEL, responseMap);
            }
          }

          @Override
          public void onSuccess(Map<String, Object> requestParamsMap, Map<String,
            Object> fortResponseMap) {
            JSONObject responseJSON = new JSONObject(fortResponseMap);
            WritableMap responseMap = convertJsonToWritableMap(responseJSON);
            Log.d("Success Response", responseJSON.toString());
            if (iPaymentRequestCallBack != null) {
              iPaymentRequestCallBack.onPaymentRequestResponse(RESPONSE_PAYMENT_SUCCESS, responseMap);
            }
          }

          @Override
          public void onFailure(Map<String, Object> requestParamsMap, Map<String,
            Object> fortResponseMap) {
            JSONObject response = new JSONObject(fortResponseMap);
            JSONObject responseJSON = new JSONObject(fortResponseMap);
            WritableMap responseMap = convertJsonToWritableMap(responseJSON);
            Log.e("Failure Response", responseJSON.toString());
            if (iPaymentRequestCallBack != null) {
              iPaymentRequestCallBack.onPaymentRequestResponse(RESPONSE_PAYMENT_FAILURE, responseMap);
            }
          }
        });
    } catch (Exception e) {
      e.printStackTrace();
    }
  }

  private FortRequest getPurchaseFortRequest() {
    FortRequest fortRequest = new FortRequest();
    if (payFortRequest != null) {
      HashMap<String, Object> parameters = new HashMap<>();
      parameters.put(AMOUNT_KEY, payFortRequest.amount);
      parameters.put(COMMAND_KEY, payFortRequest.command);
      parameters.put(CURRENCY_KEY, payFortRequest.currency);
      parameters.put(CUSTOMER_EMAIL_KEY, payFortRequest.customerEmail);
      parameters.put(LANGUAGE_KEY, payFortRequest.language);
      parameters.put(MERCHANT_REFERENCE_KEY, payFortRequest.merchantReference);
      parameters.put(SDK_TOKEN_KEY, payFortRequest.sdkToken);

      fortRequest.setRequestMap(parameters);
    }
    return fortRequest;
  }

  private WritableMap convertJsonToWritableMap(JSONObject object){
    BundleJSONConverter converter = new BundleJSONConverter();
    Bundle bundle = null;
    try {
      bundle = converter.convertToBundle(object);
    } catch (JSONException e) {
      Log.e("Bundle JSON Conversion:", e.getMessage());
    }
    return Arguments.fromBundle(bundle);
  }

}
