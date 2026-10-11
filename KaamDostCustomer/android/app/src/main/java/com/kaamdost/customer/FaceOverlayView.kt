package com.kaamdost.customer

import android.content.Context
import android.graphics.*
import android.util.AttributeSet
import android.view.View

class FaceOverlayView @JvmOverloads constructor(
    context: Context,
    attrs: AttributeSet? = null,
    defStyleAttr: Int = 0
) : View(context, attrs, defStyleAttr) {

    private val backgroundPaint = Paint(Paint.ANTI_ALIAS_FLAG).apply {
        color = Color.parseColor("#B3050B14") // 70% dark mask
        style = Paint.Style.FILL
    }

    private val clearPaint = Paint(Paint.ANTI_ALIAS_FLAG).apply {
        xfermode = PorterDuffXfermode(PorterDuff.Mode.CLEAR)
    }

    private val borderPaint = Paint(Paint.ANTI_ALIAS_FLAG).apply {
        style = Paint.Style.STROKE
        strokeWidth = 10f
        color = Color.parseColor("#F59E0B") // amber yellow by default
    }

    private val progressPaint = Paint(Paint.ANTI_ALIAS_FLAG).apply {
        style = Paint.Style.STROKE
        strokeWidth = 14f
        strokeCap = Paint.Cap.ROUND
        color = Color.parseColor("#10B981") // emerald green
    }

    val ovalRect = RectF()

    var statusColor: Int = Color.parseColor("#F59E0B")
        set(value) {
            field = value
            borderPaint.color = value
            invalidate()
        }

    var progressPercent: Float = 0f
        set(value) {
            field = value.coerceIn(0f, 1f)
            invalidate()
        }

    init {
        setLayerType(LAYER_TYPE_SOFTWARE, null)
    }

    override fun onSizeChanged(w: Int, h: Int, oldw: Int, oldh: Int) {
        super.onSizeChanged(w, h, oldw, oldh)
        val ovalWidth = w * 0.72f
        val ovalHeight = ovalWidth * 1.35f
        val left = (w - ovalWidth) / 2f
        val top = (h - ovalHeight) / 2.3f
        ovalRect.set(left, top, left + ovalWidth, top + ovalHeight)
    }

    override fun onDraw(canvas: Canvas) {
        super.onDraw(canvas)

        // Dim background outside oval
        canvas.drawRect(0f, 0f, width.toFloat(), height.toFloat(), backgroundPaint)

        // Clear transparent oval viewport
        canvas.drawOval(ovalRect, clearPaint)

        // Draw HUD oval border
        canvas.drawOval(ovalRect, borderPaint)

        // Draw progress arc around the oval as stability builds
        if (progressPercent > 0f) {
            val sweep = 360f * progressPercent
            canvas.drawArc(ovalRect, -90f, sweep, false, progressPaint)
        }
    }
}
