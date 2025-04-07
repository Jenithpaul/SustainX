import React, { useState, useRef } from 'react';
import { usePathname } from 'expo-router';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Animated, Dimensions, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeContext } from '../contexts/ThemeContext';
import { AudioPlayer } from './components/AudioPlayer';
import { VideoPlayer } from './components/VideoPlayer';
import { EpisodePlayerScreen } from './components/EpisodePlayerScreen';
import { useNavigation } from '@react-navigation/native';

interface Podcast {
  id: string;
  title: string;
  date: string;
  duration: string;
  type: 'audio' | 'video';
  mediaUrl: string;
  thumbnail: string;
}

const podcastData: Podcast[] = [
  { 
    id: '1', 
    title: 'The Power of Mindfulness',
    date: 'March 23, 2024',
    duration: '3:45',
    type: 'audio',
    mediaUrl: 'https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba.mp3', // Sample audio
    thumbnail: 'https://images.pexels.com/photos/4101143/pexels-photo-4101143.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  },
  { 
    id: '2', 
    title: 'Introduction to Meditation',
    date: 'March 22, 2024',
    duration: '2:15',
    type: 'video',
    mediaUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', // Sample video
    thumbnail: 'https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  },
  { 
    id: '3', 
    title: 'Advanced Meditation Techniques',
    date: 'March 21, 2024',
    duration: '5:30',
    type: 'video',
    mediaUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    thumbnail: 'https://images.pexels.com/photos/1051838/pexels-photo-1051838.jpeg'
  },
  { 
    id: '4', 
    title: 'Zen and Modern Life',
    date: 'March 20, 2024',
    duration: '4:15',
    type: 'video',
    mediaUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumbnail: 'https://images.pexels.com/photos/3560168/pexels-photo-3560168.jpeg'
  },
  { 
    id: '5', 
    title: 'Deep Breathing Techniques',
    date: 'March 19, 2024',
    duration: '6:20',
    type: 'video',
    mediaUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    thumbnail: 'https://images.pexels.com/photos/3822727/pexels-photo-3822727.jpeg'
  },
  { 
    id: '6', 
    title: 'Morning Meditation Guide',
    date: 'March 18, 2024',
    duration: '4:45',
    type: 'audio',
    mediaUrl: 'URL_TO_AUDIO',
    thumbnail: 'https://images.pexels.com/photos/3094230/pexels-photo-3094230.jpeg'
  },
  { 
    id: '7', 
    title: 'Yoga for Beginners',
    date: 'March 17, 2024',
    duration: '28:15',
    type: 'video',
    mediaUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
    thumbnail: 'https://images.pexels.com/photos/4056723/pexels-photo-4056723.jpeg'
  },
  { 
    id: '8', 
    title: 'Meditation Music Session',
    date: 'March 16, 2024',
    duration: '15:30',
    type: 'video',
    mediaUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4',
    thumbnail: 'https://images.pexels.com/photos/3822621/pexels-photo-3822621.jpeg'
  },
];

export default function PodcastsScreen() {
  const pathname = usePathname();
  const navigation = useNavigation(); // Use navigation hook
  const { colors } = useThemeContext();
  const [podcasts] = useState<Podcast[]>(podcastData);
  const [selectedPodcast, setSelectedPodcast] = useState<Podcast | null>(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const animatedValue = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const { width, height } = Dimensions.get('window');
  let controlsTimer: NodeJS.Timeout | null = null;

  // Extract and validate the tab name from the current path
  let previousScreen = null;
  if (pathname.includes('/(tabs)/')) {
    const tabMatch = pathname.match(/\/\(tabs\)\/([^/]+)/);
    if (tabMatch && tabMatch[1]) {
      previousScreen = tabMatch[1];
    }
  }

  const handleEpisodePress = (episode: Podcast) => {
    setSelectedPodcast(episode);
    setIsAudioPlaying(true);
    Animated.spring(animatedValue, {
      toValue: 1,
      useNativeDriver: false,
    }).start();
  };

  const handleClose = () => {
    setSelectedPodcast(null);
    setIsAudioPlaying(false);
  };

  const handleBackClick = () => {
    navigation.goBack(); // Use navigation to go back
  };

  const handleAudioPlayPause = () => {
    setIsAudioPlaying(!isAudioPlaying);
  };

  const getRecommendations = (currentId: string) => {
    return podcasts
      .filter(p => p.id !== currentId && p.type === 'video')
      .sort(() => Math.random() - 0.5) // Randomize recommendations
      .slice(0, 5); // Show up to 5 recommendations
  };

  const startControlsTimer = () => {
    if (controlsTimer) clearTimeout(controlsTimer);
    
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 150,
      useNativeDriver: true,
    }).start();

    controlsTimer = setTimeout(() => {
      if (isAudioPlaying) {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }).start();
      }
    }, 4500);
  };

  const headerHeight = 80; // Reduced header height

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      paddingTop: headerHeight + 20, // Add padding for header
    },
    listContent: {
      paddingHorizontal: 16,
      paddingTop: 20, // Add padding top for list content
    },
    headerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 20,
      marginBottom: 8,
    },
    iconContainer: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.backgroundPrimary,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 10,
    },
    podcastsTitle: {
      fontSize: 24,
      fontWeight: '600',
      color: colors.text,
    },
    newEpisodesText: {
      fontSize: 16,
      color: colors.textSecondary,
      marginBottom: 16,
    },
    episodeContainer: {
      marginVertical: 8,
      backgroundColor: colors.backgroundPrimary,
      borderRadius: 12,
      padding: 16,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3.84,
      elevation: 5,
    },
    episodeContent: {
      padding: 12,
    },
    thumbnailContainer: {
      width: '100%',
      aspectRatio: 16 / 9,
    },
    thumbnail: {
      width: '100%',
      height: '100%',
      resizeMode: 'cover',
    },
    durationBadge: {
      position: 'absolute',
      right: 8,
      bottom: 8,
      backgroundColor: 'rgba(0,0,0,0.75)',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 4,
    },
    durationText: {
      color: '#fff',
      fontSize: 12,
      fontWeight: '500',
    },
    episodeTitle: {
      fontSize: 18,
      fontWeight: '500',
      color: colors.text,
      marginBottom: 4,
    },
    episodeDate: {
      fontSize: 16,
      color: colors.textSecondary,
      marginBottom: 12,
    },
    divider: {
      height: 1,
      backgroundColor: colors.border,
      marginVertical: 4,
    },
    header: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: headerHeight,
      backgroundColor: colors.backgroundPrimary,
      zIndex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    backButton: {
      position: 'absolute',
      top: 12,
      left: 16,
      zIndex: 1,
    },
    headerTitle: {
      fontSize: 24,
      fontWeight: '600',
      color: colors.text,
      marginLeft: 12,
    },
    headerTitleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
      justifyContent: 'center',
    },
    detailsHeader: {
      padding: 20,
      flexDirection: 'row',
      justifyContent: 'flex-end',
    },
    podcastImage: {
      width: '100%',
      height: 200,
      resizeMode: 'cover',
    },
    detailTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      padding: 20,
      color: colors.text,
    },
    detailDate: {
      fontSize: 16,
      color: colors.textSecondary,
      paddingHorizontal: 20,
    },
    audioContainer: {
      flex: 1,
      backgroundColor: 'transparent', // Changed from solid color
      position: 'relative',
    },
    audioBackground: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      width: '100%',
      height: '100%',
      opacity: 0.3, // Reduced opacity for background
    },
    audioContent: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)', // Gradient-like overlay
      padding: 20,
      zIndex: 1,
    },
    audioThumbnail: {
      width: width * 0.8, // Make thumbnail larger
      height: width * 0.8, // Square aspect ratio
      alignSelf: 'center',
      marginTop: 40,
      marginBottom: 40,
      borderRadius: 8,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.3,
      shadowRadius: 4.65,
      elevation: 8,
    },
    audioPlayerWrapper: {
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      padding: 20,
      borderRadius: 16,
      marginTop: 'auto', // Push to bottom
      marginBottom: 30,
    },
    videoContainer: {
      flex: 1,
      backgroundColor: '#000',
      width: '100%',
      height: '100%',
    },
    mainContent: {
      flex: 1,
      position: 'relative',
    },
    videoPlayerContainer: {
      flex: 1,
      backgroundColor: '#fff',
      marginTop: -headerHeight, // Remove header space
    },
  });

  const expandedStyle = {
    position: 'absolute' as const,
    top: animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [height, 0],
    }),
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.background,
    zIndex: 100,
  };

  const renderPodcastItem = ({ item }: { item: Podcast }) => (
    <TouchableOpacity 
      onPress={() => handleEpisodePress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.episodeContainer}>
        <View style={styles.thumbnailContainer}>
          <Image 
            source={{ uri: item.thumbnail }}
            style={styles.thumbnail}
          />
          <View style={styles.durationBadge}>
            <Text style={styles.durationText}>{item.duration}</Text>
          </View>
        </View>
        <View style={styles.episodeContent}>
          <Text style={styles.episodeTitle}>{item.title}</Text>
          <Text style={styles.episodeDate}>{item.date}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackClick} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <View style={styles.iconContainer}>
            <Ionicons name="mic" size={20} color={colors.primary} />
          </View>
          <Text style={styles.headerTitle}>Podcasts</Text>
        </View>
      </View>

      <View style={styles.mainContent}>
        {selectedPodcast?.type === 'video' ? (
          <View style={styles.videoPlayerContainer}>
            <EpisodePlayerScreen
              currentVideo={selectedPodcast}
              recommendations={getRecommendations(selectedPodcast.id)}
              onClose={handleClose}
              onSelectVideo={handleEpisodePress}
              fadeAnim={fadeAnim}
            />
          </View>
        ) : (
          <FlatList<Podcast>
            data={podcasts}
            renderItem={renderPodcastItem}
            keyExtractor={(item: Podcast) => item.id}
            ListHeaderComponent={() => (
              <View>
                <Text style={styles.newEpisodesText}>{podcasts.length} Episodes</Text>
              </View>
            )}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
          />
        )}
      </View>

      {selectedPodcast?.type === 'audio' && (
        <Animated.View style={expandedStyle}>
          <View style={styles.audioContainer}>
            <Image 
              source={{ uri: selectedPodcast.thumbnail }}
              style={styles.audioBackground}
              blurRadius={25}
            />
            <View style={styles.audioContent}>
              <View style={styles.detailsHeader}>
                <TouchableOpacity onPress={handleClose}>
                  <Ionicons name="close" size={24} color="white" />
                </TouchableOpacity>
              </View>
              
              <Image 
                source={{ uri: selectedPodcast.thumbnail }}
                style={styles.audioThumbnail}
              />
              
              <Text style={[styles.detailTitle, { color: 'white' }]}>
                {selectedPodcast.title}
              </Text>
              <Text style={[styles.detailDate, { color: 'rgba(255,255,255,0.8)' }]}>
                {selectedPodcast.date}
              </Text>
              
              <View style={styles.audioPlayerWrapper}>
                <AudioPlayer 
                  audioUrl={selectedPodcast.mediaUrl} 
                  isPlaying={isAudioPlaying}
                  onPlayPause={handleAudioPlayPause}
                  podcastTitle={selectedPodcast.title}
                />
              </View>
            </View>
          </View>
        </Animated.View>
      )}
    </View>
  );
}