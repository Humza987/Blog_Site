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
      // Create a FormData object for the image upload
      const imageData = new FormData();
      imageData.append("file", imageFile);
      imageData.append("upload_preset", "blog_uploads"); // Create an unsigned upload preset in your Cloudinary dashboard
      
      // Upload to Cloudinary
      const response = await fetch(
        "https://api.cloudinary.com/v1_1/duxahieum/image/upload",
        {
          method: "POST",
          body: imageData,
        }
      );
      
      const data = await response.json();
      setUploading(false);
      
      // Return the secure URL of the uploaded image
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

    // Validate form fields
    if (!title || !author || !summary || !content || (!image && !imageUrl)) {
      setError(true);
      return;
    }
    
    setError(false);
    
    try {
      // If there's a new image selected and not already uploaded
      let finalImageUrl = imageUrl;
      if (image && !imageUrl) {
        finalImageUrl = await uploadImage(image);
        if (!finalImageUrl) return; // Stop if image upload failed
      }
      
      // Create post data
      const postData = {
        title,
        author,
        summary,
        content,
        imageUrl: finalImageUrl, // Use the Cloudinary URL instead of a file
      };
      
      // Send post data to your API
      const response = await fetch("/api", {
        method: "POST",
        body: JSON.stringify(postData),
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();
      console.log("Success:", data);

      // Reset form fields
      setTitle("");
      setAuthor("");
      setSummary("");
      setContent("");
      setImage(null);
      setImageUrl("");

      navigate("/"); // Redirect if successful
    } catch (error) {
      console.error("Error:", error);
      setError("Failed to create post. Please try again.");
    }
  };

  // Handle image selection and preview
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setImage(file);
    setImageUrl(""); // Clear previous URL when new image is selected
    
    // Optional: You can also create a preview URL
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // This is just for preview, not the final Cloudinary URL
        const previewUrl = reader.result;
        // You could set this to state if you want to show a preview
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