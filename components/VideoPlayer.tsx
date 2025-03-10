import React from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import '@videojs/themes/dist/fantasy/index.css';

// Define props interface
interface VideoJSProps {
  options: any;
  onReady?: (player: any) => void;
}

export const VideoJS: React.FC<VideoJSProps> = ({ options, onReady }) => {
  const videoRef = React.useRef<HTMLDivElement | null>(null);
  const playerRef = React.useRef<any>(null);

  React.useEffect(() => {
    if (!playerRef.current && videoRef.current) {
      const videoElement = document.createElement("video-js");
      videoElement.classList.add('vjs-big-play-centered', 'vjs-theme-fantasy');

      videoRef.current.appendChild(videoElement);

      const player = (playerRef.current = videojs(videoElement, options, () => {
        videojs.log('player is ready');
        onReady && onReady(player);
      }));
    } else if (playerRef.current) {
      const player = playerRef.current;
      player.autoplay(options.autoplay ?? false);
      player.src(options.sources ?? []);
    }
  }, [options]);

  React.useEffect(() => {
    return () => {
      if (playerRef.current && !playerRef.current.isDisposed()) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, []);

  return (
    <div data-vjs-player>
      <div ref={videoRef} />
    </div>
  );
};

export default VideoJS;
