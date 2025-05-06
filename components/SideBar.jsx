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
        <div className='flex-1'>
            <div>
                <p onClick={()=>setOthersActive(!othersActive)} className='flex bg-blue-500 text-white font-bold cursor-pointer'>Others</p>
                {othersActive && (
                    <div>
                        {data.map((item, index) => (
                            <p>{item}</p>
                        ))}
                    </div>
                )}
            </div>
            <div>
                <p onClick={()=>setSportsActive(!sportsActive)} className='flex bg-blue-500 text-white font-bold cursor-pointer'>
                    All Sports
                </p>
                {sportsActive && (
                    <div>
                        {sports.map((item, index) => (
                            <p>{item}</p>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default SideBar