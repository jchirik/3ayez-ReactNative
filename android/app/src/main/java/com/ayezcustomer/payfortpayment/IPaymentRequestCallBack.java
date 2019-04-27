package com.ayezcustomer.payfortpayment;

import com.facebook.react.bridge.WritableMap;

/**
 * Created by Ahmed Ghazy on 4/15/19.
 * https://github.com/afghazy
 * ahmedfathyghazy@gmail.com
 */

public interface IPaymentRequestCallBack {
  void onPaymentRequestResponse(int responseType, WritableMap responseMap);
}
