package com.kaamdost.customer

import android.Manifest
import android.annotation.SuppressLint
import android.content.Intent
import android.content.pm.PackageManager
import android.graphics.Color
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.util.Log
import android.view.Gravity
import android.view.View
import android.view.ViewGroup
import android.widget.FrameLayout
import android.widget.LinearLayout
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.camera.core.*
import androidx.camera.lifecycle.ProcessCameraProvider
import androidx.camera.view.PreviewView
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat
import com.google.mlkit.vision.common.InputImage
import com.google.mlkit.vision.face.Face
import com.google.mlkit.vision.face.FaceDetection
import com.google.mlkit.vision.face.FaceDetectorOptions
import java.io.File
import java.text.SimpleDateFormat
import java.util.Locale
import java.util.concurrent.ExecutorService
import java.util.concurrent.Executors
import kotlin.math.abs

class FaceCaptureActivity : AppCompatActivity() {

    private lateinit var cameraExecutor: ExecutorService
    private lateinit var previewView: PreviewView
    private lateinit var overlayView: FaceOverlayView
    private lateinit var statusText: TextView
    private lateinit var hintText: TextView
    private lateinit var flashView: View

    private var imageCapture: ImageCapture? = null
    private var isCapturing = false

    // Anti-shake & stability tracking
    private var steadyFramesCount = 0
    private val requiredSteadyFrames = 12 // ~0.8s - 1.0s of continuous zero-shake & sharp frames
    private var prevCenterX: Float? = null
    private var prevCenterY: Float? = null
    private var prevFaceWidth: Float? = null

    private val mainHandler = Handler(Looper.getMainLooper())

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        cameraExecutor = Executors.newSingleThreadExecutor()

        val root = FrameLayout(this).apply {
            layoutParams = ViewGroup.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.MATCH_PARENT
            )
            setBackgroundColor(Color.BLACK)
        }

        previewView = PreviewView(this).apply {
            layoutParams = FrameLayout.LayoutParams(
                FrameLayout.LayoutParams.MATCH_PARENT,
                FrameLayout.LayoutParams.MATCH_PARENT
            )
        }
        root.addView(previewView)

        overlayView = FaceOverlayView(this).apply {
            layoutParams = FrameLayout.LayoutParams(
                FrameLayout.LayoutParams.MATCH_PARENT,
                FrameLayout.LayoutParams.MATCH_PARENT
            )
        }
        root.addView(overlayView)

        // Top HUD Header
        val topBar = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            layoutParams = FrameLayout.LayoutParams(
                FrameLayout.LayoutParams.MATCH_PARENT,
                FrameLayout.LayoutParams.WRAP_CONTENT,
                Gravity.TOP
            ).apply {
                setMargins(24, 48, 24, 0)
            }
            gravity = Gravity.CENTER_HORIZONTAL
        }

        val titleView = TextView(this).apply {
            text = "AI Face Recognition"
            textSize = 18f
            setTextColor(Color.WHITE)
            paint.isFakeBoldText = true
            gravity = Gravity.CENTER
        }
        topBar.addView(titleView)

        val subTitleView = TextView(this).apply {
            text = "Anti-Shake & Auto-Capture Active • Hold Still"
            textSize = 12f
            setTextColor(Color.parseColor("#94A3B8"))
            gravity = Gravity.CENTER
            setPadding(0, 4, 0, 0)
        }
        topBar.addView(subTitleView)
        root.addView(topBar)

        // Close / Cancel Button at Top Right
        val closeBtn = TextView(this).apply {
            text = "✕"
            textSize = 22f
            setTextColor(Color.WHITE)
            layoutParams = FrameLayout.LayoutParams(
                FrameLayout.LayoutParams.WRAP_CONTENT,
                FrameLayout.LayoutParams.WRAP_CONTENT,
                Gravity.TOP or Gravity.END
            ).apply {
                setMargins(0, 44, 32, 0)
            }
            setPadding(16, 8, 16, 8)
            setOnClickListener {
                setResult(RESULT_CANCELED)
                finish()
            }
        }
        root.addView(closeBtn)

        // Bottom HUD Card
        val bottomCard = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            layoutParams = FrameLayout.LayoutParams(
                FrameLayout.LayoutParams.MATCH_PARENT,
                FrameLayout.LayoutParams.WRAP_CONTENT,
                Gravity.BOTTOM
            ).apply {
                setMargins(32, 0, 32, 48)
            }
            background = android.graphics.drawable.GradientDrawable().apply {
                setColor(Color.parseColor("#CC0F172A"))
                cornerRadius = 32f
            }
            setPadding(32, 24, 32, 24)
            gravity = Gravity.CENTER_HORIZONTAL
        }

        statusText = TextView(this).apply {
            text = "Position your face inside the oval"
            textSize = 15f
            setTextColor(Color.parseColor("#F59E0B"))
            paint.isFakeBoldText = true
            gravity = Gravity.CENTER
        }
        bottomCard.addView(statusText)

        hintText = TextView(this).apply {
            text = "Hold camera steady; auto-captures when sharp & centered"
            textSize = 12f
            setTextColor(Color.parseColor("#94A3B8"))
            gravity = Gravity.CENTER
            setPadding(0, 8, 0, 0)
        }
        bottomCard.addView(hintText)
        root.addView(bottomCard)

        // Flash overlay view (for shutter animation)
        flashView = View(this).apply {
            layoutParams = FrameLayout.LayoutParams(
                FrameLayout.LayoutParams.MATCH_PARENT,
                FrameLayout.LayoutParams.MATCH_PARENT
            )
            setBackgroundColor(Color.WHITE)
            alpha = 0f
            visibility = View.GONE
        }
        root.addView(flashView)

        setContentView(root)

        if (allPermissionsGranted()) {
            startCamera()
        } else {
            ActivityCompat.requestPermissions(
                this,
                arrayOf(Manifest.permission.CAMERA),
                REQUEST_CODE_PERMISSIONS
            )
        }
    }

    private fun allPermissionsGranted() = ContextCompat.checkSelfPermission(
        this, Manifest.permission.CAMERA
    ) == PackageManager.PERMISSION_GRANTED

    override fun onRequestPermissionsResult(
        requestCode: Int,
        permissions: Array<out String>,
        grantResults: IntArray
    ) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults)
        if (requestCode == REQUEST_CODE_PERMISSIONS) {
            if (allPermissionsGranted()) {
                startCamera()
            } else {
                Toast.makeText(this, "Camera permission is required for face recognition", Toast.LENGTH_SHORT).show()
                finish()
            }
        }
    }

    private fun startCamera() {
        val cameraProviderFuture = ProcessCameraProvider.getInstance(this)

        cameraProviderFuture.addListener({
            val cameraProvider = cameraProviderFuture.get()

            val preview = Preview.Builder().build().also {
                it.setSurfaceProvider(previewView.surfaceProvider)
            }

            imageCapture = ImageCapture.Builder()
                .setCaptureMode(ImageCapture.CAPTURE_MODE_MAXIMIZE_QUALITY)
                .build()

            val options = FaceDetectorOptions.Builder()
                .setPerformanceMode(FaceDetectorOptions.PERFORMANCE_MODE_FAST)
                .setLandmarkMode(FaceDetectorOptions.LANDMARK_MODE_NONE)
                .setClassificationMode(FaceDetectorOptions.CLASSIFICATION_MODE_ALL)
                .build()

            val detector = FaceDetection.getClient(options)

            val imageAnalyzer = ImageAnalysis.Builder()
                .setBackpressureStrategy(ImageAnalysis.STRATEGY_KEEP_ONLY_LATEST)
                .build()
                .also { analysis ->
                    analysis.setAnalyzer(cameraExecutor) { imageProxy ->
                        processImageProxy(imageProxy, detector)
                    }
                }

            val cameraSelector = CameraSelector.DEFAULT_FRONT_CAMERA

            try {
                cameraProvider.unbindAll()
                cameraProvider.bindToLifecycle(
                    this,
                    cameraSelector,
                    preview,
                    imageCapture,
                    imageAnalyzer
                )
            } catch (exc: Exception) {
                Log.e("FaceCaptureActivity", "Use case binding failed", exc)
            }

        }, ContextCompat.getMainExecutor(this))
    }

    /**
     * Measure image sharpness / blur using gradient edge variance on luminance channel.
     * Higher score = sharp image; Lower score (< 8.0) = blurry / motion-blurred image.
     */
    private fun calculateSharpnessScore(image: ImageProxy): Double {
        val plane = image.planes.getOrNull(0) ?: return 50.0
        val buffer = plane.buffer
        val rowStride = plane.rowStride
        val pixelStride = plane.pixelStride
        val width = image.width
        val height = image.height

        val sampleStep = 4
        var sumGradient = 0.0
        var sampleCount = 0

        // Inspect central face quadrant
        val startY = height / 4
        val endY = height * 3 / 4
        val startX = width / 4
        val endX = width * 3 / 4

        for (y in startY until endY step sampleStep) {
            val rowOffset = y * rowStride
            for (x in startX until endX step sampleStep) {
                val index = rowOffset + x * pixelStride
                val rightIndex = index + (pixelStride * 2)
                val bottomIndex = rowOffset + (rowStride * 2) + (x * pixelStride)

                if (rightIndex < buffer.limit() && bottomIndex < buffer.limit()) {
                    val pCurrent = buffer.get(index).toInt() and 0xFF
                    val pRight = buffer.get(rightIndex).toInt() and 0xFF
                    val pBottom = buffer.get(bottomIndex).toInt() and 0xFF

                    val diffX = abs(pCurrent - pRight)
                    val diffY = abs(pCurrent - pBottom)
                    sumGradient += (diffX + diffY)
                    sampleCount++
                }
            }
        }

        if (sampleCount == 0) return 50.0
        return sumGradient / sampleCount
    }

    @SuppressLint("UnsafeOptInUsageError")
    private fun processImageProxy(
        imageProxy: ImageProxy,
        detector: com.google.mlkit.vision.face.FaceDetector
    ) {
        val mediaImage = imageProxy.image
        if (mediaImage == null || isCapturing) {
            imageProxy.close()
            return
        }

        // Measure frame sharpness to prevent capturing blur/shake
        val sharpness = calculateSharpnessScore(imageProxy)
        val image = InputImage.fromMediaImage(mediaImage, imageProxy.imageInfo.rotationDegrees)
        val frameWidth = imageProxy.width
        val frameHeight = imageProxy.height

        detector.process(image)
            .addOnSuccessListener { faces ->
                evaluateFaces(faces, sharpness, frameWidth, frameHeight)
            }
            .addOnFailureListener {
                // Ignore transient frame errors
            }
            .addOnCompleteListener {
                imageProxy.close()
            }
    }

    private fun evaluateFaces(faces: List<Face>, sharpnessScore: Double, frameWidth: Int, frameHeight: Int) {
        if (isCapturing) return

        if (faces.isEmpty()) {
            steadyFramesCount = 0
            prevCenterX = null
            prevCenterY = null
            mainHandler.post {
                overlayView.statusColor = Color.parseColor("#F59E0B") // Amber
                overlayView.progressPercent = 0f
                statusText.text = "No face detected"
                statusText.setTextColor(Color.parseColor("#F59E0B"))
                hintText.text = "Look directly into the oval frame"
            }
            return
        }

        if (faces.size > 1) {
            steadyFramesCount = 0
            prevCenterX = null
            prevCenterY = null
            mainHandler.post {
                overlayView.statusColor = Color.parseColor("#EF4444") // Red
                overlayView.progressPercent = 0f
                statusText.text = "Multiple faces detected"
                statusText.setTextColor(Color.parseColor("#EF4444"))
                hintText.text = "Only 1 person must be in frame"
            }
            return
        }

        val face = faces[0]
        val faceBox = face.boundingBox
        val centerX = faceBox.exactCenterX()
        val centerY = faceBox.exactCenterY()
        val width = faceBox.width().toFloat()

        // 1. Anti-Shake / Motion Detection
        val isShaking = if (prevCenterX != null && prevCenterY != null) {
            val deltaX = abs(centerX - prevCenterX!!)
            val deltaY = abs(centerY - prevCenterY!!)
            val deltaW = abs(width - (prevFaceWidth ?: width))
            // Shake threshold: if face shifted more than 16px between consecutive frames
            deltaX > 16f || deltaY > 16f || deltaW > 22f
        } else false

        prevCenterX = centerX
        prevCenterY = centerY
        prevFaceWidth = width

        if (isShaking) {
            steadyFramesCount = 0
            mainHandler.post {
                overlayView.statusColor = Color.parseColor("#EF4444") // Red
                overlayView.progressPercent = 0f
                statusText.text = "Camera/Face Moving — Hold Still"
                statusText.setTextColor(Color.parseColor("#EF4444"))
                hintText.text = "Do not shake your phone. Hold completely steady."
            }
            return
        }

        // 2. Anti-Blur Sharpness Check
        if (sharpnessScore < 8.5) {
            steadyFramesCount = 0
            mainHandler.post {
                overlayView.statusColor = Color.parseColor("#F59E0B") // Amber
                overlayView.progressPercent = 0f
                statusText.text = "Image Blurry — Hold Steady"
                statusText.setTextColor(Color.parseColor("#F59E0B"))
                hintText.text = "Ensure good lighting and avoid camera shake."
            }
            return
        }

        // 3. Pose / Angle Check (Must look straight ahead)
        val yaw = abs(face.headEulerAngleY)
        val pitch = abs(face.headEulerAngleX)
        val roll = abs(face.headEulerAngleZ)

        if (yaw > 16f || pitch > 16f || roll > 16f) {
            steadyFramesCount = 0
            mainHandler.post {
                overlayView.statusColor = Color.parseColor("#F59E0B")
                overlayView.progressPercent = 0f
                statusText.text = "Look straight ahead"
                statusText.setTextColor(Color.parseColor("#F59E0B"))
                hintText.text = "Keep your head level and centered"
            }
            return
        }

        // 4. Eyes Open Classification (Avoid capturing blink)
        val leftEye = face.leftEyeOpenProbability
        val rightEye = face.rightEyeOpenProbability
        if ((leftEye != null && leftEye < 0.35f) || (rightEye != null && rightEye < 0.35f)) {
            steadyFramesCount = 0
            mainHandler.post {
                overlayView.statusColor = Color.parseColor("#F59E0B")
                overlayView.progressPercent = 0f
                statusText.text = "Eyes Closed / Blinking"
                statusText.setTextColor(Color.parseColor("#F59E0B"))
                hintText.text = "Keep both eyes clearly open"
            }
            return
        }

        // 5. Face Distance & Framing Check
        val minFaceWidth = frameWidth * 0.22f
        val maxFaceWidth = frameWidth * 0.82f
        if (width < minFaceWidth) {
            steadyFramesCount = 0
            mainHandler.post {
                overlayView.statusColor = Color.parseColor("#F59E0B")
                overlayView.progressPercent = 0f
                statusText.text = "Move Closer"
                statusText.setTextColor(Color.parseColor("#F59E0B"))
                hintText.text = "Bring your face closer to the oval frame"
            }
            return
        }
        if (width > maxFaceWidth) {
            steadyFramesCount = 0
            mainHandler.post {
                overlayView.statusColor = Color.parseColor("#F59E0B")
                overlayView.progressPercent = 0f
                statusText.text = "Move Slightly Back"
                statusText.setTextColor(Color.parseColor("#F59E0B"))
                hintText.text = "Keep entire face within the oval border"
            }
            return
        }

        // All checks passed! Accumulate steady, sharp frame
        steadyFramesCount++
        val progress = (steadyFramesCount.toFloat() / requiredSteadyFrames).coerceIn(0f, 1f)

        mainHandler.post {
            overlayView.statusColor = Color.parseColor("#10B981") // Green
            overlayView.progressPercent = progress

            if (steadyFramesCount < requiredSteadyFrames) {
                statusText.text = "Sharp & Steady! Hold still..."
                statusText.setTextColor(Color.parseColor("#10B981"))
                val countdown = ((requiredSteadyFrames - steadyFramesCount) / 3) + 1
                hintText.text = "Auto-capturing in $countdown..."
            } else {
                statusText.text = "Auto-Capturing Live Selfie ✓"
                statusText.setTextColor(Color.parseColor("#10B981"))
                hintText.text = "Perfect quality captured"
                triggerAutoCapture()
            }
        }
    }

    private fun triggerAutoCapture() {
        if (isCapturing) return
        isCapturing = true

        val capture = imageCapture ?: run {
            isCapturing = false
            return
        }

        // Play visual flash
        flashView.visibility = View.VISIBLE
        flashView.alpha = 1f
        flashView.animate()
            .alpha(0f)
            .setDuration(300)
            .withEndAction { flashView.visibility = View.GONE }
            .start()

        val photoFile = File(
            cacheDir,
            "live_selfie_${SimpleDateFormat("yyyyMMdd_HHmmss", Locale.US).format(System.currentTimeMillis())}.jpg"
        )

        val outputOptions = ImageCapture.OutputFileOptions.Builder(photoFile).build()

        capture.takePicture(
            outputOptions,
            ContextCompat.getMainExecutor(this),
            object : ImageCapture.OnImageSavedCallback {
                override fun onError(exc: ImageCaptureException) {
                    isCapturing = false
                    Toast.makeText(this@FaceCaptureActivity, "Capture failed: ${exc.message}", Toast.LENGTH_SHORT).show()
                }

                override fun onImageSaved(output: ImageCapture.OutputFileResults) {
                    val resultIntent = Intent().apply {
                        putExtra("imageUri", "file://${photoFile.absolutePath}")
                    }
                    setResult(RESULT_OK, resultIntent)
                    finish()
                }
            }
        )
    }

    override fun onDestroy() {
        super.onDestroy()
        cameraExecutor.shutdown()
    }

    companion object {
        private const val REQUEST_CODE_PERMISSIONS = 1001
    }
}
