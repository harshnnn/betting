"use client"
import Link from 'next/link';
import React from 'react';

const sports = [
  "Home", "Cricket", "Football", "Tennis", "Casino", "Sports bookNew", "Horse Racing",
  "Greyhound Racing", "BinaryNew", "Kabaddi", "Politics", "Basketball", "Baseball",
  "Table Tennis", "Volleyball", "Ice Hockey", "Rugby", "Mixed Martial Arts", "Darts", "Futsal"
];

const HomeBar = () => {
  return (
    <div className='w-full overflow-x-auto bg-[#0f2462]'>
      <div className='flex gap-4 min-w-max'>
        {sports.map((item, index) => (
          <Link href={`/${item === "Home" ? "" : item.replace(/\s+/g, "-")}`} key={index}>
            <div className='group relative flex w-max px-4 h-10 justify-center items-center rounded-lg cursor-pointer'>
              <p className='text-white font-bold whitespace-nowrap relative before:content-[""] before:absolute before:bottom-0 before:left-1/2 before:translate-x-[-50%] before:h-0.5 before:w-0 before:bg-white before:transition-all before:duration-400 group-hover:before:w-full'>
                {item.toUpperCase()}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default HomeBar;
