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
#import <Firebase.h>
#import <GoogleMaps/GoogleMaps.h>
#import "ChatManger.h"
#import "ZendeskChat.h"
#import <FBSDKCoreKit/FBSDKCoreKit.h>
#import "RNSplashScreen.h"
#import <ZDCChat/ZDCChat.h>

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  [[FBSDKApplicationDelegate sharedInstance] application:application
                           didFinishLaunchingWithOptions:launchOptions];
  NSString *zendeskAccountKey = [ReactNativeConfig envFor:@"ZENDESK_ACCOUNT_KEY"];

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
  return YES;
}



- (void)applicationDidBecomeActive:(UIApplication *)application {
  [FBSDKAppEvents activateApp];
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
