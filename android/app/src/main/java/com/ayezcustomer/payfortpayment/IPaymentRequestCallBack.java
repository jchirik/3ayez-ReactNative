package com.ayezcustomer.payfortpayment;

/**
 * Created by Ahmed Ghazy on 4/15/19.
 * https://github.com/afghazy
 * ahmedfathyghazy@gmail.com
 */

public interface IPaymentRequestCallBack {
  void onPaymentRequestResponse(int responseType, PayFortData responseData);
}
