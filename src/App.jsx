import { useState } from 'react'
import './App.css'
import OMRSheet from './pages/OMRSheet';

function App() {
  const [count, setCount] = useState(0)

  return (
    <OMRSheet />
  )
}

export default App
