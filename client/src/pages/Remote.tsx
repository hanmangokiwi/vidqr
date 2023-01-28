import React, { useState, useEffect } from "react";
import {useNavigate, useParams} from 'react-router-dom';
import {VideoQueue} from "../components/video_queue";
import {Button, Loader, Stack, TextInput} from '@mantine/core';
import {socket} from "../config/socket";
import aFetch from "../config/axios";
import {useSetState} from "@mantine/hooks";

function RemoteWrapper(params: any) {
    const [videoLink, setVideoLink] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [invalid, setInvalid] = useState(false);

    const textSubmit = () => {
        if (videoLink !== "") {
            setSubmitted(true);
            aFetch.post(`/api/remote/add_video`, {'roomId': params.roomId, 'videoLink': videoLink}).then(
                response => {
                    setSubmitted(false);
                    if (response.data.validVideo) {
                        setVideoLink("");
                        setInvalid(false);
                    }else{
                        setInvalid(true);
                    }
                });
        } else {
            alert("Please Add A Valid Link");
        }
    }

    return (
        <div className="hViewer">
          <div className="primary">
              <TextInput
                  label="YouTube Link"
                  placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                  value={videoLink}
                  onChange={e => {setInvalid(false);setVideoLink(e.target.value)}}
                  onKeyDown={(e) => e.key === "Enter" ? textSubmit(): null}
                  rightSection={submitted ? <Loader size={"xs"}/>: null}
                  error={invalid ? "Invalid Video Link": null}
              />
              <Button
                  onClick={() => {textSubmit()}}
              >
                  Submit
              </Button>
          </div>
          <div className="secondary">
            <VideoQueue roomId={params.roomId}/>
          </div>
        </div>
    );
}
const Remote = () => {
    let params = useParams();
    let navigate = useNavigate();

    const [username, setUsername] = useState(undefined)
    const [usernameBox, setUsernameBox] = useState('')
    const [roomInfo, setRoomInfo] = useSetState({'roomName': undefined});

    useEffect(() => {
        aFetch.post(`/api/host/get_room_info/`, {'roomId': params.roomId}).then(response => {
            if (response.data.roomName){
                document.title = response.data.roomName;
                setRoomInfo(response.data);
            }else{
                navigate('/');
            }
        });

        aFetch.post(`/api/remote/get_username/${params.roomId}`).then(response => {
            if (response.data.username){
                setUsername(response.data.username);
            }
        }
    )}, []);

    const promptSubmit = () => {
        if (usernameBox.length > 16){
            return;
        }


        aFetch.post(`/api/remote/join_room/${params.roomId}`, {'redirect': false, 'username': usernameBox}).then(response => {
            if (response.data.validRoom){
                socket.emit("video:subscribe", {'roomId': response.data.roomId});
                setUsername(response.data.username);
            }
        });

    }

    if (username === '' || username === undefined){
        return (
            <div className="mainViewer"><div className="promptForm">
                <div className="promptBox">
                    <Stack >
                        <b>You are trying to join room <mark>{roomInfo.roomName}</mark></b>

                        <b>Pick an identifiable name</b>
                        <TextInput
                            placeholder="Username"
                            onChange={(e) => {setUsernameBox(e.target.value)}}
                            onKeyDown={(e) => e.key === "Enter" ? promptSubmit(): null}
                            error={usernameBox.length > 16 ? "Usernames must be at most 16 characters": null}
                        />
                        {params.isLocked ? (
                            <><b>This room is password-locked</b><TextInput
                                placeholder="Room Secret"/></>): null}
                        <Button variant="gradient" gradient={{ from: 'teal', to: 'cyan' }} onClick={promptSubmit}>Enter</Button>
                    </Stack>
                </div>
            </div>
            </div>
        )
    }else{
        return (
            <div className="mainViewer">
                <div className="remoteHeader">
                    <b>{username}</b>

                    <b>{params.roomId}</b>
                </div>


                <RemoteWrapper roomId={params.roomId}/>
            </div>
        );
    }
};

export default Remote;
