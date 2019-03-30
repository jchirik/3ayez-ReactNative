//
//  ChatStyle.m
//  zendesk
//
//  Created by MahmoudShaabanAllam on 3/13/19.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <ZDCChat/ZDCChat.h>
#import "ChatManger.h"
#import "AppDelegate.h"


@implementation ChatManger : NSObject

+(void) initZendeskChat: (NSString *) accountKey {
  [ZDCChat initializeWithAccountKey: accountKey];
}

+ (void) applyStyle {


  UIFont *ayezFont = [UIFont fontWithName:@"Helvetica-Bold" size: 15];
  UIFont *titleFont = [UIFont fontWithName:@"Helvetica-Bold" size: 18];
  NSDictionary *navbarAttributes = [NSDictionary dictionaryWithObjectsAndKeys:
                                    WhiteColor ,NSForegroundColorAttributeName, titleFont, NSFontAttributeName,nil];

  [[ZDCChat instance].overlay setEnabled:YES];
  [[ZDCChatOverlay appearance] setOverlayBackgroundImage:  [UIImage imageNamed:@"customerService"]];
  [[ZDCChatOverlay appearance] setInsets: [NSValue valueWithUIEdgeInsets: UIEdgeInsetsMake(0, 10, 60, 0)] ];
  [[ZDCChatOverlay appearance] setMessageCountColor: WhiteColor];
  [[ZDCChatOverlay appearance] setTypingIndicatorDiameter: @(3)];
  [[ZDCChatOverlay appearance] setTypingIndicatorColor: WhiteColor];
  [[ZDCChatOverlay appearance] setMessageCountFont:[UIFont fontWithName:@"Helvetica-Bold" size: 15]];



  [[ZDCLoadingView appearance] setLoadingLabelTextColor:BlueGreenColor ];


  [[ZDCVisitorChatCell appearance] setBubbleColor: BlueGreenColor];
  [[ZDCVisitorChatCell appearance] setBubbleBorderColor: BlueGreenColor];
  [[ZDCVisitorChatCell appearance] setTextColor: WhiteColor];
  [[ZDCVisitorChatCell appearance] setBubbleCornerRadius: BubbleCornerRadius];
  [[ZDCVisitorChatCell appearance] setTextFont:ayezFont];

  [[ZDCVisitorAttachmentCell appearance] setBubbleCornerRadius:BubbleCornerRadius];

  [[ZDCAgentChatCell appearance] setBubbleColor: WhiteColor];
  [[ZDCAgentChatCell appearance] setBubbleBorderColor: WhiteColor];
  [[ZDCAgentChatCell appearance] setBubbleCornerRadius: BubbleCornerRadius];
  [[ZDCAgentChatCell appearance] setTextFont: ayezFont];

  [[ZDCAgentAttachmentCell appearance] setBubbleCornerRadius:BubbleCornerRadius];

  [[UINavigationBar appearance] setTitleTextAttributes:navbarAttributes];
  [[UINavigationBar appearance] setBarTintColor:BlueGreenColor];
  [[UINavigationBar appearance] setTintColor: WhiteColor];

  [[ZDCChatUI appearance] setEndChatButtonImage: ExitIcon];

  UIUserInterfaceLayoutDirection direction = [UIApplication sharedApplication].userInterfaceLayoutDirection;

  if (direction == UIUserInterfaceLayoutDirectionRightToLeft) {
    [[ZDCChatUI appearance] setBackChatButtonImage: BackRightIcon];
  } else {
    [[ZDCChatUI appearance] setBackChatButtonImage: BackLeftIcon];
  }

  [[ZDCChatView appearance] setChatBackgroundColor:OffWhiteColor];
  [[ZDCTextEntryView appearance] setSendButtonImage:SendIcon];
  [[ZDCChatAPI instance] addObserver:self forChatLogEvents:@selector(chatEvent:)];
}

+(void) chatEvent: (NSNotification *)  event {
  NSArray *events = [[ZDCChatAPI instance] livechatLog];
  ZDCChatEvent *chatEvent = [events lastObject];
  if (chatEvent.type ==  ZDCChatEventTypeAgentMessage) {
    UIViewController *controller  = [ChatManger topViewController];
    if (![controller isKindOfClass:[ZDUViewController class]]) {
      [[NSNotificationCenter defaultCenter]
       postNotificationName:ReceiveMessageNotification
       object:self];
    }
  }
}

+(void) start: (NSDictionary*) params {

  [ZDCChat updateVisitor:^(ZDCVisitorInfo *user) {
    user.phone = [params objectForKey:(VisitorPhoneNumber)];
    user.name = [params objectForKey:(VisitorName)];
    user.email = [params objectForKey:(VisitorEmail)];
    [user addNote:[params objectForKey:(VisitorNote)]];
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
    constatnsDict = @{
                       ZendeskUrl : ZendeskUrl,
                       ApplicationId  : ApplicationId,
                       OauthClientId : OauthClientId,
                       ZopimAccountKey : ZopimAccountKey,
                       VisitorName  : VisitorName,
                       VisitorPhoneNumber: VisitorPhoneNumber,
                       VisitorEmail : VisitorEmail,
                       VisitorNote : VisitorNote,
                       ReceiveMessageEvent: ReceiveMessageEvent
                       };
  }
  return constatnsDict;
}

+ (UIViewController *)topViewController{
  return [self topViewController: [UIApplication sharedApplication].keyWindow.rootViewController];
}


+(UIViewController *)topViewController:(UIViewController *)rootViewController
{
  if ([rootViewController isKindOfClass:[UINavigationController class]]) {
    UINavigationController *navigationController = (UINavigationController *)rootViewController;
    return [self topViewController:navigationController.visibleViewController];
  }
  if ([rootViewController isKindOfClass:[UITabBarController class]]) {
    UITabBarController *tabController = (UITabBarController *)rootViewController;
    return [self topViewController:tabController.selectedViewController];
  }
  if (rootViewController.presentedViewController) {
    return [self topViewController:rootViewController];
  }
  return rootViewController ;
}

  @end
