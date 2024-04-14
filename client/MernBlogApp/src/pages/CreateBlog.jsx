import React from "react";
import { useState } from "react";
import { Navigate } from "react-router-dom";
import Editor from "../components/Editor";

export const CreateBlog = () => {
  const [title, settitle] = useState("");
  const [summary, setsummary] = useState("");
  const [content, setcontent] = useState("");
  const [files, setfiles] = useState("");
  const [redirect, setredirect] = useState(false);

  async function createNewBlog(e) {
    const data = new FormData();
    data.set("title", title);
    data.set("summary", summary);
    data.set("content", content);
    data.set("file", files[0]);
    e.preventDefault();
    console.log(files);
    const response = await fetch("https://mern-blog-backend-vq70.onrender.com/post", {
      method: "POST",
      body: data,
      credentials: "include",
    });
    if (response.ok) {
      setredirect(true);
    }
  }

  if (redirect) {
    return <Navigate to={"/"} />;
  }

  return (
    <form onSubmit={createNewBlog}>
      <input
        type="title"
        placeholder={"Title"}
        value={title}
        onChange={(e) => {
          settitle(e.target.value);
        }}
      />
      <input
        type="summary"
        placeholder={"Summary"}
        value={summary}
        onChange={(e) => {
          setsummary(e.target.value);
        }}
      />
      <input
        type="file"
        onChange={(e) => {
          setfiles(e.target.files);
        }}
      />
      <Editor value={content} onChange={setcontent} />

      <button>Create Blog</button>
    </form>
  );
};
