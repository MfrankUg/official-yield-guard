<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { Send, Bot, User, Sparkles, X, MessageSquare, Mic, Loader2 } from 'lucide-vue-next'
import { useMQTT } from '../composables/useMQTT'

const { currentTemperature, currentHumidity, currentHeatIndex } = useMQTT()

const isOpen = ref(false)

const messages = ref([
  {
    id: 1,
    role: 'ai',
    content: 'Hello! I am your Yield Guard AI assistant. I continuously monitor the warehouse conditions. How can I help you today?'
  }
])

const inputMessage = ref('')
const chatContainer = ref(null)
const isTyping = ref(false)

const scrollToBottom = async () => {
  await nextTick()
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight
  }
}

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

const toggleChat = () => {
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    scrollToBottom()
  }
}

const sendMessage = async () => {
  if (!inputMessage.value.trim() || isTyping.value) return

  const userQuery = inputMessage.value
  inputMessage.value = ''

  // Add user message
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
- Heat Index: ${currentHeatIndex.value !== null ? currentHeatIndex.value.toFixed(1) + '°C' : '--'}

Keep your answers concise, professional, and directly related to warehouse safety, mold risks, or environmental control.`
    },
    // Map previous chat history
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
</script>

<template>
  <div class="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[100] flex flex-col items-end">
    
    <!-- Chat Window -->
    <transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="transform scale-95 opacity-0 translate-y-4"
      enter-to-class="transform scale-100 opacity-100 translate-y-0"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="transform scale-100 opacity-100 translate-y-0"
      leave-to-class="transform scale-95 opacity-0 translate-y-4"
    >
      <div 
        v-if="isOpen" 
        class="bg-base-secondary rounded-2xl border border-border-soft flex flex-col shadow-2xl overflow-hidden mb-3 sm:mb-4 w-[calc(100vw-2rem)] sm:w-[450px] md:w-[500px] h-[calc(100dvh-120px)] sm:h-[650px] md:h-[750px] max-h-[calc(100dvh-120px)] sm:max-h-[85vh] transition-all"
      >
        <!-- Chat Header -->
        <div class="px-6 py-4 border-b border-border-soft flex items-center justify-between bg-base-secondary">
          <div class="flex items-center space-x-3">
            <div class="w-8 h-8 rounded-full bg-[var(--color-accent-blue)]/20 flex items-center justify-center">
              <Sparkles class="w-4 h-4 text-[var(--color-accent-blue)]" />
            </div>
            <div>
              <h3 class="text-content-primary font-semibold text-sm">Yield Guard AI</h3>
              <p class="text-[10px] sm:text-xs text-[var(--color-accent-blue)] font-medium">Predictive Environmental Intelligence</p>
            </div>
          </div>
          <button @click="toggleChat" class="text-content-secondary hover:text-content-primary transition-colors p-1">
            <X class="w-5 h-5" />
          </button>
        </div>

        <!-- Chat History -->
        <div ref="chatContainer" class="flex-1 overflow-y-auto p-6 space-y-4 bg-base-primary/50 scroll-smooth">
          <div 
            v-for="msg in messages" 
            :key="msg.id"
            class="flex w-full"
            :class="msg.role === 'user' ? 'justify-end' : 'justify-start'"
          >
            <div 
              class="flex max-w-[80%] items-end space-x-2"
              :class="msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : 'flex-row'"
            >
              <div 
                class="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center mb-1"
                :class="msg.role === 'user' ? 'bg-base-primary border border-border-soft' : 'bg-[var(--color-accent-blue)]'"
              >
                <User v-if="msg.role === 'user'" class="w-3 h-3 text-content-secondary" />
                <Bot v-else class="w-3 h-3 text-white" />
              </div>
              
              <div 
                class="px-4 py-3 rounded-2xl text-sm leading-relaxed"
                :class="msg.role === 'user' 
                  ? 'bg-[var(--color-accent-blue)] text-white rounded-br-none shadow-md shadow-[var(--color-accent-blue)]/20' 
                  : 'bg-base-secondary border border-border-soft text-content-primary rounded-bl-none shadow-sm'"
              >
                {{ msg.content }}
              </div>
            </div>
          </div>
          
          <!-- Typing Indicator -->
          <div v-if="isTyping" class="flex w-full justify-start">
            <div class="flex max-w-[80%] items-end space-x-2">
              <div class="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center mb-1 bg-[var(--color-accent-blue)]">
                 <Bot class="w-3 h-3 text-white" />
              </div>
              <div class="px-4 py-3 rounded-2xl bg-base-secondary border border-border-soft rounded-bl-none flex space-x-1.5 items-center h-[44px]">
                <div class="w-1.5 h-1.5 bg-content-secondary rounded-full animate-bounce" style="animation-delay: 0ms"></div>
                <div class="w-1.5 h-1.5 bg-content-secondary rounded-full animate-bounce" style="animation-delay: 150ms"></div>
                <div class="w-1.5 h-1.5 bg-content-secondary rounded-full animate-bounce" style="animation-delay: 300ms"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Input Area -->
        <div class="p-4 border-t border-border-soft bg-base-secondary">
          <form @submit.prevent="sendMessage" class="relative flex items-center">
            <input 
              v-model="inputMessage"
              type="text" 
              :placeholder="isRecording ? 'Listening...' : (isTranscribing ? 'Transcribing...' : 'Ask AI...')"
              :disabled="isRecording || isTranscribing"
              class="w-full bg-base-primary border border-border-soft rounded-full pl-5 pr-20 py-3 text-sm text-content-primary placeholder-content-secondary focus:outline-none focus:border-[var(--color-accent-blue)] focus:ring-1 focus:ring-[var(--color-accent-blue)] transition-all disabled:opacity-70"
            />
            <div class="absolute right-2 flex items-center space-x-1">
              <button 
                type="button"
                @click="toggleRecording"
                :disabled="isTranscribing || isTyping"
                class="p-1.5 rounded-full transition-colors disabled:opacity-50 flex items-center justify-center"
                :class="isRecording ? 'bg-[var(--color-accent-red)] text-white animate-pulse' : 'bg-transparent text-content-secondary hover:text-[var(--color-accent-blue)]'"
              >
                <Loader2 v-if="isTranscribing" class="w-4 h-4 animate-spin" />
                <Mic v-else class="w-4 h-4" />
              </button>
              <button 
                type="submit"
                :disabled="!inputMessage.trim() || isTyping || isRecording || isTranscribing"
                class="p-2 bg-[var(--color-accent-blue)] text-white rounded-full hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                <Send class="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </transition>

    <!-- Floating Action Button -->
    <button 
      @click="toggleChat"
      class="w-16 h-16 rounded-full bg-[var(--color-accent-blue)] text-white shadow-[0_0_20px_rgba(59,130,246,0.4)] hover:shadow-[0_0_30px_rgba(59,130,246,0.6)] hover:-translate-y-1 transform transition-all duration-300 flex items-center justify-center border-2 border-base-primary z-50 group"
    >
      <MessageSquare v-if="!isOpen" class="w-8 h-8 group-hover:scale-110 transition-transform" />
      <X v-else class="w-8 h-8 group-hover:rotate-90 transition-transform" />
      
      <!-- Notification dot -->
      <span v-if="!isOpen" class="absolute top-0 right-0 w-4 h-4 bg-[var(--color-accent-red)] rounded-full border-2 border-base-primary"></span>
    </button>
  </div>
</template>
