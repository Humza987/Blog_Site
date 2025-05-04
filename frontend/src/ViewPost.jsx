import { useEffect, useState } from "react";
import * as React from "react";

import "./App.css";
import { useParams } from "react-router-dom";

const ViewPost = () => {
  const { id } = useParams();
  const [data, setData] = useState([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/${id}`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        if (
          response.headers.get("content-type").indexOf("application/json") ===
          -1
        ) {
          throw new Error("Response is not JSON");
        }
        const data = await response.json();
        console.log(data);
        setData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(true);
      }
    };
    fetchData();
  }, [id]);

  return (
    <>
      {error ? (
        <div>Error fetching data.</div>
      ) : (
        <>
          {data.length !== 0 && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
              }}
            >
              <div className="item" key={data._id}>
                <div className="cont">
                  <div className="image2">
                    {/* Use Cloudinary URL directly instead of local path */}
                    <img
                      src={data.image}
                      alt={data.title}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/placeholder-image.jpg"; // Fallback image
                      }}
                    />
                  </div>
                </div>
                <div className="info">
                  <h1>{data.title}</h1>
                  <h2>Author: {data.author}</h2>
                  <p>{data.content}</p>
                </div>
              </div>
            </div>
          )}
          {data.length === 0 && <div>Loading...</div>}
        </>
      )}
    </>
  );
};

export default ViewPost;