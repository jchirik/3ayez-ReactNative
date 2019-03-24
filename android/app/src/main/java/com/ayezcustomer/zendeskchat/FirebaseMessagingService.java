package com.ayezcustomer.zendeskchat;

import android.app.Activity;
import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Intent;
import android.os.Build;
import android.os.Handler;
import android.os.Looper;
import android.support.v4.app.NotificationCompat;
import android.support.v4.app.NotificationManagerCompat;
import android.support.v4.content.LocalBroadcastManager;
import android.util.Log;
import android.widget.Toast;

import com.ayez.ayezcustomer.MainActivity;
import com.ayez.ayezcustomer.R;
import com.facebook.react.HeadlessJsTaskService;
import com.google.firebase.messaging.RemoteMessage;
import com.zopim.android.sdk.api.ZopimChatApi;
import com.zopim.android.sdk.model.PushData;
import com.zopim.android.sdk.prechat.ZopimChatActivity;

import java.util.Random;

import io.invertase.firebase.Utils;
import io.invertase.firebase.messaging.RNFirebaseBackgroundMessagingService;
import io.invertase.firebase.messaging.RNFirebaseMessagingService;

/**
 * Created by Ahmed Ghazy on 3/21/19.
 * https://github.com/afghazy
 * ahmedfathyghazy@gmail.com
 */

public class FirebaseMessagingService extends RNFirebaseMessagingService {
  private final static String SUPPORT_CHANNEL_ID = "3AYEZ_SUPPORT";

  @Override
  public void onMessageReceived(RemoteMessage message) {
    Log.e("HELLO666", message.toString());

    final PushData pushData = PushData.getChatNotification(message.getData());

    switch (pushData.getType()) {
      case END:
        break;
      case MESSAGE:
        if (Utils.isAppInForeground(this.getApplicationContext())) {
          Handler handler = new Handler(Looper.getMainLooper());
          handler.post(new Runnable() {
            @Override
            public void run() {
              Toast.makeText(getApplicationContext(), R.string.chat_customer_support_3ayez_new_message, Toast.LENGTH_SHORT).show();
            }
          });
        } else {
          createNotificationChannel();
          Intent intent = new Intent(getApplicationContext(), ZopimChatActivity.class);
          intent.setFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP | Intent.FLAG_ACTIVITY_SINGLE_TOP);
          NotificationCompat.Builder builder = new NotificationCompat.Builder(this, SUPPORT_CHANNEL_ID)
            .setSmallIcon(R.mipmap.ic_launcher)
            .setContentTitle(getApplicationContext().getString(R.string.chat_customer_support_3ayez))
            .setContentText(pushData.getAuthor() + ": " + pushData.getMessage())
            .setPriority(NotificationCompat.PRIORITY_HIGH)
            .setContentIntent(PendingIntent.getActivity(getApplicationContext(), 0, intent, 0));
          NotificationManagerCompat notificationManager = NotificationManagerCompat.from(getApplicationContext());
          notificationManager.notify(new Random().nextInt(), builder.build());
        }
        break;
    }

    super.onMessageReceived(message);
  }

  private void createNotificationChannel() {
    // Create the NotificationChannel, but only on API 26+ because
    // the NotificationChannel class is new and not in the support library
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
      CharSequence name = getString(R.string.chat_customer_support_3ayez);
      String description = getString(R.string.chat_customer_support_3ayez_desc);
      int importance = NotificationManager.IMPORTANCE_HIGH;
      NotificationChannel channel = new NotificationChannel(SUPPORT_CHANNEL_ID, name, importance);
      channel.setDescription(description);
      // Register the channel with the system; you can't change the importance
      // or other notification behaviors after this
      NotificationManager notificationManager = getSystemService(NotificationManager.class);
      notificationManager.createNotificationChannel(channel);
    }
  }
}
