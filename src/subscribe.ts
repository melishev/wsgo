import { formatString, fromMsToUp } from './helpers'
import { type WSGOSubscribeResponse, type WSGOSubscribeCallback } from './subscribe/types'
import { type WSGOEventName, type WSGOConfig, type WSGOSubscriptions } from './types'

/** Method allows you to subscribe to listen to a specific event */
export function subscribe<T>(
  eventName: WSGOEventName,
  callback: WSGOSubscribeCallback<T>,
  subscriptions: WSGOSubscriptions,
  _config: WSGOConfig,
): void {
  if (eventName in subscriptions) return

  callback = _subscribeDecoratorTransform<T>(callback, _config)

  Object.assign(subscriptions, { [eventName]: callback })
}

/** Decorator adds aditional data to received events */
function _subscribeDecoratorTransform<T>(callback: WSGOSubscribeCallback<T>, _config: WSGOConfig): any {
  return (message: Omit<WSGOSubscribeResponse<T>, 'timeReceived'>) => {
    const transformedMessage: WSGOSubscribeResponse<T> = {
      ...message,
      timeReceived: Date.now(),
    }

    _subscribeDebugger(transformedMessage, _config)
    callback(transformedMessage)
  }
}

function _subscribeDebugger(message: WSGOSubscribeResponse<any>, _config: WSGOConfig): void {
  if (!_config.debugging) return

  if (message.event === 'exception') {
    console.error(message.data)
    return
  }

  const { event, data, timeSended, timeReceived } = message
  const timeDiff = fromMsToUp(timeReceived - timeSended)

  // console.log(`%c${new Date(timeReceived).toLocaleTimeString()}%c`, 'color: gray', '', event, data)
  // console.log(`%c${new Date(timeReceived).toLocaleTimeString()} %c${timeDiff}ms`, 'color: gray', 'color: green', event, data)
  console.log(
    `%c${new Date(timeReceived).toLocaleTimeString()} %c${formatString(`${timeDiff.value + timeDiff.unit}`, 5)}%c ${formatString(event, 30)}`,
    'color: gray',
    'color: green',
    '',
    data,
  )
}
