import React from 'react'
import { Post } from '../components/Post'
import { useEffect,useState } from 'react'

function HomePage() {

  const [posts, setposts] = useState([])

  useEffect(() => {
    fetch('https://mern-blog-bqop.onrender.com/post').then(response => {
      response.json().then(posts=>{
        setposts(posts)
      })
    })
  }, [])
  
  return (
    <>
      {posts.length>0 &&  posts.map(post=>(
        <Post {...post}/>
      ))}
    </>
  )
}

export default HomePage