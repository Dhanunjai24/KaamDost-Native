package com.kaamdost.customer

import android.content.Intent
import android.os.Bundle
import android.speech.RecognitionListener
import android.speech.RecognizerIntent
import android.speech.SpeechRecognizer
import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule
import java.util.Locale

class SpeechRecognitionModule(private val reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    private var speechRecognizer: SpeechRecognizer? = null
    private var isListening = false

    override fun getName(): String = "SpeechRecognitionModule"

    private fun sendEvent(eventName: String, params: WritableMap?) {
        try {
            if (reactContext.hasActiveReactInstance()) {
                reactContext
                    .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                    .emit(eventName, params)
            }
        } catch (e: Exception) {
            // Context might be inactive
        }
    }

    @ReactMethod
    fun isRecognitionAvailable(promise: Promise) {
        UiThreadUtil.runOnUiThread {
            try {
                val available = SpeechRecognizer.isRecognitionAvailable(reactContext)
                promise.resolve(available)
            } catch (e: Exception) {
                promise.resolve(false)
            }
        }
    }

    @ReactMethod
    fun startListening(languageCode: String?, promise: Promise) {
        UiThreadUtil.runOnUiThread {
            try {
                if (speechRecognizer != null) {
                    try {
                        speechRecognizer?.destroy()
                    } catch (e: Exception) {
                        // Ignore cleanup errors
                    }
                    speechRecognizer = null
                }

                if (!SpeechRecognizer.isRecognitionAvailable(reactContext)) {
                    promise.reject("UNAVAILABLE", "Speech recognition is not available on this device")
                    return@runOnUiThread
                }

                speechRecognizer = SpeechRecognizer.createSpeechRecognizer(reactContext)
                val lang = if (!languageCode.isNullOrEmpty()) languageCode else "te-IN"

                val intent = Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH).apply {
                    putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL, RecognizerIntent.LANGUAGE_MODEL_FREE_FORM)
                    putExtra(RecognizerIntent.EXTRA_PARTIAL_RESULTS, true)
                    putExtra(RecognizerIntent.EXTRA_MAX_RESULTS, 5)
                    putExtra(RecognizerIntent.EXTRA_LANGUAGE, lang)
                    putExtra(RecognizerIntent.EXTRA_LANGUAGE_PREFERENCE, lang)
                    putExtra(RecognizerIntent.EXTRA_ONLY_RETURN_LANGUAGE_PREFERENCE, lang)
                    putExtra(RecognizerIntent.EXTRA_CALLING_PACKAGE, reactContext.packageName)
                }

                speechRecognizer?.setRecognitionListener(object : RecognitionListener {
                    override fun onReadyForSpeech(params: Bundle?) {
                        val map = Arguments.createMap()
                        map.putString("status", "ready")
                        sendEvent("onSpeechReady", map)
                    }

                    override fun onBeginningOfSpeech() {
                        isListening = true
                        val map = Arguments.createMap()
                        map.putString("status", "listening")
                        sendEvent("onSpeechStart", map)
                    }

                    override fun onRmsChanged(rmsdB: Float) {
                        val map = Arguments.createMap()
                        map.putDouble("rms", rmsdB.toDouble())
                        sendEvent("onSpeechRmsChanged", map)
                    }

                    override fun onBufferReceived(buffer: ByteArray?) {}

                    override fun onEndOfSpeech() {
                        isListening = false
                        val map = Arguments.createMap()
                        map.putString("status", "processing")
                        sendEvent("onSpeechEnd", map)
                    }

                    override fun onError(error: Int) {
                        isListening = false
                        val map = Arguments.createMap()
                        map.putInt("error", error)
                        val errorMsg = when (error) {
                            SpeechRecognizer.ERROR_AUDIO -> "Audio recording error"
                            SpeechRecognizer.ERROR_CLIENT -> "Client side error"
                            SpeechRecognizer.ERROR_INSUFFICIENT_PERMISSIONS -> "Microphone permission required"
                            SpeechRecognizer.ERROR_NETWORK -> "Network connection error"
                            SpeechRecognizer.ERROR_NETWORK_TIMEOUT -> "Network timed out"
                            SpeechRecognizer.ERROR_NO_MATCH -> "No speech match found"
                            SpeechRecognizer.ERROR_RECOGNIZER_BUSY -> "Speech service busy"
                            SpeechRecognizer.ERROR_SERVER -> "Server error"
                            SpeechRecognizer.ERROR_SPEECH_TIMEOUT -> "No speech detected"
                            else -> "Recognition error code: $error"
                        }
                        map.putString("message", errorMsg)
                        sendEvent("onSpeechError", map)
                    }

                    override fun onResults(results: Bundle?) {
                        isListening = false
                        val matches = results?.getStringArrayList(SpeechRecognizer.RESULTS_RECOGNITION)
                        val map = Arguments.createMap()
                        val array = Arguments.createArray()
                        matches?.forEach { array.pushString(it) }
                        map.putArray("results", array)
                        map.putString("text", matches?.firstOrNull() ?: "")
                        sendEvent("onSpeechResults", map)
                    }

                    override fun onPartialResults(partialResults: Bundle?) {
                        val matches = partialResults?.getStringArrayList(SpeechRecognizer.RESULTS_RECOGNITION)
                        val map = Arguments.createMap()
                        val array = Arguments.createArray()
                        matches?.forEach { array.pushString(it) }
                        map.putArray("results", array)
                        map.putString("text", matches?.firstOrNull() ?: "")
                        sendEvent("onSpeechPartialResults", map)
                    }

                    override fun onEvent(eventType: Int, params: Bundle?) {}
                })

                speechRecognizer?.startListening(intent)
                promise.resolve(true)
            } catch (e: Exception) {
                isListening = false
                promise.reject("START_ERROR", e.message, e)
            }
        }
    }

    @ReactMethod
    fun stopListening(promise: Promise) {
        UiThreadUtil.runOnUiThread {
            try {
                if (speechRecognizer != null && isListening) {
                    speechRecognizer?.stopListening()
                }
                isListening = false
                promise.resolve(true)
            } catch (e: Exception) {
                promise.reject("STOP_ERROR", e.message, e)
            }
        }
    }

    @ReactMethod
    fun destroy(promise: Promise) {
        UiThreadUtil.runOnUiThread {
            try {
                speechRecognizer?.destroy()
                speechRecognizer = null
                isListening = false
                promise.resolve(true)
            } catch (e: Exception) {
                promise.reject("DESTROY_ERROR", e.message, e)
            }
        }
    }
}
