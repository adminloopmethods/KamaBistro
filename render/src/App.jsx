import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'
import Webpage from './Components/Webpage'
import { Provider } from './Context/ContextAPI'

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Provider>
        <Webpage />
      </Provider>
    </>
  )
}

export default App
