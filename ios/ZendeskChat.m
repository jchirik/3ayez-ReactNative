//  Created by react-native-create-bridge

#import "ZendeskChat.h"
#import "Zendesk.h"

// import RCTBridge
#if __has_include(<React/RCTBridge.h>)
#import <React/RCTBridge.h>
#elif __has_include(“RCTBridge.h”)
#import “RCTBridge.h”
#else
#import “React/RCTBridge.h” // Required when used as a Pod in a Swift project
#endif

// import RCTEventDispatcher
#if __has_include(<React/RCTEventDispatcher.h>)
#import <React/RCTEventDispatcher.h>
#elif __has_include(“RCTEventDispatcher.h”)
#import “RCTEventDispatcher.h”
#else
#import “React/RCTEventDispatcher.h” // Required when used as a Pod in a Swift project
#endif

@implementation ZendeskChat
@synthesize bridge = _bridge;

// Export a native module
// https://facebook.github.io/react-native/docs/native-modules-ios.html
RCT_EXPORT_MODULE();

- (NSDictionary *)constantsToExport
{
  return @{ @"REACT_CLASS" : @"ZendeskChat",
            @"ZENDESK_URL" :@"zendeskUrl",
            @"APPLICATION_ID" : @"applicationId",
            @"OAUTH_CLIENT_ID" : @"oauthClientId",
            @"ZOPIM_ACCOUNT_KEY" : @"zopimAccountKey"};
}

RCT_EXPORT_METHOD(start: (NSDictionary*) params) {
  NSLog(@"RN binding - Native View - Loading MyViewController.swift");
  dispatch_async(dispatch_get_main_queue(), ^{
    Zendesk *zenDisk = [[Zendesk alloc] init];
    [zenDisk start: params];
  });

}


@end
