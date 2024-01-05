import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AdopcionComponent from './Components/AdopcionComponent';
import './App.css';

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<AdopcionComponent></AdopcionComponent>}></Route>
    </Routes>
    </BrowserRouter>
  );
}

export default App;
