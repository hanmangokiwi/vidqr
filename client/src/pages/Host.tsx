import React, { useState } from "react";
import {useNavigate} from "react-router-dom";
import aFetch from "../config/axios";
import {PromptBox, RoomNamePrompt, SubmitButton} from "../components/PromptBox";


const Host = () => {
    const navigate = useNavigate();

    const [roomNameBox, setRoomNameBox] = useState('');
    const [roomNameError, setRoomNameError] = useState('');

    const promptSubmit = () => {
        if (roomNameBox.length > 16 || roomNameBox.length === 0){
            if (roomNameBox.length === 0){
                setRoomNameError('Room name cannot be empty');
            }
            return;
        }

        aFetch.post(`/api/room/create_room/`, {'roomName': roomNameBox }).then(response => {
            if (response.data.roomId){
                navigate(`/${response.data.roomId}`)
            }
        });
    }

    return (
        <div className="flex flex-col min-h-full overflow-x-hidden overflow-y-hidden flex flex-col justify-center items-center min-h-full h-screen">
            <PromptBox promptSubmit={promptSubmit}>
                <RoomNamePrompt roomNameState={[roomNameBox, setRoomNameBox]} errorState={[roomNameError, setRoomNameError]}/>
                {/*<b>Optional Password</b>*/}
                {/*<TextInput*/}
                {/*    placeholder="Password"*/}
                {/*    onChange={(e) => {}}*/}
                {/*/>*/}
                <SubmitButton text="Create Room"/>
            </PromptBox>
        </div>
    )
};

export default Host;