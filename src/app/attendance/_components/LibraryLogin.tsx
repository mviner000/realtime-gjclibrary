"use client"

import { useState, useEffect } from 'react'
import Image from 'next/image'

export default function LibraryLogin() {
  const [studentId, setStudentId] = useState('')
  const [currentTime, setCurrentTime] = useState('')

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date()
      setCurrentTime(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }))
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const purposes = [
    'Study / Read / Review',
    'Research',
    'Computer Use',
    'Transaction',
    'Exam',
    'Clearance',
    'Printing / Xerox',
    'Silver Star',
  ]

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-[#525254] p-6">
        <h1 className="text-white text-2xl font-bold tracking-wider">
          Welcome to the library! Please proceed to LOG IN here.
        </h1>
      </header>

      <main className="p-6 flex flex-col lg:flex-row gap-6">
        <div className="border-4 border-[#ffb700] p-6 w-full lg:w-1/3">
          <div className="flex flex-col items-center gap-4">
            <Image
              src="/images/library-logo.png"
              alt="GJC Library Logo"
              width={120}
              height={120}
              className="w-32 h-32"
            />
            <h2 className="text-2xl font-bold text-[#525254]">WELCOME!</h2>
            <div className="relative w-full aspect-square max-w-sm">
              <Image
                src="/images/QR_image.png"
                alt="QR Code"
                layout="fill"
                objectFit="cover"
                className="rounded-lg"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white text-xl font-semibold" />
            </div>
            <input
              type="text"
              placeholder="Student ID"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              className="w-full p-3 text-center bg-[#9E9D99] text-black rounded-br-full rounded-bl-full focus:outline-none focus:ring-2 focus:ring-[#ffb700]"
              required
            />
          </div>
        </div>

        <div className="border-4 border-[#ffb700] p-6 w-full lg:w-2/3 flex flex-col justify-end">
          <div className="flex-grow" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-auto">
            {purposes.map((purpose, index) => (
              <button
                key={index}
                className="p-3 border-2 border-[#525254] rounded-lg text-[#525254] font-bold hover:bg-[#525254] hover:text-white transition-colors"
              >
                {purpose}
              </button>
            ))}
          </div>
        </div>
      </main>

      <footer className="bg-[#525254] p-6 mt-6 rounded-tr-full rounded-br-full">
        <div className="flex flex-col md:flex-row items-center gap-4">
          <span className="text-white text-2xl">{currentTime}</span>
          <h2 className="text-[#ffb700] text-4xl font-bold">
            What brings you to the library today?
          </h2>
        </div>
      </footer>
    </div>
  )
}