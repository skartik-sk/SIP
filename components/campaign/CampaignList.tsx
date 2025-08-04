import { CampaignSkeletonLoader } from '@/components/ui/SkeletonLoader';
import { Campaign } from '@/types/campaign';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import {
    FlatList,
    RefreshControl,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { CampaignCard } from './CampaignCard';

interface CampaignListProps {
  campaigns: Campaign[];
  loading: boolean;
  onRefresh: () => void;
  onParticipate: (campaignId: string) => void;
  onViewLeaderboard: (campaignId: string) => void;
  onCreateCampaign: () => void;
  showCreateButton?: boolean;
}

export const CampaignList: React.FC<CampaignListProps> = ({
  campaigns,
  loading,
  onRefresh,
  onParticipate,
  onViewLeaderboard,
  onCreateCampaign,
  showCreateButton = false,
}) => {
  const renderCampaign = ({ item }: { item: Campaign }) => (
    <CampaignCard
      campaign={item}
      onParticipate={onParticipate}
      onViewLeaderboard={onViewLeaderboard}
    />
  );

  const EmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="rocket-outline" size={80} color="#444" />
      <Text style={styles.emptyTitle}>No Campaigns Yet</Text>
      <Text style={styles.emptyDescription}>
        Be the first to create an exciting campaign!
      </Text>
      {showCreateButton && (
        <TouchableOpacity style={styles.createButton} onPress={onCreateCampaign}>
          <LinearGradient
            colors={['#ff9a9e', '#ff6b95', '#a855f7']}
            style={styles.gradientButton}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Ionicons name="add" size={24} color="#fff" />
            <Text style={styles.createButtonText}>Create Campaign</Text>
          </LinearGradient>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      {showCreateButton && campaigns.length > 0 && (
        <View style={styles.header}>
          <TouchableOpacity style={styles.headerButton} onPress={onCreateCampaign}>
            <LinearGradient
              colors={['#ff9a9e', '#ff6b95']}
              style={styles.headerGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Ionicons name="add" size={20} color="#fff" />
              <Text style={styles.headerButtonText}>Create Campaign</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      )}

      {loading && campaigns.length === 0 ? (
        <CampaignSkeletonLoader count={3} />
      ) : (
        <FlatList
          data={campaigns}
          renderItem={renderCampaign}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[
            styles.listContainer,
            campaigns.length === 0 && styles.emptyListContainer,
          ]}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={onRefresh}
              tintColor="#fff"
              colors={['#ff9a9e', '#ff6b95', '#a855f7']}
            />
          }
          ListEmptyComponent={EmptyState}
          numColumns={1}
          ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    padding: 16,
    alignItems: 'flex-end',
  },
  headerButton: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  headerGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
  },
  headerButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'SpaceMono',
  },
  listContainer: {
    padding: 16,
    paddingBottom: 100, // Extra space for bottom tab bar
    alignItems: 'center',
  },
  emptyListContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    fontFamily: 'SpaceMono',
  },
  emptyDescription: {
    color: '#666',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    paddingHorizontal: 40,
    fontFamily: 'SpaceMono',
  },
  createButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  gradientButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 14,
    gap: 8,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'SpaceMono',
  },
});
