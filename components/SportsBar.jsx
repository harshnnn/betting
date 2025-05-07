"use client"
import Link from 'next/link';
import React, { useState } from 'react'

const sports = [
    "IPL", "Cricket", "Football", "Kabaddi", "Tennis", "Casino",
]

const SportsBar = () => {

    const [activeSport, setActiveSport] = useState("Home");

    return (
        <div className='flex gap-4 px-10 py-2'>
            {sports.map((item, index) => (
                <Link href={`/${item}`} key={index}>
                    <div className={`flex ${activeSport === item ? "bg-blue-800" : "bg-gray-500"} w-20 h-10 justify-center items-center rounded-lg cursor-pointer`} onClick={() => setActiveSport(item)}>
                        <p className='text-white font-bold'>{item}</p>
                    </div>
                </Link>
            ))}
        </div>
    )
}

export default SportsBar