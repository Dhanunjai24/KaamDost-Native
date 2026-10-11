package com.kaamdost.partner

import android.content.Context
import android.media.AudioManager
import android.media.ToneGenerator
import android.os.Build
import android.os.Handler
import android.os.Looper
import android.os.VibrationEffect
import android.os.Vibrator
import android.os.VibratorManager
import com.facebook.react.bridge.*

class AlertSoundModule(private val reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    private var toneGenerator: ToneGenerator? = null
    private var isBeeping = false
    private val mainHandler = Handler(Looper.getMainLooper())
    private var beepRunnable: Runnable? = null

    override fun getName(): String = "AlertSoundModule"

    @ReactMethod
    fun playJobAlert(promise: Promise? = null) {
        try {
            stopJobAlert()
            isBeeping = true

            // Initialize built-in app ToneGenerator on STREAM_ALARM at 100% volume
            toneGenerator = try {
                ToneGenerator(AudioManager.STREAM_ALARM, 100)
            } catch (e: Exception) {
                try {
                    ToneGenerator(AudioManager.STREAM_NOTIFICATION, 100)
                } catch (e2: Exception) {
                    ToneGenerator(AudioManager.STREAM_MUSIC, 100)
                }
            }

            // Start repeating "beep-beep ... beep-beep" alarm sequence
            startBeepSequence()

            // Trigger synchronized urgent vibration
            triggerVibration()

            promise?.resolve(true)
        } catch (e: Exception) {
            promise?.reject("E_ALERT_SOUND", e.message)
        }
    }

    private fun startBeepSequence() {
        beepRunnable = object : Runnable {
            override fun run() {
                if (!isBeeping) return

                try {
                    // First Beep (high crisp alert tone ~160ms)
                    toneGenerator?.startTone(ToneGenerator.TONE_PROP_BEEP2, 160)

                    // Second Beep after 220ms (double-beep alarm)
                    mainHandler.postDelayed({
                        if (!isBeeping) return@postDelayed
                        toneGenerator?.startTone(ToneGenerator.TONE_PROP_BEEP2, 180)
                    }, 220)

                    // Repeat sequence every 850ms ("beep-beep ... beep-beep ...")
                    mainHandler.postDelayed(this, 850)
                } catch (e: Exception) {
                    // Ignore transient audio focus errors
                }
            }
        }
        beepRunnable?.let { mainHandler.post(it) }
    }

    @ReactMethod
    fun stopJobAlert(promise: Promise? = null) {
        try {
            isBeeping = false
            beepRunnable?.let { mainHandler.removeCallbacks(it) }
            beepRunnable = null

            try {
                toneGenerator?.stopTone()
                toneGenerator?.release()
            } catch (_: Exception) {}
            toneGenerator = null

            stopVibration()
            promise?.resolve(true)
        } catch (e: Exception) {
            promise?.reject("E_STOP_SOUND", e.message)
        }
    }

    private fun triggerVibration() {
        try {
            // Pulse vibration synchronized with the double beep:
            // 0ms delay, 180ms vibrate, 80ms pause, 180ms vibrate, 410ms pause (repeats until stopped)
            val pattern = longArrayOf(0, 180, 80, 180, 410)
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
                val vibratorManager = reactContext.getSystemService(Context.VIBRATOR_MANAGER_SERVICE) as? VibratorManager
                vibratorManager?.defaultVibrator?.vibrate(VibrationEffect.createWaveform(pattern, 0))
            } else {
                @Suppress("DEPRECATION")
                val vibrator = reactContext.getSystemService(Context.VIBRATOR_SERVICE) as? Vibrator
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                    vibrator?.vibrate(VibrationEffect.createWaveform(pattern, 0))
                } else {
                    @Suppress("DEPRECATION")
                    vibrator?.vibrate(pattern, 0)
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

    override fun onCatalystInstanceDestroy() {
        super.onCatalystInstanceDestroy()
        stopJobAlert()
    }
}
