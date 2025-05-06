"use client"
import React, { useState } from 'react'

const games = [

]

const data = [
    "TP T20",
    "TP 1 DAY",
    "TP TEST",
    "DT 1 DAY",
    "32 CARDS",
    "HI LOW",
    "POKER",
    "QUEEN",
    "BACCARAT",
    "AMAR AKBAR ANTHONY",
    "BOLLYWOOD",
    "TRIO",
    "ANDAR BAHAR",
    "MUFLIS TP",
    "ROULETTE",
    "WORLI MATKA",
]

const sports = [
    "IPL", "Cricket", "Football", "Kabaddi", "Tennis", "Casino"
]

const SideBar = () => {

    const [othersActive, setOthersActive] = useState(false);
    const [sportsActive, setSportsActive] = useState(false);

    return (
        <div className='flex-1 bg-[#ccc]'>
            <div>
                <p onClick={()=>setOthersActive(!othersActive)} className='flex p-1 text-xl bg-blue-600 text-white font-medium cursor-pointer'>Others</p>
                {othersActive && (
                    <div className='m-2 shadow'>
                        {data.map((item, index) => (
                            <p className='shadow'>{item}</p>
                        ))}
                    </div>
                )}
            </div>
            <div>
                <p onClick={()=>setSportsActive(!sportsActive)} className='flex p-1 text-xl bg-blue-600 text-white font-medium cursor-pointer'>
                    All Sports
                </p>
                {sportsActive && (
                    <div className='m-2 shadow'>
                        {sports.map((item, index) => (
                            <p className='shadow'>{item}</p>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default SideBar