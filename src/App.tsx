import { FC } from "react"
import {
    BrowserRouter as Router,
    Routes,
    Route
} from "react-router-dom"


import HomePage from "./pages/home"

import "./global.scss"

const App: FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage/>}/>
            </Routes>
        </Router>
    )
}

export default App