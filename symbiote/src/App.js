import React from 'react';
import { Routes, Route } from 'react-router-dom';
// import Header from './Header';
// import Footer from './Footer';
import Landing from './Pages/Landing';
import './App.css';

function App() {
  return (
    <div>
      {/* <Header /> */}
        <Routes>
          <Route path="/" element={<Landing />} />
        </Routes>
      {/* <Footer /> */}
    </div>
  );
}

export default App;
