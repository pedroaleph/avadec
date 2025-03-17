import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.scss';
import './core/assets/styles/custom.scss';
import Home from 'pages/Home';

function App() {
    return (
        <div className="App">
            <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons"/>
            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" />
            <BrowserRouter>
                <Routes>
                    <Route path="/*" element={<Home />} />
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;
