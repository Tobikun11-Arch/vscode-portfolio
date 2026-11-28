import { Route, Routes } from 'react-router'
import './App.css'
import { Desktop } from './desktop/Desktop'

function App() {
  return (
    <>
      <div className="wallpaper" aria-hidden="true" />
      <Routes>
        <Route path="*" element={<Desktop />} />
      </Routes>
    </>
  )
}

export default App
