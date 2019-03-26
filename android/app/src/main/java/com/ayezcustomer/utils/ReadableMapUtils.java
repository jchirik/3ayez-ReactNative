package com.ayezcustomer.utils;

import android.content.Intent;

import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReadableType;

import java.util.HashMap;
import java.util.Map;

/**
 * Created by Ahmed Ghazy on 3/26/19.
 * https://github.com/afghazy
 * ahmedfathyghazy@gmail.com
 */

public class ReadableMapUtils {
  public static HashMap<String, String> convertToStringHashMap(ReadableMap rmap) {
    HashMap<String,Object> map = rmap.toHashMap(); //Object is containing String
    HashMap<String,String> newMap =new HashMap<String,String>();
    for (Map.Entry<String, Object> entry : map.entrySet()) {
      if(entry.getValue() instanceof String){
        newMap.put(entry.getKey(), (String) entry.getValue());
      }
    }
    return newMap;
  }

  public static Boolean hasValue(ReadableMap rmap, String key) {
    return rmap.hasKey(key) && !rmap.isNull(key);
  }

  public static void putIntentExtraFromRMap(ReadableMap rmap, String key, Intent intent) {
    if(hasValue(rmap, key)) {

      switch (rmap.getType(key)) {
        case Boolean:
          intent.putExtra(key, rmap.getBoolean(key));
          break;
        case String:
          intent.putExtra(key, rmap.getString(key));
          break;
        case Number:
          intent.putExtra(key, rmap.getString(key));
          break;
        default:
          break;
      }
    }
  }
}
