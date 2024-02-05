import { describe, it, expect, vitest } from 'vitest'
import WSGO from '../src/index'

describe('subscribe', () => {
  it('should be a browser env', () => {
    expect(typeof window).not.toBe('undefined')
  })

  it('should subscribe to event', async () => {
    let event: any

    // Arrange
    const wsgo = WSGO(import.meta.env.VITE_SERVER_URL)
    await vitest.waitFor(() => {
      if (wsgo.ws?.readyState !== window.WebSocket.OPEN) {
        throw new Error()
      }
    })

    // Act
    wsgo.subscribe('eventName', (ev) => (event = ev))
    wsgo.send('eventName', { text: 'Hello World!' })
    await vitest.waitFor(() => {
      if (event === undefined) {
        throw new Error()
      }
    })
    wsgo.close()

    // Assert
    expect(event).toStrictEqual({ event: 'eventName', data: { text: 'Hello World!' } })
  })

  it('should receive an error from the server', async () => {
    // TODO: implement own server for testing needs
    // let event: any
    // // Arrange
    // const wsgo = WSGO(import.meta.env.VITE_SERVER_URL)
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
