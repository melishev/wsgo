import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import WSGO from '../src/index'
import ws from 'ws'
import { createMockWSServer } from './utils'

describe('open', () => {
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

  it('should open WebSocket when immediate = false, but the open method is called', () => {
    // Arrange
    const wsgo = WSGO(`ws://localhost:${port}`, {
      immediate: false,
    })

    // Act
    wsgo.open()

    // Assert
    expect(wsgo.ws).toBeInstanceOf(window.WebSocket)
    expect(wsgo.ws?.readyState).toBe(window.WebSocket.CONNECTING)
    // check source data
    expect(wsgo.ws?.url).toBe(`ws://localhost:${port}/`)
  })

  it.todo('should open new Websocket, after closing old', () => {})
})
