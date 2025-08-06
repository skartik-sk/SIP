import { ReclaimVerification } from '@reclaimprotocol/inapp-rn-sdk';
import { Alert } from 'react-native/Libraries/Alert/Alert';
export async function startVerification() {
    const reclaimVerification = new ReclaimVerification();
  try {
    const verificationResult = await reclaimVerification.startVerification({
      appId: "0xbf47BAF421Af158dA0901cF65741d1b628559938",
      secret: "0x6433cffb41cdc55c801a8b57119f22574d92067f5982cff828c77bff5ae0e55c",
      providerId: "8f548df0-4a8b-4672-b1fb-f103cbf51832",
    });
    
    // Handle successful verification
    if (verificationResult.proofs) {
      console.log('Verification successful:', verificationResult.proofs);
      return verificationResult;
    }
  } catch (error) {
    // Handle verification errors
    handleVerificationError(error);
  }
}

export function handleVerificationError(error) {
  if (error instanceof ReclaimVerification.ReclaimVerificationException) {
    switch (error.type) {
      case ReclaimVerification.ExceptionType.Cancelled:
        Alert.alert('Verification Cancelled', 'The verification process was cancelled by the user.');
        break;
      case ReclaimVerification.ExceptionType.Dismissed:
        Alert.alert('Verification Dismissed', 'The verification process was dismissed.');
        break;
      case ReclaimVerification.ExceptionType.SessionExpired:
        Alert.alert('Session Expired', 'The verification session has expired. Please try again.');
        break;
      case ReclaimVerification.ExceptionType.Failed:
      default:
        Alert.alert('Verification Failed', 'The verification process failed. Please try again.');
    }
    
    // Access additional error details
    console.log('Session ID:', error.sessionId);
    console.log('Reason:', error.reason);
    console.log('Inner Error:', error.innerError);
  } else {
    Alert.alert('Error', error instanceof Error ? error.message : 'An unknown verification error occurred');
  }
}