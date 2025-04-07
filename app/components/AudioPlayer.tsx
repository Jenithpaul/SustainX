import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import { useThemeContext } from '../../contexts/ThemeContext';

interface AudioPlayerProps {
  audioUrl: string;
  isPlaying?: boolean;
  onPlayPause?: () => void;
  podcastTitle: string;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ audioUrl, isPlaying: parentIsPlaying, onPlayPause, podcastTitle }) => {
  const { colors } = useThemeContext();
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);

  async function loadAudio() {
    try {
      const { sound: audioSound } = await Audio.Sound.createAsync(
        { uri: audioUrl },
        { shouldPlay: true },
        onPlaybackStatusUpdate
      );
      setSound(audioSound);
      setIsPlaying(true);
    } catch (error) {
      console.error("Error loading audio:", error);
    }
  }

  const onPlaybackStatusUpdate = (status: any) => {
    if (status.isLoaded) {
      setPosition(status.positionMillis);
      setDuration(status.durationMillis);
    }
  };

  async function togglePlayPause() {
    if (sound) {
      if (isPlaying) {
        await sound.pauseAsync();
      } else {
        await sound.playAsync();
      }
      setIsPlaying(!isPlaying);
    } else {
      await loadAudio();
    }
  }

  const handleSeek = async (value: number) => {
    if (sound) {
      await sound.setPositionAsync(value);
    }
  };

  const formatTime = (millis: number) => {
    const minutes = Math.floor(millis / 60000);
    const seconds = Math.floor((millis % 60000) / 1000);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const styles = createStyles(colors);

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.titleText} numberOfLines={1}>
          {podcastTitle}
        </Text>
      </View>
      <View style={styles.controlsContainer}>
        <TouchableOpacity style={styles.playButton} onPress={togglePlayPause}>
          <Ionicons 
            name={isPlaying ? 'pause' : 'play'} 
            size={24} 
            color="#fff" 
          />
        </TouchableOpacity>
        <View style={styles.timelineContainer}>
          <Slider
            style={styles.timeline}
            value={position}
            minimumValue={0}
            maximumValue={duration}
            onSlidingComplete={handleSeek}
            minimumTrackTintColor={colors.primary}
            maximumTrackTintColor={colors.border}
            thumbTintColor={colors.primary}
          />
          <Text style={styles.timeText}>
            {formatTime(position)} / {formatTime(duration)}
          </Text>
        </View>
      </View>
    </View>
  );
};

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    width: '100%',
    paddingBottom: 10, // Reduced padding
    backgroundColor: 'transparent', // Remove black background
    borderRadius: 12,
  },
  titleContainer: {
    marginBottom: 8,
  },
  titleText: {
    color: '#FFFFFF',  // Changed from colors.text to white
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
  controlsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  timelineContainer: {
    flex: 1,
    marginHorizontal: 15,
    height: 20, // Reduced height
  },
  timeline: {
    height: 20, // Reduced height
  },
  playButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timeText: {
    color: colors.textSecondary,
    fontSize: 12,
    textAlign: 'center',
  },
});
