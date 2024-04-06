import React from "react";
import { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Navigate } from "react-router-dom";


const modules = {
  toolbar: [
    [{ header: [1, 2, false] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" },
    ],
    ["link", "image"],
    ["clean"],
  ],
};

const formats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "indent",
  "link",
  "image",
];

export const CreateBlog = () => {
  const [title, settitle] = useState("");
  const [summary, setsummary] = useState("");
  const [content, setcontent] = useState("");
  const [files, setfiles] = useState("");
  const [redirect, setredirect] = useState(false)

  async function createNewBlog(e) {
    const data = new FormData();
    data.set("title", title);
    data.set("summary", summary);
    data.set("content", content);
    data.set("file", files[0]);
    e.preventDefault();
    console.log(files);
    const response = await fetch("http://localhost:4000/post", {
      method: "POST",
      body: data,
      credentials:'include'
    });
    if(response.ok){
      setredirect(true)
    }
  }

  if(redirect){
    return <Navigate to={'/'}/>
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
      <ReactQuill
        value={content}
        onChange={setcontent}
        modules={modules}
        formats={formats}
      />
      <button>Create Blog</button>
    </form>
  );
};
