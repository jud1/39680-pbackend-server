import Cookies from "js-cookie"

const getSessionCookie = () => {
   const cookieName = import.meta.env.VITE_COOKIE_SESSION_NAME
   const cookie = Cookies.get(cookieName)
   return cookie ? cookie : null
}

const clearSessionCookie = () => {
   const cookieName = import.meta.env.VITE_COOKIE_SESSION_NAME
   Cookies.remove(cookieName)
}

const fetchCookie = async () => {

   const URL = `${import.meta.env.VITE_API_URL}/sessions/usersimple`
   const sessionCookie = getSessionCookie()

   try {
      console.log('fetchCookie')
      const response = await fetch(URL, {
         headers: {
            "Content-Type": "application/json", 
            "Authorization": `Bearer ${sessionCookie}`
         } 
      })

      if (!response.ok) throw new Error(response.status) 

      const data = await response.json()
      
      return data
   }
   catch (error) {
      throw new Error(error)
   }
}

export { getSessionCookie, clearSessionCookie, fetchCookie }