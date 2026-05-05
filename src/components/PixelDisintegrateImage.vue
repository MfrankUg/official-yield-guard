<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  src: {
    type: String,
    required: true
  },
  resolution: {
    type: Number,
    default: 4 // Pixel block size
  },
  interactionRadius: {
    type: Number,
    default: 80 // Mouse interaction radius
  }
})

const canvasRef = ref(null)
let particles = []
let animationFrameId
let mouse = { x: null, y: null, radius: props.interactionRadius }
let image = new Image()

class Particle {
  constructor(x, y, color, size) {
    this.x = x
    this.y = y
    this.originX = x
    this.originY = y
    this.color = color
    this.size = size
    this.vx = 0
    this.vy = 0
    this.ease = 0.05
    this.friction = 0.85
  }
  
  draw(ctx) {
    ctx.fillStyle = this.color
    ctx.fillRect(this.x, this.y, this.size, this.size)
  }
  
  update(mouse) {
    if (mouse.x != null && mouse.y != null) {
      const dx = mouse.x - this.x
      const dy = mouse.y - this.y
      const distance = Math.sqrt(dx * dx + dy * dy)
      
      if (distance < mouse.radius) {
        const angle = Math.atan2(dy, dx)
        const force = (mouse.radius - distance) / mouse.radius
        // Push AWAY from mouse
        const directionX = Math.cos(angle) * force * 15
        const directionY = Math.sin(angle) * force * 15
        
        this.vx -= directionX
        this.vy -= directionY
      }
    }
    
    // Return to origin
    this.x += (this.originX - this.x) * this.ease + this.vx
    this.y += (this.originY - this.y) * this.ease + this.vy
    
    // Apply friction
    this.vx *= this.friction
    this.vy *= this.friction
  }
}

const initEffect = () => {
  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  
  // Safe max size for performance
  const MAX_SIZE = 350
  let scale = 1
  if (image.width > MAX_SIZE || image.height > MAX_SIZE) {
    scale = Math.min(MAX_SIZE / image.width, MAX_SIZE / image.height)
  }
  
  canvas.width = image.width * scale
  canvas.height = image.height * scale
  
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height)
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data
  
  particles = []
  
  const step = props.resolution
  for (let y = 0; y < canvas.height; y += step) {
    for (let x = 0; x < canvas.width; x += step) {
      const index = (y * canvas.width + x) * 4
      const alpha = imageData[index + 3]
      
      // Extract RGB values
      const r = imageData[index]
      const g = imageData[index + 1]
      const b = imageData[index + 2]
      
      // Only process pixels that are not fully transparent AND not part of a white background
      const isWhite = r > 245 && g > 245 && b > 245
      
      if (alpha > 10 && !isWhite) { 
        const color = `rgba(${r},${g},${b},${alpha/255})`
        // Start completely scattered far away to create an assembling effect
        const startX = Math.random() * canvas.width * 3 - canvas.width
        const startY = Math.random() * canvas.height * 3 - canvas.height
        const particle = new Particle(startX, startY, color, step)
        particle.originX = x
        particle.originY = y
        // Randomize easing slightly so they don't all arrive at the exact same time
        particle.ease = Math.random() * 0.03 + 0.02
        particles.push(particle)
      }
    }
  }
  
  ctx.clearRect(0, 0, canvas.width, canvas.height)
}

const animate = () => {
  if (!canvasRef.value) return
  const ctx = canvasRef.value.getContext('2d')
  ctx.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height)
  
  for (let i = 0; i < particles.length; i++) {
    particles[i].update(mouse)
    particles[i].draw(ctx)
  }
  
  animationFrameId = requestAnimationFrame(animate)
}

const handleMouseMove = (e) => {
  if (!canvasRef.value) return
  const rect = canvasRef.value.getBoundingClientRect()
  const scaleX = canvasRef.value.width / rect.width
  const scaleY = canvasRef.value.height / rect.height
  
  mouse.x = (e.clientX - rect.left) * scaleX
  mouse.y = (e.clientY - rect.top) * scaleY
}

const handleMouseLeave = () => {
  mouse.x = null
  mouse.y = null
}

const handleTouchMove = (e) => {
  if (!canvasRef.value || !e.touches[0]) return
  const rect = canvasRef.value.getBoundingClientRect()
  const scaleX = canvasRef.value.width / rect.width
  const scaleY = canvasRef.value.height / rect.height
  
  mouse.x = (e.touches[0].clientX - rect.left) * scaleX
  mouse.y = (e.touches[0].clientY - rect.top) * scaleY
}

onMounted(() => {
  image.src = props.src
  image.onload = () => {
    initEffect()
    animate()
  }
})

onUnmounted(() => {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
  }
})
</script>

<template>
  <div class="relative w-full h-full flex items-center justify-center p-4">
    <canvas 
      ref="canvasRef" 
      class="max-w-full max-h-full object-contain drop-shadow-2xl transition-transform hover:scale-105 duration-700"
      @mousemove="handleMouseMove"
      @mouseleave="handleMouseLeave"
      @touchmove.prevent="handleTouchMove"
      @touchend="handleMouseLeave"
    ></canvas>
  </div>
</template>
