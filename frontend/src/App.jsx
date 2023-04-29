import { useEffect, useState } from 'react'
import * as React from 'react';

import './App.css'




function App() {
  const [data, setData] = useState([]);

  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [body, setBody] = useState('');

  const [postId, setPostId] = useState('');

  const [button, setButton] = useState(0);




  useEffect(()=>{
    fetch("/api").then(
      response => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        if (response.headers.get("content-type").indexOf("application/json") === -1) {
          throw new Error("Response is not JSON");
        }
        return response.json();
      }).then (
      data => {
        setData(data)  
        console.log(data)
      }
    )
  },[button])

  const handleClick = (postId) => {
    console.log(button)
    fetch(`api/${postId}`, {
      method: 'DELETE'
    })
     .then(response => response.json())
      .then(data => {
        console.log(data);
        setButton(button + 1)
      });
      setButton(button + 1)

  };

  const handleSubmit = (event) => {
    event.preventDefault(); 
    fetch('/api', {
      method: 'POST',
      body: JSON.stringify({ title, author, body }),
      headers: { 'Content-Type': 'application/json' }
    })
    .then(response => {
      setButton(button + 1)
      setTitle('');
      setAuthor('');
      setBody('');

      console.log(response);
    })
    .catch(error => {
      console.error(error);
    });
  };
  if (data === null) {
    return <div>Loading...</div>;
  }
  return (
    <>

  <div className="title">
   Humza's Blog Site!!!
  </div>

<div  style={{display: 'flex', justifyContent: 'center',
  alignItems: 'center', flexDirection: 'column'}}>
      {data.map(post => (
        <div className="blogitem" key={post._id}>
          <h3>Title: {post.title}</h3>
          <h4>Author: {post.author} </h4>
          <p> Post: {post.body}</p>
          <button onClick={() => {handleClick(post._id);}}>Delete</button>
        </div>
      ))}
</div>
  
<form onSubmit={handleSubmit}>
  <div style={{display: 'flex', justifyContent: 'center',
  alignItems: 'center', flexDirection: 'column'}}>
  <input  type='text'  size="50" value={title} placeholder='Enter Title Here' onChange={(event) => setTitle(event.target.value)}/>
  <input  type='text' size="50" value={author}placeholder='Enter Author Here' onChange={(event) => setAuthor(event.target.value)}/>
  <input  type='text'  size="50" style={{height: '100px',}} value={body} placeholder='Enter Post Text Here' onChange={(event) => setBody(event.target.value)}/>
  <button type="submit">Submit</button>
  </div>
</form>

     </>
  )
}

export default App