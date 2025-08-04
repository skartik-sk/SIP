import { useAuth } from '@/components/auth/auth-provider'
import { WalletConnectButton } from '@/components/ui/wallet-connect-button'
import { COLORS, SPACING } from '@/constants/theme'
import * as Haptics from 'expo-haptics'
import { LinearGradient } from 'expo-linear-gradient'
import { Image, StyleSheet, Text, View } from 'react-native'

export default function SignInScreen() {
  const { signIn, isLoading } = useAuth()

  const handleConnectWallet = async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
      await signIn()
    } catch (error) {
      console.error('Failed to connect wallet:', error)
    }
  }

  return (
    <LinearGradient
      colors={[COLORS.PRIMARY_DARK, COLORS.SECONDARY_DARK]}
      style={styles.container}
    >
      <View style={styles.content}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <Image 
            source={require('@/assets/images/logo.jpg')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        {/* App Title */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>DASHH</Text>
          <Text style={styles.subtitle}>Decentralized Engagement Platform</Text>
        </View>

        {/* App Description */}
        <View style={styles.descriptionContainer}>
          <Text style={styles.description}>
            The new ad platform focused on helping brands reach the masses through micro-influencers
          </Text>
          
          <View style={styles.featuresList}>
            <FeatureItem text="Transparent & Verified Engagement" />
            <FeatureItem text="Direct Payments via Blockchain" />
            <FeatureItem text="Real-time Campaign Tracking" />
            <FeatureItem text="zkTLS Proofs for Privacy" />
          </View>
        </View>

        {/* Connect Wallet Button */}
        <View style={styles.walletButtonContainer}>
          <WalletConnectButton 
            onPress={handleConnectWallet}
            loading={isLoading}
          />
        </View>

        {/* Footer */}
        <Text style={styles.footer}>
          Powered by Solana & Reclaim Protocol
        </Text>
      </View>
    </LinearGradient>
  )
}

const FeatureItem = ({ text }: { text: string }) => (
  <View style={styles.featureItem}>
    <View style={styles.featureDot} />
    <Text style={styles.featureText}>{text}</Text>
  </View>
)

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: SPACING.LG,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    marginBottom: SPACING.XL,
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: SPACING.XL,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: COLORS.BRIGHT_GREEN,
    textAlign: 'center',
    marginBottom: SPACING.SM,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.LIGHT_GREEN,
    textAlign: 'center',
  },
  descriptionContainer: {
    marginBottom: SPACING.XXL,
    alignItems: 'center',
  },
  description: {
    fontSize: 16,
    color: COLORS.WHITE,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: SPACING.LG,
  },
  featuresList: {
    alignItems: 'flex-start',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.SM,
  },
  featureDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.BRIGHT_GREEN,
    marginRight: SPACING.SM,
  },
  featureText: {
    fontSize: 14,
    color: COLORS.LIGHTEST_GREEN,
  },
  walletButtonContainer: {
    width: '100%',
    marginBottom: SPACING.LG,
  },
  footer: {
    fontSize: 12,
    color: COLORS.GRAY,
    textAlign: 'center',
  },
})
