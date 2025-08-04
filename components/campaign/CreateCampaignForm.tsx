import { useWalletUi } from '@/components/solana/use-wallet-ui';
import { useDashhProgram } from '@/hooks/useDashhProgram';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import {
    Alert,
    Dimensions,
    Image,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import DatePicker from 'react-native-date-picker';

const { width } = Dimensions.get('window');

interface CreateCampaignFormProps {
  onSuccess: () => void;
}

export const CreateCampaignForm: React.FC<CreateCampaignFormProps> = ({
  onSuccess,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [label, setLabel] = useState('social');
  const [amount, setAmount] = useState('');
  const [imageUri, setImageUri] = useState('');
  const [endDate, setEndDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() + 7); // Default to 7 days from now
    return date;
  });
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const { createCampaign } = useDashhProgram();
  const { account } = useWalletUi();

  // Pre-defined campaign categories
  const categories = [
    { value: 'social', label: 'Social Media', icon: 'share-social' },
    { value: 'nft', label: 'NFT', icon: 'images' },
    { value: 'defi', label: 'DeFi', icon: 'trending-up' },
    { value: 'gaming', label: 'Gaming', icon: 'game-controller' },
    { value: 'education', label: 'Education', icon: 'school' },
    { value: 'marketing', label: 'Marketing', icon: 'megaphone' },
  ];

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (!account?.publicKey) {
      Alert.alert('Error', 'Please connect your wallet first');
      return;
    }

    if (!title || !description || !label || !amount || !imageUri) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      Alert.alert('Error', 'Please enter a valid prize amount');
      return;
    }

    if (endDate <= new Date()) {
      Alert.alert('Error', 'End date must be in the future');
      return;
    }

    setLoading(true);
    try {
      await createCampaign.mutateAsync({
        id: 0, // Will be generated in the mutation
        title,
        description,
        image: imageUri,
        lable: label, // Matching blinks-mini field name
        endtime: endDate.getTime(),
        reward: numericAmount,
        owner: account.publicKey,
      });

      Alert.alert('Success', 'Campaign created successfully! 🎉');
      onSuccess();
      
      // Reset form
      setTitle('');
      setDescription('');
      setLabel('social');
      setAmount('');
      setImageUri('');
      const newDate = new Date();
      newDate.setDate(newDate.getDate() + 7);
      setEndDate(newDate);
    } catch (error) {
      console.error('Error creating campaign:', error);
      Alert.alert('Error', 'Failed to create campaign. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const previewImage = isValidUrl(imageUri) ? imageUri : 
    'https://t3.ftcdn.net/jpg/07/46/54/88/360_F_746548833_Cw1ZK4jF4S6SEg4yXQ3aQwv9cfIpJxBR.jpg';

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={styles.header}>Create New Campaign</Text>

          <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Campaign Title</Text>
              <TextInput
                style={styles.input}
                value={title}
                onChangeText={setTitle}
                placeholder="Enter an engaging campaign title"
                placeholderTextColor="#666"
                maxLength={60}
              />
              <Text style={styles.charCount}>{title.length}/60</Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Category</Text>
              <View style={styles.categoryContainer}>
                {categories.map((category) => (
                  <TouchableOpacity
                    key={category.value}
                    style={[
                      styles.categoryButton,
                      label === category.value && styles.categoryButtonActive,
                    ]}
                    onPress={() => setLabel(category.value)}
                  >
                    <Ionicons
                      name={category.icon as any}
                      size={16}
                      color={label === category.value ? '#fff' : '#666'}
                    />
                    <Text
                      style={[
                        styles.categoryText,
                        label === category.value && styles.categoryTextActive,
                      ]}
                    >
                      {category.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Campaign Image</Text>
              <View style={styles.imageSection}>
                <TextInput
                  style={[styles.input, { marginBottom: 8 }]}
                  value={imageUri}
                  onChangeText={setImageUri}
                  placeholder="https://example.com/image.jpg"
                  placeholderTextColor="#666"
                />
                <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
                  <Ionicons name="camera" size={20} color="#fff" />
                  <Text style={styles.imageButtonText}>Pick from Gallery</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Description</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={description}
                onChangeText={setDescription}
                placeholder="Describe what influencers need to do to participate..."
                placeholderTextColor="#666"
                multiline
                numberOfLines={4}
                maxLength={200}
              />
              <Text style={styles.charCount}>{description.length}/200</Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Prize Amount (SOL)</Text>
              <TextInput
                style={styles.input}
                value={amount}
                onChangeText={setAmount}
                placeholder="10.0"
                placeholderTextColor="#666"
                keyboardType="decimal-pad"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Campaign End Date</Text>
              <TouchableOpacity
                style={styles.dateButton}
                onPress={() => setOpen(true)}
              >
                <Text style={styles.dateText}>
                  {endDate.toLocaleDateString('en-US', {
                    weekday: 'short',
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </Text>
                <Ionicons name="calendar" size={20} color="#ff6b95" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[styles.submitButton, loading && styles.submitButtonDisabled]}
              onPress={handleSubmit}
              disabled={loading}
            >
              <LinearGradient
                colors={loading ? ['#666', '#444'] : ['#ff9a9e', '#ff6b95']}
                style={styles.gradientButton}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                {loading ? (
                  <View style={styles.loadingContainer}>
                    <Text style={styles.submitText}>Creating Campaign...</Text>
                  </View>
                ) : (
                  <View style={styles.submitContainer}>
                    <Ionicons name="rocket" size={20} color="#fff" />
                    <Text style={styles.submitText}>Launch Campaign</Text>
                  </View>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Enhanced Preview Card */}
          {(title || description || imageUri) && (
            <View style={styles.previewSection}>
              <Text style={styles.previewHeader}>Campaign Preview</Text>
              <View style={styles.previewCard}>
                <View style={styles.previewImageContainer}>
                  <Image 
                    source={{ 
                      uri: isValidUrl(imageUri) ? imageUri : 
                      'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
                    }} 
                    style={styles.previewImage} 
                  />
                  <View style={styles.previewTag}>
                    <Text style={styles.previewTagText}>{label}</Text>
                  </View>
                </View>
                <View style={styles.previewContent}>
                  <Text style={styles.previewTitle}>
                    {title || 'Your Campaign Title'}
                  </Text>
                  <Text style={styles.previewDescription}>
                    {description || 'Your campaign description will appear here'}
                  </Text>
                  <View style={styles.previewStats}>
                    <View style={styles.previewStat}>
                      <Ionicons name="trophy" size={16} color="#ff6b95" />
                      <Text style={styles.previewStatText}>
                        {amount || '0'} SOL
                      </Text>
                    </View>
                    <View style={styles.previewStat}>
                      <Ionicons name="time" size={16} color="#ff6b95" />
                      <Text style={styles.previewStatText}>
                        {Math.ceil((endDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity style={styles.previewParticipateButton}>
                    <LinearGradient
                      colors={['#ff9a9e', '#ff6b95']}
                      style={styles.previewGradient}
                    >
                      <Ionicons name="rocket" size={16} color="#fff" />
                      <Text style={styles.previewParticipateText}>
                        Join Campaign
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
        </View>

        <DatePicker
          modal
          open={open}
          date={endDate}
          onConfirm={(date) => {
            setOpen(false);
            setEndDate(date);
          }}
          onCancel={() => {
            setOpen(false);
          }}
          mode="date"
          minimumDate={new Date()}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 100, // Extra space for bottom navigation
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 30,
    fontFamily: 'SpaceMono',
  },
  formContainer: {
    backgroundColor: 'rgba(26, 26, 26, 0.9)',
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: 30,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    fontFamily: 'SpaceMono',
  },
  input: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: '#fff',
    fontSize: 16,
    fontFamily: 'SpaceMono',
  },
  charCount: {
    color: '#666',
    fontSize: 12,
    textAlign: 'right',
    marginTop: 4,
    fontFamily: 'SpaceMono',
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    gap: 6,
  },
  categoryButtonActive: {
    backgroundColor: '#ff6b95',
    borderColor: '#ff6b95',
  },
  categoryText: {
    color: '#666',
    fontSize: 12,
    fontFamily: 'SpaceMono',
  },
  categoryTextActive: {
    color: '#fff',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  imageSection: {
    gap: 8,
  },
  imageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 107, 149, 0.2)',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 149, 0.3)',
  },
  imageButtonText: {
    color: '#ff6b95',
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'SpaceMono',
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  dateText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'SpaceMono',
  },
  submitButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 10,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  gradientButton: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  submitContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  submitText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'SpaceMono',
  },
  previewSection: {
    marginBottom: 40,
  },
  previewHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: 'SpaceMono',
  },
  previewCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  previewImageContainer: {
    height: 200,
    position: 'relative',
  },
  previewImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  previewTag: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: 'rgba(255, 107, 149, 0.9)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  previewTagText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'SpaceMono',
  },
  previewContent: {
    padding: 20,
  },
  previewTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'SpaceMono',
    marginBottom: 8,
  },
  previewDescription: {
    color: '#ccc',
    fontSize: 14,
    marginBottom: 16,
    fontFamily: 'SpaceMono',
    lineHeight: 20,
  },
  previewStats: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  previewStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  previewStatText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'SpaceMono',
  },
  previewParticipateButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  previewGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    gap: 8,
  },
  previewParticipateText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'SpaceMono',
  },
});
