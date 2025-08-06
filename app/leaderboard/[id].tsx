import { COLORS, SPACING } from '@/constants/theme'
import { useDashhProgram } from '@/hooks/useDashhProgram'
import { Ionicons } from '@expo/vector-icons'
import * as Haptics from 'expo-haptics'
import { LinearGradient } from 'expo-linear-gradient'
import { router, useLocalSearchParams } from 'expo-router'
import React, { useEffect, useState } from 'react'
import {
    Alert,
    FlatList,
    RefreshControl,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native'

interface LeaderboardEntry {
  rank: number
  address: string
  points: number
  campaigns: number
}

import { useAuth } from '@/components/auth/auth-provider'
export default function LeaderboardScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [refreshing, setRefreshing] = useState(false)
  const [loading, setLoading] = useState(true)
  const { paccounts,updateParticipant } = useDashhProgram()
  const { publicKey } = useAuth()
  const [isParticipating, setIsParticipating] = useState(false)

  useEffect(() => {
    calculateLeaderboard()
    // Check if current user is participating
    if (paccounts.data && publicKey && id) {
      const userAddress = publicKey.toString()
      const participated = paccounts.data.some(
        (participant: any) =>
          participant.account.id.toString() === id &&
          participant.account.user.toString() === userAddress
      )
      setIsParticipating(participated)
    } else {
      setIsParticipating(false)
    }
  }, [paccounts.data, id, publicKey])

  const calculateLeaderboard = () => {
    try {
      setLoading(true)
      if (paccounts.data && id) {
        // Filter participants for this campaign
        const filtered = paccounts.data.filter(
          (participant: any) => participant.account.id.toString() === id
        )

        // Group by user and sum points
        const userStats = new Map<string, { points: number; campaigns: Set<string> }>()
        filtered.forEach((participant: any) => {
          const userAddress = participant.account.user.toString()
          const points = participant.account.points.toNumber()
          const campaignId = participant.account.id.toString()

          if (userStats.has(userAddress)) {
            const existing = userStats.get(userAddress)!
            existing.points += points
            existing.campaigns.add(campaignId)
          } else {
            userStats.set(userAddress, {
              points,
              campaigns: new Set([campaignId]),
            })
          }
        })

        // Convert to leaderboard format and sort by points
        const leaderboardData = Array.from(userStats.entries())
          .map(([address, stats]) => ({
            address,
            points: stats.points,
            campaigns: stats.campaigns.size,
          }))
          .sort((a, b) => b.points - a.points)
          .map((entry, index) => ({
            rank: index + 1,
            ...entry,
          }))

        setLeaderboard(leaderboardData)
      }
    } catch (error) {
      console.error('Error calculating leaderboard:', error)
    } finally {
      setLoading(false)
    }
  }

  const onRefresh = async () => {
    setRefreshing(true)
    await paccounts.refetch()
    calculateLeaderboard()
    setRefreshing(false)
  }

  const handleVerifyWithReclaim = async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
        const randomValue = Math.floor(Math.random() * 101)
      const updatedata=
           { id, points: randomValue } 
      Alert.alert(
        'Verify with Reclaim Protocol',
        'This will verify your engagement using zero-knowledge proofs. Continue?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Verify',
      onPress: async () => {
        Alert.alert('Verification Started', 'Reclaim Protocol verification is in progress...')
        await new Promise((resolve) => setTimeout(resolve, 1000))
        Alert.alert('Verification Complete', 'You have been verified successfully!(Due to unavailability of Reclaim Protocol, this is a simulated verification)',
        [
          {
            text: 'OK',
            onPress: () => {
              Alert.alert('You got verified!', randomValue.toString() + ' points will updated once you click on the Reclaim button below.',
                [
                  {
                    text: 'Cancel',
                    style: 'cancel',
                  },
                  {
                    text: 'Reclaim',
                    onPress: async () => {
                      await updateParticipant.mutateAsync(updatedata)
                    }
                  },
                  
                ]
              )
            },
          },
        ]
        )
      },
          },
        ]
      )
    } catch (error) {
      console.error('Error with Reclaim verification:', error)
      Alert.alert('Error', 'Failed to start verification process')
    }
    finally {
      paccounts.refetch()
      setLoading(false)}
    }

  const renderLeaderboardItem = ({ item }: { item: LeaderboardEntry }) => (
    <View style={styles.leaderboardItem}>
      <LinearGradient
        colors={[COLORS.SECONDARY_DARK, COLORS.PRIMARY_DARK]}
        style={styles.itemGradient}
      >
        <View style={styles.rankContainer}>
          {item.rank <= 3 ? (
            <LinearGradient
              colors={getRankColors(item.rank)}
              style={styles.topRankBadge}
            >
              <Ionicons 
                name={getRankIcon(item.rank)} 
                size={20} 
                color={COLORS.WHITE} 
              />
            </LinearGradient>
          ) : (
            <View style={styles.rankBadge}>
              <Text style={styles.rankText}>#{item.rank}</Text>
            </View>
          )}
        </View>

        <View style={styles.userInfo}>
          <Text style={styles.userAddress} numberOfLines={1}>
            {item.address.slice(0, 8)}...{item.address.slice(-8)}
          </Text>
          <Text style={styles.campaignCount}>
            {item.campaigns} campaign{item.campaigns !== 1 ? 's' : ''}
          </Text>
        </View>

        <View style={styles.pointsContainer}>
          <Text style={styles.pointsText}>{item.points}</Text>
          <Text style={styles.pointsLabel}>points</Text>
        </View>
      </LinearGradient>
    </View>
  )

  const getRankColors = (rank: number) => {
    switch (rank) {
      case 1:
        return ['#FFD700', '#FFA500'] as const // Gold
      case 2:
        return ['#C0C0C0', '#A9A9A9'] as const // Silver
      case 3:
        return ['#CD7F32', '#8B4513'] as const // Bronze
      default:
        return [COLORS.ACCENT_GREEN, COLORS.BRIGHT_GREEN] as const
    }
  }

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return 'trophy' as const
      case 2:
        return 'medal' as const
      case 3:
        return 'ribbon' as const
      default:
        return 'star' as const
    }
  }

  return (
    <LinearGradient colors={[COLORS.PRIMARY_DARK, COLORS.SECONDARY_DARK]} style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.WHITE} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Leaderboard</Text>
        <TouchableOpacity style={styles.verifyButton} onPress={handleVerifyWithReclaim}>
          <LinearGradient
            colors={[COLORS.ACCENT_GREEN, COLORS.BRIGHT_GREEN]}
            style={styles.verifyButtonGradient}
          >
            <Ionicons name="shield-checkmark" size={16} color={COLORS.WHITE} />
          </LinearGradient>
        </TouchableOpacity>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{leaderboard.length}</Text>
          <Text style={styles.statLabel}>Total Users</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>
            {leaderboard.reduce((sum, entry) => sum + entry.points, 0)}
          </Text>
          <Text style={styles.statLabel}>Total Points</Text>
        </View>
      </View>

      <FlatList
        data={leaderboard}
        renderItem={renderLeaderboardItem}
        keyExtractor={(item) => item.address}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="trophy-outline" size={48} color={COLORS.GRAY} />
            <Text style={styles.emptyTitle}>No Rankings Yet</Text>
            <Text style={styles.emptySubtitle}>
              Participate in this campaign to appear on the leaderboard!
            </Text>
          </View>
        }
      />
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.reclaimButton, !isParticipating && { opacity: 0.6 }]}
          onPress={handleVerifyWithReclaim}
          disabled={!isParticipating}
        >
          <LinearGradient
            colors={[COLORS.ACCENT_GREEN, COLORS.BRIGHT_GREEN]}
            style={styles.reclaimButtonGradient}
          >
            <Ionicons name="shield-checkmark" size={20} color={COLORS.WHITE} />
            <Text style={styles.reclaimButtonText}>Verify with Reclaim</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.LG,
    paddingTop: 60,
    paddingBottom: SPACING.LG,
  },
  backButton: {
    padding: SPACING.SM,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.WHITE,
  },
  verifyButton: {
    borderRadius: 16,
  },
  verifyButtonGradient: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    marginHorizontal: SPACING.LG,
    marginBottom: SPACING.LG,
    backgroundColor: `${COLORS.SECONDARY_DARK}50`,
    borderRadius: 16,
    paddingVertical: SPACING.MD,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.BRIGHT_GREEN,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.LIGHT_GREEN,
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    backgroundColor: COLORS.SECONDARY_DARK,
    marginVertical: SPACING.SM,
  },
  listContainer: {
    paddingHorizontal: SPACING.LG,
    paddingBottom: 120,
  },
  leaderboardItem: {
    marginBottom: SPACING.MD,
    borderRadius: 16,
    overflow: 'hidden',
  },
  itemGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.MD,
    paddingVertical: SPACING.MD,
  },
  rankContainer: {
    marginRight: SPACING.MD,
  },
  topRankBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rankBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: `${COLORS.BRIGHT_GREEN}20`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rankText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.BRIGHT_GREEN,
  },
  userInfo: {
    flex: 1,
    marginRight: SPACING.MD,
  },
  userAddress: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.WHITE,
    marginBottom: 2,
  },
  campaignCount: {
    fontSize: 12,
    color: COLORS.LIGHT_GREEN,
  },
  pointsContainer: {
    alignItems: 'flex-end',
  },
  pointsText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.BRIGHT_GREEN,
  },
  pointsLabel: {
    fontSize: 10,
    color: COLORS.GRAY,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.WHITE,
    marginTop: SPACING.MD,
  },
  emptySubtitle: {
    fontSize: 14,
    color: COLORS.GRAY,
    marginTop: SPACING.SM,
    textAlign: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: SPACING.LG,
    paddingVertical: SPACING.LG,
    backgroundColor: COLORS.PRIMARY_DARK,
  },
  reclaimButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  reclaimButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.MD,
    paddingHorizontal: SPACING.LG,
  },
  reclaimButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.WHITE,
    marginLeft: SPACING.SM,
  },
})
