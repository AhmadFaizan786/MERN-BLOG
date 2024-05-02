import React, { useEffect } from "react";
import { useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import Editor from "../components/Editor";

function EditPost() {
  const { id } = useParams();
  const [title, settitle] = useState("");
  const [summary, setsummary] = useState("");
  const [content, setcontent] = useState("");
  const [files, setfiles] = useState("");
  const [redirect, setredirect] = useState(false);

  useEffect(() => {
    fetch(`https://mern-blog-bqop.onrender.com/post/`+id).then((response) => {
      response.json().then((postInfo) => {
        settitle(postInfo.title);
        setsummary(postInfo.summary);
        setcontent(postInfo.content);
      });
    });
  }, []);

  async function updatePost(e) {
    e.preventDefault();
    const data = new FormData();
    data.set("title", title);
    data.set("summary", summary);
    data.set("content", content);
    data.set("id",id)
    if (files?.[0]) {
      data.set("file", files?.[0]);
    }
    const response = await fetch(`https://mern-blog-bqop.onrender.com/post`, {
      method: "PUT",
      body: data,
      credentials: "include",
    });
    if (response.ok) {
      setredirect(true);
    }
  }

  if (redirect) {
    return <Navigate to={"/post/" + id} />;
  }

  return (
    <form onSubmit={updatePost}>
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
      <button>Update Blog</button>
    </form>
  );
}

export default EditPost;
