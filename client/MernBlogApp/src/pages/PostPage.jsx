import React, { useState,useEffect } from 'react'
import {useParams} from 'react-router-dom'

function PostPage() {
  const {id} = useParams()
  const [postInfo, setpostInfo] = useState(null)
  useEffect(()=>{
    fetch(`http://localhost:4000/post/${id}`)
    .then(response =>{
      response.json().then(postInfo=>{
        setpostInfo(postInfo)
      })
    })
  },[]);

  if(!postInfo) return '';
  return (
    <div>
      <img src={'http://localhost:4000/${postInfo.cover}'}/>
    </div>
  )
}

export default PostPage