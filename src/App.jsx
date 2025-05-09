import { useState } from 'react'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
function App() {
  const [count, setCount] = useState(0)
  const navigate = useNavigate()

  useEffect(() => {
    navigate('/auth/login')
  }, [])

  return (
    <>
      <h1>Now</h1>
    </>
  )
}

export default App;