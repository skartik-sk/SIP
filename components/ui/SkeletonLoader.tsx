import React from 'react';
import {
    Animated,
    Dimensions,
    StyleSheet,
    View,
} from 'react-native';

const { width } = Dimensions.get('window');

interface SkeletonLoaderProps {
  count?: number;
}

export const CampaignSkeletonLoader: React.FC<SkeletonLoaderProps> = ({ count = 3 }) => {
  const animatedValue = new Animated.Value(0);

  React.useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, []);

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  const renderSkeleton = () => (
    <View style={styles.skeletonCard}>
      <Animated.View style={[styles.skeletonImage, { opacity }]} />
      <View style={styles.skeletonContent}>
        <Animated.View style={[styles.skeletonTitle, { opacity }]} />
        <View style={styles.skeletonStats}>
          <Animated.View style={[styles.skeletonStat, { opacity }]} />
          <Animated.View style={[styles.skeletonStat, { opacity }]} />
        </View>
        <Animated.View style={[styles.skeletonParticipant, { opacity }]} />
        <View style={styles.skeletonButtons}>
          <Animated.View style={[styles.skeletonButton, { opacity }]} />
          <Animated.View style={[styles.skeletonButton, { opacity }]} />
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {Array.from({ length: count }, (_, index) => (
        <View key={index} style={styles.skeletonWrapper}>
          {renderSkeleton()}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    alignItems: 'center',
  },
  skeletonWrapper: {
    marginBottom: 20,
  },
  skeletonCard: {
    width: width * 0.9,
    maxWidth: 350,
    backgroundColor: 'rgba(40, 40, 40, 0.6)',
    borderRadius: 12,
    overflow: 'hidden',
  },
  skeletonImage: {
    height: 200,
    backgroundColor: 'rgba(80, 80, 80, 0.8)',
  },
  skeletonContent: {
    padding: 16,
  },
  skeletonTitle: {
    height: 20,
    backgroundColor: 'rgba(80, 80, 80, 0.8)',
    borderRadius: 4,
    marginBottom: 16,
    width: '80%',
  },
  skeletonStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  skeletonStat: {
    height: 14,
    backgroundColor: 'rgba(80, 80, 80, 0.8)',
    borderRadius: 4,
    width: '45%',
  },
  skeletonParticipant: {
    height: 40,
    backgroundColor: 'rgba(80, 80, 80, 0.8)',
    borderRadius: 8,
    marginBottom: 16,
  },
  skeletonButtons: {
    gap: 8,
  },
  skeletonButton: {
    height: 44,
    backgroundColor: 'rgba(80, 80, 80, 0.8)',
    borderRadius: 8,
  },
});
