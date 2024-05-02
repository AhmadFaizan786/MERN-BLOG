import React, { useContext } from 'react'
import { useEffect,useState } from 'react'
import { Link} from 'react-router-dom'
import { UserContext } from '../contexts/UserContext'

export const Header=()=>{

  // const [username, setusername] = useState(null)
  const {setuserInfo,userInfo} = useContext(UserContext);

  useEffect(() => {
    fetch('https://mern-blog-bqop.onrender.com/profile',{credentials:'include'}).then(response=>{
      response.json().then(userInfo=>{
        setuserInfo(userInfo)
      })
    })
  }, [])

  function handleLogout(){
    fetch('https://mern-blog-bqop.onrender.com/logout',{
      credentials:'include',
      method:'POST',
    });
    setuserInfo(null)
  }

  const username = userInfo?.username
  
  return (
    <header>
        <Link to ="" className="logo">
          B L O G S P H E R E
        </Link>
        <nav>
        {username && (
          <>
            <Link to="/create" className='nav-link'>Create Blog</Link>
            <a onClick={handleLogout} className='nav-link'>Logout</a>
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
