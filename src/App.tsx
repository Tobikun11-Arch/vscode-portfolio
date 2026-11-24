import { Route, Routes } from 'react-router'
import './App.css'
import { EditorWindow } from './editor/EditorWindow'

function App() {
  return (
    <>
      <div className="wallpaper" aria-hidden="true" />
      <Routes>
        <Route path="*" element={<EditorWindow />} />
      </Routes>
    </>
  )
}

export default App
