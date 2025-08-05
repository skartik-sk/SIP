import { useAuth } from '@/components/auth/auth-provider'
import { useDashhProgram } from '@/hooks/useDashhProgram'
import { Campaign,Participant } from '@/types/campaign'
import { bnToSol, bnToTimestamp } from '@/utils/lamports-to-sol'
import { Ionicons } from '@expo/vector-icons'
import * as Haptics from 'expo-haptics'
import { LinearGradient } from 'expo-linear-gradient'
import { router } from 'expo-router'
import React, { useEffect, useState } from 'react'
import {
  Alert,
  FlatList,
  Image,
  RefreshControl,
  Text,
  TouchableOpacity,
  View
} from 'react-native'



export default function DiscoverScreen() {
  const [campaigns, setCampaigns] = useState([])
  const [allCampaigns, setAllCampaigns] = useState([])
  const [refreshing, setRefreshing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [showPastCampaigns, setShowPastCampaigns] = useState(false)
  const { accounts,getProgramAccount , paccounts } = useDashhProgram()
  const { isAuthenticated } = useAuth()
  useEffect(() => {
    console.log("🚀 Fetching program account...");
    loadCampaigns()
  }, [accounts.data])

  const getParticipants = (campaignId: string) => {
    if (!paccounts.data) return 0
    const participants = paccounts.data.filter((p: any) => p.account.id.toString()  === campaignId)
    return participants.length
  }

  const filterCampaigns = (allCampaignsData: any[], showPast: boolean) => {
    const currentTime = Math.floor(Date.now() / 1000)
    
    if (showPast) {
      // Show past/expired campaigns
      const pastCampaigns = allCampaignsData.filter(campaign => campaign.endtime < currentTime)
      console.log(`📜 Filtering past campaigns: ${pastCampaigns.length} found`)
      setCampaigns(pastCampaigns)
    } else {
      // Show active/live campaigns
      const activeCampaigns = allCampaignsData.filter(campaign => campaign.endtime >= currentTime)
      console.log(`🔴 Filtering active campaigns: ${activeCampaigns.length} found`)
      setCampaigns(activeCampaigns)
    }
  }

  const toggleCampaignView = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    const newShowPast = !showPastCampaigns
    setShowPastCampaigns(newShowPast)
    filterCampaigns(allCampaigns, newShowPast)
    console.log(`🔄 Toggled to ${newShowPast ? 'past' : 'live'} campaigns`)
  }

  const loadCampaigns = async () => {
    try {
      setLoading(true)
      console.log("🔄 Loading campaigns from useDashhProgram...");
      
      // The campaigns are automatically loaded via React Query in useDashhProgram
      // We just need to process the data when it's available
      if (accounts.data && Array.isArray(accounts.data) && accounts.data.length > 0) {
        // console.log(`✅ Processing ${accounts.data.length} campaigns from blockchain`);
        
        const campaignData = accounts.data.map((account: any) => {
          // Helper function to safely convert BN to number using Anchor's BN
        

          const campaignData = {
            id: account?.account?.id?.toString() || 'unknown',
            title: account?.account?.title || 'Untitled',
            description: account?.account?.image || 'No description', // Swapped: description is in image field
            image: account?.account?.description || '', // Swapped: image is in description field
            reward: bnToSol(account?.account?.reward), // Convert lamports to SOL properly
            endtime: bnToTimestamp(account?.account?.endtime),
            participants: 0, // This would come from participants query
            creator: account?.account?.owner?.toString() || 'unknown',
          };
          
         
          
          return campaignData;
        });
        
        setAllCampaigns(campaignData)
        filterCampaigns(campaignData, showPastCampaigns)
      } else {
        console.log("📭 No campaigns found, keeping current state");
        // Don't replace campaigns if no data is available - let React Query handle it
      }
    } catch (error) {
      console.error('❌ Failed to load campaigns:', error)
    } finally {
      setLoading(false)
    }
  }

  const onRefresh = async () => {
    setRefreshing(true)
    await accounts.refetch()
    await loadCampaigns()
    setRefreshing(false)
  }

  const handleCreateCampaign = () => {
    if (!isAuthenticated) {
      Alert.alert('Connect Wallet', 'Please connect your wallet to create campaigns')
      return
    }
    router.push('/create-campaign')
  }

  const handleCampaignPress = (campaign: any) => {
    if (!campaign?.id) return;
    
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    router.push(`/campaign/${campaign.id}`)
  }

  const handleLeaderboard = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    router.push('/leaderboard')
  }

  const renderCampaignCard = ({ item }: { item: Campaign }) => {
    if (!item) return null;
    
    const isExpired = (item.endtime || 0) < Math.floor(Date.now() / 1000)
    
    return (
      <TouchableOpacity
        style={{
          marginBottom: 24,
          marginHorizontal: 24,
          borderRadius: 24,
          overflow: 'hidden',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          opacity: isExpired ? 0.7 : 1,
        }}
        onPress={() => handleCampaignPress(item)}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={isExpired ? ['#2A2A2A', '#1A1A1A'] : ['#134156', '#0E151A']}
          style={{ padding: 24 }}
        >
          {/* Status Badge */}
          <View style={{
            position: 'absolute',
            top: 16,
            right: 16,
            backgroundColor: isExpired ? '#FF6B6B33' : '#14F1B233',
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderRadius: 12,
            flexDirection: 'row',
            alignItems: 'center',
            zIndex: 1,
          }}>
            <Ionicons 
              name={isExpired ? "time-outline" : "flash"} 
              size={12} 
              color={isExpired ? '#FF6B6B' : '#14F1B2'} 
            />
            <Text style={{
              color: isExpired ? '#FF6B6B' : '#14F1B2',
              fontSize: 10,
              fontWeight: '600',
              marginLeft: 4,
            }}>
              {isExpired ? 'ENDED' : 'LIVE'}
            </Text>
          </View>

          <Image 
            source={{ uri: item.image || 'https://via.placeholder.com/400x200' }} 
            style={{
              width: '100%',
              height: 192,
              borderRadius: 16,
              marginBottom: 16,
            }}
            resizeMode="cover"
          />
          <View>
            <Text style={{
              fontSize: 20,
              fontWeight: 'bold',
              color: 'white',
              marginBottom: 12,
            }} numberOfLines={2}>
              {item.title || 'Untitled Campaign'}
            </Text>
            <Text style={{
              fontSize: 14,
              color: '#C5FFF8',
              marginBottom: 16,
              lineHeight: 20,
            }} numberOfLines={3}>
              {item.description || 'No description available'}
            </Text>
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 16,
            }}>
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: '#00B49F33',
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 20,
              }}>
                <Ionicons name="diamond" size={16} color="#14F1B2" />
                <Text style={{
                  color: '#14F1B2',
                  fontWeight: '600',
                  marginLeft: 8,
                }}>{item.reward || 0} SOL</Text>
              </View>
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: '#8DFFF033',
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 20,
              }}>
                <Ionicons name="people" size={16} color="#8DFFF0" />
                <Text style={{
                  color: '#8DFFF0',
                  marginLeft: 8,
                }}>{getParticipants(item.id) || 0}</Text>
              </View>
            </View>
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name="time" size={14} color="#C5FFF8" />
                <Text style={{
                  color: '#C5FFF8',
                  fontSize: 12,
                  marginLeft: 8,
                }}>
                  {isExpired ? 'Ended' : 'Ends'} {new Date((item.endtime || 0) * 1000).toLocaleDateString()}
                </Text>
              </View>
              <TouchableOpacity 
                style={{
                  backgroundColor: '#14F1B233',
                  paddingHorizontal: 12,
                  paddingVertical: 8,
                  borderRadius: 20,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
                  router.push(`/leaderboard?campaignId=${item.id}`)
                }}
              >
                <Ionicons name="trophy" size={14} color="#14F1B2" />
                <Text style={{
                  color: '#14F1B2',
                  fontSize: 12,
                  marginLeft: 4,
                  fontWeight: '500',
                }}>Leaderboard</Text>
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    )
  }

  return (
    <LinearGradient colors={['#0E151A', '#134156']} style={{ flex: 1 }}>
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingTop: 56,
        paddingBottom: 24,
      }}>
        <View style={{ flex: 1 }}>
          <Text style={{
            fontSize: 30,
            fontWeight: 'bold',
            color: 'white',
          }}>Discover</Text>
          <Text style={{
            color: '#8DFFF0',
            marginTop: 4,
          }}>Find {showPastCampaigns ? 'past' : 'active'} campaigns</Text>
        </View>
        <TouchableOpacity
          onPress={toggleCampaignView}
          style={{
            backgroundColor: showPastCampaigns ? '#8DFFF033' : '#14F1B233',
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderRadius: 20,
            flexDirection: 'row',
            alignItems: 'center',
            borderWidth: 1,
            borderColor: showPastCampaigns ? '#8DFFF0' : '#14F1B2',
          }}
          activeOpacity={0.8}
        >
          <Ionicons 
            name={showPastCampaigns ? "time" : "radio-button-on"} 
            size={16} 
            color={showPastCampaigns ? '#8DFFF0' : '#14F1B2'} 
          />
          <Text style={{
            color: showPastCampaigns ? '#8DFFF0' : '#14F1B2',
            fontWeight: '600',
            marginLeft: 6,
            fontSize: 12,
          }}>
            {showPastCampaigns ? 'Past' : 'Live'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Filter Info */}
      <View style={{
        paddingHorizontal: 24,
        paddingBottom: 16,
      }}>
        <View style={{
          backgroundColor: showPastCampaigns ? '#8DFFF015' : '#14F1B215',
          paddingHorizontal: 12,
          paddingVertical: 8,
          borderRadius: 12,
          flexDirection: 'row',
          alignItems: 'center',
        }}>
          <Ionicons 
            name={showPastCampaigns ? "archive" : "flash"} 
            size={14} 
            color={showPastCampaigns ? '#8DFFF0' : '#14F1B2'} 
          />
          <Text style={{
            color: showPastCampaigns ? '#8DFFF0' : '#14F1B2',
            fontSize: 12,
            marginLeft: 6,
            fontWeight: '500',
          }}>
            {showPastCampaigns 
              ? `Showing ${campaigns.length} completed campaigns` 
              : `Showing ${campaigns.length} active campaigns`
            }
          </Text>
        </View>
      </View>

      <FlatList
        data={campaigns}
        renderItem={renderCampaignCard}
        keyExtractor={(item, index) => item?.id || `campaign-${index}`}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24, minHeight: 400 }}>
            <Ionicons 
              name={showPastCampaigns ? "archive-outline" : "search"} 
              size={48} 
              color="#6B7280" 
            />
            <Text style={{ fontSize: 20, fontWeight: '600', color: 'white', marginTop: 16, marginBottom: 8, textAlign: 'center' }}>
              {showPastCampaigns ? 'No Past Campaigns' : 'No Active Campaigns'}
            </Text>
            <Text style={{ color: '#8DFFF0', textAlign: 'center', fontSize: 16 }}>
              {showPastCampaigns 
                ? 'No completed campaigns found. Check back later!' 
                : 'Be the first to create one!'
              }
            </Text>
            {!showPastCampaigns && (
              <TouchableOpacity
                onPress={handleCreateCampaign}
                style={{
                  marginTop: 20,
                  backgroundColor: '#14F1B233',
                  paddingHorizontal: 20,
                  paddingVertical: 12,
                  borderRadius: 24,
                  borderWidth: 1,
                  borderColor: '#14F1B2',
                }}
                activeOpacity={0.8}
              >
                <Text style={{
                  color: '#14F1B2',
                  fontWeight: '600',
                  fontSize: 14,
                }}>
                  Create Campaign
                </Text>
              </TouchableOpacity>
            )}
          </View>
        }
      />

      <TouchableOpacity 
        style={{
          position: 'absolute',
          bottom: 32,
          right: 24,
          width: 64,
          height: 64,
          borderRadius: 32,
          shadowColor: '#14F1B2',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 12,
        }}
        onPress={handleCreateCampaign}
      >
        <LinearGradient
          colors={['#14F1B2', '#00B49F']}
          style={{
            width: 64,
            height: 64,
            borderRadius: 32,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Ionicons name="add" size={28} color="white" />
        </LinearGradient>
      </TouchableOpacity>
    </LinearGradient>
  )
}
