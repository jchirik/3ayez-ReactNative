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
  UIFont *titleFont = [UIFont fontWithName:@"Helvetica-Bold" size: 18];
  NSDictionary *navbarAttributes = [NSDictionary dictionaryWithObjectsAndKeys:
                                    WhiteColor ,NSForegroundColorAttributeName, titleFont, NSFontAttributeName,nil];

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

  [[UINavigationBar appearance] setTitleTextAttributes:navbarAttributes];
  [[UINavigationBar appearance] setBarTintColor:BlueGreenColor];
  [[UINavigationBar appearance] setTintColor: WhiteColor];

  [[ZDCChatUI appearance] setEndChatButtonImage: ExitIcon];
  [[ZDCChatUI appearance] setBackChatButtonImage: BackIcon];

  [[ZDCChatView appearance] setChatBackgroundColor:OffWhiteColor];
  [[ZDCTextEntryView appearance] setSendButtonImage:SendIcon];

}

  @end
