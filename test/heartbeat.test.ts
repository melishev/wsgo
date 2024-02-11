import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest'
import WSGO from '../src/index'
import { createMockWSServer } from './utils'

describe('heartbeat', () => {
  const date = new Date(2000, 1, 1)
  let mockWSServer: ReturnType<typeof createMockWSServer>

  beforeEach(() => {
    mockWSServer = createMockWSServer()
  })

  afterEach(() => {
    mockWSServer.server.close()
  })

  it('should send a ping event and receive a pong response', async () => {
    const eventName = 'pong'

    let event: any

    // Arrange
    const wsgo = WSGO(`ws://localhost:${mockWSServer.port}`)
    await vi.waitFor(() => {
      vi.setSystemTime(date)
      if (wsgo.ws?.readyState !== window.WebSocket.OPEN) {
        throw new Error()
      }
    })

    // Act
    wsgo.subscribe(eventName, (e) => (event = e))
    await vi.waitFor(
      () => {
        vi.setSystemTime(date)
        if (event === undefined) {
          throw new Error('Message not received back')
        }
      },
      {
        timeout: 5000,
        interval: 250,
      },
    )

    // Assert
    expect(event).toStrictEqual({ event: eventName, timeSended: Date.now(), timeReceived: Date.now() })
  })

  it('must close the connection if no response is received from the server', async () => {
    // Arrange
    const wsgo = WSGO(`ws://localhost:${mockWSServer.port}`)
    await vi.waitFor(() => {
      if (wsgo.ws?.readyState !== window.WebSocket.OPEN) {
        throw new Error()
      }
    })

    // Act
    mockWSServer.turnHeartbeat()
    await vi.waitFor(
      () => {
        if (wsgo.ws?.readyState !== window.WebSocket.CLOSED) {
          throw new Error()
        }
      },
      {
        timeout: 5000,
        interval: 250,
      },
    )

    // Assert
    expect(wsgo.ws?.readyState).toBe(window.WebSocket.CLOSED)
  })
})
