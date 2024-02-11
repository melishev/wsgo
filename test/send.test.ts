import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import WSGO from '../src/index'
import { createMockWSServer } from './utils'

describe('send', () => {
  const date = new Date(2000, 1, 1)
  let mockWSServer: ReturnType<typeof createMockWSServer>

  beforeEach(() => {
    vi.useFakeTimers()
    mockWSServer = createMockWSServer()
  })

  afterEach(() => {
    mockWSServer.server.close()
    vi.restoreAllMocks()
  })

  it('should send an event to the server', async () => {
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
        throw new Error('Message not received back')
      }
    })

    // Assert
    expect(event).toStrictEqual({ event: eventName, data: eventData, timeSended: Date.now(), timeReceived: Date.now() })
  })

  it('should output logs to the console if debugging is enabled', async () => {
    const groupSpy = vi.spyOn(console, 'group')
    const groupEndSpy = vi.spyOn(console, 'groupEnd')

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
    wsgo.send('eventName', { text: 'Hello, world!' })
    vi.advanceTimersByTime(100)

    // Assert
    expect(groupSpy).toHaveBeenCalledWith('eventName', { text: 'Hello, world!' })
    expect(groupEndSpy).toHaveBeenCalled()
  })
})
