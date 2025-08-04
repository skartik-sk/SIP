import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'

interface WalletConnectButtonProps {
  onPress?: () => void
  loading?: boolean
  connected?: boolean
}

export function WalletConnectButton({ 
  onPress, 
  loading = false, 
  connected = false 
}: WalletConnectButtonProps) {
  const handlePress = () => {
    if (onPress) {
      onPress()
    }
  }

  if (connected) {
    return (
      <TouchableOpacity 
        className="rounded-xl bg-[#14F1B2]/20 border border-[#14F1B2]" 
        onPress={handlePress}
      >
        <View className="flex-row items-center justify-center py-4 px-6">
          <Ionicons name="checkmark-circle" size={20} color="#14F1B2" />
          <Text className="text-[#14F1B2] font-bold text-base ml-2">Wallet Connected</Text>
        </View>
      </TouchableOpacity>
    )
  }

  return (
    <TouchableOpacity 
      className={`rounded-xl overflow-hidden ${loading ? 'opacity-60' : ''}`}
      onPress={handlePress}
      disabled={loading}
    >
      <LinearGradient
        colors={loading ? ['#6B7280', '#6B7280'] : ['#8DFFF0', '#14F1B2']}
        className="flex-row items-center justify-center py-4 px-6"
      >
        {loading ? (
          <Text className="text-white font-bold text-base">Connecting...</Text>
        ) : (
          <>
            <Ionicons name="wallet" size={20} color="white" />
            <Text className="text-white font-bold text-base ml-2">Connect Wallet</Text>
          </>
        )}
      </LinearGradient>
    </TouchableOpacity>
  )
}
