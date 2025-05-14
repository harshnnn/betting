'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import dummyData from './data.json'
import { FaTv } from "react-icons/fa";

const GameDetail = () => {
  const { id: event_id } = useParams()
  const [bookMaker, setBookMaker] = useState([])
  const [fancy, setFancy] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let ws
    let reconnectAttempts = 0
    const maxReconnect = 3
    let hasReceivedMessage = false

    const connect = () => {
      try {
        ws = new WebSocket('wss://m1-alb5.onrender.com/ws')

        ws.onopen = () => {
          console.log('Connected to WebSocket')
          ws.send(JSON.stringify({ type: 'market', event_id }))
          setError(null)
        }

        ws.onmessage = (msg) => {
          try {
            hasReceivedMessage = true
            const data = JSON.parse(msg.data)
            const bookMakerData = Array.isArray(data.bookMaker) && data.bookMaker.length ? data.bookMaker : dummyData.bookMaker
            const fancyData = Array.isArray(data.fancy) && data.fancy.length ? data.fancy : dummyData.fancy
            setBookMaker(bookMakerData)
            setFancy(fancyData)
            setLoading(false)
          } catch (e) {
            console.error('Error parsing message:', e)
            setBookMaker(dummyData.bookMaker)
            setFancy(dummyData.fancy)
            setError('Failed to process data')
            setLoading(false)
          }
        }

        ws.onerror = () => {
          setBookMaker(dummyData.bookMaker)
          setFancy(dummyData.fancy)
          setError('Connection error, using fallback data.')
          setLoading(false)
        }

        ws.onclose = () => {
          if (!hasReceivedMessage) {
            setBookMaker(dummyData.bookMaker)
            setFancy(dummyData.fancy)
            setLoading(false)
          }
          if (reconnectAttempts < maxReconnect) {
            reconnectAttempts++
            setTimeout(connect, 3000)
          } else {
            setError('Disconnected. Using fallback data.')
            setBookMaker(dummyData.bookMaker)
            setFancy(dummyData.fancy)
            setLoading(false)
          }
        }
      } catch {
        setBookMaker(dummyData.bookMaker)
        setFancy(dummyData.fancy)
        setError('Could not connect. Using fallback data.')
        setLoading(false)
      }
    }

    connect()
    return () => { if (ws) ws.close() }
  }, [event_id])

  return (
    <div className="p-4 flex flex-col lg:flex-row bg-white gap-4">

      <div className='w-full lg:w-[70%]'>
        <div className="flex justify-between items-center bg-[#0F2462] text-white text-sm font-bold px-4 py-2 rounded-sm mb-4">
          <div>
            {bookMaker.length > 0 && bookMaker[0].runners.length >= 2 ? (
              <p>{`${bookMaker[0].runners[0].selectionName} V ${bookMaker[0].runners[1].selectionName}`}</p>
            ) : (
              <p>Match</p>
            )}
          </div>
        </div>

        <div className="md:hidden w-full h-[250px] bg-cover bg-center relative flex items-center justify-between px-4 py-16" style={{ backgroundImage: "url('/images/mobile.webp')" }}>
          <img src="/images/batsman.svg" alt="batsman" className="h-[100%]" />
          <div className="text-white border border-white rounded p-2 text-center w-[60%]">
            <div className="font-bold text-md">DOUBLE</div>
            <div className="text-2xl font-bold mb-1">0 2</div>
            <div className="flex justify-between text-xs px-4">
              <span>*Player 1 (score1)</span>
              <span>player2  (score2)</span>
            </div>
          </div>
          <img src="/images/ballersvg.svg" alt="bowler" className="h-24" />
        </div>

        <div className="hidden md:flex w-full h-[250px] bg-cover bg-center relative items-center justify-between px-24 py-15" style={{ backgroundImage: "url('/images/desktop.webp')" }}>
          <img src="/images/batsman.svg" alt="batsman" className="h-[100%]" />
          <div className="text-white border border-white rounded p-2 text-center w-[60%]">
            <div className="font-bold text-md">DOUBLE</div>
            <div className="text-2xl font-bold mb-1">0 2</div>
            <div className="flex justify-between text-xs px-4">
              <span>*Player 1 (score1)</span>
              <span>player2  (score2)</span>
            </div>
          </div>
          <img src="/images/ballersvg.svg" alt="bowler" className="h-24" />
        </div>

        {loading && <div>Loading market...</div>}
        {error && <div className="text-red-500">{error}</div>}

        <div className="border border-gray-300 rounded-md overflow-hidden text-sm">
          {bookMaker.map((market, idx) => (
            <div key={idx}>
              <div className="bg-[#2d3b74] text-white font-bold flex items-center justify-between px-4 py-2">
                <div>
                  {market.marketName}
                  <button className="ml-2 bg-yellow-400 text-black px-2 rounded text-xs font-bold">CASHOUT</button>
                </div>
              </div>
              <div className="grid grid-cols-8 bg-white border-b text-center font-bold">
                <div className="col-span-2 text-left pl-4 py-2">
                  <div className="text-[14px] font-bold  text-[#17a2b8]">Min: 100 Max: 50k</div>
                </div>
                <div className="col-span-3 bg-blue-100 py-2 border-l border-gray-200">BACK</div>
                <div className="col-span-3 bg-pink-100 py-2 border-l border-gray-200">LAY</div>
              </div>
              {market.runners.map((runner, i) => (
                <div key={i} className={`grid grid-cols-8 text-center items-center ${i % 2 === 0 ? 'bg-gray-100' : 'bg-white'}`}>
                  <div className="col-span-2 text-left pl-4 font-bold py-2">{runner.selectionName}</div>
                  {[...Array(3)].map((_, index) => (
                    <div key={index} className={`py-2 border-l border-gray-200 ${index === 2 ? 'bg-blue-400 font-bold' : 'bg-blue-200'}`}>
                      <div>{index === 2 ? runner.backOdds : '-'}</div>
                      <div className="text-xs">{index === 2 ? '50k' : '0.0'}</div>
                    </div>
                  ))}
                  {[...Array(3)].map((_, index) => (
                    <div key={index} className={`py-2 border-l border-gray-200 ${index === 0 ? 'bg-pink-400 font-bold' : 'bg-pink-200'}`}>
                      <div>{index === 0 ? runner.layOdds : '-'}</div>
                      <div className="text-xs">{index === 0 ? '50k' : '0.0'}</div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>

        <h2 className="text-md mb-2 mt-6 bg-[#2d3b74] text-white font-bold flex items-center justify-between px-4 py-2 w-full md:w-[50%] rounded-sm">Fancy Market</h2>
        <div className="grid gap-[1px] border-t border-gray-300 w-full md:w-[50%]">
          <div className="grid grid-cols-12 text-[14px] font-bold text-center bg-white my-2">
            <div className="col-span-6"></div>
            <div className="col-span-2 bg-red-300 py-1">No</div>
            <div className="col-span-2 bg-blue-300 py-1">Yes</div>
          </div>
          {fancy.map((item, i) => (
            <div key={i} className="grid grid-cols-12 text-[14px] bg-white border-b border-gray-300 text-center">
              <div className="col-span-6 px-2 py-1 text-left font-semibold text-[12px]">{item.marketName}</div>
              <div className="col-span-2 bg-red-200 py-1">
                <div className="font-bold">{item.oddsNo}</div>
                <div className="text-[12px]">100</div>
              </div>
              <div className="col-span-2 bg-blue-200 py-1">
                <div className="font-bold">{item.oddsYes}</div>
                <div className="text-[12px]">100</div>
              </div>
              <div className="col-span-2 text-[12px] py-1">Min: 100 Max: 25k</div>
            </div>
          ))}
        </div>
      </div>

      <div className='flex flex-col w-full lg:w-[30%] text-white'>
        <div className='flex justify-between font-medium bg-[#0F2462] w-full p-2 rounded-sm'>
          <h6>Live Match</h6>
          <h6 className='flex items-center gap-1'><FaTv />Live Stream Started</h6>
        </div>
        <h6 className='bg-[#0F2462] p-2 rounded-sm w-full font-medium mt-2'>Place Bet</h6>
        <h6 className='bg-[#0F2462] p-2 rounded-sm w-full font-medium mt-2'>My Bet</h6>
        <div className='flex justify-between items-center w-full bg-[#CCCCCC] text-black px-2 p-1 font-bold text-[12px] mt-2'>
          <div>
            <p>Nation</p>
          </div>
          <div className='flex space-x-4'>
            <p>Odds</p>
            <p>Stake</p>
          </div>
        </div>
        <div className='flex justify-center items-center w-full border-t border-b border-gray-300 text-center text-gray-800 text-sm shadow-sm py-2'>No records found</div>
      </div>
    </div>
  )
}

export default GameDetail;