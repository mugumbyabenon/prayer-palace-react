import logo from './logo.svg';
import './App.css';
import SignInSide from './screens/Login';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './screens/Home/Home';
import SignUp from './screens/Home/signup';
import PubliSermons from './screens/PublicSermons';

function App() {
  return (
    <BrowserRouter>
    <Routes>
    <Route path="/login" element={<SignInSide />} />
    <Route path="/" element={<Home />} />
    <Route path="/publicsermons" element={<PubliSermons />} />
    <Route path="/signup" element={<SignUp />} />
    </Routes>
  </BrowserRouter>
  );
}

export default App;
