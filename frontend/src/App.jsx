import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-md p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-600">Notora</h1>
        <div>
          <button className="text-sm font-medium text-gray-700 mr-4 hover:text-blue-600">Login</button>
          <button className="text-sm font-medium text-white bg-blue-600 px-4 py-2 rounded hover:bg-blue-700">Sign Up</button>
        </div>
      </nav>

      <main className="p-8">
        <h2 className="text-xl font-semibold mb-4">Welcome to Notora</h2>
        <p className="text-gray-700">Simplify your lecture notes with smart uploads and sharing.</p>
      </main>
    </div>
  );
}

export default App;
