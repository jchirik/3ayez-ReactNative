//
//  Zendesk.m
//  zendesk_chat
//
//  Created by MahmoudShaabanAllam on 3/13/19.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "Zendesk.h"
#import "AppDelegate.h"
#import <ZDCChat/ZDCChat.h>

@implementation Zendesk

  -(void) start: (NSDictionary*) params {
    
    NSString *accountKey =  [params objectForKey:(Zendesk.constants[@"ZOPIM_ACCOUNT_KEY"])];
    [ZDCChat initializeWithAccountKey:accountKey];
    [ZDCChat updateVisitor:^(ZDCVisitorInfo *user) {
      user.phone = [params objectForKey:(Zendesk.constants[@"VISITOR_PHONE_NUMBER"])];
      user.name = [params objectForKey:(Zendesk.constants[@"VISITOR_NAME"])];
      user.email = [params objectForKey:(Zendesk.constants[@"VISITOR_EMAIL"])];
      [user addNote:[params objectForKey:(Zendesk.constants[@"VISITOR_NOTE"])]];
    }];

  AppDelegate *appDelegate = (AppDelegate *)[UIApplication sharedApplication].delegate;
  [ZDCChat startChatIn:appDelegate.rootViewController.navigationController withConfig:^(ZDCConfig *config) {
    config.preChatDataRequirements.name = ZDCPreChatDataNotRequired;
    config.preChatDataRequirements.email = ZDCPreChatDataNotRequired;
    config.preChatDataRequirements.phone = ZDCPreChatDataNotRequired;
    config.preChatDataRequirements.department = ZDCPreChatDataNotRequired;
    config.preChatDataRequirements.message = ZDCPreChatDataNotRequired;
    config.emailTranscriptAction = ZDCEmailTranscriptActionNeverSend;
  }];
}
+ (NSDictionary *)constants {
  static NSDictionary *constatnsDict = nil;
  if (constatnsDict == nil) {
    constatnsDict = @{ @"REACT_CLASS" : @"ZendeskChat",
                       @"ZENDESK_URL" :@"ZENDESK_URL",
                       @"APPLICATION_ID" : @"APPLICATION_ID",
                       @"OAUTH_CLIENT_ID" : @"OAUTH_CLIENT_ID",
                       @"ZOPIM_ACCOUNT_KEY" : @"ZOPIM_ACCOUNT_KEY",
                       @"VISITOR_NAME": @"VISITOR_NAME",
                       @"VISITOR_PHONE_NUMBER": @"VISITOR_PHONE_NUMBER",
                       @"VISITOR_EMAIL": @"VISITOR_EMAIL",
                       @"VISITOR_NOTE": @"VISITOR_NOTE"
                       };
  }
  return constatnsDict;
}
  @end


