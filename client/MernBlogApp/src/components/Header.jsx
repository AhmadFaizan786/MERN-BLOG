import React, { useContext } from 'react'
import { useEffect,useState } from 'react'
import { Link} from 'react-router-dom'
import { UserContext } from '../contexts/UserContext'

export const Header=()=>{

  // const [username, setusername] = useState(null)
  const {setuserInfo,userInfo} = useContext(UserContext);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/profile`,{credentials:'include'}).then(response=>{
      response.json().then(userInfo=>{
        setuserInfo(userInfo)
      })
    })
  }, [])

  function handleLogout(){
    fetch(`${import.meta.env.VITE_API_BASE_URL}/logout`,{
      credentials:'include',
      method:'POST',
    });
    setuserInfo(null)
  }

  const username = userInfo?.username
  
  return (
    <header>
        <Link to ="" className="logo">
          B L <svg className='globe-logo' 
                   xmlns="http://www.w3.org/2000/svg" 
                   viewBox="0 0 24 24" 
                   fill="currentColor"
                >
                <path 
                   d="M2.04932 12.9999H7.52725C7.70624 16.2688 8.7574 19.3053 10.452 21.8809C5.98761 21.1871 2.5001 17.5402 2.04932 12.9999ZM2.04932 10.9999C2.5001 6.45968 5.98761 2.81276 10.452 2.11902C8.7574 4.69456 7.70624 7.73111 7.52725 10.9999H2.04932ZM21.9506 10.9999H16.4726C16.2936 7.73111 15.2425 4.69456 13.5479 2.11902C18.0123 2.81276 21.4998 6.45968 21.9506 10.9999ZM21.9506 12.9999C21.4998 17.5402 18.0123 21.1871 13.5479 21.8809C15.2425 19.3053 16.2936 16.2688 16.4726 12.9999H21.9506ZM9.53068 12.9999H14.4692C14.2976 15.7828 13.4146 18.3732 11.9999 20.5915C10.5852 18.3732 9.70229 15.7828 9.53068 12.9999ZM9.53068 10.9999C9.70229 8.21709 10.5852 5.62672 11.9999 3.40841C13.4146 5.62672 14.2976 8.21709 14.4692 10.9999H9.53068Z"
                >
                </path>
              </svg>
          G S P H E R E
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
