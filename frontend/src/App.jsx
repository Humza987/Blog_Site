import * as React from 'react';

import './App.css'
import { Link, Route, Routes, } from "react-router-dom"

import CreatePost from './CreatePost';
import Home from './Home';


function App() {

  return (
    <>
      <div className="Links">
        <Link to="/"> Home </Link>
        <Link to="create-post"> Create a Post</Link>
      </div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create-post" element={<CreatePost />} />
      </Routes>
    </>
  )
}

export default App