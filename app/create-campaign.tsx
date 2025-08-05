import { useAuth } from '@/components/auth/auth-provider'
import { COLORS, SPACING } from '@/constants/theme'
import { useDashhProgram } from '@/hooks/useDashhProgram'
import { CreateCampaignParams } from '@/types/campaign'
import { Ionicons } from '@expo/vector-icons'
import * as Haptics from 'expo-haptics'
import { LinearGradient } from 'expo-linear-gradient'
import { router } from 'expo-router'
import React, { useState } from 'react'
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'

export default function CreateCampaignScreen() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [tags, setTags] = useState('')
  const [reward, setReward] = useState('')
  const [duration, setDuration] = useState('7')
  const [loading, setLoading] = useState(false)
  const [imagePreviewError, setImagePreviewError] = useState(false)

  const { createCampaign } = useDashhProgram()
  const { isAuthenticated } = useAuth()

  const handleImageUrlChange = (url: string) => {
    setImageUrl(url)
    setImagePreviewError(false)
  }

  const handleImageError = () => {
    setImagePreviewError(true)
  }

  const handleSubmit = async () => {
    if (!isAuthenticated) {
      Alert.alert('Connect Wallet', 'Please connect your wallet to create campaigns')
      return
    }

    if (!title.trim() || !description.trim() || !reward.trim() || !tags.trim() || !imageUrl.trim()) {
      Alert.alert('Missing Information', 'Please fill in all required fields including image URL and tags')
      return
    }

    const rewardAmount = parseFloat(reward)
    if (isNaN(rewardAmount) || rewardAmount <= 0) {
      Alert.alert('Invalid Reward', 'Please enter a valid reward amount')
      return
    }

    try {
      setLoading(true)
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)

      const endTime = Math.floor(Date.now() / 1000) + (parseInt(duration) * 24 * 60 * 60)
      
        
      const campaignData =
        { title, description, image: imageUrl, lable: tags, endtime: endTime, reward: rewardAmount } as CreateCampaignParams
      

      console.log('📤 Submitting campaign data:', campaignData)
      await createCampaign.mutateAsync(campaignData)
      
      Alert.alert(
        'Campaign Created!',
        'Your campaign has been successfully created and is now live.',
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
      )
    } catch (error) {
      console.error('Error creating campaign:', error)
      Alert.alert('Error', 'Failed to create campaign. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <LinearGradient colors={[COLORS.PRIMARY_DARK, COLORS.SECONDARY_DARK]} style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.WHITE} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Campaign</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.form}>
          {/* Image Section */}
          <View style={styles.imageSection}>
            <Text style={styles.label}>Campaign Image URL *</Text>
            <TextInput
              style={styles.input}
              value={imageUrl}
              onChangeText={handleImageUrlChange}
              placeholder="https://example.com/image.jpg"
              placeholderTextColor={COLORS.GRAY}
              autoCapitalize="none"
              autoCorrect={false}
            />
            
            {/* Image Preview */}
            {imageUrl ? (
              <View style={styles.imagePreviewContainer}>
                <Text style={styles.previewLabel}>Preview:</Text>
                {!imagePreviewError ? (
                  <Image 
                    source={{ uri: imageUrl }} 
                    style={styles.imagePreview}
                    onError={handleImageError}
                    resizeMode="cover"
                  />
                ) : (
                  <View style={styles.imageErrorContainer}>
                    <Ionicons name="image" size={32} color={COLORS.GRAY} />
                    <Text style={styles.imageErrorText}>Failed to load image</Text>
                    <Text style={styles.imageErrorSubtext}>Please check the URL</Text>
                  </View>
                )}
              </View>
            ) : (
              <View style={styles.imageHintContainer}>
                <Ionicons name="information-circle" size={16} color={COLORS.BRIGHT_GREEN} />
                <Text style={styles.imageHintText}>
                  Enter a valid image URL to see preview
                </Text>
              </View>
            )}
          </View>

          {/* Title Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Campaign Title *</Text>
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              placeholder="Enter campaign title"
              placeholderTextColor={COLORS.GRAY}
              maxLength={100}
            />
          </View>

          {/* Description Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Description *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              placeholder="Describe your campaign objectives and requirements"
              placeholderTextColor={COLORS.GRAY}
              multiline
              numberOfLines={4}
              maxLength={500}
            />
          </View>

          {/* Tags Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Tags *</Text>
            <TextInput
              style={styles.input}
              value={tags}
              onChangeText={setTags}
              placeholder="e.g. social, nft, defi"
              placeholderTextColor={COLORS.GRAY}
              maxLength={50}
            />
          </View>

          {/* Reward Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Reward Amount (SOL) *</Text>
            <View style={styles.rewardContainer}>
              <TextInput
                style={[styles.input, styles.rewardInput]}
                value={reward}
                onChangeText={setReward}
                placeholder="0.0"
                placeholderTextColor={COLORS.GRAY}
                keyboardType="decimal-pad"
                maxLength={10}
              />
              <View style={styles.currencyBadge}>
                <Text style={styles.currencyText}>SOL</Text>
              </View>
            </View>
          </View>

          {/* Duration Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Campaign Duration (days)</Text>
            <TextInput
              style={styles.input}
              value={duration}
              onChangeText={setDuration}
              placeholder="7"
              placeholderTextColor={COLORS.GRAY}
              keyboardType="numeric"
              maxLength={3}
            />
          </View>

          {/* Info Box */}
          <View style={styles.infoBox}>
            <Ionicons name="information-circle" size={20} color={COLORS.BRIGHT_GREEN} />
            <Text style={styles.infoText}>
              Your campaign will be visible to all users. Make sure to provide clear instructions
              and attractive rewards to encourage participation.
            </Text>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={[styles.submitButton, loading && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            <LinearGradient
              colors={loading ? [COLORS.GRAY, COLORS.GRAY] : [COLORS.ACCENT_GREEN, COLORS.BRIGHT_GREEN]}
              style={styles.submitButtonGradient}
            >
              {loading ? (
                <Text style={styles.submitButtonText}>Creating...</Text>
              ) : (
                <>
                  <Ionicons name="rocket" size={20} color={COLORS.WHITE} />
                  <Text style={styles.submitButtonText}>Launch Campaign</Text>
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  form: {
    paddingHorizontal: SPACING.LG,
    paddingBottom: 100,
  },
  imageSection: {
    marginBottom: SPACING.LG,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.WHITE,
    marginBottom: SPACING.SM,
  },
  imagePicker: {
    height: 200,
    borderRadius: 12,
    backgroundColor: `${COLORS.SECONDARY_DARK}50`,
    borderWidth: 2,
    borderColor: COLORS.SECONDARY_DARK,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  imagePickerContent: {
    alignItems: 'center',
  },
  imagePickerText: {
    fontSize: 14,
    color: COLORS.GRAY,
    marginTop: SPACING.SM,
  },
  selectedImage: {
    width: '100%',
    height: '100%',
  },
  inputGroup: {
    marginBottom: SPACING.LG,
  },
  input: {
    backgroundColor: `${COLORS.SECONDARY_DARK}50`,
    borderWidth: 1,
    borderColor: COLORS.SECONDARY_DARK,
    borderRadius: 12,
    paddingHorizontal: SPACING.MD,
    paddingVertical: SPACING.MD,
    fontSize: 16,
    color: COLORS.WHITE,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  rewardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rewardInput: {
    flex: 1,
    marginRight: SPACING.SM,
  },
  currencyBadge: {
    backgroundColor: COLORS.BRIGHT_GREEN,
    paddingHorizontal: SPACING.MD,
    paddingVertical: SPACING.SM,
    borderRadius: 8,
  },
  currencyText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.WHITE,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: `${COLORS.BRIGHT_GREEN}20`,
    paddingHorizontal: SPACING.MD,
    paddingVertical: SPACING.MD,
    borderRadius: 12,
    marginBottom: SPACING.LG,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.LIGHTEST_GREEN,
    marginLeft: SPACING.SM,
    lineHeight: 20,
  },
  submitButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.MD,
    paddingHorizontal: SPACING.LG,
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.WHITE,
    marginLeft: SPACING.SM,
  },
  imagePreviewContainer: {
    marginTop: SPACING.MD,
  },
  previewLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.WHITE,
    marginBottom: SPACING.SM,
  },
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    backgroundColor: COLORS.SECONDARY_DARK,
  },
  imageErrorContainer: {
    height: 200,
    borderRadius: 12,
    backgroundColor: `${COLORS.SECONDARY_DARK}50`,
    borderWidth: 1,
    borderColor: COLORS.SECONDARY_DARK,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageErrorText: {
    fontSize: 14,
    color: COLORS.GRAY,
    marginTop: SPACING.SM,
    fontWeight: '600',
  },
  imageErrorSubtext: {
    fontSize: 12,
    color: COLORS.GRAY,
    marginTop: SPACING.XS,
  },
  imageHintContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.SM,
    paddingHorizontal: SPACING.SM,
  },
  imageHintText: {
    fontSize: 12,
    color: COLORS.BRIGHT_GREEN,
    marginLeft: SPACING.XS,
  },
})
