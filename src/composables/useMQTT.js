import { ref } from 'vue'
import mqtt from 'mqtt'

// Singleton state: moved outside the composable so all components share the exact same reactive refs
const currentTemperature = ref(null)
const currentHumidity = ref(null)
const currentHeatIndex = ref(null)
const isConnected = ref(false)
const connectionError = ref(null)

const historicalDataPoints = ref([])

let client = null
let lastUpdateTime = 0

export function useMQTT() {

  const connect = () => {
    const brokerUrl = 'wss://392a25b9fbf4427da0a7b361620a2a2a.s1.eu.hivemq.cloud:8884/mqtt'
    const options = {
      username: 'Mfrankug',
      password: '$Frank1122',
      clientId: 'yield_guard_web_' + Math.random().toString(16).substr(2, 8),
    }

    try {
      client = mqtt.connect(brokerUrl, options)

      client.on('connect', () => {
        isConnected.value = true
        connectionError.value = null
        client.subscribe('tdms/warehouse1/environment', (err) => {
          if (err) console.error('Subscription error:', err)
        })
      })

      client.on('message', (topic, message) => {
        try {
          if (topic === 'tdms/warehouse1/environment') {
            const parsedData = JSON.parse(message.toString())
            if (parsedData.temperature !== undefined) {
              currentTemperature.value = parsedData.temperature
            }
            if (parsedData.humidity !== undefined) {
              currentHumidity.value = parsedData.humidity
            }
            if (parsedData.heatIndex !== undefined) {
              currentHeatIndex.value = parsedData.heatIndex
            }
            
            // Only update history if we have valid values
            if (parsedData.temperature !== undefined && parsedData.humidity !== undefined) {
              updateHistory(parsedData.temperature, parsedData.humidity)
            }
          }
        } catch (error) {
          console.error('Error parsing MQTT message:', error)
        }
      })

      client.on('error', (err) => {
        console.error('MQTT Connection Error: ', err)
        connectionError.value = err.message || 'Connection failed'
        isConnected.value = false
      })
      
      client.on('close', () => {
        isConnected.value = false
      })

      client.on('offline', () => {
        isConnected.value = false
      })

    } catch (err) {
      console.error('MQTT Setup Error: ', err)
      connectionError.value = 'Setup failed'
    }
  }

  // Helper to throttle history updates to not spam the chart
  const updateHistory = (temp, humidity) => {
    const time = Date.now()
    if (time - lastUpdateTime > 60000) { // Update history max once per minute
      lastUpdateTime = time
      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      historicalDataPoints.value.push({
        timestamp: timeStr,
        temp,
        humidity
      })
      if (historicalDataPoints.value.length > 72) {
        historicalDataPoints.value.shift()
      }
    }
  }

  const disconnect = () => {
    if (client) {
      client.end()
    }
  }

  return {
    currentTemperature,
    currentHumidity,
    currentHeatIndex,
    historicalDataPoints,
    isConnected,
    connectionError,
    connect,
    disconnect
  }
}
