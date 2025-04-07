import React from 'react';
import { View, ScrollView, StyleSheet, Dimensions, Animated, Text, TouchableOpacity, Image } from 'react-native';
import { VideoPlayer } from './VideoPlayer';
import { Ionicons } from '@expo/vector-icons';
import { useThemeContext } from '../../contexts/ThemeContext';
import { useNavigation } from '@react-navigation/native';

interface EpisodePlayerScreenProps {
  currentVideo: {
    title: string;
    date: string;
    duration: string;
    thumbnail: string;
    mediaUrl: string;
  };
  recommendations: Array<{
    id: string;
    title: string;
    date: string;
    duration: string;
    thumbnail: string;
  }>;
  onClose: () => void;
  onSelectVideo: (video: any) => void;
  fadeAnim?: Animated.Value;
}

export const EpisodePlayerScreen: React.FC<EpisodePlayerScreenProps> = ({
  currentVideo,
  recommendations,
  onClose,
  onSelectVideo,
  fadeAnim,
}) => {
  const { colors } = useThemeContext();
  const navigation = useNavigation();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      position: 'absolute',
      top: 0,
      left: 0,
      zIndex: 100,
      padding: 16,
    },
    backButton: {
      backgroundColor: 'rgba(0,0,0,0.5)',
      padding: 8,
      borderRadius: 20,
    },
    scrollView: {
      flex: 1,
      backgroundColor: colors.background,
    },
    recommendationsContainer: {
      padding: 16,
      paddingTop: 0, // Remove top padding
    },
    videoContainer: {
      height: Dimensions.get('window').width * (12 / 16), // Match video height
      backgroundColor: '#000',
    },
    scrollContent: {
      flexGrow: 1,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 16,
    },
    podcastItem: {
      flexDirection: 'row',
      marginBottom: 20,
    },
    thumbnailContainer: {
      position: 'relative',
      width: 160,
      height: 90,
    },
    thumbnail: {
      width: '100%',
      height: '100%',
      borderRadius: 8,
    },
    duration: {
      position: 'absolute',
      bottom: 8,
      right: 8,
      backgroundColor: 'rgba(0,0,0,0.8)',
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 4,
    },
    durationText: {
      color: '#fff',
      fontSize: 12,
    },
    details: {
      flex: 1,
      marginLeft: 12,
    },
    title: {
      fontSize: 16,
      fontWeight: '500',
      color: colors.text,
      marginBottom: 4,
    },
    date: {
      fontSize: 14,
      color: colors.textSecondary,
    },
  });

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.header} 
        onPress={() => navigation.goBack()}
      >
        <View style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="white" />
        </View>
      </TouchableOpacity>
      <VideoPlayer
        videoUrl={currentVideo.mediaUrl}
        onClose={onClose}
        currentVideo={currentVideo}
        recommendations={recommendations}
        onSelectVideo={onSelectVideo}
        fadeAnim={fadeAnim}
      />
      <ScrollView 
        style={styles.scrollView} 
        bounces={false}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.recommendationsContainer}>
          <Text style={styles.sectionTitle}>Up Next</Text>
          {recommendations.map((podcast) => (
            <TouchableOpacity
              key={podcast.id}
              style={styles.podcastItem}
              onPress={() => onSelectVideo(podcast)}
            >
              <View style={styles.thumbnailContainer}>
                <Image source={{ uri: podcast.thumbnail }} style={styles.thumbnail} />
                <View style={styles.duration}>
                  <Text style={styles.durationText}>{podcast.duration}</Text>
                </View>
              </View>
              <View style={styles.details}>
                <Text style={styles.title} numberOfLines={2}>{podcast.title}</Text>
                <Text style={styles.date}>{podcast.date}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};
