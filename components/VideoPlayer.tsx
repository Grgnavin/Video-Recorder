import React, { useEffect, useRef, useState } from 'react'
import { cn, createIframeLink } from '../lib/utils'
import { initialVideoState } from '../constants';
import { getVideoProcessingStatus, incrementVideoViews } from '../lib/actions/video';

const VideoPlayer = ({ videoId, className }: VideoPlayerProps) => {
  const iFrameRef = useRef<HTMLIFrameElement>(null);
  const[state, setState] = useState(initialVideoState);

  useEffect(() => {
    const checkProcessingStatus = async () => {
      const status = await getVideoProcessingStatus(videoId);
      setState(prevState => ({
        ...prevState,
        isProcessing: !status.isProcessed,
      }));
      return status.isProcessed;
    }
    checkProcessingStatus();

    const intervalId = setInterval(async() => {
      const isProcessed = await checkProcessingStatus();
      if (isProcessed) {
        clearInterval(intervalId);
      }
    }, 3000);
    return () => {
      clearInterval(intervalId);
    }
  }, [videoId]);

  useEffect(() => {
    if(state.isLoaded && !state.hasIncrementedView && !state.isProcessing) {
      const incrementView = async() => {
        try {
          await incrementVideoViews(videoId);
          setState((prevstate) => ({ ...prevstate, hasIncrementedView: true }));
        } catch (error) {
          console.error('Error incrementing view count:', error);
        }
      }
      incrementView();
    }
  }, [videoId, state.isLoaded, state.hasIncrementedView, state.isProcessing])

  return (
    <div className={cn("video-player", className)}>
      {state.isProcessing ? (
        <div>
          <p>Processing video...</p>
        </div>
      ) : (
        <iframe
          ref={iFrameRef}
          src={createIframeLink(videoId)}
          loading="lazy"
          title="Video player"
          style={{ border: 0, zIndex: 50 }}
          allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
          onLoad={() => setState((prev) => ({ ...prev, isLoaded: true }))}
        />
      )}
    </div>
  )
}

export default VideoPlayer