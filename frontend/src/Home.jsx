import { useEffect, useState } from "react";
import * as React from "react";
import "./App.css";
import {
  SignOutButton,
  SignInButton,
  SignedIn,
  SignedOut,
  useUser,
} from "@clerk/clerk-react";
import { Link } from "react-router-dom";

function Home() {
  const [data, setData] = useState([]);
  const [postId, setPostId] = useState("");
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { isSignedIn, user, isLoaded } = useUser();

  // Use backend URL from environment variable
  const backendUrl = import.meta.env.VITE_REACT_APP_BACKEND_URL; 
  
  useEffect(() => {
    fetch(`${backendUrl}/api`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        if (
          response.headers.get("content-type")?.indexOf("application/json") === -1
        ) {
          throw new Error("Response is not JSON");
        }
        return response.json();
      })
      .then((data) => {
        setData(data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [refreshTrigger]);

  const handleClick = (postId) => {
    fetch(`${backendUrl}/api/${postId}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((data) => {
        setRefreshTrigger((prev) => prev + 1);
      })
      .catch((error) => {
        console.error("Error deleting post:", error);
      });
  };

  if (data === null) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="Links"></div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          marginTop: "5px",
        }}
      >
        {data.map((post) => (
          <div className="block" key={post._id}>
            <div className="blogitem">
              <div className="image">
                <img
                  src={post.image}
                  alt={post.title}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/placeholder-image.jpg";
                  }}
                />
              </div>
              <div className="information">
                <h1>{post.title}</h1>
                <h2>{"@" + post.author}</h2>
                <p>Summary: {post.summary}</p>
                <Link to={`/${post._id}`}>
                  <button>View blog</button>
                </Link>
                {user?.username === post.author && (
                  <button
                    style={{ marginLeft: "2%" }}
                    onClick={() => {
                      handleClick(post._id);
                    }}
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
            <div
              style={{ width: "100%", height: "2px", backgroundColor: "black" }}
            ></div>
          </div>
        ))}
      </div>
    </>
  );
}

export default Home;