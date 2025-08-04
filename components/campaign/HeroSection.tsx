import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef } from 'react';
import {
    Animated,
    Dimensions,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const { width, height } = Dimensions.get('window');

interface HeroSectionProps {
  onGetStarted: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onGetStarted }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const features = [
    {
      icon: 'trophy',
      title: 'Compete & Win',
      description: 'Join campaigns and compete for amazing prizes',
    },
    {
      icon: 'create',
      title: 'Create Campaigns',
      description: 'Launch your own influencer campaigns easily',
    },
    {
      icon: 'analytics',
      title: 'Track Performance',
      description: 'Monitor engagement and track your success',
    },
    {
      icon: 'wallet',
      title: 'Solana Powered',
      description: 'Secure blockchain transactions on Solana',
    },
  ];

  return (
    <LinearGradient
      colors={['#000000', '#1a0a1a', '#000000']}
      style={styles.container}
    >
      {/* Animated Background Elements */}
      <View style={styles.backgroundElements}>
        <Animated.View
          style={[
            styles.floatingElement,
            styles.element1,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        />
        <Animated.View
          style={[
            styles.floatingElement,
            styles.element2,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        />
        <Animated.View
          style={[
            styles.floatingElement,
            styles.element3,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        />
      </View>

      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        {/* Header */}
        <View style={styles.header}>
          <LinearGradient
            colors={['#ff9a9e', '#ff6b95', '#a855f7']}
            style={styles.logoContainer}
          >
            <Ionicons name="rocket" size={40} color="#fff" />
          </LinearGradient>
          <Text style={styles.appName}>Dashh</Text>
          <Text style={styles.tagline}>Influencer Campaign Platform</Text>
        </View>

        {/* Main Title */}
        <View style={styles.titleSection}>
          <Text style={styles.mainTitle}>
            Engage and Earn{'\n'}
            <Text style={styles.gradientText}>with Instagram Stories</Text>
          </Text>
          <Text style={styles.subtitle}>
            Create campaigns, participate in challenges, and earn rewards on the Solana blockchain
          </Text>
        </View>

        {/* Features Grid */}
        <View style={styles.featuresGrid}>
          {features.map((feature, index) => (
            <Animated.View
              key={feature.title}
              style={[
                styles.featureCard,
                {
                  opacity: fadeAnim,
                  transform: [
                    {
                      translateY: Animated.add(
                        slideAnim,
                        new Animated.Value(index * 10)
                      ),
                    },
                  ],
                },
              ]}
            >
              <BlurView intensity={20} style={styles.featureBlur}>
                <View style={styles.featureContent}>
                  <LinearGradient
                    colors={['#ff9a9e', '#ff6b95']}
                    style={styles.featureIcon}
                  >
                    <Ionicons
                      name={feature.icon as any}
                      size={24}
                      color="#fff"
                    />
                  </LinearGradient>
                  <Text style={styles.featureTitle}>{feature.title}</Text>
                  <Text style={styles.featureDescription}>
                    {feature.description}
                  </Text>
                </View>
              </BlurView>
            </Animated.View>
          ))}
        </View>

        {/* CTA Button */}
        <TouchableOpacity style={styles.ctaButton} onPress={onGetStarted}>
          <LinearGradient
            colors={['#ff9a9e', '#ff6b95', '#a855f7']}
            style={styles.ctaGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.ctaText}>Get Started</Text>
            <Ionicons name="arrow-forward" size={20} color="#fff" />
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  backgroundElements: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  floatingElement: {
    position: 'absolute',
    borderRadius: 100,
    opacity: 0.1,
  },
  element1: {
    width: 200,
    height: 200,
    backgroundColor: '#ff9a9e',
    top: '10%',
    right: -50,
  },
  element2: {
    width: 150,
    height: 150,
    backgroundColor: '#a855f7',
    bottom: '20%',
    left: -30,
  },
  element3: {
    width: 100,
    height: 100,
    backgroundColor: '#ff6b95',
    top: '50%',
    left: '80%',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  appName: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
    fontFamily: 'SpaceMono',
    marginBottom: 8,
  },
  tagline: {
    color: '#666',
    fontSize: 16,
    fontFamily: 'SpaceMono',
  },
  titleSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  mainTitle: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    fontFamily: 'SpaceMono',
    lineHeight: 36,
  },
  gradientText: {
    color: '#ff6b95',
  },
  subtitle: {
    color: '#999',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
    fontFamily: 'SpaceMono',
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 40,
  },
  featureCard: {
    width: '48%',
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  featureBlur: {
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  featureContent: {
    alignItems: 'center',
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
    fontFamily: 'SpaceMono',
  },
  featureDescription: {
    color: '#666',
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 16,
    fontFamily: 'SpaceMono',
  },
  ctaButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 20,
  },
  ctaGradient: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    gap: 12,
  },
  ctaText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'SpaceMono',
  },
});
