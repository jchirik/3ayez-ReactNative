package com.ayezcustomer.payfortpayment;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

import java.io.Serializable;

/**
 * Created by Ahmed Ghazy on 4/15/19.
 * https://github.com/afghazy
 * ahmedfathyghazy@gmail.com
 */

public class PayFortRequest {

  @SerializedName("sdk_token")
  @Expose
  public String sdkToken;
  @SerializedName("language")
  @Expose
  public String language;
  @SerializedName("eci")
  @Expose
  public String eci;
  @SerializedName("customer_email")
  @Expose
  public String customerEmail;
  @SerializedName("customer_ip")
  @Expose
  public String customerIp;
  @SerializedName("customer_name")
  @Expose
  public String customerName;
  @SerializedName("phone_number")
  @Expose
  public String phoneNumber;
  @SerializedName("currency")
  @Expose
  public String currency;
  @SerializedName("amount")
  @Expose
  public String amount;
  @SerializedName("merchant_reference")
  @Expose
  public String merchantReference;
  @SerializedName("command")
  @Expose
  public String command;
  @SerializedName("payment_option")
  @Expose
  public String paymentOption;
  @SerializedName("order_description")
  @Expose
  public String orderDescription;
  @SerializedName("settlement_reference")
  @Expose
  public String settlementReference;
  @SerializedName("merchant_extra")
  @Expose
  public String merchantExtra;
}
