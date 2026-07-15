import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'

function App() {

  return (
    <div className="container mt-5 text-center">
      <div className="card p-5 shadow-sm bg-light">
        <h1 className="text-primary display-4 fw-bold mb-3">📚 Book Discount Hub</h1>
        <p className="lead text-muted">
          ჩვენი პროექტის ფრონტენდი წარმატებით დაუკავშირდა Bootstrap-ს!
        </p>
        <div className="mt-4">
          <button className="btn btn-success btn-lg me-2">შესვლა</button>
          <button className="btn btn-outline-secondary btn-lg">რეგისტრაცია</button>
        </div>
      </div>
    </div>
  )
}

export default App
