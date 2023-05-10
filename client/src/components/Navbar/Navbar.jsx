import { useState, useEffect } from 'react'
import { Link, NavLink } from "react-router-dom"
import { useSelector, useDispatch } from 'react-redux'
import { selectUser, setUser, clearUser } from '../../store.js'
import { getSessionCookie, fetchCookie } from '../../utils/useCookies.js'

import Logout from '../Logout/Logout.jsx'
import Logo from '../Logo/Logo'
import Menu from './Menu'
import './menu.min.css'


const Navbar = () => {

   const [isLoggedIn, setIsLoggedIn] = useState(false)
   
   const cookie = getSessionCookie()
   const dispatch = useDispatch()
   const user = useSelector(selectUser)
   const activeClassName = "uk-text-warning"
   console.log(user)
   
   useEffect(() => {

      if(cookie && user.data !== null) {}
      
      else if (cookie) {
         const getData = async () => {
            try {
               const data = await fetchCookie()
               dispatch(setUser(data))
            } 
            catch (error) { 
               dispatch(clearUser())
               /* console.error(error) // too much information */ 
            }
         }
         getData()
      }

      else dispatch(clearUser())
      
      setIsLoggedIn(true)
   }, [])

   return (
      <nav className="uk-navbar-container">
         <div className="uk-container">
            <div data-uk-navbar="mode: click">

               {/* LEFT Navbar */}
               <div className="uk-navbar-left uk-margin-right">
                  {/* LOGO */}
                  <Link className="uk-navbar-item uk-logo" to="/" aria-label="Back to Home">
                     <Logo/>
                  </Link> 
                  {/* USER MENU (conditional) */} 
                  <div> {/* [TODO]: Pass this entire div on a componente */}
                     { user.data !== null 
                        ? <>
                           <a href="#">
                              <img className="uk-border-circle" width="40" height="40" src={user.data.avatar} alt="Avatar" />
                           </a>
                           <div uk-dropdown="mode: click">
                              <ul className="uk-nav uk-dropdown-nav">
                                 <li className="uk-margin-small-bottom">
                                    <span>
                                       Hola <strong className="uk-text-uppercase">{user.data.firstname}</strong> !
                                    </span>
                                 </li>
                                 <li className="uk-nav-divider"></li>
                                 <Link to="/messages" className="uk-flex uk-flex-middle uk-link-reset">
                                    <span className="uk-margin-small-right" data-uk-icon="mail"></span>
                                    <span>Messages</span>
                                 </Link>
                                 <li className="uk-flex uk-flex-middle uk-hidden">
                                    <span className="uk-margin-small-right" data-uk-icon="settings"></span>
                                    <a href="#">Account</a>
                                 </li>
                                 <li className="uk-flex uk-flex-middle">
                                    <span className="uk-margin-small-right" data-uk-icon="sign-out"></span>
                                    <Logout>Logout</Logout>
                                 </li>
                              </ul>
                           </div>
                        </>
                        : false
                     }
                  </div>
               </div>

               {/* RIGHT Navbar */}
               <div className="uk-navbar-right">
                  { user.data !== null
                     ? <NavLink to={`/cart`} className={({ isActive }) => isActive ? activeClassName : undefined}>
                        <span data-uk-icon="icon: cart"></span>
                        <span>Cart</span>
                     </NavLink>
                     : false
                  }
                  <Menu/>
               </div>
            </div>
         </div>
      </nav>
   )
}

export default Navbar
