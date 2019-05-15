/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "AppDelegate.h"
#import <CodePush/CodePush.h>
#import <ReactNativeConfig/ReactNativeConfig.h>
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
#if __has_include(<React/RNSentry.h>)
#import <React/RNSentry.h> // This is used for versions of react >= 0.40
#else
#import "RNSentry.h" // This is used for versions of react < 0.40
#endif
#import <Firebase.h>
#import <GoogleMaps/GoogleMaps.h>
#import "ChatManger.h"
#import "ZendeskChat.h"
#import <FBSDKCoreKit/FBSDKCoreKit.h>
#import "RNSplashScreen.h"
#import <ZDCChat/ZDCChat.h>
@import AppsFlyerLib;

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  [[FBSDKApplicationDelegate sharedInstance] application:application
                           didFinishLaunchingWithOptions:launchOptions];
  [self initZendesk];
  [GMSServices provideAPIKey:@"AIzaSyAGioxDWpQAHxVUvDkPiSltb6iGbTaEr-g"];
  [FIRApp configure];
  NSURL *jsCodeLocation;
  
                #ifdef DEBUG
                    jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
                #else
                    jsCodeLocation = [CodePush bundleURL];
                #endif
RCTRootView *rootView = [[RCTRootView alloc] initWithBundleURL:jsCodeLocation
                                                      moduleName:@"ayezcustomer"
                                               initialProperties:nil
                                                   launchOptions:launchOptions];

  [RNSentry installWithRootView:rootView];

  rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];

  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];

  UINavigationController* navController = [[UINavigationController alloc] initWithRootViewController: rootViewController];
  [navController setNavigationBarHidden:YES animated:YES];
  self.rootViewController = navController;
  rootViewController.view = rootView;
  self.window.rootViewController = self.rootViewController;
  [self.window makeKeyAndVisible];
  [ChatManger applyStyle];
  [self registerForRemoteNotifications];

  return YES;
}


- (void)registerForRemoteNotifications {
  if(SYSTEM_VERSION_GRATERTHAN_OR_EQUALTO(@"10.0")){
    UNUserNotificationCenter *center = [UNUserNotificationCenter currentNotificationCenter];
    center.delegate = self;
    [center requestAuthorizationWithOptions:(UNAuthorizationOptionSound | UNAuthorizationOptionAlert | UNAuthorizationOptionBadge) completionHandler:^(BOOL granted, NSError * _Nullable error){
      if(!error){
        dispatch_async(dispatch_get_main_queue(), ^{
          [[UIApplication sharedApplication] registerForRemoteNotifications];
        });
      }
    }];
  }
  else {
    UIUserNotificationType userNotificationTypes = (UIUserNotificationTypeAlert | UIUserNotificationTypeBadge | UIUserNotificationTypeSound);
    UIUserNotificationSettings *settings = [UIUserNotificationSettings settingsForTypes:userNotificationTypes
                                                                             categories:nil];
    [[UIApplication sharedApplication] registerUserNotificationSettings:settings];
    [[UIApplication sharedApplication] registerForRemoteNotifications];
  }
}

- (void) application:(UIApplication*)app didRegisterForRemoteNotificationsWithDeviceToken:(NSData*)tokenData {
  [ZDCChat setPushToken:tokenData];
  [[AppsFlyerTracker sharedTracker] registerUninstall:tokenData];
}

- (void)applicationDidBecomeActive:(UIApplication *)application {
  [FBSDKAppEvents activateApp];
}

-(void)userNotificationCenter:(UNUserNotificationCenter *)center didReceiveNotificationResponse:(UNNotificationResponse *)response withCompletionHandler:(void(^)(void))completionHandler{
  [self initZendesk];
  completionHandler();
}

- (void) application:(UIApplication*)application didReceiveRemoteNotification:(NSDictionary*)userInfo {
  [self initZendesk];
}

-(void) initZendesk {
  NSString *zendeskAccountKey = [ReactNativeConfig envFor:@"ZENDESK_ACCOUNT_KEY"];
  [ChatManger initZendeskChat:zendeskAccountKey];
}

- (void)userNotificationCenter:(UNUserNotificationCenter *)center
       willPresentNotification:(UNNotification *)notification
         withCompletionHandler:(void (^)(UNNotificationPresentationOptions options))completionHandler
{
  [self initZendesk];
  completionHandler(UNNotificationPresentationOptionAlert);
}


- (BOOL)application:(UIApplication *)application
            openURL:(NSURL *)url
            options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options {
  
  BOOL handled = [[FBSDKApplicationDelegate sharedInstance] application:application
    openURL:url
    sourceApplication:options[UIApplicationOpenURLOptionsSourceApplicationKey]
    annotation:options[UIApplicationOpenURLOptionsAnnotationKey]
  ];
  // Add any custom logic here.
  return handled;
}

@end
