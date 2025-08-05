// Polyfills must be imported FIRST
import assert from 'assert'
import BN from 'bn.js'
import { Buffer } from 'buffer'
import { getRandomValues as expoCryptoGetRandomValues } from 'expo-crypto'
import 'react-native-get-random-values'
import { TextEncoder } from 'text-encoding'

// Set up global polyfills
global.Buffer = Buffer
global.BN = BN
global.assert = assert
global.TextEncoder = TextEncoder

// structuredClone polyfill for React Native
if (typeof global.structuredClone === 'undefined') {
  global.structuredClone = (obj) => {
    return JSON.parse(JSON.stringify(obj))
  }
}

// Buffer subarray polyfill for Anchor
Buffer.prototype.subarray = function subarray(begin, end) {
  const result = Uint8Array.prototype.subarray.apply(this, [begin, end])
  Object.setPrototypeOf(result, Buffer.prototype)
  return result
}

// getRandomValues polyfill
class Crypto {
  getRandomValues = expoCryptoGetRandomValues
}

const webCrypto = typeof crypto !== 'undefined' ? crypto : new Crypto()

;(() => {
  if (typeof crypto === 'undefined') {
    Object.defineProperty(global, 'crypto', {
      configurable: true,
      enumerable: true,
      get: () => webCrypto,
    })
  }
})()

// Import and register the Expo app
import 'expo-router/entry'
