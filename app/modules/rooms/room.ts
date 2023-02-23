import {User, UserManager} from "../users/user";


class Room {
    private readonly _roomId: string;

    public readonly roomName: string | undefined;
    private readonly _users: Map<string, User>;
    private _hostId: string;
    private readonly _usernames: Set<string>;
    private readonly _videoList: {videoLink: string, videoTitle: string, videoThumbnail: string, videoUsername: string, videoId: number}[];
    private readonly _historicalVideoList: {videoLink: string, videoTitle: string, videoThumbnail: string, videoUsername: string, videoId: number}[];
    private _videoCount: number;


    constructor(roomId: string, roomName: string | undefined, hostId: string) {
        this._roomId = roomId;
        this.roomName = roomName;
        this._users = new Map<string, User>();
        this._hostId = hostId;
        this._usernames = new Set<string>();
        this._videoList = [];
        this._historicalVideoList = [];
        this._videoCount = 0;
    }

    public get roomId(): string {
        return this._roomId;
    }

    public get hostId(): string {
        return this._hostId;
    }

    public addUser(user: User, username: string): void {
        user.joinRoom(this._roomId, username);
        this._usernames.add(username);
        this._users.set(user.userId, user);
    }

    public usernameExists(username: string): boolean {
        return this._usernames.has(username);
    }

    public removeUser(userId: string): void {
        const user = this._users.get(userId);
        if (user !== undefined) {
            const username = user.getUsername(this._roomId);
            if (username !== undefined) {
                this._usernames.delete(username);
            }
            user.leaveRoom(this._roomId);
        }
        this._users.delete(userId);
    }

    public addVideo(video: {videoLink: string, videoTitle: string, videoThumbnail: string, videoUsername: string}): void {
        this._videoCount++;
        const newVideo = {
            videoLink: video.videoLink,
            videoTitle: video.videoTitle,
            videoThumbnail: video.videoThumbnail,
            videoUsername: video.videoUsername,
            videoId: this._videoCount
        }
        this._videoList.push(newVideo);
    }

    public get videoList(): {videoLink: string, videoTitle: string, videoThumbnail: string, videoUsername: string, videoId: number}[] {
        return this._videoList;
    }

    public shiftVideoList(discard?: boolean): void {
        if (this._videoList.length > 0){
            const pop = this._videoList.shift();
            if (!discard && pop != undefined) {
                this._historicalVideoList.push(pop);
            }
        }
    }

    public unshiftVideoList(): boolean {
        if (this._historicalVideoList.length > 0){
            const pop = this._historicalVideoList.pop();
            if (pop != undefined) {
                this._videoList.unshift(pop);
            }
            return true
        }
        return false
    }

    public getCurrentVideo(){
        return this._videoList[0];
    }

    public getCumulativeVideoCount(): number {
        return this._videoCount;
    }

    public getUserCount(): number {
        return this._users.size;
    }


}

class RoomManager {
    private _rooms: Map<string, Room>;
    private nullRoom = new Room("null", undefined, "null");
    private static _instance: RoomManager;

    private constructor() {
        this._rooms = new Map<string, Room>();
    }

    public static getInstance(): RoomManager {
        if (RoomManager._instance == null) {
            RoomManager._instance = new RoomManager();
        }

        return RoomManager._instance;
    }

    public createRoom(roomId: string, roomName: string, owner: string): Room {
        let room = new Room(roomId, roomName, owner);
        this._rooms.set(roomId, room);
        return room;
    }

    public getUnusedId(): string {
        let id = Math.random().toString().substring(2, 10);
        while (this._rooms.has(id)) {
            id = Math.random().toString().substring(2, 10);
        }
        return id;
    }

    public addUserToRoom(roomId: string, user: User, username: string): void {
        this.getRoom(roomId).addUser(user, username);
    }

    public removeUserFromRoom(roomId: string, userId: string): void {
        this.getRoom(roomId).removeUser(userId);
    }

    public getRoom(roomId: string): Room {
        const room = this._rooms.get(roomId);
        if (room == undefined) {
            return this.nullRoom;
        }else{
            return room;
        }
    }

    public deleteRoom(roomId: string): void {
        this._rooms.delete(roomId);
    }

    public roomExists(roomId: string): boolean {
        if (roomId == undefined) {
            return false;
        }
        return this._rooms.has(roomId);
    }

    public getRandomName(): string {
        return "Uncreative Room Name";
    }
}

export {Room, RoomManager};