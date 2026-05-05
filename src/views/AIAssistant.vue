<script setup>
import { ref, onMounted, nextTick, watch } from 'vue'
import { Send, Bot, User, Sparkles, Mic, Loader2 } from 'lucide-vue-next'
import { useMQTT } from '../composables/useMQTT'

const { currentTemperature, currentHumidity, currentHeatIndex } = useMQTT()

const messages = ref([
  {
    id: 1,
    role: 'ai',
    content: 'Welcome to the full AI Assistant dashboard. I have full access to your warehouse sensor data. Ask me anything about environmental safety or predictive risks!'
  }
])

const inputMessage = ref('')
const chatContainer = ref(null)
const isTyping = ref(false)

const isRecording = ref(false)
const isTranscribing = ref(false)
let mediaRecorder = null
let audioChunks = []

const toggleRecording = async () => {
  if (isRecording.value) {
    mediaRecorder.stop()
    isRecording.value = false
    return
  }

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    mediaRecorder = new MediaRecorder(stream)
    audioChunks = []

    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) audioChunks.push(e.data)
    }

    mediaRecorder.onstop = async () => {
      stream.getTracks().forEach(track => track.stop())
      isTranscribing.value = true
      
      const audioBlob = new Blob(audioChunks, { type: 'audio/webm' })
      const file = new File([audioBlob], 'recording.webm', { type: 'audio/webm' })
      
      const formData = new FormData()
      formData.append('file', file)
      formData.append('model', 'whisper-large-v3')

      try {
        const response = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`
          },
          body: formData
        })
        
        if (!response.ok) throw new Error('Transcription failed')
        const data = await response.json()
        inputMessage.value += (inputMessage.value ? ' ' : '') + data.text.trim()
      } catch (err) {
        console.error('Transcription error:', err)
        alert('Failed to transcribe audio. Please check your microphone or API key.')
      } finally {
        isTranscribing.value = false
      }
    }

    mediaRecorder.start()
    isRecording.value = true
  } catch (err) {
    console.error('Microphone access denied', err)
    alert('Please allow microphone permissions to use voice chat.')
  }
}

const scrollToBottom = async () => {
  await nextTick()
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight
  }
}

const sendMessage = async () => {
  if (!inputMessage.value.trim() || isTyping.value) return

  const userQuery = inputMessage.value
  inputMessage.value = ''

  messages.value.push({
    id: Date.now(),
    role: 'user',
    content: userQuery
  })

  scrollToBottom()
  isTyping.value = true

  const groqMessages = [
    {
      role: 'system',
      content: `You are Yield Guard AI, a professional agricultural warehouse monitoring assistant. 
You analyze current environmental conditions and answer questions to ensure optimal storage (e.g., for coffee beans).
CURRENT SENSOR DATA:
- Air Temperature: ${currentTemperature.value !== null ? currentTemperature.value.toFixed(1) + '°C' : '--'}
- Relative Humidity: ${currentHumidity.value !== null ? currentHumidity.value.toFixed(1) + '%' : '--'}

Keep your answers comprehensive, professional, and directly related to warehouse safety, mold risks, or environmental control.`
    },
    ...messages.value.map(m => ({
      role: m.role === 'ai' ? 'assistant' : 'user',
      content: m.content
    }))
  ]

  try {
    const { Groq } = await import('groq-sdk')
    const groq = new Groq({ 
      apiKey: import.meta.env.VITE_GROQ_API_KEY,
      dangerouslyAllowBrowser: true 
    })

    const chatCompletion = await groq.chat.completions.create({
      messages: groqMessages,
      model: "llama-3.1-8b-instant",
      temperature: 0.7,
      max_completion_tokens: 1024,
      top_p: 1,
      stream: false,
      stop: null
    })

    const replyContent = chatCompletion.choices[0]?.message?.content || 'I have no response.'
    
    messages.value.push({
      id: Date.now(),
      role: 'ai',
      content: replyContent
    })
  } catch (err) {
    console.error(err)
    messages.value.push({
      id: Date.now(),
      role: 'ai',
      content: 'Sorry, I am unable to connect to the cloud AI service. Please verify your Groq API key and network connection.'
    })
  } finally {
    isTyping.value = false
    scrollToBottom()
  }
}

onMounted(() => {
  scrollToBottom()
})

watch(messages, () => {
  scrollToBottom()
}, { deep: true })
</script>

<template>
  <!-- Main container -->
  <div class="w-full h-full flex flex-col bg-base-primary">
    
    <!-- Chat Interface -->
    <div class="w-full flex-1 bg-base-secondary flex flex-col overflow-hidden transition-all">
      <!-- Chat Header -->
      <div class="px-4 py-3 sm:px-6 sm:py-4 border-b border-border-soft flex items-center justify-between bg-base-secondary shrink-0">
        <div class="flex items-center space-x-3 sm:space-x-4">
          <div class="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[var(--color-accent-blue)]/10 flex items-center justify-center shrink-0 border border-[var(--color-accent-blue)]/20">
            <Sparkles class="w-4 h-4 sm:w-5 sm:h-5 text-[var(--color-accent-blue)]" />
          </div>
          <div>
            <h2 class="text-content-primary font-bold text-base sm:text-lg leading-tight">Yield Guard AI</h2>
            <p class="text-xs sm:text-sm text-[var(--color-accent-blue)] font-medium mt-0.5">Predictive Environmental Intelligence</p>
          </div>
        </div>
      </div>

      <!-- Chat History -->
      <div ref="chatContainer" class="flex-1 overflow-y-auto p-4 sm:p-8 space-y-4 sm:space-y-6 bg-base-primary/50 scroll-smooth">
        <div 
          v-for="msg in messages" 
          :key="msg.id"
          class="flex w-full"
          :class="msg.role === 'user' ? 'justify-end' : 'justify-start'"
        >
          <div 
            class="flex max-w-[90%] sm:max-w-[85%] items-start space-x-2 sm:space-x-4"
            :class="msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : 'flex-row'"
          >
            <div 
              class="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex-shrink-0 flex items-center justify-center mt-0.5 sm:mt-1"
              :class="msg.role === 'user' ? 'bg-base-primary border border-border-soft' : 'bg-[var(--color-accent-blue)]'"
            >
              <User v-if="msg.role === 'user'" class="w-4 h-4 sm:w-5 sm:h-5 text-content-secondary" />
              <Bot v-else class="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            
            <div 
              class="px-4 py-3 sm:px-6 sm:py-4 rounded-2xl text-[14px] sm:text-[15px] leading-relaxed shadow-sm overflow-hidden"
              :class="msg.role === 'user' 
                ? 'bg-[var(--color-accent-blue)] text-white rounded-tr-none' 
                : 'bg-base-secondary border border-border-soft text-content-primary rounded-tl-none'"
            >
              <div v-html="msg.content.replace(/\n/g, '<br/>')" class="prose prose-sm sm:prose-base prose-invert max-w-none break-words"></div>
            </div>
          </div>
        </div>
        
        <!-- Typing Indicator -->
        <div v-if="isTyping" class="flex w-full justify-start">
          <div class="flex max-w-[80%] items-start space-x-2 sm:space-x-4">
            <div class="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex-shrink-0 flex items-center justify-center mt-0.5 sm:mt-1 bg-[var(--color-accent-blue)]">
               <Bot class="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div class="px-4 py-3 sm:px-6 sm:py-4 rounded-2xl bg-base-secondary border border-border-soft rounded-tl-none flex space-x-2 items-center h-[48px] sm:h-[56px]">
              <div class="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-content-secondary rounded-full animate-bounce" style="animation-delay: 0ms"></div>
              <div class="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-content-secondary rounded-full animate-bounce" style="animation-delay: 150ms"></div>
              <div class="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-content-secondary rounded-full animate-bounce" style="animation-delay: 300ms"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Input Area -->
      <div class="p-3 sm:p-6 border-t border-border-soft bg-base-secondary shrink-0">
        <form @submit.prevent="sendMessage" class="relative flex items-center max-w-4xl mx-auto">
          <input 
            v-model="inputMessage"
            type="text" 
            :placeholder="isRecording ? 'Listening...' : (isTranscribing ? 'Transcribing...' : 'Ask AI...')"
            :disabled="isRecording || isTranscribing"
            class="w-full bg-base-primary border border-border-soft rounded-2xl pl-4 pr-24 sm:pl-6 sm:pr-28 py-3 sm:py-4 text-[14px] sm:text-[15px] text-content-primary placeholder-content-secondary focus:outline-none focus:border-[var(--color-accent-blue)] focus:ring-1 focus:ring-[var(--color-accent-blue)] transition-all shadow-inner disabled:opacity-70"
          />
          <div class="absolute right-2 sm:right-3 flex items-center space-x-1 sm:space-x-2">
            <button 
              type="button"
              @click="toggleRecording"
              :disabled="isTranscribing || isTyping"
              class="p-2 sm:p-3 rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center"
              :class="isRecording ? 'bg-[var(--color-accent-red)] text-white animate-pulse' : 'bg-base-secondary text-content-secondary hover:text-[var(--color-accent-blue)] hover:bg-[var(--color-accent-blue)]/10'"
            >
              <Loader2 v-if="isTranscribing" class="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
              <Mic v-else class="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button 
              type="submit"
              :disabled="!inputMessage.trim() || isTyping || isRecording || isTranscribing"
              class="p-2 sm:p-3 bg-[var(--color-accent-blue)] text-white rounded-xl hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              <Send class="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </form>
      </div>
    </div>

  </div>
</template>
