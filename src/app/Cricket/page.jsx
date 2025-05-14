'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { BiCricketBall } from "react-icons/bi";


const CricketPage = () => {
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const router = useRouter()

  // 1️⃣ Load cached matches from localStorage on first load
  useEffect(() => {
    const cachedData = localStorage.getItem('cricketMatches')
    if (cachedData) {
      try {
        const parsed = JSON.parse(cachedData)
        setMatches(parsed)
        setLoading(false)
      } catch (e) {
        console.warn('Failed to parse cached data:', e)
      }
    }
  }, [])

  // 2️⃣ Setup WebSocket and replace state + cache with fresh data
  useEffect(() => {
    let ws
    let reconnectAttempts = 0
    const maxReconnectAttempts = 5
    const reconnectInterval = 3000

    const connectWebSocket = () => {
      ws = new WebSocket('wss://m1-alb5.onrender.com/ws')

      ws.onopen = () => {
        console.log('WebSocket connected')
        ws.send(JSON.stringify({ type: 'events' }))
        setError(null)
        reconnectAttempts = 0
      }

      ws.onmessage = (message) => {
        try {
          const data = JSON.parse(message.data)
          const parsedMatches = (Array.isArray(data) ? data : []).map((match) => {
            let runners = []
            try {
              runners = JSON.parse(match.runners || '[]')
            } catch (e) {
              console.warn('Failed to parse runners:', e)
            }

            return {
              ...match,
              runners: runners.map((r) => ({
                name: r.name || 'Unknown',
                backOdds: r.backOdds ?? '-',
                layOdds: r.layOdds ?? '-',
              })),
            }
          })

          // 🛑 Don't update state or localStorage if no new data
          if (parsedMatches.length > 0) {
            setMatches(parsedMatches)
            localStorage.setItem('cricketMatches', JSON.stringify(parsedMatches))
          }

          setLoading(false)
        } catch (err) {
          console.error('Error parsing WebSocket message:', err)
          setError('Failed to process data')
        }
      }

      ws.onerror = (err) => {
        console.error('WebSocket error:', err)
        setError('WebSocket connection failed')
        setLoading(false)
      }

      ws.onclose = () => {
        console.log('WebSocket closed')
        if (reconnectAttempts < maxReconnectAttempts) {
          reconnectAttempts++
          setTimeout(connectWebSocket, reconnectInterval)
        } else {
          setError('Max reconnection attempts reached')
          setLoading(false)
        }
      }
    }

    connectWebSocket()

    return () => {
      if (ws) ws.close()
    }
  }, [])

  return (
    <div className="p-1 bg-white">
      {/* Top Scrollable Match Tags */}
      <div className="w-full overflow-x-auto mb-2">
        <div className="flex space-x-2 py-2 px-1 bg-gray-100 rounded shadow-inner">
          {matches.slice(0, 10).map((match) => (
            <div
              key={match.event_id}
              className="whitespace-nowrap cursor-pointer bg-blue-900 text-white text-2xs font-semibold px-3 py-1 rounded"
              onClick={() => router.push(`/Cricket/${match.event_id}`)}
            >
              <span className="animate-blink flex items-center hover:underline">
                <BiCricketBall className='m-1 text-white' />
                {match.event_name}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-between items-center mb-2">
        <h1 className="text-2xs text-white bg-violet-950 px-2 py-1 font-medium">CRICKET</h1>

        <div className="flex items-center space-x-2 text-xs font-semibold">
          <button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">LIVE</button>
          <button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">VIRTUAL</button>
          <div className="flex items-center space-x-1">
            <label className="text-gray-700">View by:</label>
            <select
              className="border border-gray-300 rounded px-1 py-0.5 text-sm"
              onChange={(e) => {
                const value = e.target.value
                if (value === 'TIME') {
                  setMatches((prev) =>
                    [...prev].sort((a, b) => new Date(a.openDate) - new Date(b.openDate))
                  )
                } else if (value === 'A-Z') {
                  setMatches((prev) =>
                    [...prev].sort((a, b) => a.event_name.localeCompare(b.event_name))
                  )
                }
              }}
            >
              <option value="TIME">TIME</option>
              <option value="A-Z">A-Z</option>
            </select>
          </div>
        </div>
      </div>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid"></div>
        </div>
      ) : matches.length === 0 ? (
        <div className="text-center text-gray-500">No matches available</div>
      ) : (
        <>
          <div className="flex font-semibold text-sm bg-white rounded shadow p-1 mb-1">
            <div className="w-[65%]">Game</div>
            <div className="w-[35%] flex justify-between text-center">
              <div className="w-1/3">1</div>
              <div className="w-1/3">X</div>
              <div className="w-1/3">2</div>
            </div>
          </div>

          {matches.map((match) => {
            const { event_id, event_name, openDate, runners = [] } = match;

            let oneBack = '-', oneLay = '-';
            let drawBack = '-', drawLay = '-';
            let twoBack = '-', twoLay = '-';

            if (runners.length === 2) {
              oneBack = runners[0]?.backOdds ?? '-';
              oneLay = runners[0]?.layOdds ?? '-';
              twoBack = runners[1]?.backOdds ?? '-';
              twoLay = runners[1]?.layOdds ?? '-';
            } else if (runners.length === 3 && runners[2]?.name === 'The Draw') {
              oneBack = runners[0]?.backOdds ?? '-';
              oneLay = runners[0]?.layOdds ?? '-';
              drawBack = runners[2]?.backOdds ?? '-';
              drawLay = runners[2]?.layOdds ?? '-';
              twoBack = runners[1]?.backOdds ?? '-';
              twoLay = runners[1]?.layOdds ?? '-';
            }

            return (
              <div key={event_id} className="bg-white rounded-lg shadow-md p-0 m-1">

                {/* Desktop View */}
                <div className="hidden md:flex flex-row justify-between items-center">
                  <div
                    className="cursor-pointer w-[65%] hover:underline whitespace-nowrap overflow-hidden text-ellipsis"
                    onClick={() => router.push(`/Cricket/${event_id}`)}
                  >
                    {event_name} / {new Date(openDate).toLocaleString()}
                  </div>

                  <div className="w-[35%] flex justify-between text-center gap-1">
                    <div className="w-1/3 grid grid-cols-2 gap-1">
                      <div className="bg-[#72BBEF] p-1 rounded">{oneBack}</div>
                      <div className="bg-[#FAA9BA] p-1 rounded">{oneLay}</div>
                    </div>
                    <div className="w-1/3 grid grid-cols-2 gap-1">
                      <div className="bg-[#72BBEF] p-1 rounded">{drawBack}</div>
                      <div className="bg-[#FAA9BA] p-1 rounded">{drawLay}</div>
                    </div>
                    <div className="w-1/3 grid grid-cols-2 gap-1">
                      <div className="bg-[#72BBEF] p-1 rounded">{twoBack}</div>
                      <div className="bg-[#FAA9BA] p-1 rounded">{twoLay}</div>
                    </div>
                  </div>
                </div>

                {/* Mobile View */}
                <div className="block md:hidden">
                  <div
                    className="cursor-pointer font-semibold text-base"
                    onClick={() => router.push(`/Cricket/${event_id}`)}
                  >
                    {event_name}
                  </div>
                  <div className="text-red-500 text-sm mb-1">{new Date(openDate).toLocaleString()}</div>

                  <div className="text-center flex  justify-around font-bold mb-1">
                    <div>1</div>
                    <div>X</div>
                    <div>2</div>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div className="grid grid-cols-2 gap-1">
                      <div className="bg-[#72BBEF] p-1 rounded text-center">{oneBack}</div>
                      <div className="bg-[#FAA9BA] p-1 rounded text-center">{oneLay}</div>
                    </div>
                    <div className="grid grid-cols-2 gap-1">
                      <div className="bg-[#72BBEF] p-1 rounded text-center">{drawBack}</div>
                      <div className="bg-[#FAA9BA] p-1 rounded text-center">{drawLay}</div>
                    </div>
                    <div className="grid grid-cols-2 gap-1">
                      <div className="bg-[#72BBEF] p-1 rounded text-center">{twoBack}</div>
                      <div className="bg-[#FAA9BA] p-1 rounded text-center">{twoLay}</div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

        </>
      )}
    </div>
  )
}

export default CricketPage
