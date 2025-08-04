import { useAuth } from '@/components/auth/auth-provider'
import { WalletConnectButton } from '@/components/ui/wallet-connect-button'
import * as Haptics from 'expo-haptics'
import { LinearGradient } from 'expo-linear-gradient'
import React from 'react'
import { Image, SafeAreaView, ScrollView, Text, View } from 'react-native'

export default function SignInScreen() {
  const { signIn, isLoading } = useAuth()

  const handleConnectWallet = async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
      await signIn()
    } catch (error) {
      console.error('Failed to connect wallet:', error)
    }
  }

  return (
    <LinearGradient
      colors={['#0E151A', '#134156']}
      className="flex-1"
    >
      <SafeAreaView className="flex-1">
        <ScrollView 
          className="flex-1"
          contentContainerStyle={{ 
            flexGrow: 1, 
            justifyContent: 'center', 
            paddingHorizontal: 24,
            paddingVertical: 20 
          }}
        >
          {/* Logo */}
          <View className="items-center mb-6">
            <Image 
              source={require('@/assets/images/logo.jpg')}
              style={{ width: 80, height: 80 }}
              className="rounded-full"
              resizeMode="cover"
            />
          </View>

          {/* App Title */}
          <View className="items-center mb-6">
            <Text className="text-2xl font-bold text-[#14F1B2] text-center mb-2">
              DASHH
            </Text>
            <Text className="text-sm text-[#00B49F] text-center">
              Decentralized Engagement Platform
            </Text>
          </View>

          {/* App Description */}
          <View className="mb-6 items-center">
            <Text className="text-sm text-white text-center leading-5 mb-3">
              The new ad platform focused on helping brands reach the masses through micro-influencers
            </Text>
            
            <View className="items-start">
              <FeatureItem text="Transparent & Verified Engagement" />
              <FeatureItem text="Direct Payments via Blockchain" />
              <FeatureItem text="Real-time Campaign Tracking" />
              <FeatureItem text="zkTLS Proofs for Privacy" />
            </View>
          </View>

          {/* Connect Wallet Button */}
          <View className="w-full mb-4">
            <WalletConnectButton 
              onPress={handleConnectWallet}
              loading={isLoading}
            />
          </View>

          {/* Footer */}
          <Text className="text-xs text-gray-400 text-center">
            Powered by Solana & Reclaim Protocol
          </Text>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  )
}

const FeatureItem = ({ text }: { text: string }) => (
  <View className="flex-row items-center mb-1">
    <View className="w-1 h-1 rounded-full bg-[#14F1B2] mr-2" />
    <Text className="text-xs text-[#8DFFF0]">{text}</Text>
  </View>
)
