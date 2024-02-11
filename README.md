<h1 align="center">WSGO</h1>

<p align="center">WebSocket client for the browser. Simplifying development and debugging</p>

> [!NOTES]
> Please lock the version of the package. This library is not stable yet and may have some behavioral differences depending on the version.

### What is WSGO?

The WSGO library acts as an abstraction on top of a pure WebSocket connection. Think of it as:

- Socket.io, only without being tied to your server implementation
- Axios, just for WebSocket communication

WSGO is designed to standardize communication between client and server through an explicit and common communication format

### Getting Started

To install the library in your project:

```
npm i wsgo
```

Then import WSGO into your code to create a connection to the server with the default settings:

```js
import WSGO from 'wsgo'

const wsgo = WSGO('wss://echo.websocket.org')
```

### Options

#### debugging

> Allows you to enable debugging mode when working with events. Logs outgoing and incoming events more informative than default browser developer tools

- type: boolean
- default: false

#### immediate

> Whether to connect to the server automatically when WSGO is initialized. If set to false, call the `open` method yourself when you are ready

- type: boolean
- default: true

#### heartbeat

> Implements the basic ping-pong mechanism. If there is no response from the server, closes the connection

- type: boolean
- default: true

### Examples

Create a WebSocket connection:

```js
import WSGO from 'wsgo'

const wsgo = WSGO('wss://echo.websocket.org')
```

Open the connection manually:

```js
import WSGO from 'wsgo'

const wsgo = WSGO('wss://echo.websocket.org', {
  immediate: false,
})

wsgo.open()
```

Register an event listener:

```js
import WSGO from 'wsgo'

const wsgo = WSGO('wss://echo.websocket.org')

wsgo.subscribe('my-event', (e) => {
  console.log(e)
})
```

Send the event to the server:

```js
import WSGO from 'wsgo'

const wsgo = WSGO('wss://echo.websocket.org')

wsgo.send('my-event', { text: 'Hello world!' })
```

Get the original and unmodified Websocket instance:

```js
import WSGO from 'wsgo'

const wsgo = WSGO('wss://echo.websocket.org')

const status = wsgo.ws.readyState
```

Close the connection:

```js
import WSGO from 'wsgo'

const wsgo = WSGO('wss://echo.websocket.org')

wsgo.close()
```

### Feedback

WSGO is designed to create a convenient and easy way to interact with WebSocket. We would love to get your ideas on how to make it even better.
