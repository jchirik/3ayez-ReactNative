//
//  Payfortwords.swift
//  ayezcustomer
//
//  Created by Ahmed Abdelmagied on 4/17/19.
//  Copyright © 2019 Facebook. All rights reserved.
//

enum PayFortKeywords {
  static let command = "command"
  static let merchantReference = "merchant_reference"
  static let amount = "amount"
  static let currency = "currency"
  static let language = "language"
  static let customerEmail = "customer_email"
  static let sdkToken = "sdk_token"
  static let authorizationCommand = "AUTHORIZATION"
  static let purchaseCommand = "PURCHASE"

  
  static let requestKeys = [ command, merchantReference, amount, currency, language, customerEmail, sdkToken]
}
