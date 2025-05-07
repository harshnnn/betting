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

            <div className='flex  justify-between items-center bg-[#1a3da6] px-10 py-5'>
                <h1 className="text-3xl">❌</h1>

                <div className='flex flex-col '>
                    <div className='flex gap-4 '>
                        <button className="flex items-center cursor-pointer gap-1 bg-green-600 hover:bg-green-700 px-3 py-1 rounded-xl text-white border border-white">
                            <FaPiggyBank size={14} />
                            DEPOSIT
                        </button>
                        <button className="flex items-center cursor-pointer gap-1 bg-red-600 hover:bg-red-700 px-3 py-1 rounded-xl text-white border border-white">
                            <FaChartLine size={14} />
                            WITHDRAWAL
                        </button>
                        <div className="flex items-center gap-2  text-white font-bold">
                            <AiOutlineSearch size={32} className='cursor-pointer' />
                            <span className='cursor-pointer'>Rules</span>
                        </div>

                        <div>
                            <div>
                                <p className='text-white font-bold cursor-pointer'>Balance: 99.0</p>
                            </div>

                            <div>
                                <p className='text-white font-bold underline cursor-pointer'>Exposure: 0</p>
                            </div>
                        </div>

                        <div className="relative cursor-pointer"
                            onMouseEnter={() => setShowDropdown(true)}
                            onMouseLeave={() => setShowDropdown(false)}>
                            <div className="flex items-center gap-1 cursor-pointer text-white font-bold">
                                <span>99bada1164</span>
                                <IoMdArrowDropdown size={16} />
                            </div>

                            {showDropdown && (
                                <div className="absolute right-0 mt-1 w-48 bg-white text-black text-sm shadow-lg rounded">
                                    <ul className="py-1">
                                        {[
                                            "Account Statement",
                                            "Profit Loss Report",
                                            "Bet History",
                                            "Unsettled Bet",
                                            "Set Button Values",
                                            "Change Password"
                                        ].map((item, i) => (
                                            <li
                                                key={i}
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

                    {/* <div className= 'overflow-hidden!important' >
                        <div className="overflow-hidden whitespace-nowrap">
                            <div className="block animate-[scroll_80s_linear_infinite] text-black font-bold px-0">
                            🏆𝐈𝐍𝐃𝐈𝐀𝐍 𝐏𝐑𝐄𝐌𝐈𝐄𝐑 𝐋𝐄𝐀𝐆𝐔𝐄(𝐈𝐏𝐋) 🏆𝐂𝐔𝐏 𝐖𝐈𝐍𝐍𝐄𝐑 𝐌𝐀𝐑𝐊𝐄𝐓 𝐁𝐄𝐓𝐒 𝐒𝐓𝐀𝐑𝐓𝐄𝐃 𝐈𝐍 𝐎𝐔𝐑
                             𝐄𝐗𝐂𝐇𝐀𝐍𝐆𝐄🏆 🏆𝐏𝐀𝐊𝐈𝐒𝐓𝐀𝐍 𝐒𝐔𝐏𝐄𝐑 𝐋𝐄𝐀𝐆𝐔𝐄(𝐏𝐒𝐋) 𝟐𝟎𝟐𝟓 𝐂𝐔𝐏 𝐖𝐈𝐍𝐍𝐄𝐑 𝐌𝐀𝐑𝐊𝐄𝐓 𝐁𝐄𝐓𝐒 
                             𝐒𝐓𝐀𝐑𝐓𝐄𝐃 𝐈𝐍 𝐎𝐔𝐑 𝐄𝐗𝐂𝐇𝐀𝐍𝐆𝐄🏆 𝐎𝐔𝐑 𝐄𝐗𝐂𝐋𝐔𝐒𝐈𝐕𝐄 𝐏𝐑𝐄𝐌𝐈𝐔𝐌 𝐌𝐀𝐑𝐊𝐄𝐓 𝐅𝐎𝐑 (𝐒𝐑𝐋) 𝐈𝐒 
                             𝐍𝐎𝐖 𝐒𝐓𝐀𝐑𝐓𝐄𝐃 𝐈𝐍 𝐎𝐔𝐑 𝐄𝐗𝐂𝐇𝐀𝐍𝐆𝐄 , 𝐃𝐑𝐄𝐀𝐌 𝐁𝐈𝐆 𝐖𝐈𝐍 𝐁𝐈𝐆
                            </div>
                        </div>
                    </div>   */}




                </div>
            </div>
        </>
    )
}

export default TopBar