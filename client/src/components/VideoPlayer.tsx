import React, {useState} from "react";
import {socket} from "../config/socket";
import aFetch from "../config/axios";
import {AspectRatio} from "@mantine/core";
import ReactPlayer from "react-player";

function VideoPlayer(params: any) {
    const [videoRef, setVideoRef] = useState('');
    const [videoPlaying, setVideoPlaying] = useState(true);

    const nextVideo = (discard?: boolean) => {
        socket.emit("video:nextVideo", {"roomId": params.link, "discard": discard});
    }


    aFetch.post('/api/room/get_current_video/'+params.link).then(response => {
        if (response.data.video){
            setVideoRef(response.data.video.videoLink)
        }else{
            setVideoRef('')
        }
    })

    socket.on("video:nextVideo", (params: any) => {
        const videoLink = params.videoLink;

        if (videoLink !== videoRef) {
            setVideoRef(videoLink);
        }else{
            setVideoRef(videoLink + '?');
        }
        setVideoPlaying(true);
    });



    socket.on("video:toggleVideo", () => {
        console.log("toggle video");
        setVideoPlaying(!videoPlaying);
    });



    return (
        <AspectRatio ratio={16 / 9}>
            <ReactPlayer url={videoRef}
            playing={videoPlaying}
            onStart={() => setVideoPlaying(true)}
            onPause={() => setVideoPlaying(false)}
            onError={() => new Promise(res => setTimeout(res, 2000)).then(() => nextVideo(true))}
            controls={true}
            embedoptions={{cc_load_policy: 1, cc_lang_pref: "en"}}
            width="100%"
            height="100%"
            onEnded={() => nextVideo()}
            />
        </AspectRatio>
    );
}

export default VideoPlayer;