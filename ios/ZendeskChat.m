//  Created by react-native-create-bridge

#import "ZendeskChat.h"

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

#import "ChatManger.h"

@implementation ZendeskChat
@synthesize bridge = _bridge;

-(id) init {
  self = [super init];
  [[NSNotificationCenter defaultCenter] addObserver:self
                                           selector:@selector(receiveTestNotification:)
                                               name:ReceiveMessageNotification
                                             object:nil];

  return self;
}

- (void) receiveTestNotification:(NSNotification *) notification
{
  if ([[notification name] isEqualToString:ReceiveMessageNotification])
    [self sendEventWithName: ReceiveMessageEvent body: nil];
}

// Export a native module
// https://facebook.github.io/react-native/docs/native-modules-ios.html
RCT_EXPORT_MODULE();

- (NSDictionary *)constantsToExport
{
  return ChatManger.constants;
}

RCT_EXPORT_METHOD(start: (NSDictionary*) params) {
  dispatch_async(dispatch_get_main_queue(), ^{
    [ChatManger start: params];
  });

}

- (NSArray<NSString *> *)supportedEvents
{
  return @[ReceiveMessageEvent];
}


@end
