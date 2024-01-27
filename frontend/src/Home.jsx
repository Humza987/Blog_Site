import { useEffect, useState } from 'react'
import * as React from 'react';

import './App.css'

function Home() {
    const [data, setData] = useState([]);

    const [postId, setPostId] = useState('');

    const [button, setButton] = useState(0);




    useEffect(() => {
        fetch("/api").then(
            response => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                if (response.headers.get("content-type").indexOf("application/json") === -1) {
                    throw new Error("Response is not JSON");
                }
                return response.json();
            }).then(
                data => {
                    setData(data)
                    console.log(data)
                }
            )
    }, [button])

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

    if (data === null) {
        return <div>Loading...</div>;
    }
    return (
        <>

            <div className="title">
                Humza's Blog Site!!!
            </div>

            <div style={{
                display: 'flex', justifyContent: 'center',
                alignItems: 'center', flexDirection: 'column'
            }}>
                {data.map(post => (
                    <div className="blogitem" key={post._id}>
                        <h3>Title: {post.title}</h3>
                        <h4>Author: {post.author} </h4>
                        <p> Post: {post.body}</p>
                        <button onClick={() => { handleClick(post._id); }}>Delete</button>
                    </div>
                ))}
            </div>

        </>
    )
}

export default Home