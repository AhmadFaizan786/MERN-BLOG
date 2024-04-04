import React from "react";

export const Post = () => {
  return (
    <div className="post">
      <div className="blog-img">
        <img src="https://img.freepik.com/free-photo/business-women-signature-document_1388-90.jpg?size=626&ext=jpg"></img>
      </div>
      <div className="blog-text">
        <h2>My First Blog</h2>
        <p className="info">
          <a className="author">Faizan Ahmad</a>
          <time>2024-04-04 7:30</time>
        </p>
        <p className="description">
          Lorem ipsum" is a placeholder text commonly used to demonstrate the
          visual form of a document or a typeface without relying on meaningful
          content. Here's a 40-word iteration for you: "Lorem ipsum dolor sit
          amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut
          labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
          exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat
        </p>
      </div>
    </div>
  );
};
