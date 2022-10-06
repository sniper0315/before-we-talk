// const mongoose = require('mongoose');
const Step = require("../models/Step");
const User = require("../models/User");
// const { Room } = require('../models/Room');
// const { User } = require('../models/User');

const { find } = require("../config/stepTypes");
const { CourierClient } = require("@trycourier/courier");
const courierConfig = require("../config/courier");
const Message = require("../models/Message");

module.exports = {
    ADD_MESSAGE: async data => {
        // if (data.user.email === process.env.ADMIN_ACCOUNT && !data.flowId) {
        //     if (data.msgCnt == 0) {
        //         await Step.deleteMany({ type: 'default' })
        //     }
        //     const result = await Step.create({
        //         user: data.user._id,
        //         stepNumber: data.msgCnt,//
        //         stepType: data.stepType,
        //         content: data.message,
        //         type: 'default'
        //     });
        //     return result
        // } else {

            const newMessage = await new Message({
                room: data.room,
                to: data.user._id == data.room.invited_user ? data.room.creator : data.room.invited_user,
                from: data.user._id,
                content: data.message,
                stepType: data.stepType,
                flowId: data.flowId
            }).save();

            await User.findOneAndUpdate({ _id: data.user._id }, { lastSendMsgTime: new Date(), lastSendMsgTimeAhead: new Date(Date.now() + 1000 * 3600) });

            return newMessage.populate('to').populate('from');
        // }
    },
    
    UPDATE_MESSAGE: async data => {

        await Message.find({
            flowId: data.flowId,
            to: data.user._id,
            viewed: undefined
        }).update({
            $set: {
                viewed: new Date()
            }
        });

        return;
    },

    UNREAD_MESSAGE: async () => {
        const courier = CourierClient({ authorizationToken: courierConfig.auth_token });
        var curDate = new Date(Date.now() - 1000 * 3600)
        Message.aggregate(
        [   
            // {'$match': { $or: [ { viewed: undefined, to: { $ne: null },  }, { score: { $gt: 70, $lt: 90 } }, { views: { $gte: 1000 } } ] }},
            { "$lookup": {
                "from": 'users',
                "localField": "to",
                "foreignField": "_id",
                "as": "to"
            }},
            { "$unwind": "$to" },
            {'$match': { $or: [ { viewed: undefined, notified: undefined, 'to._id': { $ne: null } }] }},
            // {'$match': { $or: [ { notified: undefined, 'to._id': { $ne: null } }] }},
            { $project: { 
                room: 1, 
                to: 1,
                from: 1,
                content: 1,
                flowId: 1,
                stepType: 1,
                date: 1,
                viewed: 1,
                notified: 1,
                eq: { $cond: [ { $gt: [ '$date', '$to.lastLoginTimeAhead' ] }, 1, 0 ] } ,
                eq1: { $cond: [ { $gt: [ '$date', '$to.lastSendMsgTimeAhead' ] }, 1, 0 ] } ,
                eq2: { $cond: [ { $gt: [ '$date', '$to.lastNotificationSendTime' ] }, 1, 0 ] } 
            } },
            { '$match': { eq: 1, eq1: 1, eq2: 1 } },
            // {'$match': { $or: [ { 'to._id': { $ne: null }, date: { $gte: ('to.lastLoginTime' ? 'to.lastLoginTime' : new Date('2020-01-01')), $gte: ('to.lastSendMsgTime' ? 'to.lastSendMsgTime' : new Date('2020-01-01')), $gte: ('to.lastNotificationSendTime' ? 'to.lastNotificationSendTime' : new Date('2020-01-01'))} }] }},
            // {'$match': { $or: [ { viewed: undefined, notified: undefined, to: { $ne: null }, date: { $lte: curDate} }] }},
            { "$group": { 
                "_id": '$to._id',
                room : { $first: '$room' },
                to : { $first: '$to' },
                from : { $first: '$from' },
                content : { $first: '$content' },
                flowId : { $first: '$flowId' },
                stepType : { $first: '$stepType' },
                viewed : { $first: '$viewed' },
                date : { $first: '$date' }
            }}
        ])
        // .then((result) => {
        //     return Message.populate(result, {
        //         path: "to"
        //     })
        // })
        .then(async (data) => {
            // console.log(data)
            data.forEach( async (element) => {
                await courier.send({
                    message: {
                        template: courierConfig.unread_message_template,
                        to: {
                            email: element.to.email,
                        }
                    }
                });

                await User.findOneAndUpdate({ email: element.to.email }, { lastNotificationSendTime: new Date() });
            });

            const result = await Message.aggregate(
            [
                { "$lookup": {
                    "from": 'users',
                    "localField": "to",
                    "foreignField": "_id",
                    "as": "to"
                }},
                { "$unwind": "$to" },
                {'$match': { $or: [ { viewed: undefined, notified: undefined, 'to._id': { $ne: null } }] }},
                { $project: { 
                    room: 1, 
                    to: 1,
                    from: 1,
                    content: 1,
                    flowId: 1,
                    stepType: 1,
                    date: 1,
                    viewed: 1,
                    notified: 1,
                    eq: { $cond: [ { $gt: [ '$date', '$to.lastLoginTimeAhead' ] }, 1, 0 ] } ,
                    eq1: { $cond: [ { $gt: [ '$date', '$to.lastSendMsgTimeAhead' ] }, 1, 0 ] } ,
                    eq2: { $cond: [ { $gt: [ '$date', '$to.lastNotificationSendTime' ] }, 1, 0 ] } 
                } },
                { '$match': { eq: 1, eq1: 1, eq2: 1 } },
            ])
            await Promise.all(result.map(each => {
                return Message.findByIdAndUpdate(each._id, {
                    $set: {
                        notified: new Date()
                    }
                });
            }))
            // Message.updateMany({
            //     viewed: undefined,
            //     notified: undefined,
            //     to: { $ne: null },
            //     date: { $lte: curDate }
            // },{
            //     $set: {
            //         notified: new Date()
            //     }
            // })
        });
    },

    // GET_MESSAGES: async data => {
        // return await Message.find({ room: data.room._id }).populate('user', [
        //     'username',
        //     'social',
        //     'handle',
        //     'image'
        // ]);
    // },
    // CREATE_MESSAGE_CONTENT: (room, socketId) => {
    //     const user = room.previous.users.find(user => user.socketId === socketId);
    //     // return user && user.lookup && user.lookup.username
    //     //     ? `${user.lookup.username} has left ${room.updated.name}`
    //     //     : `Unknown User has left ${room.updated.name}`;
    //     return user && user.lookup && user.lookup.username
    //         ? null
    //         : null;
    // },
    // GET_ROOMS: async () => {
    //     return await Room.find({})
    //         .populate('user users.lookup', ['username', 'social', 'handle', 'image'])
    //         .select('-password');
    // },
    // GET_ROOM_USERS: async data => {
    //     return await Room.findById(data.room._id)
    //         .populate('user users.lookup', ['username', 'social', 'handle', 'image'])
    //         .select('-password');
    // },
    // UPDATE_ROOM_USERS: async data => {
    //     const room = await Room.findOne({ name: data.room.name })
    //         .select('-password')
    //         .populate('users.lookup', ['username', 'social', 'handle', 'image']);

    //     if (room) {
    //         if (
    //             room.users &&
    //             !room.users.find(user => user.lookup ? user.lookup._id.toString() === data.user._id : false)
    //         ) {
    //             room.users.push({
    //                 lookup: mongoose.Types.ObjectId(data.user._id),
    //                 socketId: data.socketId
    //             });
    //             const updatedRoom = await room.save();
    //             return await Room.populate(updatedRoom, {
    //                 path: 'user users.lookup',
    //                 select: 'username social image handle'
    //             });
    //         } else {
    //             // Update user socket id if the user already exists
    //             const existingUser = room.users.find(
    //                 user => user.lookup ? user.lookup._id.toString() === data.user._id : false
    //             );
    //             if (existingUser.socketId != data.socketId) {
    //                 existingUser.socketId = data.socketId;
    //                 await room.save();
    //             }
    //             return await Room.populate(room, {
    //                 path: 'user users.lookup',
    //                 select: 'username social image handle'
    //             });
    //         }
    //     } else {
    //         return;
    //     }
    // },
    // FILTER_ROOM_USERS: async data => {
    //     console.log('Filter Rooms');
    //     console.log(data);
    //     if (data.roomId) {
    //         const room = await Room.findById(mongoose.Types.ObjectId(data.roomId))
    //             .select('-password')
    //             .populate('users.lookup', ['username', 'social', 'handle', 'image']);
    //         if (room) {
    //             let previousUserState = Object.assign({}, room._doc);
    //             room.users = room.users.filter(user => user.socketId !== data.socketId);
    //             const updatedRoom = await room.save();
    //             return {
    //                 previous: previousUserState,
    //                 updated: await Room.populate(updatedRoom, {
    //                     path: 'user users.lookup',
    //                     select: 'username social image handle'
    //                 })
    //             };
    //         }
    //     }
    // }
};