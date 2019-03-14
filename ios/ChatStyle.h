//
//  ChatStyle.h
//  zendesk
//
//  Created by MahmoudShaabanAllam on 3/13/19.
//  Copyright © 2019 Facebook. All rights reserved.
//
#define BlueGreenColor [UIColor colorWithRed:0.17f green:0.82f blue:0.56f alpha:1.0f]
#define BubbleCornerRadius @(15.0f)
#define WhiteColor [UIColor whiteColor]
#define OffWhiteColor [UIColor colorWithRed:0.95f green:0.95f blue:0.95f alpha:1.0f]
#define ExitIcon @"exit.jpg"
#define BackRightIcon @"backRight.jpg"
#define BackLeftIcon @"backLeft.jpg"
#define SendIcon @"send.jpg"


@interface ChatStyle : NSObject
+(void) applyStyle;
  @end
