# PredictAI

PredictAI is an AI-powered predictive maintenance SaaS platform built with Next.js. It enables real-time sensor data visualization, anomaly detection, and AI-driven maintenance recommendations to minimize downtime and optimize asset performance.

This project is led by **George Kairu Maina**, CTO at **Milleast Global**.

---

## 🚀 Features

-   **Real-time Data Visualization** — Stream and display live sensor data from connected devices.
-   **AI Anomaly Detection** — Automatically detect unusual patterns in equipment performance.
-   **Maintenance Recommendations** — Get AI-generated suggestions for preventive maintenance.
-   **Interactive Chatbot** — AI assistant for quick queries and support.
-   **User Authentication** — Secure signup/login with session handling.
-   **Responsive UI** — Built with Tailwind CSS and ShadCN for a modern, mobile-first design.

## 🛠 Tech Stack

-   **Frontend**: Next.js, React, TypeScript
-   **AI Integration**: Genkit
-   **Backend**: Firebase (Authentication, Firestore, Hosting)
-   **Styling**: Tailwind CSS, ShadCN UI
-   **Schema Validation**: Zod
-   **Linting**: ESLint

## 📂 Project Structure

```
src/
 ├── ai/                  # AI workflows and logic
 │    ├── flows/           # Anomaly detection, recommendations, chat flows
 │    ├── dev.ts
 │    └── genkit.ts
 ├── app/                 # Next.js app pages and routing
 │    ├── (main)/          # Main application routes
 │    ├── (auth)/          # Authentication routes (login, signup)
 │    ├── globals.css
 │    └── layout.tsx
 ├── components/          # Reusable UI components
 │    └── ui/              # ShadCN UI components
 ├── hooks/               # Custom React hooks
 ├── lib/                 # Utility functions and libraries (Firebase, etc.)
 └── types/               # TypeScript type definitions
```

## ⚙️ Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/PredictAI.git
    cd PredictAI
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the root directory and add your Firebase project configuration and a Genkit API key.

    ```env
    # Firebase Environment Variables
    NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
    NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

    # Genkit/Gemini API Key
    GEMINI_API_KEY=your_gemini_api_key
    ```

## 🖥 Running Locally

To run the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:9002`.

## 🚢 Deployment

This project is configured for deployment on Firebase Hosting.

1.  **Build the application:**
    ```bash
    npm run build
    ```

2.  **Deploy to Firebase:**
    Make sure you have the Firebase CLI installed and are logged in.
    ```bash
    firebase deploy --only hosting
    ```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/new-amazing-feature`).
3.  Make your changes and commit them (`git commit -m 'Add some amazing feature'`).
4.  Push to the branch (`git push origin feature/new-amazing-feature`).
5.  Open a pull request.

## 📜 License

This project is licensed under the MIT License — see the `LICENSE` file for details.
