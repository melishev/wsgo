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

  it.todo('should receive an error from the server', async () => {
    // TODO: implement own server for testing needs
    // let event: any
    // // Arrange
    // const wsgo = WSGO(`ws://localhost:${port}`)
    // await vitest.waitFor(() => {
    //   if (wsgo.ws?.readyState !== window.WebSocket.OPEN) {
    //     throw new Error()
    //   }
    // })
    // // Act
    // wsgo.subscribe('eventName', (ev) => event = ev)
    // wsgo.send('eventName', { text: 'Hello World!' })
    // await vitest.waitFor(() => {
    //   if (event === undefined) {
    //     throw new Error()
    //   }
    // })
    // // Assert
    // expect(wsgo.ws).toBeInstanceOf(window.WebSocket)
    // expect(wsgo.ws?.readyState).toBe(window.WebSocket.OPEN)
    // expect(event).toStrictEqual({ event: 'eventName', data: { text: 'Hello World!' }})
  })
})
