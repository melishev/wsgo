import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import WSGO from '../src/index'
import { createMockWSServer } from './utils'

describe('close', () => {
  let mockWSServer: ReturnType<typeof createMockWSServer>

  beforeEach(() => {
    mockWSServer = createMockWSServer()
  })

  afterEach(() => {
    mockWSServer.server.close()
  })

  it('should close the WebSocket when it is not already open', () => {
    // Arrange
    const wsgo = WSGO(`ws://localhost:${mockWSServer.port}`)

    // Act
    wsgo.close()

    // Assert
    expect(wsgo.ws).toBeInstanceOf(window.WebSocket)
    expect(wsgo.ws?.readyState).toBe(window.WebSocket.CLOSING)
  })
})
