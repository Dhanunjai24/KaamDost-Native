package com.kaamdost.partner

import android.content.Context
import android.media.AudioAttributes
import android.media.Ringtone
import android.media.RingtoneManager
import android.net.Uri
import android.os.Build
import android.os.VibrationEffect
import android.os.Vibrator
import android.os.VibratorManager
import com.facebook.react.bridge.*

class AlertSoundModule(private val reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    private var currentRingtone: Ringtone? = null

    override fun getName(): String = "AlertSoundModule"

    @ReactMethod
    fun playJobAlert(promise: Promise? = null) {
        try {
            stopJobAlert()

            val notificationUri: Uri = RingtoneManager.getDefaultUri(RingtoneManager.TYPE_NOTIFICATION)
                ?: RingtoneManager.getDefaultUri(RingtoneManager.TYPE_ALARM)
                ?: RingtoneManager.getDefaultUri(RingtoneManager.TYPE_RINGTONE)

            val ringtone = RingtoneManager.getRingtone(reactContext, notificationUri)
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
                ringtone.audioAttributes = AudioAttributes.Builder()
                    .setUsage(AudioAttributes.USAGE_NOTIFICATION_COMMUNICATION_REQUEST)
                    .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION)
                    .build()
            }
            ringtone.play()
            currentRingtone = ringtone

            triggerVibration()
            promise?.resolve(true)
        } catch (e: Exception) {
            promise?.reject("E_ALERT_SOUND", e.message)
        }
    }

    @ReactMethod
    fun stopJobAlert(promise: Promise? = null) {
        try {
            currentRingtone?.let {
                if (it.isPlaying) {
                    it.stop()
                }
            }
            currentRingtone = null
            stopVibration()
            promise?.resolve(true)
        } catch (e: Exception) {
            promise?.reject("E_STOP_SOUND", e.message)
        }
    }

    private fun triggerVibration() {
        try {
            val pattern = longArrayOf(0, 600, 250, 600, 250, 1000)
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
                val vibratorManager = reactContext.getSystemService(Context.VIBRATOR_MANAGER_SERVICE) as? VibratorManager
                vibratorManager?.defaultVibrator?.vibrate(VibrationEffect.createWaveform(pattern, -1))
            } else {
                @Suppress("DEPRECATION")
                val vibrator = reactContext.getSystemService(Context.VIBRATOR_SERVICE) as? Vibrator
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                    vibrator?.vibrate(VibrationEffect.createWaveform(pattern, -1))
                } else {
                    @Suppress("DEPRECATION")
                    vibrator?.vibrate(pattern, -1)
                }
            }
        } catch (_: Exception) {}
    }

    private fun stopVibration() {
        try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
                val vibratorManager = reactContext.getSystemService(Context.VIBRATOR_MANAGER_SERVICE) as? VibratorManager
                vibratorManager?.defaultVibrator?.cancel()
            } else {
                @Suppress("DEPRECATION")
                val vibrator = reactContext.getSystemService(Context.VIBRATOR_SERVICE) as? Vibrator
                vibrator?.cancel()
            }
        } catch (_: Exception) {}
    }
}
