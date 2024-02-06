import { describe, it, expect, vitest, beforeAll, afterAll } from 'vitest'
import WSGO from '../src/index'
import ws from 'ws'

describe('subscribe', () => {
  let port = 0
  let server: ws.Server

  beforeAll(() => {
    server = new ws.WebSocketServer({ port })

    server.on('connection', (ws) => {
      ws.on('message', (data, isBinary) => {
        const message = isBinary ? data : data.toString()
        ws.send(message)
      })
    })

    port = (server.address() as ws.AddressInfo).port
  })

  afterAll(() => {
    server.close()
  })

  it('should subscribe to event', async () => {
    let event: any

    // Arrange
    const wsgo = WSGO(`ws://localhost:${port}`)
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
