const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const Promise = require("promise");
const BunnyStorage = require('bunnycdn-storage').default;
const axios = require('axios')
const bunnyStorage = new BunnyStorage(process.env.ACCESSKEY, process.env.STORAGE_ZONE_NAME);

const keys = require('../../config/keys');
const authMiddleware = require("../../middlewares/auth");
const verify = require('../../utilities/verify-token');
const Message = require('../../models/Message');
const Conversation = require('../../models/Conversation');
const GlobalMessage = require('../../models/GlobalMessage');

var multer = require('multer');
const storage = multer.diskStorage(
    {
        destination: './' + process.env.UPLOAD_DIR + '/',
        filename: function (req, file, cb) {
            cb( null, file.originalname);
        }
    }
);
const upload = multer( { storage: storage } );

// Token verfication middleware
// Get global messages

router.get('/global', (req, res) => {
    GlobalMessage.aggregate([
        {
            $lookup: {
                from: 'users',
                localField: 'from',
                foreignField: '_id',
                as: 'fromObj',
            },
        },
    ])
        .project({
            'fromObj.password': 0,
            'fromObj.__v': 0,
            'fromObj.date': 0,
        })
        .exec((err, messages) => {
            if (err) {
                console.log(err);
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ message: 'Failure' }));
                res.sendStatus(500);
            } else {
                res.send(messages);
            }
        });
});

// Post global message
router.post('/global', (req, res) => {
    let message = new GlobalMessage({
        from: jwtUser.id,
        body: req.body.body,
    });

    req.io.sockets.emit('messages', req.body.body);

    message.save(err => {
        if (err) {
            console.log(err);
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ message: 'Failure' }));
            res.sendStatus(500);
        } else {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ message: 'Success' }));
        }
    });
});

router.post('/create', authMiddleware, upload.array('media'), async (req, res) => {
    // req.files && req.files.forEach(eachFile => {
    //     const file_path = path.join(__dirname, '../../' + process.env.UPLOAD_DIR + '/' + eachFile.originalname);
    //     console.log(file_path)
    //     const stepType = eachFile.originalname.substr(-3) == 'wav' ? 'audio' : eachFile.originalname.substr(-3) == 'mp4' ? 'video' : 'file'
    //     console.log(stepType)
    //     bunnyStorage.upload(fs.readFileSync(file_path), stepType + '/' + eachFile.originalname)
    // })
    let fileList = req.files.map((eachFile) => {
        return {
            file_path: path.join(__dirname, '../../' + process.env.UPLOAD_DIR + '/' + eachFile.originalname),
            stepType: eachFile.originalname.substr(-3) == 'wav' ? 'audio' : eachFile.originalname.substr(-3) == 'mp4' ? 'video' : 'file',
            originalname: eachFile.originalname
        }
    })
    req.body.messageArray = JSON.parse(req.body.messageArray)
    req.body.messageArray.map((eachStep) => {
        if (eachStep.type) {
            fileList.push({
                file_path: path.join(__dirname, '../../' + process.env.UPLOAD_TEMP_DIR + '/' + eachStep.message),
                stepType: eachStep.message.substr(-3) == 'wav' ? 'audio' : eachStep.message.substr(-3) == 'mp4' ? 'video' : 'file',
                originalname: eachStep.message
            })
        }
    })
    await Promise.all(fileList.map((eachFile) => {
        var aPromise = new Promise(function(resolve, reject) {
            fs.readFile(eachFile.file_path, function (err, data) {
                if (err) reject(err);
                resolve(data)
            });
        })
        return aPromise
            .then((data) => {
                return axios({
                    method: 'PUT',
                    baseURL:'https://storage.bunnycdn.com/' + process.env.STORAGE_ZONE_NAME + '/',
                    url:  eachFile.stepType + '/' + eachFile.originalname,
                    headers: {
                        'AccessKey': process.env.ACCESSKEY
                    },
                    maxContentLength: Infinity,
                    maxBodyLength: Infinity,
                    data: data
                });
            })
            .catch((error) => {
                console.log(error)
            })
    }))
    const result = Promise.all(
        req.body.messageArray.map(async (msg, index) => {
            const newMessage = await new Message({
                room: msg.room,
                to: null,
                from: msg.user,
                content: msg.message,
                stepType: msg.stepType,
                flowId: msg.flowId
            }).save();
            return newMessage;
        })
    )

    result.then((resultA) => { return res.json({ message: resultA }) });
});

router.post('/upload', authMiddleware, upload.array('media'), async (req, res) => {
    console.log('=============================')
    console.log(req.files)
    console.log('=============================')
    await Promise.all(req.files.map((eachFile) => {
        const file_path = path.join(__dirname, '../../' + process.env.UPLOAD_DIR + '/' + eachFile.originalname);
        const stepType = eachFile.originalname.substr(-3) == 'wav' ? 'audio' : eachFile.originalname.substr(-3) == 'mp4' ? 'video' : 'file'

        var aPromise = new Promise(function(resolve, reject) {
            fs.readFile(file_path, function (err, data) {
                if (err) reject(err);
                resolve(data)
            });
        })
        return aPromise
            .then((data) => {
                return axios({
                    method: 'PUT',
                    baseURL:'https://storage.bunnycdn.com/' + process.env.STORAGE_ZONE_NAME + '/',
                    url:  stepType + '/' + eachFile.originalname,
                    headers: {
                        'AccessKey': process.env.ACCESSKEY
                    },
                    maxContentLength: Infinity,
                    maxBodyLength: Infinity,
                    data: data
                });
            })
            .catch((error) => {
                console.log(error)
            })
    }))
    return res.json({ message: 'finish' });
});

router.get('/download/:filename', (req, res) => {
    
    const stepType = req.params.filename.substr(-3) == 'wav' ? 'audio' : req.params.filename.substr(-3) == 'mp4' ? 'video' : 'file'
    bunnyStorage.download(stepType + '/' + req.params.filename, 'arraybuffer').then((result) => {
        res.type('application/octet-stream').send(JSON.stringify(result.data));
    }).catch((error) => {
        res.type('application/octet-stream').send(JSON.stringify(error.data));
    })
});

router.get("/getByFlowId/:flowId", async (req, res) => {
    const messages = await Message.find({ flowId: req.params.flowId }).sort({date: 1, '_id': 1}).populate('room').populate('from');

    return res.json({ messages });
});

// Get conversations list
router.get('/conversations', (req, res) => {
    let from = mongoose.Types.ObjectId(jwtUser.id);
    Conversation.aggregate([
        {
            $lookup: {
                from: 'users',
                localField: 'recipients',
                foreignField: '_id',
                as: 'recipientObj',
            },
        },
    ])
        .match({ recipients: { $all: [{ $elemMatch: { $eq: from } }] } })
        .project({
            'recipientObj.password': 0,
            'recipientObj.__v': 0,
            'recipientObj.date': 0,
        })
        .exec((err, conversations) => {
            if (err) {
                console.log(err);
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ message: 'Failure' }));
                res.sendStatus(500);
            } else {
                res.send(conversations);
            }
        });
});

// Get messages from conversation
// based on to & from
router.get('/conversations/query', (req, res) => {
    let user1 = mongoose.Types.ObjectId(jwtUser.id);
    let user2 = mongoose.Types.ObjectId(req.query.userId);
    Message.aggregate([
        {
            $lookup: {
                from: 'users',
                localField: 'to',
                foreignField: '_id',
                as: 'toObj',
            },
        },
        {
            $lookup: {
                from: 'users',
                localField: 'from',
                foreignField: '_id',
                as: 'fromObj',
            },
        },
    ])
        .match({
            $or: [
                { $and: [{ to: user1 }, { from: user2 }] },
                { $and: [{ to: user2 }, { from: user1 }] },
            ],
        })
        .project({
            'toObj.password': 0,
            'toObj.__v': 0,
            'toObj.date': 0,
            'fromObj.password': 0,
            'fromObj.__v': 0,
            'fromObj.date': 0,
        })
        .exec((err, messages) => {
            if (err) {
                console.log(err);
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ message: 'Failure' }));
                res.sendStatus(500);
            } else {
                res.send(messages);
            }
        });
});

// Post private message
router.post('/', (req, res) => {
    let from = mongoose.Types.ObjectId(jwtUser.id);
    let to = mongoose.Types.ObjectId(req.body.to);

    Conversation.findOneAndUpdate(
        {
            recipients: {
                $all: [
                    { $elemMatch: { $eq: from } },
                    { $elemMatch: { $eq: to } },
                ],
            },
        },
        {
            recipients: [jwtUser.id, req.body.to],
            lastMessage: req.body.body,
            date: Date.now(),
        },
        { upsert: true, new: true, setDefaultsOnInsert: true },
        function (err, conversation) {
            if (err) {
                console.log(err);
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ message: 'Failure' }));
                res.sendStatus(500);
            } else {
                let message = new Message({
                    conversation: conversation._id,
                    to: req.body.to,
                    from: jwtUser.id,
                    body: req.body.body,
                });

                req.io.sockets.emit('messages', req.body.body);

                message.save(err => {
                    if (err) {
                        console.log(err);
                        res.setHeader('Content-Type', 'application/json');
                        res.end(JSON.stringify({ message: 'Failure' }));
                        res.sendStatus(500);
                    } else {
                        res.setHeader('Content-Type', 'application/json');
                        res.end(
                            JSON.stringify({
                                message: 'Success',
                                conversationId: conversation._id,
                            })
                        );
                    }
                });
            }
        }
    );
});

module.exports = router;
