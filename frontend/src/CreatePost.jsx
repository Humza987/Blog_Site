import React from 'react';

import { useEffect, useState } from 'react'
import {useNavigate} from "react-router-dom"

import './App.css'

const CreatePost = () => {

    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [body, setBody] = useState('');

    const navigate = useNavigate();

    // const [button, setButton] = useState(0);
    const handleSubmit = (event) => {
        event.preventDefault(); 
        fetch('/api', {
          method: 'POST',
          body: JSON.stringify({ title, author, body }),
          headers: { 'Content-Type': 'application/json' }
        })
        .then(response => {
        //   setButton(button + 1)
          setTitle('');
          setAuthor('');
          setBody('');
    
          console.log(response);
          navigate("/");
        })
        .catch(error => {
          console.error(error);
        });
      };

  return (

    <>
   <div>
<form onSubmit={handleSubmit}>
  <div style={{display: 'flex', justifyContent: 'center',
  alignItems: 'center', flexDirection: 'column'}}>
  <input  type='text'  size="50" value={title} placeholder='Enter Title Here' onChange={(event) => setTitle(event.target.value)}/>
  <input  type='text' size="50" value={author}placeholder='Enter Author Here' onChange={(event) => setAuthor(event.target.value)}/>
  <textarea style={{height: '100px', width: '30%'}} value={body} placeholder='Enter Post Text Here' onChange={(event) => setBody(event.target.value)}/>
  <button type="submit">Submit</button>
  </div>
</form>
    </div>


    </>
 
  );
};

export default CreatePost;