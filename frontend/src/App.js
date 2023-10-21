import './App.css';

import {
  BrowserRouter,
  Routes, // instead of "Switch"
  Route,
} from "react-router-dom";

import Signup from './components/pages/signup';
import Login from './components/pages/login';
import Home from './components/pages/home';
import { UserProvider } from './utils/auth';

function App() {
  
  return (
    <div className="App p-8">
      <UserProvider>

        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} ></Route>
            <Route path="/signup" element={<Signup />} ></Route>
            <Route path='/login' element={<Login />} />
          </Routes>
        </BrowserRouter>
      </UserProvider>

    </div>
  );
}

export default App;
