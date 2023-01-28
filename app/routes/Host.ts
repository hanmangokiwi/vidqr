import express from 'express';
import {UserManager} from "../modules/users/user";
import {RoomManager} from "../modules/rooms/room";
import VideoController from "../controllers/VideoController";

const router = express.Router();



const roomManager = RoomManager.getInstance();
const userManager = UserManager.getInstance();


router.post('/rejoin_room', function (req: any, res, next) {
    let roomId;
    let roomName=null;
    if (req.session.roomId) {
        roomId = req.session.roomId;
        roomName = roomManager.getRoom(roomId).roomName;
        console.log("A host has joined a room with id: " + roomId);
    } else {
        roomId = undefined;
    }

    res.send({'roomId': roomId, 'host': roomName===req.session.owner});
});

router.post('/create_room', function (req: any, res, next) {
    let roomId = roomManager.getUnusedId()
    let roomName = req.body.roomName

    if (roomName.length > 16) {
        roomName = roomName.substring(0, 16);
    }else if (roomName.length === 0) {
        roomName = roomManager.getRandomName();
    }

    roomManager.createRoom(roomId, roomName);


    req.session.roomId = roomId;
    req.session.owner = roomId;


    console.log("A host has made a room with id: " + roomId);
    res.send({'roomId': roomId});
});

router.post('/get_room_info', function (req: any, res, next) {
    let roomId = req.body.roomId;
    let roomName;

    try {
        roomName = roomManager.getRoom(roomId).roomName;
    }
    catch (e) {
        roomName = undefined;
    }

    res.send({'roomName': roomName, 'host': roomId===req.session.owner});
});

router.post('/get_current_video/:roomId', function (req: any, res, next) {
    try {
        const roomId = req.params.roomId;
        const room = roomManager.getRoom(roomId);

        if (room === undefined) {
            res.send({'video': []});
            return;
        }

        res.send({'video': room.getCurrentVideo()});
    }catch (e) {
        res.send({'video': []});
    }
});

router.post('/mediaControl/', function (req: any, res, next) {
    try {
        const action = req.body.action;
        if (action === "play") {
            res.send({'success': VideoController.getInstance().toggleVideo(req.session.roomId)});
        } else if (action === "next") {
            res.send({'success': VideoController.getInstance().nextVideo(req.session.roomId)});
        } else if (action === "prev") {
            res.send({'success': VideoController.getInstance().prevVideo(req.session.roomId)});
        } else {
            res.send({'success': false});
        }
    }catch (e) {
        res.send({'success': false});
    }
});

module.exports = router;