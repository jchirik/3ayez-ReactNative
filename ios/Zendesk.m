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
    
    NSString *accountKey =  [params objectForKey:(@"zopimAccountKey")];
    [ZDCChat initializeWithAccountKey:accountKey];
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

  @end


