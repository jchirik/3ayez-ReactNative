package com.ayez.ayezcustomer;

import android.annotation.SuppressLint;
import android.app.Application;

import com.ayezcustomer.zendeskchat.ZendeskChatPackage;
import com.facebook.react.ReactApplication;
import org.devio.rn.splashscreen.SplashScreenReactPackage;
import com.facebook.reactnative.androidsdk.FBSDKPackage;
import com.microsoft.codepush.react.CodePush;
import com.imagepicker.ImagePickerPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import io.invertase.firebase.RNFirebasePackage;
// optional packages - add/remove as appropriate
import io.invertase.firebase.admob.RNFirebaseAdMobPackage;
import io.invertase.firebase.analytics.RNFirebaseAnalyticsPackage;
import io.invertase.firebase.auth.RNFirebaseAuthPackage;
import io.invertase.firebase.config.RNFirebaseRemoteConfigPackage;
import io.invertase.firebase.database.RNFirebaseDatabasePackage;
import io.invertase.firebase.fabric.crashlytics.RNFirebaseCrashlyticsPackage;
import io.invertase.firebase.firestore.RNFirebaseFirestorePackage;
import io.invertase.firebase.functions.RNFirebaseFunctionsPackage;
import io.invertase.firebase.instanceid.RNFirebaseInstanceIdPackage;
import io.invertase.firebase.invites.RNFirebaseInvitesPackage;
import io.invertase.firebase.links.RNFirebaseLinksPackage;
import io.invertase.firebase.messaging.RNFirebaseMessagingPackage;
import io.invertase.firebase.notifications.RNFirebaseNotificationsPackage;
import io.invertase.firebase.perf.RNFirebasePerformancePackage;
import io.invertase.firebase.storage.RNFirebaseStoragePackage;
import com.gettipsi.stripe.StripeReactPackage;

import com.zmxv.RNSound.RNSoundPackage;
import com.airbnb.android.react.maps.MapsPackage;

import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.reactcommunity.rnlanguages.RNLanguagesPackage;
import com.dylanvann.fastimage.FastImageViewPackage;

import java.util.Arrays;
import java.util.List;

import com.facebook.FacebookSdk;
import com.facebook.CallbackManager;
import com.facebook.appevents.AppEventsLogger;
import android.content.Context;
import android.support.multidex.MultiDex;
import android.support.multidex.MultiDexApplication;
import android.support.v7.app.AppCompatDelegate;

public class MainApplication extends MultiDexApplication implements ReactApplication {

  @Override
  protected void attachBaseContext(Context context) {
    super.attachBaseContext(context);
    MultiDex.install(this);
  }



  // facebook SDK
  private static CallbackManager mCallbackManager = CallbackManager.Factory.create();

  protected static CallbackManager getCallbackManager() {
    return mCallbackManager;
  }

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {

        @Override
        protected String getJSBundleFile() {
        return CodePush.getJSBundleFile();
        }

    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @SuppressLint("MissingPermission")
    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.asList(
        new MainReactPackage(),
            new SplashScreenReactPackage(),
        new FBSDKPackage(mCallbackManager),
        new CodePush(getResources().getString(R.string.reactNativeCodePush_androidDeploymentKey), getApplicationContext(), BuildConfig.DEBUG),
        new ImagePickerPackage(),
        new StripeReactPackage(),
        new RNFirebasePackage(),
        // add/remove these packages as appropriate
        new RNFirebaseAdMobPackage(),
        new RNFirebaseAnalyticsPackage(),
        new RNFirebaseAuthPackage(),
        new RNFirebaseRemoteConfigPackage(),
        new RNFirebaseCrashlyticsPackage(),
        new RNFirebaseDatabasePackage(),
        new RNFirebaseFirestorePackage(),
        new RNFirebaseFunctionsPackage(),
        new RNFirebaseInstanceIdPackage(),
        new RNFirebaseInvitesPackage(),
        new RNFirebaseLinksPackage(),
        new RNFirebaseMessagingPackage(),
        new RNFirebaseNotificationsPackage(),
        new RNFirebasePerformancePackage(),
        new RNFirebaseStoragePackage(),

        new RNSoundPackage(),
        new MapsPackage(),
        new RNDeviceInfo(),
        new RNLanguagesPackage(),
        new FastImageViewPackage(),
        new ZendeskChatPackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
