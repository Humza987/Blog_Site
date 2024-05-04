import * as React from 'react';
import { ClerkProvider } from '@clerk/clerk-react';

import './App.css'
import { Link, Route, Routes, } from "react-router-dom"

import CreatePost from './CreatePost';
import Home from './Home';

const PUBLISHABLE_KEY =  import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key")
}

function App() {

  return (
    <>
      <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <div className="Links">
        <Link to="/"> Home </Link>
        <Link to="create-post"> Create a Post</Link>
      </div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create-post" element={<CreatePost />} />
      </Routes>
      </ClerkProvider>
    </>
  )
}

export default App