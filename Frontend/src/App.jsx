import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Auth } from './pages/Auth'
import { Group } from './pages/Group'

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Auth type="login"/>} />
          <Route path="/signup" element={<Auth type="signup"/>} />
          <Route path="/group/:id" element={<Group />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App