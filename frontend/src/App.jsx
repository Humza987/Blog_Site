import * as React from "react";
import { ClerkProvider } from "@clerk/clerk-react";

import "./App.css";
import { Link, Route, Routes } from "react-router-dom";

import CreatePost from "./CreatePost";
import ViewPost from "./ViewPost";
import NavBar from "./NavBar";

import { useUser } from "@clerk/clerk-react";

import Home from "./Home";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

function App() {
  return (
    <>
      <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/:id" element={<ViewPost />} />
        </Routes>
      </ClerkProvider>
    </>
  );
}

export default App;
