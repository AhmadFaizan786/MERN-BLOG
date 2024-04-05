import React, { useContext } from 'react'
import { useEffect,useState } from 'react'
import { Link, json } from 'react-router-dom'
import { UserContext } from '../contexts/UserContext'

export const Header=()=>{

  // const [username, setusername] = useState(null)
  const {setuserInfo,userInfo} = useContext(UserContext)

  useEffect(() => {
    fetch('http://localhost:4000/profile',{credentials:'include'}).then(response=>{
      response.json().then(userInfo=>{
        setuserInfo(userInfo)
      })
    })
  }, [])

  function handleLogout(){
    fetch('http://localhost:4000/logout',{
      credentials:'include',
      method:'POST',
    });
    setuserInfo(null)
  }

  const username = userInfo?.username
  
  return (
    <header>
        <Link to ="" className="logo">
          BlogSphere
        </Link>
        <nav>
        {username && (
          <>
            <Link to="/create">Create Blog</Link>
            <a onClick={handleLogout}>Logout</a>
          </>
        )}
        {
          !username && (
            <>
            <Link to ="/login" className="nav-link">
            Login
          </Link>
          <Link to ="/register" className="nav-link">
            Register
          </Link>
            </>
          )
        }
        </nav>
      </header>
  )
}
