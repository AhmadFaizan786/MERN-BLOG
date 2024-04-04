import React from 'react'
import { Link } from 'react-router-dom'

export const Header = () => {
  return (
    <header>
        <Link to ="" className="logo">
          BlogSphere
        </Link>
        <nav>
          <Link to ="/login" className="nav-link">
            Login
          </Link>
          <Link to ="/register" className="nav-link">
            Register
          </Link>
        </nav>
      </header>
  )
}
