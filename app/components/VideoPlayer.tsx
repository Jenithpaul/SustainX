import React, { useRef, useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Dimensions, Text, Image, Animated, TouchableWithoutFeedback } from 'react-native';
import Slider from '@react-native-community/slider';
import { Video, ResizeMode, AVPlaybackStatus } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import * as ScreenOrientation from 'expo-screen-orientation';
import { useThemeContext } from '../../contexts/ThemeContext';

interface VideoPlayerProps {
  videoUrl: string;
  onClose: () => void;
  currentVideo: {
    title: string;
    date: string;
    duration: string;
    thumbnail: string;
  };
  recommendations: Array<{
    id: string;
    title: string;
    date: string;
    duration: string;
    thumbnail: string;
  }>;
  onSelectVideo: (video: any) => void;
  fadeAnim?: Animated.Value;
}

type VideoStatusUpdateCallback = (status: AVPlaybackStatus) => void;

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  videoUrl,
  onClose,
  currentVideo,
  recommendations,
  onSelectVideo,
  fadeAnim,
}) => {
  const videoRef = useRef<Video>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [videoDimensions, setVideoDimensions] = useState({
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').width * (9 / 16),
  });
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const { colors } = useThemeContext();
  const styles = createStyles(colors);
  let controlsTimer: NodeJS.Timeout;
  const lastTapRef = useRef(0);
  const tapSideRef = useRef<string | null>(null);
  const [status, setStatus] = useState<AVPlaybackStatus>({
    isLoaded: false,
  });

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', updateDimensions);
    return () => {
      subscription.remove();
      const resetOrientation = async () => {
        try {
          await ScreenOrientation.unlockAsync();
          await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
        } catch (error) {
          console.error('Error resetting orientation:', error);
        }
      };
      resetOrientation();
      if (controlsTimer) clearTimeout(controlsTimer);
    };
  }, []);

  const updateDimensions = () => {
    const { width, height } = Dimensions.get('window');
    if (isFullscreen) {
      setVideoDimensions({ width: width, height: height });
    } else {
      setVideoDimensions({ width: width, height: width * (9 / 16) });
    }
  };

  const handlePlayPause = async () => {
    if (videoRef.current) {
      if (isPlaying) {
        await videoRef.current.pauseAsync();
      } else {
        await videoRef.current.playAsync();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleFullscreen = async () => {
    try {
      if (isFullscreen) {
        const { width } = Dimensions.get('window');
        setVideoDimensions({
          width: width,
          height: width * (9 / 16),
        });
        setIsFullscreen(false);
        await new Promise(resolve => setTimeout(resolve, 100));
        await ScreenOrientation.unlockAsync();
        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
      } else {
        setIsFullscreen(true);
        await ScreenOrientation.unlockAsync();
        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
        await new Promise(resolve => setTimeout(resolve, 100));
        const { width, height } = Dimensions.get('window');
        setVideoDimensions({
          width: width,
          height: height,
        });
      }
    } catch (error) {
      console.error('Error changing orientation:', error);
      setIsFullscreen(false);
      const { width } = Dimensions.get('window');
      setVideoDimensions({
        width: width,
        height: width * (9 / 16),
      });
      await ScreenOrientation.unlockAsync();
      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
    }
  };

  const onPlaybackStatusUpdate: VideoStatusUpdateCallback = (status) => {
    if (!status.isLoaded) return;

    setProgress(status.positionMillis / status.durationMillis);
    setDuration(status.durationMillis);

    if (status.didJustFinish && recommendations.length > 0) {
      onSelectVideo(recommendations[0]);
    }
    setStatus(status);
  };

  const handleTimelineChange = async (value: number) => {
    if (videoRef.current) {
      await videoRef.current.setPositionAsync(value * duration);
    }
  };

  const formatTime = (millis: number) => {
    const totalSeconds = millis / 1000;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.floor(totalSeconds % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const renderRecommendation = (item: any) => (
    <TouchableOpacity
      key={item.id}
      style={[styles.recommendationItem]}
      onPress={() => onSelectVideo(item)}
    >
      <Image source={{ uri: item.thumbnail }} style={styles.recommendationThumbnail} />
      <View style={styles.recommendationInfo}>
        <Text style={styles.recommendationTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.recommendationDuration}>{item.duration}</Text>
      </View>
    </TouchableOpacity>
  );

  const startControlsTimer = () => {
    if (controlsTimer) clearTimeout(controlsTimer);
    setShowControls(true);
    controlsTimer = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 4500);
  };

  const handleVideoPress = () => {
    setShowControls(true);
    startControlsTimer();
  };

  const handleDoubleTap = async (side: string) => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;

    if (lastTapRef.current && (now - lastTapRef.current) < DOUBLE_TAP_DELAY && tapSideRef.current === side) {
      try {
        if (videoRef.current && status.isLoaded) {
          const skipTime = side === 'left' ? -10000 : 10000;
          const newPosition = Math.max(0, Math.min(status.positionMillis + skipTime, duration));
          await videoRef.current.setPositionAsync(newPosition);
        }
      } catch (error) {
        console.error('Error seeking video:', error);
      }
    }

    lastTapRef.current = now;
    tapSideRef.current = side;
  };

  useEffect(() => {
    if (isPlaying) {
      startControlsTimer();
    } else {
      setShowControls(true);
    }
  }, [isPlaying]);

  return (
    <View style={[styles.container, isFullscreen && styles.fullscreenContainer]}>
      <View style={[
        styles.videoWrapper, 
        isFullscreen ? { width: '100%', height: '100%' } : { height: videoDimensions.height }
      ]}>
        <TouchableOpacity
          style={styles.videoTouchable}
          onPress={handleVideoPress}
          activeOpacity={1}
        >
          <Video
            ref={videoRef}
            style={[
              styles.video,
              !isFullscreen && {
                width: videoDimensions.width,
                height: videoDimensions.height,
              },
            ]}
            source={{ uri: videoUrl }}
            useNativeControls={false}
            resizeMode={isFullscreen ? ResizeMode.COVER : ResizeMode.CONTAIN}
            isLooping={false}
            shouldPlay={isPlaying}
            isMuted={false}
            onPlaybackStatusUpdate={onPlaybackStatusUpdate}
          />
          <View style={styles.controlsOverlay}>
            <TouchableWithoutFeedback onPress={() => handleDoubleTap('left')}>
              <View style={styles.skipArea} />
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={() => handleDoubleTap('right')}>
              <View style={styles.skipArea} />
            </TouchableWithoutFeedback>
          </View>
        </TouchableOpacity>

        {showControls && (
          <Animated.View style={[
            styles.controlsOverlay,
            isFullscreen && { backgroundColor: 'rgba(0,0,0,0.3)' }
          ]}>
            <View style={styles.timelineContainer}>
              <Slider
                style={styles.timeline}
                value={progress}
                onValueChange={handleTimelineChange}
                minimumValue={0}
                maximumValue={1}
                minimumTrackTintColor="#fff"
                maximumTrackTintColor="rgba(255,255,255,0.5)"
                thumbTintColor="#fff"
              />
              <Text style={styles.timeText}>
                {formatTime(progress * duration)} / {formatTime(duration)}
              </Text>
            </View>
            <View style={styles.controls}>
              <TouchableOpacity onPress={handlePlayPause}>
                <Ionicons name={isPlaying ? 'pause' : 'play'} size={28} color="white" />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleFullscreen}>
                <Ionicons name={isFullscreen ? 'contract' : 'expand'} size={24} color="white" />
              </TouchableOpacity>
            </View>
          </Animated.View>
        )}

        {!isFullscreen && (
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={24} color="white" />
          </TouchableOpacity>
        )}
      </View>

      {!isFullscreen && (
        <View style={styles.content}>
          <View style={styles.videoDetails}>
            <Text style={styles.videoTitle}>{currentVideo.title}</Text>
            <Text style={styles.videoDate}>{currentVideo.date}</Text>
            <Text style={styles.videoType}>
              <Ionicons name="videocam-outline" size={14} /> Video
            </Text>
          </View>
        </View>
      )}
    </View>
  );
};

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  fullscreenContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#000',
    zIndex: 9999,
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 10,
    padding: 8,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
  },
  controlsOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
    paddingBottom: 10,
    flexDirection: 'column',
  },
  skipArea: {
    flex: 1,
  },
  timelineContainer: {
    width: '100%',
    paddingHorizontal: 15,
    height: 20,
    marginBottom: 5,
  },
  timeline: {
    width: '100%',
    height: 20,
  },
  timeText: {
    color: 'white',
    fontSize: 12,
    textAlign: 'right',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 5,
  },
  videoWrapper: {
    width: '100%',
    position: 'relative',
    backgroundColor: '#000',
    marginBottom: 0,
  },
  fullscreenVideoWrapper: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  videoTouchable: {
    width: '100%',
    height: '100%',
  },
  video: {
    backgroundColor: '#000',
    width: '100%',
    height: '100%',
  },
  content: {
    flex: 1,
    backgroundColor: colors.background,
  },
  videoDetails: {
    padding: 15,
    backgroundColor: colors.backgroundPrimary,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  videoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 5,
  },
  videoDate: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
    marginBottom: 8,
  },
  videoType: {
    fontSize: 14,
    color: '#666',
    alignItems: 'center',
  },
  recommendationsContainer: {
    padding: 15,
  },
  recommendationsTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 15,
  },
  recommendationsList: {
    paddingBottom: 20,
  },
  recommendationItem: {
    flexDirection: 'row',
    padding: 12,
    marginBottom: 12,
    backgroundColor: colors.backgroundPrimary,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  recommendationThumbnail: {
    width: 160,
    height: 90,
    borderRadius: 8,
  },
  recommendationInfo: {
    flex: 1,
    marginLeft: 10,
    justifyContent: 'space-between',
  },
  recommendationTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
  recommendationDuration: {
    fontSize: 14,
    color: colors.textSecondary,
  },
});