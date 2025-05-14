'use client'

import React, { useState } from 'react'
import { FaPiggyBank, FaChartLine } from "react-icons/fa";
import { AiOutlineSearch } from "react-icons/ai";
import { IoMdArrowDropdown } from "react-icons/io";

const TopBar = () => {
    const [showDropdown, setShowDropdown] = useState(false);

    return (
        <>
            <style jsx global>{`
                @keyframes scroll {
                    0% { transform: translateX(10%); }
                    100% { transform: translateX(-10%); }
                }
            `}</style>

            <div className="flex flex-col bg-[#1a3da6] px-4 md:px-10 py-4 gap-4">
                {/* Top Section */}
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl md:text-3xl text-white">❌</h1>

                    <div className="flex items-center space-x-2 md:space-x-4">
                        <button className="flex items-center gap-1 bg-green-600 hover:bg-green-700 px-2 md:px-3 py-1 rounded text-white text-sm md:text-base">
                            <FaPiggyBank size={14} />
                            <span className="hidden sm:inline">DEPOSIT</span>
                        </button>
                        <button className="flex items-center gap-1 bg-red-600 hover:bg-red-700 px-2 md:px-3 py-1 rounded text-white text-sm md:text-base">
                            <FaChartLine size={14} />
                            <span className="hidden sm:inline">WITHDRAWAL</span>
                        </button>
                        <div className="flex items-center gap-1 md:gap-2 text-white font-bold">
                            <AiOutlineSearch size={24} className="cursor-pointer" />
                            <span className="hidden sm:inline cursor-pointer">Rules</span>
                        </div>
                        <div className="text-white text-xs md:text-sm font-bold space-y-1 hidden sm:block">
                            <p className="cursor-pointer">Balance: 99.0</p>
                            <p className="underline cursor-pointer">Exposure: 0</p>
                        </div>
                        {/* Dropdown */}
                        <div
                            className="relative"
                            onMouseEnter={() => setShowDropdown(true)}
                            onMouseLeave={() => setShowDropdown(false)}
                        >
                            <div className="flex items-center gap-1 text-white font-bold cursor-pointer">
                                <span className="text-sm md:text-base">99bada1164</span>
                                <IoMdArrowDropdown size={16} />
                            </div>
                            {showDropdown && (
                                <div className="absolute right-0 mt-2 w-44 bg-white text-black text-sm shadow-lg rounded z-50">
                                    <ul className="py-1">
                                        {[
                                            "Account Statement",
                                            "Profit Loss Report",
                                            "Bet History",
                                            "Unsettled Bet",
                                            "Set Button Values",
                                            "Change Password"
                                        ].map((item, index) => (
                                            <li
                                                key={index}
                                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                            >
                                                {item}
                                            </li>
                                        ))}
                                        <hr className="my-1" />
                                        <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Signout</li>
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Optional scrolling ticker section */}
                {/* 
                <div className="overflow-hidden whitespace-nowrap">
                    <div className="block animate-[scroll_80s_linear_infinite] text-white font-bold text-sm">
                        🏆 IPL & PSL 2025 Winner Markets started in our Exchange! Dream Big, Win Big!
                    </div>
                </div> 
                */}
            </div>
        </>
    )
}

export default TopBar
