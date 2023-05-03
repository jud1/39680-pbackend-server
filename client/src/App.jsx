import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Provider } from 'react-redux'
import { store } from "../store"

import Button from "./components/Button/Button"
import Footer from "./components/Footer/Footer"
import Main from "./components/Main/Main"
import Navbar from "./components/Navbar/Navbar"
import Products from "./components/Products/Products"
import Login from "./components/Login/Login"
import Carts from "./components/Carts/Carts"
import Register from "./components/Register/Register"
import Cart from "./components/Cart/Cart"
import Messages from "./components/Messages/Messages"


function App() {
   const handleClick = () => {
      console.log('Clicked button')
   }
   return (
      <>
         <Provider store={store}>
            <BrowserRouter>
               <Navbar />
               <Main>
                  <Routes>
                     <Route exact path="/" element={<Products />}/>
                     <Route exact path="/carts" element={<Carts />} />
                     <Route exact path="/login" element={<Login />}/>
                     <Route exact path="/register" element={<Register />}/>
                     <Route exact path="/cart" element={<Cart />}/>
                     <Route exact path="/messages" element={<Messages />}/>
                  </Routes>
                  {/* <Button style='secondary' onClick={handleClick}>Button default</Button> */}
               </Main>
               <Footer />
            </BrowserRouter>
         </Provider>
      </>
   )
}

export default App
