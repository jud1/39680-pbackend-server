import { NavLink } from "react-router-dom"
import { useSelector } from 'react-redux'
import { selectUser } from '../../store.js'

const Menu = () => {

   const activeClassName = "uk-text-warning"
   const user = useSelector(selectUser)

   return (
      <ul id="navigation" className="uk-navbar-nav uk-link-text">
         { user.data === null ?
            <>
               <NavLink to={`/login`} className={({ isActive }) => isActive ? activeClassName : undefined}>
                  <span>Login</span>
                  <span data-uk-icon="icon: sign-in"></span>
               </NavLink>
               <NavLink to={`/register`} className={({ isActive }) => isActive ? activeClassName : undefined} >
                  <span>Register</span>
                  <span data-uk-icon="icon: users"></span>
               </NavLink>
            </> : false
         }
      </ul>
   )
}

export default Menu
