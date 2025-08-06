import { useState } from "react";
import { View, Button, Text } from "react-native";
import { handleVerificationError, startVerification } from "./verification";

export function ReclaimDemo() {
  const [status, setStatus] = useState('Ready to start verification');
  const [isVerifying, setIsVerifying] = useState(false);
 
  const handleStartVerification = async () => {
    setIsVerifying(true);
    setStatus('Starting verification...');
    
    try {
      const result = await startVerification();
      if (result && result.proofs) {
        setStatus('Verification successful!');
        console.log('Proofs received:', result.proofs);
      }
    } catch (error) {
      setStatus('Verification failed');
      handleVerificationError(error);
    } finally {
      setIsVerifying(false);
    }
  };
 
  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Reclaim InApp Demo</Text>
      <Text style={{ marginVertical: 10 }}>Status: {status}</Text>
      <Button 
        title={isVerifying ? "Verifying..." : "Start Verification"} 
        onPress={handleStartVerification}
        disabled={isVerifying}
      />
    </View>
  );
}