import { Participant } from '@/types/campaign';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import {
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

interface LeaderboardProps {
  participants: Participant[];
  campaignTitle: string;
  onClose: () => void;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({
  participants,
  campaignTitle,
  onClose,
}) => {
  const sortedParticipants = [...participants].sort((a, b) => b.points - a.points);

  const renderParticipant = ({ item, index }: { item: Participant; index: number }) => {
    const getRankIcon = (rank: number) => {
      switch (rank) {
        case 0:
          return '🥇';
        case 1:
          return '🥈';
        case 2:
          return '🥉';
        default:
          return `#${rank + 1}`;
      }
    };

    return (
      <View style={styles.participantCard}>
        <LinearGradient
          colors={
            index === 0
              ? ['#FFD700', '#FFA500']
              : index === 1
              ? ['#C0C0C0', '#A9A9A9']
              : index === 2
              ? ['#CD7F32', '#B8860B']
              : ['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)']
          }
          style={styles.rankGradient}
        >
          <View style={styles.participantContent}>
            <View style={styles.rankContainer}>
              <Text style={styles.rankText}>{getRankIcon(index)}</Text>
            </View>
            
            <View style={styles.participantInfo}>
              <Text style={styles.participantAddress}>
                {item.user.slice(0, 6)}...{item.user.slice(-4)}
              </Text>
              <Text style={styles.participantPoints}>{item.points} points</Text>
            </View>

            {index < 3 && (
              <View style={styles.trophyContainer}>
                <Ionicons 
                  name="trophy" 
                  size={24} 
                  color={index === 0 ? '#FFD700' : index === 1 ? '#C0C0C0' : '#CD7F32'} 
                />
              </View>
            )}
          </View>
        </LinearGradient>
      </View>
    );
  };

  const EmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="trophy-outline" size={80} color="#444" />
      <Text style={styles.emptyTitle}>No Participants Yet</Text>
      <Text style={styles.emptyDescription}>
        Be the first to join this campaign!
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#000000', '#1a1a1a', '#000000']}
        style={styles.gradient}
      >
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.title}>Leaderboard</Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={styles.campaignInfo}>
          <Text style={styles.campaignTitle}>{campaignTitle}</Text>
          <Text style={styles.participantCount}>
            {participants.length} participant{participants.length !== 1 ? 's' : ''}
          </Text>
        </View>

        <FlatList
          data={sortedParticipants}
          renderItem={renderParticipant}
          keyExtractor={(item, index) => `${item.user}-${index}`}
          contentContainerStyle={[
            styles.listContainer,
            sortedParticipants.length === 0 && styles.emptyListContainer,
          ]}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={EmptyState}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        />
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  gradient: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingTop: 60,
  },
  closeButton: {
    padding: 8,
  },
  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'SpaceMono',
  },
  campaignInfo: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  campaignTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
    fontFamily: 'SpaceMono',
  },
  participantCount: {
    color: '#666',
    fontSize: 14,
    fontFamily: 'SpaceMono',
  },
  listContainer: {
    padding: 16,
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
    paddingHorizontal: 40,
    fontFamily: 'SpaceMono',
  },
  participantCard: {
    borderRadius: 12,
    overflow: 'hidden',
    marginHorizontal: 4,
  },
  rankGradient: {
    padding: 1,
  },
  participantContent: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 11,
  },
  rankContainer: {
    width: 50,
    alignItems: 'center',
  },
  rankText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'SpaceMono',
  },
  participantInfo: {
    flex: 1,
    marginLeft: 16,
  },
  participantAddress: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'SpaceMono',
  },
  participantPoints: {
    color: '#ff6b95',
    fontSize: 14,
    marginTop: 4,
    fontFamily: 'SpaceMono',
  },
  trophyContainer: {
    marginLeft: 16,
  },
});
