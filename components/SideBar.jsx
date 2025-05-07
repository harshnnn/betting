"use client"
import React, { useState } from 'react'
import { FaAngleDown, FaAngleRight } from "react-icons/fa"

const data = [
  "TP T20", "TP 1 DAY", "TP TEST", "DT 1 DAY", "32 CARDS", "HI LOW", "POKER", "QUEEN", "BACCARAT",
  "AMAR AKBAR ANTHONY", "BOLLYWOOD", "TRIO", "ANDAR BAHAR", "MUFLIS TP", "ROULETTE", "WORLI MATKA"
]

const sports = [
  "IPL", "Cricket", "Football", "Kabaddi", "Tennis", "Casino"
]

const SideBar = () => {
  const [othersActive, setOthersActive] = useState(false)
  const [sportsActive, setSportsActive] = useState(false)

  return (
    <div className='flex-1 bg-[#ccc]'>
      {/* Others */}
      <div>
        <div onClick={() => setOthersActive(!othersActive)} className='flex justify-between p-2 text-xl bg-[#1a3da6] text-white font-medium cursor-pointer'>
          <p>Others</p>
          {!othersActive ? <FaAngleDown /> : <FaAngleRight />}
        </div>
        <div
          className={`transition-all duration-300 ease-in-out overflow-hidden ${othersActive ? 'max-h-96' : 'max-h-0'}`}
        >
          <div className='m-2'>
            {data.map((item, index) => (
              <p key={index} className='shadow py-1 px-2'>{item}</p>
            ))}
          </div>
        </div>
      </div>

      {/* Sports */}
      <div>
        <div onClick={() => setSportsActive(!sportsActive)} className='flex justify-between p-2 text-xl bg-[#1a3da6] text-white font-medium cursor-pointer'>
          <p>All Sports</p>
          {!sportsActive ? <FaAngleDown /> : <FaAngleRight />}
        </div>
        <div
          className={`transition-all duration-300 ease-in-out overflow-hidden ${sportsActive ? 'max-h-96' : 'max-h-0'}`}
        >
          <div className='m-2'>
            {sports.map((item, index) => (
              <p key={index} className='shadow py-1 px-2'>{item}</p>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SideBar
