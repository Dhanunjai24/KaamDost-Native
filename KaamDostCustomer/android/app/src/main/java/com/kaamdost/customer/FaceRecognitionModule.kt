package com.kaamdost.customer

import android.app.Activity
import android.content.Intent
import com.facebook.react.bridge.*

class FaceRecognitionModule(private val reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext), ActivityEventListener {

    private var capturePromise: Promise? = null

    init {
        reactContext.addActivityEventListener(this)
    }

    override fun getName(): String = "FaceRecognitionModule"

    @ReactMethod
    fun startFaceCapture(promise: Promise) {
        val currentAct = currentActivity
        if (currentAct == null) {
            promise.reject("E_NO_ACTIVITY", "Activity doesn't exist")
            return
        }

        capturePromise = promise

        val intent = Intent(currentAct, FaceCaptureActivity::class.java)
        currentAct.startActivityForResult(intent, REQUEST_CODE_FACE_CAPTURE)
    }

    override fun onActivityResult(
        activity: Activity?,
        requestCode: Int,
        resultCode: Int,
        data: Intent?
    ) {
        if (requestCode == REQUEST_CODE_FACE_CAPTURE) {
            val promise = capturePromise ?: return
            capturePromise = null

            if (resultCode == Activity.RESULT_OK && data != null) {
                val uri = data.getStringExtra("imageUri")
                val map = Arguments.createMap().apply {
                    putBoolean("success", true)
                    putString("uri", uri)
                }
                promise.resolve(map)
            } else {
                val map = Arguments.createMap().apply {
                    putBoolean("success", false)
                    putString("error", "Cancelled")
                }
                promise.resolve(map)
            }
        }
    }

    override fun onNewIntent(intent: Intent?) {
        // No-op
    }

    companion object {
        private const val REQUEST_CODE_FACE_CAPTURE = 2002
    }
}
