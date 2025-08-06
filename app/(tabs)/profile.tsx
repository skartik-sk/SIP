import { AccountUiBalance } from '@/components/account/account-ui-balance'
import { useGetBalance } from '@/components/account/use-get-balance'
import { useAuth } from '@/components/auth/auth-provider'
import { WalletUiButtonConnect } from '@/components/solana/wallet-ui-button-connect'
import { useDashhProgram } from '@/hooks/useDashhProgram'
import { lamportsToSol } from '@/utils/lamports-to-sol'
import { Ionicons } from '@expo/vector-icons'
import * as Haptics from 'expo-haptics'
import { LinearGradient } from 'expo-linear-gradient'
import React, { use, useEffect, useState } from 'react'
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'

interface UserStats {
  balance: number
  totalEarnings: number
  participatedCampaigns: number
  createdCampaigns: number
  rank: number
}

export default function ProfileScreen() {
  const authData = useAuth()
  const { isAuthenticated, publicKey, disconnect } = authData || {}
  const { accounts, paccounts } = useDashhProgram()
  const [userStats, setUserStats] = useState<UserStats>({
    balance: 0,
    totalEarnings: 0,
    participatedCampaigns: 0,
    createdCampaigns: 0,
    rank: 0,
  })
  const query = useGetBalance({ address: publicKey })
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    if (isAuthenticated && publicKey) {
        console.log("Calculating user stats...");

      calculateUserStats()
    }
  }, [isAuthenticated, publicKey, accounts?.data, paccounts?.data])

  const calculateUserStats = () => {
    if (!publicKey || !accounts?.data || !paccounts?.data) return

    const userAddress = publicKey.toString()

    // Calculate created campaigns
    const createdCampaigns = accounts.data.filter(
      (account: any) => {
        return account?.account?.owner?.toString() === userAddress
      }
    ).length

    // Calculate participated campaigns
    const participatedCampaigns = paccounts.data.filter(
      (account: any) => {
        return account?.account?.user?.toString() === userAddress
      }
    ).length

    // Calculate total earnings
    const totalEarnings = paccounts.data
      .filter((account: any) => account?.account?.user?.toString() === userAddress)
      .reduce((total: number, account: any) => total + (account?.account?.points || 0), 0) / 1000000000

    setUserStats({
      balance: 2.5, // Mock balance
      totalEarnings,
      participatedCampaigns,
      createdCampaigns,
      rank: Math.max(1, 100 - (participatedCampaigns * 5) - (createdCampaigns * 10)),
    })
  }

  const onRefresh = () => {
    setRefreshing(true)
    calculateUserStats()
    setTimeout(() => setRefreshing(false), 1000)
  }

  const handleDisconnect = () => {
    if (!disconnect) return
    
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    Alert.alert(
      'Disconnect Wallet',
      'Are you sure you want to disconnect your wallet?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Disconnect',
          style: 'destructive',
          onPress: () => {
            disconnect()
          },
        },
      ]
    )
  }

  // Show loading state if auth data is not ready
  if (!authData) {
    return (
      <LinearGradient colors={['#0E151A', '#134156']} className="flex-1">
        <View className="flex-1 items-center justify-center">
          <Text className="text-white text-lg">Loading...</Text>
        </View>
      </LinearGradient>
    )
  }

  if (!isAuthenticated) {
    return (
      <LinearGradient colors={['#0E151A', '#134156']} className="flex-1">
        <View className="flex-1 items-center justify-center px-6">
          <Ionicons name="wallet-outline" size={64} color="#6B7280" />
          <Text className="text-xl font-bold text-white mt-6 mb-3">Connect Your Wallet</Text>
          <Text className="text-[#8DFFF0] text-center mb-8">
            Connect your Solana wallet to view your profile and track your campaigns
          </Text>
          <View className="w-full">
            <WalletUiButtonConnect />
          </View>
        </View>
      </LinearGradient>
    )
  }

  return (
    <LinearGradient colors={['#0E151A', '#134156']} className="flex-1">
      <ScrollView
        className="flex-1"
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="flex-row justify-between items-center px-6 pt-12 pb-6">
          <View className="flex-row items-center flex-1">
            <LinearGradient
              colors={['#8DFFF0', '#14F1B2']}
              className="w-16 h-16 rounded-full items-center justify-center mr-4"
            >
              <Ionicons name="person" size={32} color="white" />
            </LinearGradient>
            <View className="flex-1">
              <Text className="text-white font-bold text-lg" numberOfLines={1}>
                {publicKey?.toString().slice(0, 8)}...{publicKey?.toString().slice(-8)}
              </Text>
              <Text className="text-[#00B49F] text-sm">Solana Influencer</Text>
            </View>
          </View>
          <TouchableOpacity className="p-2" onPress={handleDisconnect}>
            <Ionicons name="log-out-outline" size={24} color="#6B7280" />
          </TouchableOpacity>
        </View>

        {/* Stats Grid */}
        <View className="px-6 mb-8">
          <Text className="text-white text-xl font-bold mb-6">Your Stats</Text>
          <View className="flex-row flex-wrap justify-between">
            <StatCard
            
              title="Balance"
              value={`${query.isLoading ? <ActivityIndicator /> : query.data ? lamportsToSol(query.data) : '0'} SOL`}
              icon="wallet"
              gradient={['#0E151A', '#134156']}
            />
            <StatCard
              title="Total Earned"
              value={`${userStats.totalEarnings.toFixed(3)} SOL`}
              icon="diamond"
              gradient={['#0E151A', '#134156']}
            />
            <StatCard
              title="Campaigns Created"
              value={userStats.createdCampaigns.toString()}
              icon="megaphone"
              gradient={['#0E151A', '#134156']}
            />
            <StatCard
              title="Participated"
              value={userStats.participatedCampaigns.toString()}
              icon="people"
              gradient={['#0E151A', '#134156']}
            />
          </View>
        </View>

        {/* Rank Section */}
        <View className="px-6 mb-8">
          <LinearGradient
           style={{ borderRadius: 16 }} 
            colors={['#134156', '#0E151A']}
            className="rounded-3xl p-6 shadow-lg"
          >
            <View className="flex-row items-center justify-between">
              <View className="flex-1">
                <Text className="text-[#8DFFF0] text-sm font-medium">Your Global Rank</Text>
                <Text className="text-white text-3xl font-bold mt-1">#{userStats.rank}</Text>
                <Text className="text-[#C5FFF8] text-sm mt-2">Keep engaging to climb higher!</Text>
              </View>
              <LinearGradient
                colors={['#14F1B2', '#00B49F']}
                className="w-16 h-16 rounded-3xl items-center justify-center shadow-md"
              >
                <Ionicons name="trophy" size={32} color="white" />
              </LinearGradient>
            </View>
          </LinearGradient>
        </View>

        {/* Quick Actions */}
        <View className="px-6 mb-8">
          <Text className="text-white text-xl font-bold mb-6">Quick Actions</Text>
          <View style={{ gap: 16 }}>
            <ActionButton
              title="Create Campaign"
              subtitle="Start a new engagement campaign"
              icon="add-circle"
              bgColor="bg-[#134156]"
              borderColor="border-[#00B49F]"
              iconColor="#14F1B2"
              onPress={() => {}}
            />
            <ActionButton
              title="View History"
              subtitle="See your campaign activity"
              icon="time"
              bgColor="bg-[#134156]"
              borderColor="border-[#8DFFF0]"
              iconColor="#8DFFF0"
              onPress={() => {}}
            />
            <ActionButton
              title="Leaderboard"
              subtitle="Compare with other users"
              icon="trophy"
              bgColor="bg-[#134156]"
              borderColor="border-[#C5FFF8]"
              iconColor="#C5FFF8"
              onPress={() => {}}
            />
          </View>
        </View>

        {/* Recent Activity */}
        <View className="px-6 pb-6">
          <Text className="text-white text-xl font-bold mb-4">Recent Activity</Text>
          <View style={{ gap: 12 }}>
            <ActivityItem
              title="Completed Campaign"
              subtitle="Crypto Education Campaign"
              time="2 hours ago"
              icon="checkmark-circle"
            />
            <ActivityItem
              title="Created Campaign"
              subtitle="NFT Art Promotion"
              time="1 day ago"
              icon="add-circle"
            />
            <ActivityItem
              title="Earned Rewards"
              subtitle="0.5 SOL from engagement"
              time="3 days ago"
              icon="diamond"
            />
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  )
}

const StatCard = ({ title, value, icon, gradient }: { 
  title: string
  value: string
  icon: string
  gradient: [string, string]
}) => (
  <View className="w-[47%] mb-6">
    <LinearGradient
      colors={gradient}
      style={{ borderRadius: 16 }} // Ensures rounded corners
      className="p-5 shadow-lg"
    >
      <View className="items-center">
        <Ionicons name={icon as any} size={28} color="#14F1B2" />
        <Text className="text-white text-lg font-bold mt-3">{value}</Text>
        <Text className="text-[#C5FFF8] text-xs font-medium">{title}</Text>
      </View>
    </LinearGradient>
  </View>
)

const ActionButton = ({ title, subtitle, icon, bgColor, borderColor, iconColor, onPress }: {
  title: string
  subtitle: string
  icon: string
  bgColor: string
  borderColor: string
  iconColor: string
  onPress: () => void
}) => (
  <TouchableOpacity
    className={`${bgColor} ${borderColor} border rounded-3xl p-4 flex-row items-center shadow-sm`}
    onPress={onPress}
    activeOpacity={0.8}
  >
    <Ionicons name={icon as any} size={22} color={iconColor} />
    <View className="flex-1 ml-4">
      <Text className="text-white font-semibold text-base">{title}</Text>
      <Text className="text-gray-300 text-sm mt-1">{subtitle}</Text>
    </View>
    <Ionicons name="chevron-forward" size={20} color="#6B7280" />
  </TouchableOpacity>
)

const ActivityItem = ({ title, subtitle, time, icon }: {
  title: string
  subtitle: string
  time: string
  icon: string
}) => (
  <View className="bg-[#134156] rounded-xl p-4 flex-row items-center">
    <LinearGradient
      colors={['#8DFFF0', '#14F1B2']}
      className="w-10 h-10 rounded-full items-center justify-center mr-3"
    >
      <Ionicons name={icon as any} size={20} color="white" />
    </LinearGradient>
    <View className="flex-1">
      <Text className="text-white font-semibold">{title}</Text>
      <Text className="text-[#8DFFF0] text-sm">{subtitle}</Text>
      <Text className="text-gray-400 text-xs mt-1">{time}</Text>
    </View>
  </View>
)
