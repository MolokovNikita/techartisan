import { useState, useEffect, useRef } from 'react'
import reactLogo from './assets/react.svg'
import styles from './style.module.css'
import Header from './components/Header'
import Footer from './components/Footer'
import Body from './components/Body'
import ModalAuth from './components/ModalAuth.jsx'
console.log({styles})
  function App() {
    const [isOpen, setIsOpen] = useState(false);
  return (
    <>
    <ModalAuth isOpen = {isOpen} onClose={()=>setIsOpen(false)}></ModalAuth>
    <header>
    <Header setIsOpen = {setIsOpen} />
    </header>
    <Body />
    <footer>
    <Footer />
    </footer>
    </>
  )
}
export default App
