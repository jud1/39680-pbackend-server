import { useDispatch } from 'react-redux'
import { useNavigate } from "react-router-dom"
import { clearUser } from '../../store.js'
import { clearSessionCookie } from '../../utils/useCookies.js'

const Logout = (props) => {
   
   const dispatch = useDispatch()
   const navigate = useNavigate()

   const logout = () => {
      dispatch(clearUser())
      clearSessionCookie()
      navigate('/')
   }
   
   return (
      <button onClick={logout} className='uk-button uk-button-link uk-link-reset' style={{textTransform: 'unset'}}>
         {props.children}
      </button>
   )
}

export default Logout
