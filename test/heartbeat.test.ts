import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest'
import WSGO from '../src/index'
import ws from 'ws'
import { createMockWSServer } from './utils'

describe('open', () => {
  const date = new Date(2000, 1, 1)

  let port: number = 0
  let server: ws.Server

  beforeAll(() => {
    const mockWSServer = createMockWSServer(port)

    server = mockWSServer.server
    port = mockWSServer.port
  })

  afterAll(() => {
    server.close()
  })

  it('should send a ping event and receive a pong response', async () => {
    const eventName = 'pong'

    let event: any

    // Arrange
    const wsgo = WSGO(`ws://localhost:${port}`)
    await vi.waitFor(() => {
      vi.setSystemTime(date)
      if (wsgo.ws?.readyState !== window.WebSocket.OPEN) {
        throw new Error()
      }
    })

    // Act
    wsgo.subscribe(eventName, (e) => (event = e))
    await vi.waitFor(() => {
      vi.setSystemTime(date)
      if (event === undefined) {
        throw new Error('Message not received back')
      }
    })

    // Assert
    expect(event).toStrictEqual({ event: eventName, timeSended: Date.now() })
  })

  it.todo('must close the connection if no response is received from the server')
})
