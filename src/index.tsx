import ReactDOM from "react-dom/client"
import React from "react"

import reportWebVitals from "./reportWebVitals"
import App from "./App"

const root = ReactDOM.createRoot(
    document.getElementById("root") as HTMLElement
)

root.render(
    <React.StrictMode>
        <App/>
    </React.StrictMode>
)

reportWebVitals()