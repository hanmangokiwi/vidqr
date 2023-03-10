import React from "react";
import VideoSearcher from "./VideoSearch";
import {VideoQueue} from "./VideoQueue";
import VideoPlayer from "./VideoPlayer";
import ShareLink from "./ShareLink";
import {ActionIcon} from "@mantine/core";
import {IconSearch, IconX} from "@tabler/icons-react";

function Header(props: {username: string}) {
    return (
        <div className="w-full flex flex-row justify-between h-10">
            <b>{props.username}</b>
        </div>
    )
}

function RemoteMenu(props: {roomId: string, username: string}) {
    return (
        <div className="flex flex-col min-h-full overflow-x-hidden overflow-y-hidden">
            <Header username={props.username}/>
            <div className="table-row-group flex-column md:flex md:flex-row">
                <div className="flex-col overflow-hidden w-full">
                    <div className="bg-gray-900 w-full">
                        <VideoSearcher roomId={props.roomId}/>
                        <ShareLink link={props.roomId}/>
                    </div>
                </div>
                <VideoQueue roomId={props.roomId}/>
            </div>
        </div>
    )
}

function HostMenu(props: {roomId: string, username: string}) {
    const [isSearching, setIsSearching] = React.useState(false);

    return (
        <div className="flex flex-col min-h-full overflow-x-hidden overflow-y-hidden">
            <Header username={props.username}/>
            <div className="absolute w-96 z-10 top-0 right-1">
                <ActionIcon className="mt-1 mb-2" color={'white'} onClick={() => {setIsSearching(!isSearching)}}>
                    {isSearching? <IconX size={16} />: <IconSearch size={16} />}
                </ActionIcon>
                {isSearching ?
                    <div className="border-2 border-slate-50">
                        <VideoSearcher roomId={props.roomId}/>
                    </div>: null}
            </div>
            <div className="table-row-group flex-column md:flex md:flex-row min-w-full w-full">

                <div className="flex-col w-full overflow-hidden mr-2">
                    <div className="bg-gray-900 w-full">
                        <VideoPlayer link={props.roomId}/>
                    </div>
                    <div className="bg-gray-900 overflow-hidden mt-1">
                        <ShareLink link={props.roomId}/>
                        {/*<UserList/>*/}
                    </div>
                </div>

                <VideoQueue roomId={props.roomId}/>
            </div>
        </div>
    )
}

function Dashboard(props: {roomId: string, username: string, isHost: boolean}) {
        if (props.isHost){
            return <HostMenu roomId={props.roomId} username={props.username}/>
        }
        else{
            return <RemoteMenu roomId={props.roomId} username={props.username}/>
        }
}

export default Dashboard;