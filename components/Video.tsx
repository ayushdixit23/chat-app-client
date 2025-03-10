import React from 'react';
import videojs from "video.js"
// This imports the functional component from the previous sample.
import VideoJS from './VideoPlayer'


const Video = ({ url }: { url: string }) => {
    const playerRef = React.useRef(null);

    const videoJsOptions = {
        autoplay: false,
        muted: false,
        controls: true,
        enableDocumentPictureInPicture: true,
        controlBar: {
            skipButtons: {
                forward: 10,
                backward: 10,
            },
            volumePanel: {
                inline: false,
            },
        },
        // experimentalSvgIcons: true,
        responsive: true,
        // playbackRates: [0.5, 1, 1.5, 2],
        fluid: true,
        sources: [{
            // src: "https://www.youtube.com/watch?v=moFB-j5iY2E",
            src: url,
            type: 'video/mp4'
        }],
       
    };

    const handlePlayerReady = (player: any) => {
        playerRef.current = player;

        // You can handle player events here, for example:
        player.on('waiting', () => {
            videojs.log('player is waiting');
        });

        player.on('dispose', () => {
            videojs.log('player will dispose');
        });
    };

    return (
        <>
            <VideoJS
                options={videoJsOptions}
                onReady={handlePlayerReady}
            />
        </>
    );
}

export default Video