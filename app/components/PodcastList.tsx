import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface PodcastListProps {
  podcasts: any[];
  onSelect: (podcast: any) => void;
}

export const PodcastList: React.FC<PodcastListProps> = ({ podcasts, onSelect }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Up Next</Text>
      {podcasts.map((podcast) => (
        <TouchableOpacity
          key={podcast.id}
          style={styles.podcastItem}
          onPress={() => onSelect(podcast)}
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
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
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
    marginBottom: 4,
  },
  date: {
    fontSize: 14,
    color: '#666',
  },
});
