'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { BiCricketBall } from "react-icons/bi";


const CricketPage = () => {
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const router = useRouter()

  useEffect(() => {
    let ws
    let reconnectAttempts = 0
    const maxReconnectAttempts = 5
    const reconnectInterval = 3000

    const connectWebSocket = () => {
      ws = new WebSocket('wss://m2-w98e.onrender.com/ws')

      ws.onopen = () => {
        console.log('WebSocket connected')
        setError(null)
        reconnectAttempts = 0
      }

      ws.onmessage = (message) => {
        try {
          const data = JSON.parse(message.data)
          if (data.type === 'match_list') {
            if (!Array.isArray(data.matches)) {
              throw new Error('Invalid match data')
            }
            setMatches(data.matches)
            setLoading(false)
            sessionStorage.setItem('matchData', JSON.stringify(data.matches))
          }
        } catch (err) {
          console.error('Error parsing WebSocket message:', err)
          setError('API error')
          setMatches([])
          setLoading(false)
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
          console.log(`Attempting to reconnect (${reconnectAttempts}/${maxReconnectAttempts})...`)
          setTimeout(connectWebSocket, reconnectInterval)
        } else {
          setError('Max reconnection attempts reached')
          setLoading(false)
        }
      }
    }

    connectWebSocket()

    return () => {
      if (ws) {
        ws.close()
      }
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
              <span className="animate-blink flex cursor-pointer hover:underline"><BiCricketBall className='m-1 text-white' />
              {match.event_name}</span>
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


          <div className="grid gap-2 shadow">
            {matches.map((match) => {
              const { event_id, event_name, openDate, runners = [] } = match

              let oneBack = '-', oneLay = '-'
              let drawBack = '-', drawLay = '-'
              let twoBack = '-', twoLay = '-'

              if (runners.length === 2) {
                oneBack = runners[0]?.backOdds ?? '-'
                oneLay = runners[0]?.layOdds ?? '-'
                twoBack = runners[1]?.backOdds ?? '-'
                twoLay = runners[1]?.layOdds ?? '-'
              } else if (runners.length === 3) {
                const isDraw = runners[2]?.name === 'The Draw'
                if (isDraw) {
                  oneBack = runners[0]?.backOdds ?? '-'
                  oneLay = runners[0]?.layOdds ?? '-'
                  drawBack = runners[2]?.backOdds ?? '-'
                  drawLay = runners[2]?.layOdds ?? '-'
                  twoBack = runners[1]?.backOdds ?? '-'
                  twoLay = runners[1]?.layOdds ?? '-'
                }
              }

              return (
                <div
                  key={event_id}
                  className="bg-white rounded-lg shadow-2xs p-0 flex flex-col md:flex-row justify-between items-start md:items-center text-sm"
                >

                  {/* Game Name & Time */}

                  <div
                    className="cursor-pointer w-full md:w-[65%] mb-2 md:mb-0 hover:underline whitespace-nowrap overflow-hidden text-ellipsis"
                    onClick={() => router.push(`/Cricket/${event_id}`)}
                  >
                    {event_name} / {new Date(openDate).toLocaleString()}
                  </div>

                  {/* Odds Section */}
                  <div className="w-full md:w-[35%] flex justify-between text-center gap-1">
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
              )

            })}
          </div>
        </>
      )}
    </div>
  )
}

export default CricketPage
