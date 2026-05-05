# Yield Guard

![Yield Guard Banner](https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?q=80&w=2070&auto=format&fit=crop)

Yield Guard is a state-of-the-art agricultural monitoring and management system designed to optimize crop storage and warehouse conditions. Leveraging real-time data, AI-driven insights, and a multilingual interface, Yield Guard empowers farmers and warehouse managers to make data-backed decisions that prevent spoilage and maximize yield quality.

---

## Key Features

- **Real-time Dashboard**: Monitor temperature, humidity, and moisture levels in real-time via MQTT integration.
- **AI Voice Assistant**: An intelligent chat interface powered by Groq and Whisper for voice-to-text agricultural consulting.
- **Interactive Warehouse Map**: Visualize the physical layout of your storage facility with real-time sensor status overlays.
- **Historical Analytics**: Deep-dive into historical data with interactive charts and comprehensive logs.
- **Professional Reporting**: Export detailed condition reports to PDF for auditing and long-term tracking.
- **Multilingual Support**: Fully localized interface supporting English, Swahili, and Luganda.
- **Premium UI/UX**: A modern, responsive design featuring dark mode, glassmorphism, and smooth micro-animations.

---

## Tech Stack

- **Frontend**: [Vue.js 3](https://vuejs.org/) (Composition API)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **State/Logic**: Vue Composables
- **Real-time Data**: [MQTT.js](https://github.com/mqttjs/MQTT.js)
- **AI Integration**: [Groq SDK](https://groq.com/) (Whisper for Voice, Llama for Chat)
- **Data Visualization**: [Chart.js](https://www.chartjs.org/) & [Vue-Chartjs](https://vue-chartjs.org/)
- **Icons**: [Lucide Vue Next](https://lucide.dev/)
- **Document Export**: [jsPDF](https://github.com/parallax/jsPDF)

---

## Project Structure

```text
official-yield-guard/
├── 📁 public/                 # Static assets (images, icons)
├── 📁 src/
│   ├── 📁 assets/             # Global styles and assets
│   ├── 📁 components/         # Reusable UI Components
│   │   ├── 📄 AIChatInterface.vue   # AI Chat UI
│   │   ├── 📄 ConditionChart.vue    # Data visualization
│   │   ├── 📄 LanguageDropdown.vue  # i18n switcher
│   │   └── 📄 MetricCard.vue        # Dashboard stats
│   ├── 📁 composables/        # Core business logic
│   │   ├── 📄 useLanguage.js        # Localization engine
│   │   ├── 📄 useMQTT.js            # Real-time data handling
│   │   └── 📄 useExport.js          # PDF generation logic
│   ├── 📁 router/             # Vue Router configuration
│   ├── 📁 views/              # Page components
│   │   ├── 📄 LandingPage.vue       # Project intro
│   │   ├── 📄 Dashboard.vue         # Real-time monitoring
│   │   ├── 📄 AIAssistant.vue       # AI consultation
│   │   └── 📄 WarehouseMap.vue      # Facility visualization
│   ├── 📄 App.vue             # Root component
│   └── 📄 main.js             # Entry point
├── 📄 .env.local              # API Keys & Configuration
├── 📄 index.html              # HTML Template
├── 📄 package.json            # Dependencies & Scripts
└── 📄 vite.config.js          # Vite configuration
```

---

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/MfrankUg/official-yield-guard.git
   ```
2. Navigate to the project directory:
   ```bash
   cd official-yield-guard
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

### Configuration
Create a `.env.local` file in the root directory and add your API keys:
```env
VITE_GROQ_API_KEY=your_groq_api_key_here
VITE_MQTT_BROKER_URL=your_mqtt_url_here
```

### Development
Start the development server:
```bash
npm run dev
```

### Build
To create a production build:
```bash
npm run build
```

---

## Localization

Yield Guard is built to be accessible. Users can toggle between languages seamlessly:
- **English**: International standard.
- **Luganda**: For local regional support in Uganda.
- **Swahili**: Supporting the wider East African community.

---

## Security & Privacy

Yield Guard handles agricultural data with care. AI interactions are processed through secure endpoints, and real-time sensor data is encrypted via MQTT protocols where applicable.

---

## Author

**Frank Muhindo**
- GitHub: [@MfrankUg](https://github.com/MfrankUg)
- Role: Lead Developer & Designer

---

## License

This project is licensed under the MIT License.
