import React from "react";
import { format, addDays } from "date-fns";
import { Link } from "react-router-dom";

export const Post = ({_id, title, summary, content, cover, createdAt, author }) => {
  return (
    <div className="post">
      <div className="blog-img">
        <Link to={`/post/${_id}`}>
          <img src={"https://mern-blog-backend-vq70.onrender.com/" + cover}></img>
        </Link>
      </div>
      <div className="blog-text">
        <Link to={`/post/${_id}`}>
          <h2>{title}</h2>
        </Link>
        <p className="info">
          <a className="author">{author.username}</a>
          <time>{format(new Date(createdAt), "MM/dd/yyyy  hh:mm a")}</time>
        </p>
        <p className="description">{summary}</p>
      </div>
    </div>
  );
};
