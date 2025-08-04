// Required polyfills for Anchor - MUST BE FIRST!
import assert from 'assert';
import BN from 'bn.js';
import { Buffer } from "buffer";
import "react-native-get-random-values";
import './polyfill';

// Set up global polyfills BEFORE expo-router
global.TextEncoder = require("text-encoding").TextEncoder;
global.Buffer = Buffer;
global.assert = assert;
global.BN = BN;

Buffer.prototype.subarray = function subarray(
  begin,
  end
) {
  const result = Uint8Array.prototype.subarray.apply(this, [begin, end]);
  Object.setPrototypeOf(result, Buffer.prototype); // Explicitly add the `Buffer` prototype (adds `readUIntLE`!)
  return result;
};

// Import expo-router AFTER polyfills are set up
import 'expo-router/entry';
