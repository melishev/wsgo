import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import WSGO from '../src/index'
import { createMockWSServer } from './utils'

describe('subscribe', () => {
  const date = new Date(2000, 1, 1)
  let mockWSServer: ReturnType<typeof createMockWSServer>

  beforeEach(() => {
    mockWSServer = createMockWSServer()
  })

  afterEach(() => {
    mockWSServer.server.close()
  })

  it('should subscribe to event', async () => {
    const eventName = 'eventName'
    const eventData = { text: 'Hello World!' }

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
    wsgo.subscribe(eventName, (ev) => (event = ev))
    wsgo.send(eventName, eventData)
    await vi.waitFor(() => {
      vi.setSystemTime(date)
      if (event === undefined) {
        throw new Error()
      }
    })

    // Assert
    expect(event).toStrictEqual({ event: eventName, data: eventData, timeSended: Date.now(), timeReceived: Date.now() })
  })

  it.todo('should work once', () => {})

  it('should output log to the console if debugging is enabled', async () => {
    const logSpy = vi.spyOn(console, 'log')
    let event: any

    // Arrange
    const wsgo = WSGO(`ws://localhost:${mockWSServer.port}`, {
      debugging: true,
    })
    await vi.waitFor(() => {
      if (wsgo.ws?.readyState !== window.WebSocket.OPEN) {
        throw new Error()
      }
    })

    // Act
    wsgo.subscribe('eventName', (e) => (event = e))
    wsgo.ws?.send(JSON.stringify({ event: 'eventName', data: 'Hello world!' }))
    await vi.waitFor(() => {
      if (event === undefined) {
        throw new Error()
      }
    })

    // Assert
    expect(logSpy).toHaveBeenCalled()
  })

  it('should output error to the console if debugging is enabled and an exception event is returned', async () => {
    const errorSpy = vi.spyOn(console, 'error')
    let event: any

    // Arrange
    const wsgo = WSGO(`ws://localhost:${mockWSServer.port}`, {
      debugging: true,
    })
    await vi.waitFor(() => {
      if (wsgo.ws?.readyState !== window.WebSocket.OPEN) {
        throw new Error()
      }
    })

    // Act
    wsgo.subscribe('exception', (e) => (event = e))
    wsgo.ws?.send(JSON.stringify({ event: 'exception', data: 'Hello world!' }))
    await vi.waitFor(() => {
      if (event === undefined) {
        throw new Error()
      }
    })

    // Assert
    expect(errorSpy).toHaveBeenCalled()
  })
})
