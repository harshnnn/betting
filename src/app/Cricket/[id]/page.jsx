'use client'

import { useEffect, useRef, useState } from 'react'
import { useParams } from 'next/navigation'

const GameDetail = () => {
  const { id } = useParams()
  const [marketData, setMarketData] = useState(null)
  const [status, setStatus] = useState('Disconnected')
  const wsRef = useRef(null)

  useEffect(() => {
    if (!id) return

    const socket = new WebSocket('wss://m2-w98e.onrender.com/ws')
    wsRef.current = socket

    socket.onopen = () => {
      setStatus('Connected')
      socket.send(JSON.stringify({
        action: 'subscribe',
        match_id: id,
      }))
    }

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        if (data.type === 'update' && data.match_id === id) {
          setMarketData(data.data)
        }
      } catch (err) {
        console.error('Error parsing WebSocket data:', err)
      }
    }

    socket.onclose = () => setStatus('Disconnected')
    socket.onerror = (err) => {
      console.error('WebSocket error:', err)
      setStatus('Error')
    }

    return () => {
      socket.close()
    }
  }, [id])

  return (
    <div className="min-h-screen p-6 bg-white">
      <h1 className="text-2xl font-bold mb-4">Live Market Data</h1>
      <p className="mb-4 text-gray-600">WebSocket Status: {status}</p>
      <p className="mb-4"><strong>Match ID:</strong> {id}</p>

      {marketData ? (
        <div className="p-4 bg-gray-100 rounded shadow">
          <pre className="whitespace-pre-wrap break-words">
            {JSON.stringify(marketData, null, 2)}
          </pre>
        </div>
      ) : (
        <p>Waiting for market data...</p>
      )}
    </div>
  )
}

export default GameDetail
