import { expect, describe, it } from 'vitest'

import WSGO from '../src/index'

describe('main', () => {
  it('should be a browser env', () => {
    expect(typeof window).not.toBe('undefined')
  })

  it('immediate default = true', () => {
    // Act
    const wsgo = WSGO(import.meta.env.VITE_SERVER_URL)

    // Assert
    expect(wsgo.ws).toBeInstanceOf(window.WebSocket)
    expect(wsgo.ws?.readyState).toBe(window.WebSocket.CONNECTING)
  })

  it('immediate set true', () => {
    // Act
    const wsgo = WSGO(import.meta.env.VITE_SERVER_URL, {
      immediate: true,
    })

    // Assert
    expect(wsgo.ws).toBeInstanceOf(window.WebSocket)
    expect(wsgo.ws?.readyState).toBe(window.WebSocket.CONNECTING)
  })

  it('immediate set false', () => {
    // Act
    const wsgo = WSGO(import.meta.env.VITE_SERVER_URL, {
      immediate: false,
    })

    // Assert
    expect(wsgo.ws).toBeUndefined()
  })

  it('should open ws connect with source data', () => {
    // Arrange
    const wsgo = WSGO(import.meta.env.VITE_SERVER_URL, {
      immediate: false,
    })

    // Act
    wsgo.open()

    // Assert
    expect(wsgo.ws).toBeInstanceOf(window.WebSocket)
    expect(wsgo.ws?.readyState).toBe(window.WebSocket.CONNECTING)
    // check source data
    expect(wsgo.ws?.url).toBe(import.meta.env.VITE_SERVER_URL + '/')
  })

  it('should close ws connect', () => {
    // Arrange
    const wsgo = WSGO(import.meta.env.VITE_SERVER_URL)

    // Act
    wsgo.close()

    // Assert
    expect(wsgo.ws).toBeInstanceOf(window.WebSocket)
    expect(wsgo.ws?.readyState).toBe(window.WebSocket.CLOSING)
  })
})
