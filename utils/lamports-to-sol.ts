import { LAMPORTS_PER_SOL } from '@solana/web3.js'

export function lamportsToSol(balance: number) {
  return Math.round((balance / LAMPORTS_PER_SOL) * 100000) / 100000
}
 export const bnToNumber =(value: any) => {
            if (!value) return 0;
            if (typeof value === 'number') return value;
            
            // Handle Anchor BN objects
            if (value && typeof value === 'object') {
              // Try using BN methods
              if (value.toNumber && typeof value.toNumber === 'function') {
                try {
                  return value.toNumber();
                } catch (e) {
                  // If toNumber fails due to size, try toString then parse
                  console.warn("BN too large for toNumber, using toString:", e);
                  try {
                    return parseInt(value.toString());
                  } catch (e2) {
                    console.warn("Failed to parse BN string:", e2);
                    return 0;
                  }
                }
              }
              
              // Try toString method for very large BNs
              if (value.toString && typeof value.toString === 'function') {
                try {
                  const strValue = value.toString();
                  return parseInt(strValue);
                } catch (e) {
                  console.warn("Failed to convert BN toString to number:", e);
                  return 0;
                }
              }
              
              // Handle plain objects with _bn property (common in Anchor)
              if (value._bn) {
                try {
                  return parseInt(value._bn.toString());
                } catch (e) {
                  console.warn("Failed to convert _bn property:", e);
                  return 0;
                }
              }
            }
            
            return 0;
          };

          // Helper function to convert BN to SOL amount
         export const bnToSol = (value: any) => {
            const lamports = bnToNumber(value);
            return lamports  // Convert lamports to SOL
          };

          // Helper function to convert BN timestamp to reasonable date
          export const bnToTimestamp = (value: any) => {
            const timestamp = bnToNumber(value);
            
            // Handle common timestamp formats
            if (timestamp === 0) {
              // If timestamp is 0, set to far future (campaign never expires)
              return Math.floor(Date.now() / 1000) + (365 * 24 * 60 * 60); // 1 year from now
            }
            
            // If timestamp looks like seconds since epoch (reasonable range)
            if (timestamp > 1_000_000_000 && timestamp < 4_000_000_000) {
              return timestamp;
            }
            
            // If timestamp is very small, treat as duration from now
            if (timestamp < 1_000_000) {
              return Math.floor(Date.now() / 1000) + timestamp;
            }
            
            // If timestamp is too large, try to make sense of it
            if (timestamp > 4_000_000_000) {
              // Might be milliseconds, convert to seconds
              const tsInSeconds = Math.floor(timestamp / 1000);
              if (tsInSeconds > 1_000_000_000 && tsInSeconds < 4_000_000_000) {
                return tsInSeconds;
              }
              // If still too large, use current time + 1 hour as fallback
              return Math.floor(Date.now() / 1000) + 3600;
            }
            
            return timestamp;
          };