import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./App.css";
import {
  SignOutButton,
  SignInButton,
  SignedIn,
  SignedOut,
  useUser,
} from "@clerk/clerk-react";

const CreatePost = () => {
  const { isSignedIn, user, isLoaded } = useUser();
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState();
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState();

  const navigate = useNavigate();

  // Use backend URL from environment variable
  const backendUrl = import.meta.env.VITE_REACT_APP_BACKEND_URL || "http://localhost:3000";

  useEffect(() => {
    if (isSignedIn && author === "") {
      if (!user.username) {
        setAuthor(user.emailAddresses[0].emailAddress);
      } else {
        setAuthor(user.username);
      }
    }
  }, [isSignedIn, user, author]);

  // Function to upload image to Cloudinary
  const uploadImage = async (imageFile) => {
    setUploading(true);
    try {
      const imageData = new FormData();
      imageData.append("file", imageFile);
      imageData.append("upload_preset", "blog_uploads");

      const response = await fetch(
        "https://api.cloudinary.com/v1_1/duxahieum/image/upload",
        {
          method: "POST",
          body: imageData,
        }
      );

      const data = await response.json();
      setUploading(false);

      return data.secure_url;
    } catch (error) {
      console.error("Error uploading image to Cloudinary:", error);
      setUploading(false);
      setError("Failed to upload image. Please try again.");
      return null;
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!title || !author || !summary || !content || (!image && !imageUrl)) {
      setError(true);
      return;
    }

    setError(false);

    try {
      let finalImageUrl = imageUrl;
      if (image && !imageUrl) {
        finalImageUrl = await uploadImage(image);
        if (!finalImageUrl) return;
      }

      const postData = {
        title,
        author,
        summary,
        content,
        imageUrl: finalImageUrl,
      };

      const response = await fetch(`${backendUrl}/api`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postData),
      });

      const data = await response.json();
      console.log("Success:", data);

      setTitle("");
      setAuthor("");
      setSummary("");
      setContent("");
      setImage(null);
      setImageUrl("");

      navigate("/");
    } catch (error) {
      console.error("Error:", error);
      setError("Failed to create post. Please try again.");
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setImage(file);
    setImageUrl("");

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // Preview URL could be used if desired
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      {!user && <h1>Please Sign in To Create A Post!</h1>}
      <SignedIn>
        <div>
          <form onSubmit={handleSubmit}>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                marginTop: "5%",
              }}
            >
              <h1 style={{ marginBottom: "3%" }}>
                Please Enter All Details and Press Submit To Create Your Blog!
              </h1>
              <h2 style={{ marginTop: "0%" }}>Author: {author}</h2>

              <input
                type="text"
                size="50"
                value={title}
                placeholder="Enter Title Here"
                onChange={(event) => setTitle(event.target.value)}
              />
              <textarea
                style={{ height: "100px", width: "30%" }}
                value={summary}
                placeholder="Enter Summary of Blog Here"
                onChange={(event) => setSummary(event.target.value)}
              />
              <textarea
                style={{ height: "100px", width: "30%" }}
                value={content}
                placeholder="Enter Blog Content Here"
                onChange={(event) => setContent(event.target.value)}
              />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />

              {uploading && <p>Uploading image...</p>}

              <button type="submit" disabled={uploading}>
                {uploading ? "Uploading..." : "Submit"}
              </button>

              {error && typeof error === "boolean" && (
                <div style={{ marginTop: "10px", color: "red" }}>
                  Please Fill out all Fields!
                </div>
              )}
              {error && typeof error === "string" && (
                <div style={{ marginTop: "10px", color: "red" }}>
                  {error}
                </div>
              )}
            </div>
          </form>
        </div>
      </SignedIn>
    </>
  );
};

export default CreatePost;