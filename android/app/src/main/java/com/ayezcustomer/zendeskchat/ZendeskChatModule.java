//  Created by react-native-create-bridge
package com.ayezcustomer.zendeskchat;

import android.content.Context;
import android.content.Intent;
import android.support.annotation.NonNull;
import android.support.annotation.Nullable;
import android.widget.Toast;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.Task;
import com.google.firebase.iid.FirebaseInstanceId;
import com.google.firebase.iid.InstanceIdResult;
import com.zopim.android.sdk.api.ZopimChat;
import com.zopim.android.sdk.api.ZopimChatApi;
import com.zopim.android.sdk.model.VisitorInfo;
import com.zopim.android.sdk.prechat.ZopimChatActivity;

import java.util.HashMap;
import java.util.Map;

public class ZendeskChatModule extends ReactContextBaseJavaModule {
    public static final String REACT_CLASS = "ZendeskChat";
    public static final String ZENDESK_URL = "ZENDESK_URL";
    public static final String APPLICATION_ID = "APPLICATION_ID";
    public static final String OAUTH_CLIENT_ID = "OAUTH_CLIENT_ID";
    public static final String ZOPIM_ACCOUNT_KEY = "ZOPIM_ACCOUNT_KEY";

    public static final String VISITOR_NAME = "VISITOR_NAME";
    public static final String VISITOR_PHONE_NUMBER = "VISITOR_PHONE_NUMBER";
    public static final String VISITOR_EMAIL = "VISITOR_EMAIL";
    public static final String VISITOR_NOTE = "VISITOR_NOTE";

    private static ReactApplicationContext reactContext = null;

    public ZendeskChatModule(ReactApplicationContext context) {
        // Pass in the context to the constructor and save it so you can emit events
        // https://facebook.github.io/react-native/docs/native-modules-android.html#the-toast-module
        super(context);

        reactContext = context;
    }

    @Override
    public String getName() {
        // Tell React the name of the module
        // https://facebook.github.io/react-native/docs/native-modules-android.html#the-toast-module
        return REACT_CLASS;
    }

    @Override
    public Map<String, Object> getConstants() {
        // Export any constants to be used in your native module
        // https://facebook.github.io/react-native/docs/native-modules-android.html#the-toast-module
        final Map<String, Object> constants = new HashMap<>();
        constants.put(ZENDESK_URL, ZENDESK_URL);
        constants.put(APPLICATION_ID, APPLICATION_ID);
        constants.put(OAUTH_CLIENT_ID, OAUTH_CLIENT_ID);
        constants.put(ZOPIM_ACCOUNT_KEY, ZOPIM_ACCOUNT_KEY);

        constants.put(VISITOR_NAME, VISITOR_NAME);
        constants.put(VISITOR_PHONE_NUMBER, VISITOR_PHONE_NUMBER);
        constants.put(VISITOR_EMAIL, VISITOR_EMAIL);
        constants.put(VISITOR_NOTE, VISITOR_NOTE);
        return constants;
    }

    private HashMap<String, String> convertToStringHashMap(ReadableMap rmap) {
        HashMap<String,Object> map = rmap.toHashMap(); //Object is containing String
        HashMap<String,String> newMap =new HashMap<String,String>();
        for (Map.Entry<String, Object> entry : map.entrySet()) {
            if(entry.getValue() instanceof String){
                newMap.put(entry.getKey(), (String) entry.getValue());
            }
        }
        return newMap;
    }

    @ReactMethod
    public void start(ReadableMap rmap) {
        HashMap<String, String> map = convertToStringHashMap(rmap);
        // An example native method that you will expose to React
        // https://facebook.github.io/react-native/docs/native-modules-android.html#the-toast-module

        Context context = getCurrentActivity();

        if (context == null) return;

      ZopimChatApi.init(map.get(ZOPIM_ACCOUNT_KEY));

        VisitorInfo visitorInfo = new VisitorInfo.Builder().name(map.get(VISITOR_NAME))
                .phoneNumber(map.get(VISITOR_PHONE_NUMBER))
                .email(map.get(VISITOR_EMAIL))
                .note(map.get(VISITOR_NOTE))
                .build();

      ZopimChatApi.setVisitorInfo(visitorInfo);

      FirebaseInstanceId.getInstance().getInstanceId()
        .addOnCompleteListener(new OnCompleteListener<InstanceIdResult>() {
          @Override
          public void onComplete(@NonNull Task<InstanceIdResult> task) {
            if (!task.isSuccessful()) {
                return;
            }

            if(task.getResult() != null) {
              ZopimChat.setPushToken(task.getResult().getToken());
            }
          }
        });

      getCurrentActivity().startActivity(new Intent(getCurrentActivity(), ZopimChatActivity.class));

    }

    private static void emitDeviceEvent(String eventName, @Nullable WritableMap eventData) {
        // A method for emitting from the native side to JS
        // https://facebook.github.io/react-native/docs/native-modules-android.html#sending-events-to-javascript
        reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(eventName, eventData);
    }
}
