import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import WSGO from '../src/index'
import { createMockWSServer } from './utils'

describe('open', () => {
  let mockWSServer: ReturnType<typeof createMockWSServer>

  beforeEach(() => {
    mockWSServer = createMockWSServer()
  })

  afterEach(() => {
    mockWSServer.server.close()
  })

  it('should open WebSocket when immediate = false, but the open method is called', () => {
    // Arrange
    const wsgo = WSGO(`ws://localhost:${mockWSServer.port}`, {
      immediate: false,
    })

    // Act
    wsgo.open()

    // Assert
    expect(wsgo.ws).toBeInstanceOf(window.WebSocket)
    expect(wsgo.ws?.readyState).toBe(window.WebSocket.CONNECTING)
    // check source data
    expect(wsgo.ws?.url).toBe(`ws://localhost:${mockWSServer.port}/`)
  })

  it.todo('should open new Websocket, after closing old', () => {})
})
