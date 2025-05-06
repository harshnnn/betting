"use client"
import Link from 'next/link';
import React, { useState } from 'react'

const sports = [
    "Home", "IPL", "Cricket", "Football", "Kabaddi", "Tennis", "Casino"
]

const HomeBar = () => {
    return (
        <div className='flex gap-4 py-2 bg-blue-900 px-10'>
            {sports.map((item, index) => (
                <Link href={`/${item === "Home" ? "" : item}`} key={index}>
                    <div className={`flex w-20 h-10 justify-center items-center rounded-lg cursor-pointer hover:underline decoration-white decoration-3 underline-offset-3`}>
                        <p className='text-white font-bold'>{item}</p>
                    </div>
                </Link>
            ))}
        </div>
    )
}

export default HomeBar