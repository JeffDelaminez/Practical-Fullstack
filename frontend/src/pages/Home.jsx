import React from 'react'
import './pages.css'
import TodoApp from '../TodoApp'

function Home() {
  return (
    <div className="home-page">
      <h1>Welcome to Practical Fullstack 🚀</h1>
      {/* TodoApp is only rendered on Home */}
      <TodoApp />
    </div>
  )
}

export default Home
