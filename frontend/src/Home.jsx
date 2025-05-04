// import { useEffect, useState } from "react";
// import * as React from "react";

// import "./App.css";
// import {
//   SignOutButton,
//   SignInButton,
//   SignedIn,
//   SignedOut,
//   useUser,
// } from "@clerk/clerk-react";
// import { Link } from "react-router-dom";

// function Home() {
//   const [data, setData] = useState([]);

//   const [postId, setPostId] = useState("");

//   const [button, setButton] = useState(0);

//   const { isSignedIn, user, isLoaded } = useUser();

//   useEffect(() => {
//     fetch("/api")
//       .then((response) => {
//         if (!response.ok) {
//           throw new Error("Network response was not ok");
//         }
//         if (
//           response.headers.get("content-type").indexOf("application/json") ===
//           -1
//         ) {
//           throw new Error("Response is not JSON");
//         }
//         console.log(response);
//         return response.json();
//       })
//       .then((data) => {
//         setData(data);
//         console.log(data);
//       });
//   }, [button]);

//   const handleClick = (postId) => {
//     console.log(button);
//     fetch(`api/${postId}`, {
//       method: "DELETE",
//     })
//       .then((response) => response.json())
//       .then((data) => {
//         console.log(data);
//         setButton(button + 1);
//       });
//     setButton(button + 1);
//   };

//   const viewBlog = (postId) => {
//     fetch(`api/${postId}`, {
//       method: "GET",
//     })
//       .then((response) => response.json())
//       .then((data) => {
//         console.log(data);
//       });
//   };

//   if (data === null) {
//     return <div>Loading...</div>;
//   }
//   return (
//     <>
//       <div className="Links"> </div>

//       <div
//         style={{
//           display: "flex",
//           justifyContent: "center",
//           alignItems: "center",
//           flexDirection: "column",
//           marginTop: "5px"
//         }}
//       >
      

//         {data.map((post) => (
//           <div className="block">
//             <div className="blogitem" key={post._id}>
//               <div className="image">
//                 <img
//                   src={`/images/${post.image}`}
//                   alt="no image"
//                 ></img>
//               </div>
//               <div className="information">
//                 <h1>{post.title}</h1>
//                 <h2>{"@"+post.author} </h2>
//                 <p> Summary: {post.summary}</p>

//                 <Link to={`/${post._id}`}>
//                   <button>View blog</button>
//                 </Link>
//                 {user?.username === post.author && (
//                   <button style={{marginLeft: '2%'}}
//                     onClick={() => {
//                       handleClick(post._id);
//                     }}
//                   >
//                     Delete
//                   </button>
//                 )}
//               </div>
//             </div>
//             <div
//               style={{ width: "100%", height: "2px", backgroundColor: "black" }}
//             ></div>
//           </div>
//         ))}
//       </div>
//     </>
//   );
// }

// export default Home;


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

  useEffect(() => {
    fetch("/api")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        if (
          response.headers.get("content-type").indexOf("application/json") ===
          -1
        ) {
          throw new Error("Response is not JSON");
        }
        return response.json();
      })
      .then((data) => {
        setData(data);
      })
      .catch(error => {
        console.error("Error fetching data:", error);
      });
  }, [refreshTrigger]);

  const handleClick = (postId) => {
    fetch(`api/${postId}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((data) => {
        // Increment refreshTrigger to cause useEffect to run again
        setRefreshTrigger(prev => prev + 1);
      })
      .catch(error => {
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
          marginTop: "5px"
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
                    e.target.src = "/placeholder-image.jpg"; // Fallback image
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