package com.quotes

import android.app.NotificationChannel
import android.app.NotificationManager
import android.content.Context
import android.os.Build
import androidx.core.app.NotificationCompat
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class NotificationModule(private val reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "NotificationModule"
    }

    @ReactMethod
    fun postSuccessNotification() {
        val notificationManager = reactContext.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
        val channelId = "post_success_channel"
        val channelName = "Post Success Notifications"
        
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(channelId, channelName, NotificationManager.IMPORTANCE_DEFAULT)
            notificationManager.createNotificationChannel(channel)
        }

        val notification = NotificationCompat.Builder(reactContext, channelId)
            .setContentTitle("Citation postée")
            .setContentText("Votre citation a été postée avec succès")
            .setSmallIcon(R.mipmap.ic_launcher) // Use your app icon or any drawable as notification icon
            .build()

        notificationManager.notify(101, notification) // 101 is a notification ID
    }
}