import { ref } from 'vue'
import mqtt from 'mqtt'
import { supabase } from '../lib/supabase'

// Singleton state: moved outside the composable so all components share the exact same reactive refs
const currentTemperature = ref(null)
const currentHumidity = ref(null)
const currentHeatIndex = ref(null)
const isConnected = ref(false)
const connectionError = ref(null)

const historicalDataPoints = ref([])
const notifications = ref([])
const unreadCount = ref(0)
const activePopup = ref(null) // Actionable insight popup state
let popupTimeout = null
let lastStatus = 'Optimal'

let client = null
let lastUpdateTime = 0

// Request browser notification permission
if ('Notification' in window && Notification.permission === 'default') {
  Notification.requestPermission()
}

const alertCooldowns = new Map()

// Evaluate raw sensor data to generate actionable insights
const evaluateActionableInsights = (temp, hum) => {
  const alerts = []

  // Check Humidity
  if (hum >= 70) {
    alerts.push({ severity: 'danger', message: `Danger: Critical Humidity (${hum.toFixed(1)}%). High mold risk.`, action: 'Open ventilations or start dehumidifiers immediately.' })
  } else if (hum > 65) {
    alerts.push({ severity: 'warning', message: `Warning: High Humidity (${hum.toFixed(1)}%).`, action: 'Monitor closely and consider ventilation.' })
  } else if (hum < 30) {
    alerts.push({ severity: 'danger', message: `Danger: Critical Low Humidity (${hum.toFixed(1)}%). Bean drying risk.`, action: 'Activate humidifiers immediately.' })
  } else if (hum < 40) {
    alerts.push({ severity: 'warning', message: `Warning: Low Humidity (${hum.toFixed(1)}%).`, action: 'Consider activating humidifiers.' })
  }

  // Check Temperature independently
  if (temp >= 30) {
    alerts.push({ severity: 'danger', message: `Danger: Critical High Temperature (${temp.toFixed(1)}°C). Quality loss risk.`, action: 'Turn on cooling systems immediately.' })
  } else if (temp >= 25) {
    alerts.push({ severity: 'warning', message: `Warning: High Temperature (${temp.toFixed(1)}°C).`, action: 'Ensure proper air circulation.' })
  } else if (temp < 10) {
    alerts.push({ severity: 'danger', message: `Danger: Critical Low Temperature (${temp.toFixed(1)}°C). Freezing risk.`, action: 'Turn on heating systems immediately.' })
  } else if (temp < 15) {
    alerts.push({ severity: 'warning', message: `Warning: Low Temperature (${temp.toFixed(1)}°C).`, action: 'Monitor for condensation.' })
  }

  const now = Date.now()
  const newAlerts = alerts.filter(alert => {
    const lastAlertTime = alertCooldowns.get(alert.message) || 0
    // 60-second cooldown per specific alert message to prevent spam and infinite popups
    if (now - lastAlertTime < 60000) return false 
    alertCooldowns.set(alert.message, now)
    return true
  })

  if (newAlerts.length > 0) {
    newAlerts.forEach(alert => {
      // Add to Notification Bell
      notifications.value.unshift({
        id: Date.now() + Math.random(),
        message: `${alert.message} ${alert.action}`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      })
      unreadCount.value++
    })
    
    // Keep only the last 20 notifications
    if (notifications.value.length > 20) {
      notifications.value.length = 20
    }
    
    // Show UI popup (if multiple trigger at once, just show the first one, they are all in the bell)
    activePopup.value = newAlerts[0]
    
    // Auto dismiss UI popup quickly
    if (popupTimeout) clearTimeout(popupTimeout)
    popupTimeout = setTimeout(() => {
      activePopup.value = null
    }, 4000) // Show for 4 seconds
  }
}

export function useMQTT() {

  const connect = () => {
    const brokerUrl = import.meta.env.VITE_MQTT_BROKER_URL || 'wss://250787cfd1a441c7bc9a72a0a5190bda.s1.eu.hivemq.cloud:8884/mqtt'
    const options = {
      username: import.meta.env.VITE_MQTT_USERNAME || 'YieldGuard',
      password: import.meta.env.VITE_MQTT_PASSWORD || 'Yieldguard@2026',
      clientId: 'yield_guard_web_' + Math.random().toString(16).substr(2, 8),
    }

    try {
      client = mqtt.connect(brokerUrl, options)

      client.on('connect', () => {
        isConnected.value = true
        connectionError.value = null
        const topic = import.meta.env.VITE_MQTT_TOPIC || 'yield/warehousezone1/environment'
        client.subscribe(topic, (err) => {
          if (err) console.error('Subscription error:', err)
        })
      })

      client.on('message', (topic, message) => {
        try {
          const envTopic = import.meta.env.VITE_MQTT_TOPIC || 'yield/warehousezone1/environment'
          if (topic === envTopic) {
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
            
            // Handle Notifications based on the 'status' field
            if (parsedData.status && parsedData.status !== lastStatus) {
              lastStatus = parsedData.status
              
              if (parsedData.status !== 'Optimal') {
                const alertMsg = `Alert: ${parsedData.status}`
                
                // Add to internal list
                notifications.value.unshift({
                  id: Date.now(),
                  message: alertMsg,
                  time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                })
                unreadCount.value++

                // Keep only the last 20 notifications
                if (notifications.value.length > 20) {
                  notifications.value.pop()
                }

                // Trigger Browser Push Notification
                if ('Notification' in window && Notification.permission === 'granted') {
                  new Notification('Yield Guard Alert', {
                    body: alertMsg,
                    icon: '/favicon.ico'
                  })
                }
              }
            }
            
            // Only update history and DB if we have valid values
            if (parsedData.temperature !== undefined && parsedData.humidity !== undefined) {
              updateHistory(parsedData.temperature, parsedData.humidity)
              saveToDatabase(parsedData)
              evaluateActionableInsights(parsedData.temperature, parsedData.humidity)
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

  // Save reading to Supabase
  let lastDbSaveTime = 0
  const saveToDatabase = async (data) => {
    const now = Date.now()
    if (now - lastDbSaveTime < 60000) return // Throttled to once per minute

    lastDbSaveTime = now
    try {
      const { error } = await supabase
        .from('sensor_readings')
        .insert([{
          temperature: data.temperature,
          humidity: data.humidity,
          heat_index: data.heatIndex,
          status: data.status || 'Optimal',
          warehouse_zone: 'warehousezone1'
        }])
      
      if (error) console.error('Error saving to Supabase:', error)
    } catch (err) {
      console.error('Failed to save sensor data:', err)
    }
  }

  const disconnect = () => {
    if (client) {
      client.end()
    }
  }

  const clearNotifications = () => {
    notifications.value = []
    unreadCount.value = 0
    lastStatus = 'Optimal' // Reset status so it can trigger again if needed
  }

  const resetUnreadCount = () => {
    unreadCount.value = 0
  }

  return {
    currentTemperature,
    currentHumidity,
    currentHeatIndex,
    historicalDataPoints,
    isConnected,
    connectionError,
    notifications,
    unreadCount,
    activePopup,
    connect,
    disconnect,
    clearNotifications,
    resetUnreadCount
  }
}
