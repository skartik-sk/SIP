import { Campaign } from '@/types/campaign';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import {
    Dimensions,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const { width } = Dimensions.get('window');

interface CampaignCardProps {
  campaign: Campaign;
  onParticipate: (campaignId: string) => void;
  onViewLeaderboard: (campaignId: string) => void;
}

export const CampaignCard: React.FC<CampaignCardProps> = ({
  campaign,
  onParticipate,
  onViewLeaderboard,
}) => {
  return (
    <View style={styles.container}>
      {/* Clean image section with minimal overlay */}
      <View style={styles.imageContainer}>
        <Image source={{ uri: campaign.image }} style={styles.image} />
        {/* Simple label tag only */}
        <View style={styles.tag}>
          <Text style={styles.tagText}>{campaign.label || '#blinks'}</Text>
        </View>
      </View>

      {/* All content moved to clean content area - no floating text */}
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {campaign.title}
        </Text>
        
        <Text style={styles.description} numberOfLines={2}>
          {campaign.description}
        </Text>

        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Ionicons name="trophy" size={16} color="#ff6b95" />
            <Text style={styles.statText}>Prize: ${campaign.amount}</Text>
          </View>
          <View style={styles.stat}>
            <Ionicons name="time" size={16} color="#ff6b95" />
            <Text style={styles.statText}>
              {campaign.daysLeft} days left
            </Text>
          </View>
        </View>

        <View style={styles.participantInfo}>
          <Ionicons name="people" size={16} color="#9CA3AF" style={styles.participantIcon} />
          <Text style={styles.participantText}>
            <Text style={styles.participantCount}>
              {campaign.participantCount}
            </Text> participants
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.participateButton}
            onPress={() => onParticipate(campaign.id)}
          >
            <LinearGradient
              colors={['#ff6b95', '#ff9a9e']}
              style={styles.gradientButton}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Ionicons name="rocket" size={16} color="#fff" />
              <Text style={styles.participateText}>Join Campaign</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.leaderboardButton}
            onPress={() => onViewLeaderboard(campaign.id)}
          >
            <Ionicons name="podium" size={14} color="#9CA3AF" />
            <Text style={styles.leaderboardText}>Leaderboard</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  imageContainer: {
    height: 180,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  tag: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(255, 107, 149, 0.9)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'SpaceMono',
  },
  content: {
    padding: 20,
  },
  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'SpaceMono',
    marginBottom: 8,
    lineHeight: 24,
  },
  description: {
    color: '#ccc',
    fontSize: 14,
    fontFamily: 'SpaceMono',
    marginBottom: 16,
    lineHeight: 20,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  statText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '500',
    fontFamily: 'SpaceMono',
  },
  participantInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 12,
    borderRadius: 12,
    marginBottom: 20,
    gap: 8,
  },
  participantIcon: {
    marginRight: 4,
  },
  participantText: {
    color: '#ccc',
    fontSize: 14,
    fontFamily: 'SpaceMono',
  },
  participantCount: {
    color: '#ff6b95',
    fontWeight: '600',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  participateButton: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  gradientButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    gap: 8,
  },
  participateText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'SpaceMono',
  },
  leaderboardButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    gap: 6,
  },
  leaderboardText: {
    color: '#9CA3AF',
    fontSize: 13,
    fontWeight: '500',
    fontFamily: 'SpaceMono',
  },
});
