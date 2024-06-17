import { useState } from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import Body from './components/Body'
import ModalAuth from './components/ModalAuth.jsx'
function App() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <ModalAuth isOpen={isOpen} onClose={() => setIsOpen(false)}></ModalAuth>
      <Header setIsOpen={setIsOpen} />
      <Body />
      <Footer />
    </>
  )
}
export default App
