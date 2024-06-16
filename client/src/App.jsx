import { useState, useEffect, useRef } from 'react'
import reactLogo from './assets/react.svg'
import styles from './App.module.css'
import Header from './components/Header'
import Footer from './components/Footer'
import Body from './components/Body'

  function App() {

  return (
    <>
    <header>
    <Header />
    </header>
    <Body />
    <footer>
    <Footer />
    </footer>

    </>
  )
}
export default App
