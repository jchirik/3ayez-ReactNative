//
//  PayFortPayment.swift
//  ayezcustomer
//
//  Created by Ahmed Abdelmagied on 4/17/19.
//  Copyright © 2019 Facebook. All rights reserved.
//

import Foundation

@objc(PayFortPayment)
class PayFortPayment : NSObject {

  static let environment : KPayFortEnviroment? = {
    guard let environment = ReactNativeConfig.env(for: "ENVIRONMENT") else {
      return nil
    }

    switch environment {
    case ReactNativeConfig.env(for: "PRODUCTION_ENVIRONMENT"):
      return KPayFortEnviromentProduction
    case ReactNativeConfig.env(for: "DEV_ENVIRONMENT"):
      return KPayFortEnviromentSandBox
    default:
      return nil
    }
  }()

  // Export constants to use in your native module
  @objc
  func constantsToExport() -> [AnyHashable : Any]! {
    return [
      "COMMAND_KEY": PayFortKeywords.command,
      "MERCHANT_REFERENCE_KEY": PayFortKeywords.merchantReference,
      "AMOUNT_KEY": PayFortKeywords.amount,
      "CURRENCY_KEY": PayFortKeywords.currency,
      "LANGUAGE_KEY": PayFortKeywords.language,
      "CUSTOMER_EMAIL_KEY": PayFortKeywords.customerEmail,
      "SDK_TOKEN_KEY": PayFortKeywords.sdkToken,
      "AUTHORIZATION_COMMAND": PayFortKeywords.authorizationCommand,
      "PURCHASE_COMMAND": PayFortKeywords.purchaseCommand,
    ]
  }

  @objc
  static func requiresMainQueueSetup() -> Bool {
    return true
  }

  @objc
  func getDeviceID(_ handler: RCTResponseSenderBlock) {
    guard let environment = PayFortPayment.environment else {
      handler(nil)
      return
    }

    let deviceID: String? = PayFortController(enviroment: environment)?.getUDID()
    handler([deviceID as Any])
  }
  
  // Implement methods that you want to export to the native module
  @objc
  func pay(_ params: NSDictionary, onSuccess: @escaping RCTResponseSenderBlock, onFail: @escaping RCTResponseSenderBlock)  {
    guard let environment = PayFortPayment.environment else {
      onFail(["Configuration file is corrupted: Invalid payment environment"])
      return
    }

    let payfortController = PayFortController(enviroment: environment)
    payfortController?.setPayFortCustomViewNib("PayFortView")
    payfortController?.hideLoading = true

    let appDelegate = UIApplication.shared.delegate as! AppDelegate

    DispatchQueue.main.async {
      // TODO: Check Apple Pay
      payfortController?.callPayFort(withRequest: self.getRequestParameters(from: params), currentViewController: appDelegate.window.rootViewController, success: { (request, response) in
        onSuccess([response as Any])
      }, canceled: { (request, response) in
        return
      }, faild: { (request, response, message) in
        onFail([response as Any])
      })
    }
  }

  private func getRequestParameters(from params: NSDictionary) -> NSMutableDictionary! {
    let requestKeys = PayFortKeywords.requestKeys
    if !requestKeys.allSatisfy { params[$0] as? String != nil } {
      return nil
    }

    let requestParams = NSMutableDictionary(capacity: requestKeys.count)

    for key in PayFortKeywords.requestKeys {
      let value = params[key] as! String
      requestParams.setValue(value, forKey: key)
    }

    return requestParams
  }
}

