//
//  ChatStyle.m
//  zendesk
//
//  Created by MahmoudShaabanAllam on 3/13/19.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <ZDCChat/ZDCChat.h>
#import "ChatStyle.h"



@implementation ChatStyle : NSObject


+ (void) applyStyle {


  UIFont *ayezFont = [UIFont fontWithName:@"Helvetica-Bold" size: 15];
  UIFont *buttonFont = [UIFont fontWithName:@"Helvetica" size: 18];
  UIFont *titleFont = [UIFont fontWithName:@"Helvetica-Bold" size: 18];
  
  NSDictionary *navbarTitleAttributes = [NSDictionary dictionaryWithObjectsAndKeys:
                                    WhiteColor ,NSForegroundColorAttributeName, titleFont, NSFontAttributeName,nil];
  NSDictionary *navbarButtonAttributes = [NSDictionary dictionaryWithObjectsAndKeys:
                                         WhiteColor ,NSForegroundColorAttributeName, buttonFont, NSFontAttributeName,nil];
  [[ZDCChat instance].overlay setEnabled:NO];

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

  [[UINavigationBar appearance] setTitleTextAttributes:navbarTitleAttributes];
  [[UINavigationBar appearance] setBarTintColor:BlueGreenColor];
  [[UINavigationBar appearance] setTintColor: WhiteColor];
  [[UIBarButtonItem appearance] setTitleTextAttributes: navbarButtonAttributes forState:0];
  
  UIUserInterfaceLayoutDirection direction = [UIApplication sharedApplication].userInterfaceLayoutDirection;

  if (direction == UIUserInterfaceLayoutDirectionRightToLeft) {
    [[ZDCChatUI appearance] setBackChatButtonImage: BackRightIcon];
  } else {
    [[ZDCChatUI appearance] setBackChatButtonImage: BackLeftIcon];
  }

  [[ZDCChatView appearance] setChatBackgroundColor:OffWhiteColor];
  [[ZDCTextEntryView appearance] setSendButtonImage:SendIcon];

}

  @end
