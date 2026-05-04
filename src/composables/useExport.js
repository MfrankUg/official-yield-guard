import { jsPDF } from 'jspdf'
import 'jspdf-autotable'
import { useMQTT } from './useMQTT'

export function useExport() {
  const { historicalDataPoints } = useMQTT()

  // Generate realistic mock data for extended periods (since we don't have a DB)
  const generateMockData = (days) => {
    const points = []
    const now = new Date()
    const pointsPerHour = 1 // 1 point per hour for older data to keep size manageable
    const totalPoints = days * 24 * pointsPerHour

    let currentTemp = 20.0
    let currentHum = 55.0

    for (let i = totalPoints; i > 0; i--) {
      const time = new Date(now.getTime() - i * 60 * 60 * 1000)
      
      // Add slight random walk to data
      currentTemp += (Math.random() - 0.5) * 2
      currentHum += (Math.random() - 0.5) * 5
      
      // Clamp values
      currentTemp = Math.max(15, Math.min(30, currentTemp))
      currentHum = Math.max(40, Math.min(80, currentHum))

      points.push({
        timestamp: time.toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
        temp: parseFloat(currentTemp.toFixed(1)),
        humidity: parseFloat(currentHum.toFixed(1))
      })
    }

    return points
  }

  const getCombinedData = (timeframe) => {
    let data = []
    if (timeframe === '1day') {
      data = generateMockData(1)
    } else if (timeframe === '1week') {
      data = generateMockData(7)
    } else if (timeframe === '1month') {
      data = generateMockData(30)
    }
    
    // Append actual live session data to the end
    const liveData = historicalDataPoints.value.map(dp => ({
      timestamp: dp.timestamp,
      temp: parseFloat(dp.temp).toFixed(1),
      humidity: parseFloat(dp.humidity).toFixed(1)
    }))

    return [...data, ...liveData]
  }

  const downloadCSV = (timeframe, reportName) => {
    const data = getCombinedData(timeframe)
    if (data.length === 0) {
      alert("No data available.")
      return
    }

    const headers = ['Timestamp', 'Temperature (°C)', 'Humidity (%)']
    const rows = data.map(dp => [dp.timestamp, dp.temp, dp.humidity])
    
    const csvContent = [
      headers.join(','),
      ...rows.map(e => e.join(','))
    ].join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', `${reportName}_${timeframe}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const downloadPDF = (timeframe, reportName) => {
    const data = getCombinedData(timeframe)
    if (data.length === 0) {
      alert("No data available.")
      return
    }

    const doc = new jsPDF()
    
    // Header
    doc.setFontSize(18)
    doc.text(`Yield Guard - ${reportName}`, 14, 22)
    
    doc.setFontSize(11)
    doc.setTextColor(100)
    doc.text(`Report Period: ${timeframe.toUpperCase()}`, 14, 30)
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 36)

    // Table
    const tableData = data.map(dp => [dp.timestamp, `${dp.temp} °C`, `${dp.humidity} %`])
    
    doc.autoTable({
      startY: 45,
      head: [['Timestamp', 'Temperature', 'Humidity']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [59, 130, 246] }, // Tailwind blue-500
      styles: { fontSize: 9 }
    })

    doc.save(`${reportName}_${timeframe}.pdf`)
  }

  return {
    downloadCSV,
    downloadPDF
  }
}
