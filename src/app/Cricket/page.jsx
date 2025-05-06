'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

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
            setMatches(data.matches)
            setLoading(false)
            sessionStorage.setItem('matchData', JSON.stringify(data.matches))
          }
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
    <div className="min-h-screen p-6 bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">Live Cricket Odds</h1>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid"></div>
        </div>
      ) : matches.length === 0 ? (
        <div className="text-center text-gray-500">No matches available</div>
      ) : (
        <>
          <div className="grid grid-cols-4 font-semibold text-sm bg-gray-300 rounded p-2 mb-2">
            <div>Game</div>
            <div className="text-center">1</div>
            <div className="text-center">X</div>
            <div className="text-center">2</div>
          </div>

          <div className="grid gap-4">
            {matches.map((match) => {
              const { event_id, event_name, openDate, runners = [] } = match

              const runner1 = runners[0] || {}
              const runner2 = runners[1] || {}

              const oneBack = runner1.backOdds ?? '-'
              const oneLay = runner1.layOdds ?? '-'
              const twoBack = runner2.backOdds ?? '-'
              const twoLay = runner2.layOdds ?? '-'

              return (
                <div
                  key={event_id}
                  className="bg-white rounded-lg shadow p-4 grid grid-cols-4 items-center text-sm"
                >
                  <div
                    className="cursor-pointer col-span-1 hover:underline"
                    onClick={() => router.push(`/Cricket/${event_id}`)}
                  >
                    {event_name} / {new Date(openDate).toLocaleString()}
                  </div>

                  <div className="grid grid-cols-2 gap-1 text-center">
                    <div className="bg-blue-100 p-1 rounded">{oneBack}</div>
                    <div className="bg-pink-100 p-1 rounded">{oneLay}</div>
                  </div>

                  <div className="grid grid-cols-2 gap-1 text-center">
                    <div className="bg-blue-100 p-1 rounded">-</div>
                    <div className="bg-pink-100 p-1 rounded">-</div>
                  </div>

                  <div className="grid grid-cols-2 gap-1 text-center">
                    <div className="bg-blue-100 p-1 rounded">{twoBack}</div>
                    <div className="bg-pink-100 p-1 rounded">{twoLay}</div>
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
