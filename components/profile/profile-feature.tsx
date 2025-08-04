import { useWalletUi } from '@/components/solana/use-wallet-ui';
import { useDashhProgram } from '@/hooks/useDashhProgram';
import { Campaign } from '@/types/campaign';
import { ellipsify } from '@/utils/ellipsify';
import { Ionicons } from '@expo/vector-icons';
import BN from 'bn.js';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
    Dimensions,
    FlatList,
    Image,
    RefreshControl,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const { width } = Dimensions.get('window');

interface ParticipatedCampaign extends Campaign {
  userPoints: number;
}

export function ProfileFeature() {
  const { account } = useWalletUi();
  const { accounts, paccounts, createParticipant } = useDashhProgram();
  const [ownedCampaigns, setOwnedCampaigns] = useState<Campaign[]>([]);
  const [participatedCampaigns, setParticipatedCampaigns] = useState<ParticipatedCampaign[]>([]);
  const [activeTab, setActiveTab] = useState<'owned' | 'participated'>('owned');
  const [expandedCampaign, setExpandedCampaign] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchUserCampaigns = useCallback(async () => {
    if (!account?.publicKey) return;

    const accountsData = accounts.data;
    const participantsData = paccounts.data;

    if (accountsData && participantsData) {
      const userPublicKey = account.publicKey.toString();
      
      // Filter owned campaigns
      const owned = accountsData
        .filter((camp) => camp.account.owner?.toString() === userPublicKey)
        .map((camp) => {
          const endTime = new Date(new BN(camp.account.endtime || 0).toNumber());
          const daysLeft = Math.max(0, Math.floor((endTime.getTime() - Date.now()) / (1000 * 60 * 60 * 24)));
          const campaignParticipants = participantsData.filter(
            (participant) => new BN(participant.account.id || 0).toNumber() === new BN(camp.account.id || 0).toNumber()
          );

          return {
            id: camp.publicKey.toString(),
            title: camp.account.title || '',
            description: camp.account.description || '',
            image: camp.account.image || '',
            label: camp.account.lable || '',
            amount: new BN(camp.account.reward || 0).toNumber(),
            endTime,
            owner: camp.account.owner?.toString() || '',
            participantCount: campaignParticipants.length,
            daysLeft,
          };
        });

      // Filter participated campaigns
      const userParticipations = participantsData.filter(
        (participant) => participant.account.user?.toString() === userPublicKey
      );

      const participated = userParticipations.map((participation) => {
        const campaign = accountsData.find(
          (camp) => new BN(camp.account.id || 0).toNumber() === new BN(participation.account.id || 0).toNumber()
        );
        
        if (campaign) {
          const endTime = new Date(new BN(campaign.account.endtime || 0).toNumber());
          const daysLeft = Math.max(0, Math.floor((endTime.getTime() - Date.now()) / (1000 * 60 * 60 * 24)));
          const campaignParticipants = participantsData.filter(
            (participant) => new BN(participant.account.id || 0).toNumber() === new BN(campaign.account.id || 0).toNumber()
          );

          return {
            id: campaign.publicKey.toString(),
            title: campaign.account.title || '',
            description: campaign.account.description || '',
            image: campaign.account.image || '',
            label: campaign.account.lable || '',
            amount: new BN(campaign.account.reward || 0).toNumber(),
            endTime,
            owner: campaign.account.owner?.toString() || '',
            participantCount: campaignParticipants.length,
            daysLeft,
            userPoints: new BN(participation.account.points || 0).toNumber(),
          };
        }
        return null;
      }).filter(Boolean) as ParticipatedCampaign[];

      setOwnedCampaigns(owned);
      setParticipatedCampaigns(participated);
    }
  }, [account?.publicKey, accounts.data, paccounts.data]);

  useEffect(() => {
    fetchUserCampaigns();
  }, [fetchUserCampaigns]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([
      accounts.refetch(),
      paccounts.refetch(),
    ]);
    setRefreshing(false);
  }, [accounts, paccounts]);

  const handleCreateCampaign = () => {
    router.push('/(tabs)/creator');
  };

  const toggleCampaignDetails = (campaignId: string) => {
    setExpandedCampaign(expandedCampaign === campaignId ? null : campaignId);
  };

  const getCampaignParticipants = (campaignId: string) => {
    const participants_data = paccounts.data || [];
    const campaign = [...ownedCampaigns, ...participatedCampaigns].find(c => c.id === campaignId);
    if (!campaign) return [];

    return participants_data.filter(
      (participant) => {
        const participantCampaignId = new BN(participant.account.id || 0).toNumber();
        const campaignNumericId = new BN(campaign.id, 16).toNumber();
        return participantCampaignId === campaignNumericId;
      }
    );
  };

  const renderCampaignCard = ({ item }: { item: Campaign | ParticipatedCampaign }) => {
    const isExpanded = expandedCampaign === item.id;
    const campaignParticipants = getCampaignParticipants(item.id);
    const isParticipated = 'userPoints' in item;

    return (
      <View style={styles.campaignCard}>
        <View style={styles.cardHeader}>
          <Image source={{ uri: item.image }} style={styles.campaignImage} />
          <View style={styles.campaignInfo}>
            <Text style={styles.campaignTitle} numberOfLines={2}>
              {item.title}
            </Text>
            <Text style={styles.campaignDescription} numberOfLines={2}>
              {item.description}
            </Text>
            <View style={styles.campaignStats}>
              <View style={styles.statItem}>
                <Ionicons name="trophy" size={16} color="#ff6b95" />
                <Text style={styles.statText}>${item.amount}</Text>
              </View>
              <View style={styles.statItem}>
                <Ionicons name="people" size={16} color="#ff6b95" />
                <Text style={styles.statText}>{item.participantCount}</Text>
              </View>
              <View style={styles.statItem}>
                <Ionicons name="time" size={16} color="#ff6b95" />
                <Text style={styles.statText}>{item.daysLeft}d</Text>
              </View>
            </View>
            {isParticipated && (
              <View style={styles.userPoints}>
                <Ionicons name="star" size={16} color="#ffd700" />
                <Text style={styles.pointsText}>Your Points: {item.userPoints}</Text>
              </View>
            )}
          </View>
          <TouchableOpacity
            style={styles.expandButton}
            onPress={() => toggleCampaignDetails(item.id)}
          >
            <Ionicons
              name={isExpanded ? "chevron-up" : "chevron-down"}
              size={24}
              color="#ff6b95"
            />
          </TouchableOpacity>
        </View>

        {isExpanded && (
          <View style={styles.expandedContent}>
            <Text style={styles.participantsTitle}>
              Participants ({campaignParticipants.length})
            </Text>
            {campaignParticipants.length > 0 ? (
              <View style={styles.participantsList}>
                {campaignParticipants.map((participant, index) => (
                  <View key={index} style={styles.participantItem}>
                    <View style={styles.participantInfo}>
                      <Ionicons name="person-circle" size={24} color="#666" />
                      <Text style={styles.participantAddress}>
                        {ellipsify(participant.account.user?.toString() || '', 4)}
                      </Text>
                    </View>
                    <View style={styles.participantPoints}>
                      <Ionicons name="star" size={16} color="#ffd700" />
                      <Text style={styles.participantPointsText}>
                        {new BN(participant.account.points || 0).toNumber()}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            ) : (
              <Text style={styles.noParticipants}>No participants yet</Text>
            )}
          </View>
        )}
      </View>
    );
  };

  if (!account) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.connectContainer}>
          <Ionicons name="person-circle-outline" size={100} color="#444" />
          <Text style={styles.connectTitle}>Connect Wallet</Text>
          <Text style={styles.connectDescription}>
            Connect your wallet to view your profile and campaigns
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#fff"
            colors={['#ff6b95']}
          />
        }
      >
        {/* Profile Header */}
        <LinearGradient
          colors={['#ff6b95', '#ff9a9e']}
          style={styles.profileHeader}
        >
          <View style={styles.profileInfo}>
            <View style={styles.avatarContainer}>
              <Ionicons name="person" size={40} color="#fff" />
            </View>
            <View style={styles.profileDetails}>
              <Text style={styles.profileName}>My Profile</Text>
              <Text style={styles.profileAddress}>
                {ellipsify(account.publicKey.toString(), 8)}
              </Text>
            </View>
          </View>
          <TouchableOpacity style={styles.createButton} onPress={handleCreateCampaign}>
            <Ionicons name="add" size={20} color="#fff" />
            <Text style={styles.createButtonText}>Create Campaign</Text>
          </TouchableOpacity>
        </LinearGradient>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{ownedCampaigns.length}</Text>
            <Text style={styles.statLabel}>Created Campaigns</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{participatedCampaigns.length}</Text>
            <Text style={styles.statLabel}>Joined Campaigns</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {participatedCampaigns.reduce((sum, camp) => sum + camp.userPoints, 0)}
            </Text>
            <Text style={styles.statLabel}>Total Points</Text>
          </View>
        </View>

        {/* Tab Navigation */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'owned' && styles.activeTab]}
            onPress={() => setActiveTab('owned')}
          >
            <Text style={[styles.tabText, activeTab === 'owned' && styles.activeTabText]}>
              My Campaigns
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'participated' && styles.activeTab]}
            onPress={() => setActiveTab('participated')}
          >
            <Text style={[styles.tabText, activeTab === 'participated' && styles.activeTabText]}>
              Participated
            </Text>
          </TouchableOpacity>
        </View>

        {/* Campaign Lists */}
        <View style={styles.campaignSection}>
          {activeTab === 'owned' ? (
            ownedCampaigns.length > 0 ? (
              <FlatList
                data={ownedCampaigns}
                renderItem={renderCampaignCard}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
                showsVerticalScrollIndicator={false}
              />
            ) : (
              <View style={styles.emptyState}>
                <Ionicons name="create-outline" size={60} color="#444" />
                <Text style={styles.emptyTitle}>No Campaigns Created</Text>
                <Text style={styles.emptyDescription}>
                  Start creating campaigns to engage with influencers
                </Text>
                <TouchableOpacity style={styles.emptyButton} onPress={handleCreateCampaign}>
                  <Text style={styles.emptyButtonText}>Create Your First Campaign</Text>
                </TouchableOpacity>
              </View>
            )
          ) : (
            participatedCampaigns.length > 0 ? (
              <FlatList
                data={participatedCampaigns}
                renderItem={renderCampaignCard}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
                showsVerticalScrollIndicator={false}
              />
            ) : (
              <View style={styles.emptyState}>
                <Ionicons name="rocket-outline" size={60} color="#444" />
                <Text style={styles.emptyTitle}>No Campaigns Joined</Text>
                <Text style={styles.emptyDescription}>
                  Explore campaigns and start participating to earn rewards
                </Text>
                <TouchableOpacity 
                  style={styles.emptyButton} 
                  onPress={() => router.push('/(tabs)/explore')}
                >
                  <Text style={styles.emptyButtonText}>Explore Campaigns</Text>
                </TouchableOpacity>
              </View>
            )
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  content: {
    flex: 1,
  },
  profileHeader: {
    padding: 20,
    paddingTop: 40,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  profileDetails: {
    flex: 1,
  },
  profileName: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'SpaceMono',
    marginBottom: 4,
  },
  profileAddress: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    fontFamily: 'SpaceMono',
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    alignSelf: 'flex-start',
    gap: 8,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'SpaceMono',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginTop: 20,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  statNumber: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'SpaceMono',
    marginBottom: 4,
  },
  statLabel: {
    color: '#666',
    fontSize: 12,
    fontFamily: 'SpaceMono',
    textAlign: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginTop: 24,
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#ff6b95',
  },
  tabText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'SpaceMono',
  },
  activeTabText: {
    color: '#fff',
  },
  campaignSection: {
    padding: 20,
    paddingBottom: 100, // Extra space for tab bar
  },
  campaignCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    padding: 16,
  },
  campaignImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  campaignInfo: {
    flex: 1,
  },
  campaignTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'SpaceMono',
    marginBottom: 4,
  },
  campaignDescription: {
    color: '#ccc',
    fontSize: 12,
    fontFamily: 'SpaceMono',
    marginBottom: 8,
  },
  campaignStats: {
    flexDirection: 'row',
    gap: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    color: '#fff',
    fontSize: 12,
    fontFamily: 'SpaceMono',
  },
  userPoints: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 4,
  },
  pointsText: {
    color: '#ffd700',
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'SpaceMono',
  },
  expandButton: {
    padding: 4,
  },
  expandedContent: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    padding: 16,
  },
  participantsTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'SpaceMono',
    marginBottom: 12,
  },
  participantsList: {
    gap: 8,
  },
  participantItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 12,
    borderRadius: 8,
  },
  participantInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  participantAddress: {
    color: '#ccc',
    fontSize: 12,
    fontFamily: 'SpaceMono',
  },
  participantPoints: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  participantPointsText: {
    color: '#ffd700',
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'SpaceMono',
  },
  noParticipants: {
    color: '#666',
    fontSize: 12,
    fontFamily: 'SpaceMono',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'SpaceMono',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDescription: {
    color: '#666',
    fontSize: 14,
    fontFamily: 'SpaceMono',
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  emptyButton: {
    backgroundColor: '#ff6b95',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  emptyButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'SpaceMono',
  },
  connectContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  connectTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'SpaceMono',
    marginTop: 20,
    marginBottom: 8,
  },
  connectDescription: {
    color: '#666',
    fontSize: 14,
    fontFamily: 'SpaceMono',
    textAlign: 'center',
  },
});
