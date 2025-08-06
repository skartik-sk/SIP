import { useAuth } from '@/components/auth/auth-provider'
import { COLORS, SPACING } from '@/constants/theme'
import { useDashhProgram } from '@/hooks/useDashhProgram'
import { bnToTimestamp } from '@/utils/lamports-to-sol'
import { Ionicons } from '@expo/vector-icons'
import * as Haptics from 'expo-haptics'
import { LinearGradient } from 'expo-linear-gradient'
import { router, useLocalSearchParams } from 'expo-router'
import React, { useEffect, useState } from 'react'
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'

interface CampaignDetails {
  id: string
  title: string
  description: string
  image: string
  reward: number
  endTime: number
  participants: number
  creator: string
  isParticipating: boolean
}

export default function CampaignDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const [campaign, setCampaign] = useState<CampaignDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [participating, setParticipating] = useState(false)
  
  const { accounts, paccounts, createParticipant } = useDashhProgram()
  const { isAuthenticated, publicKey } = useAuth()

  useEffect(() => {
    loadCampaignDetails()
  }, [id, accounts.data, paccounts.data])

  const loadCampaignDetails = () => {
    try {
      setLoading(true)
      
      if (!accounts.data || !id) return

      // Find the campaign
      const campaignAccount = accounts.data.find(
        (account: any) => account.account.id.toString() === id
      )

      if (!campaignAccount) {
        Alert.alert('Error', 'Campaign not found')
        router.back()
        return
      }

      // Count participants for this campaign
      const participantCount = paccounts.data?.filter(
        (participant: any) => participant.account.id.toString() === id
      ).length || 0

      // Check if current user is participating
      const userAddress = publicKey?.toString() || ''
      const isParticipating = paccounts.data?.some(
        (participant: any) => 
          participant.account.id.toString() === id &&
          participant.account.user.toString() === userAddress
      ) || false

      const campaignData: CampaignDetails = {
        id: campaignAccount.account.id.toString(),
        title: campaignAccount.account.title,
        description: campaignAccount.account.image,
        image: campaignAccount.account.description,
        reward: campaignAccount.account.reward.toNumber() , // Convert lamports to SOL
        endTime: bnToTimestamp(campaignAccount.account.endtime.toNumber()),
        participants: participantCount,
        creator: campaignAccount.account.owner.toString(),
        isParticipating,
      }

      setCampaign(campaignData)
    } catch (error) {
      console.error('Error loading campaign details:', error)
      Alert.alert('Error', 'Failed to load campaign details')
    } finally {
      setLoading(false)
    }
  }

  const handleParticipate = async () => {
    if (!isAuthenticated) {
      Alert.alert('Connect Wallet', 'Please connect your wallet to participate')
      return
    }

    if (!campaign) return

    try {
      setParticipating(true)
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)

      
              try {
                await createParticipant.mutateAsync({
                  id: campaign.id,
                })
                
                Alert.alert(
                  'Success!',
                  'You have successfully joined the campaign. Start engaging to earn points!'
                )
                
                loadCampaignDetails() // Refresh data
              } catch (error) {
                console.error('Error joining campaign:', error)
                Alert.alert('Error', 'Failed to join campaign. Please try again.')
            }
    } catch (error) {
      console.error('Error participating:', error)
    } finally {
      setParticipating(false)
      paccounts.refetch()
    }
  }

  const formatTimeRemaining = (endTime: number) => {
    const now = Math.floor(Date.now() / 1000)
    const timeLeft = endTime - now
    
    if (timeLeft <= 0) return 'Ended'
    
    const days = Math.floor(timeLeft / (24 * 60 * 60))
    const hours = Math.floor((timeLeft % (24 * 60 * 60)) / (60 * 60))
    
    if (days > 0) return `${days}d ${hours}h left`
    if (hours > 0) return `${hours}h left`
    return 'Less than 1h left'
  }

  if (loading || !campaign) {
    return (
      <LinearGradient colors={[COLORS.PRIMARY_DARK, COLORS.SECONDARY_DARK]} style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading campaign...</Text>
        </View>
      </LinearGradient>
    )
  }

  return (
    <LinearGradient colors={[COLORS.PRIMARY_DARK, COLORS.SECONDARY_DARK]} style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header with back button */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={COLORS.WHITE} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.shareButton}>
            <Ionicons name="share-outline" size={24} color={COLORS.WHITE} />
          </TouchableOpacity>
        </View>

        {/* Campaign Image */}
        <Image source={{ uri: campaign.image }} style={styles.campaignImage} />

        {/* Campaign Info */}
        <View style={styles.contentContainer}>
          <View style={styles.titleSection}>
            <Text style={styles.campaignTitle}>{campaign.title}</Text>
            <View style={styles.timeContainer}>
              <Ionicons name="time" size={16} color={COLORS.LIGHT_GREEN} />
              <Text style={styles.timeText}>{formatTimeRemaining(campaign.endTime)}</Text>
            </View>
          </View>

          {/* Stats Row */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Ionicons name="diamond" size={20} color={COLORS.BRIGHT_GREEN} />
              <Text style={styles.statValue}>{campaign.reward} SOL</Text>
              <Text style={styles.statLabel}>Reward</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="people" size={20} color={COLORS.LIGHT_GREEN} />
              <Text style={styles.statValue}>{campaign.participants}</Text>
              <Text style={styles.statLabel}>Participants</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="person" size={20} color={COLORS.LIGHTEST_GREEN} />
              <Text style={styles.statValue} numberOfLines={1}>
                {campaign.creator.slice(0, 6)}...
              </Text>
              <Text style={styles.statLabel}>Creator</Text>
            </View>
          </View>

          {/* Description */}
          <View style={styles.descriptionSection}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{campaign.description}</Text>
          </View>

          {/* Leaderboard Button (if participating, show above How to Participate) */}
          {campaign.isParticipating && (
            <View style={{marginBottom: 24}}>
              <TouchableOpacity
                style={styles.participateButton}
                onPress={() => router.push(`/leaderboard/${campaign.id}`)}
              >
                <LinearGradient
                  colors={[COLORS.ACCENT_GREEN, COLORS.BRIGHT_GREEN]}
                  style={styles.participateButtonGradient}
                >
                  <Ionicons name="trophy" size={20} color={COLORS.WHITE} />
                  <Text style={styles.participateButtonText}>View Leaderboard</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          )}

          {/* How to Participate */}
          <View style={styles.howToSection}>
            <Text style={styles.sectionTitle}>How to Participate</Text>
            <View style={styles.stepContainer}>
              <StepItem
                step={1}
                title="Join Campaign"
                description="Click the participate button to join this campaign"
              />
              <StepItem
                step={2}
                title="Complete Tasks"
                description="Follow campaign instructions and complete engagement tasks"
              />
              <StepItem
                step={3}
                title="Verify with Reclaim"
                description="Use Reclaim Protocol to verify your engagement and earn points"
              />
              <StepItem
                step={4}
                title="Earn Rewards"
                description="Get rewarded based on your verified engagement"
              />
            </View>
          </View>

          {/* Leaderboard Button (if NOT participating, show below Earn Rewards) */}
          {!campaign.isParticipating && (
            <View style={{marginTop: 24}}>
              <TouchableOpacity
                style={styles.participateButton}
                onPress={() => router.push(`/leaderboard/${campaign.id}`)}
              >
                <LinearGradient
                  colors={[COLORS.ACCENT_GREEN, COLORS.BRIGHT_GREEN]}
                  style={styles.participateButtonGradient}
                >
                  <Ionicons name="trophy" size={20} color={COLORS.WHITE} />
                  <Text style={styles.participateButtonText}>View Leaderboard</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Participate Button */}
      {!campaign.isParticipating && (
        <View style={styles.participateContainer}>
          <TouchableOpacity
            style={[styles.participateButton, participating && styles.participateButtonDisabled]}
            onPress={handleParticipate}
            disabled={participating}
          >
            <LinearGradient
              colors={participating ? [COLORS.GRAY, COLORS.GRAY] : [COLORS.ACCENT_GREEN, COLORS.BRIGHT_GREEN]}
              style={styles.participateButtonGradient}
            >
              {participating ? (
                <Text style={styles.participateButtonText}>Joining...</Text>
              ) : (
                <>
                  <Ionicons name="rocket" size={20} color={COLORS.WHITE} />
                  <Text style={styles.participateButtonText}>Participate Now</Text>
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>
      )}

      {campaign.isParticipating && (
        <View style={styles.participateContainer}>
          <View style={styles.participatingIndicator}>
            <LinearGradient
              colors={[COLORS.BRIGHT_GREEN, COLORS.LIGHT_GREEN]}
              style={[styles.participatingGradient, { opacity: 0.6 }]}
            >
              <Ionicons name="checkmark-circle" size={20} color={COLORS.WHITE}  />
              <Text style={styles.participatingText}>Already Participating</Text>
            </LinearGradient>
          </View>
        </View>
      )}
    </LinearGradient>
  )
}

const StepItem = ({ step, title, description }: {
  step: number
  title: string
  description: string
}) => (
  <View style={styles.stepItem}>
    <View style={styles.stepNumber}>
      <Text style={styles.stepNumberText}>{step}</Text>
    </View>
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>{title}</Text>
      <Text style={styles.stepDescription}>{description}</Text>
    </View>
  </View>
)

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: COLORS.WHITE,
  },
  header: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.LG,
    zIndex: 1,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shareButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  campaignImage: {
    width: '100%',
    height: 250,
  },
  contentContainer: {
    paddingHorizontal: SPACING.LG,
    paddingBottom: 120,
  },
  titleSection: {
    marginTop: SPACING.LG,
    marginBottom: SPACING.LG,
  },
  campaignTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.WHITE,
    marginBottom: SPACING.SM,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    fontSize: 14,
    color: COLORS.LIGHT_GREEN,
    marginLeft: 4,
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: `${COLORS.SECONDARY_DARK}50`,
    borderRadius: 16,
    paddingVertical: SPACING.LG,
    marginBottom: SPACING.LG,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.WHITE,
    marginTop: 4,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.GRAY,
  },
  descriptionSection: {
    marginBottom: SPACING.LG,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.WHITE,
    marginBottom: SPACING.MD,
  },
  description: {
    fontSize: 16,
    color: COLORS.LIGHTEST_GREEN,
    lineHeight: 24,
  },
  howToSection: {
    marginBottom: SPACING.LG,
  },
  stepContainer: {
    gap: SPACING.MD,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.BRIGHT_GREEN,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.MD,
  },
  stepNumberText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.WHITE,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.WHITE,
    marginBottom: 4,
  },
  stepDescription: {
    fontSize: 14,
    color: COLORS.LIGHT_GREEN,
    lineHeight: 20,
  },
  participateContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: SPACING.LG,
    paddingVertical: SPACING.LG,
    backgroundColor: COLORS.PRIMARY_DARK,
  },
  participateButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  participateButtonDisabled: {
    opacity: 0.6,
  },
  participateButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.MD,
    paddingHorizontal: SPACING.LG,
  },
  participateButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.WHITE,
    marginLeft: SPACING.SM,
  },
  participatingIndicator: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  participatingGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.MD,
    paddingHorizontal: SPACING.LG,
  },
  participatingText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.WHITE,
    marginLeft: SPACING.SM,
  },
})
