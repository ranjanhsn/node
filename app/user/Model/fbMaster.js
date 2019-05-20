var mongoose = require("mongoose");
// var mongoose = restful.mongoose;
var autoIncrement = require("mongoose-auto-increment");
autoIncrement.initialize(mongoose.connection);

var usermaster = require('./userMaster');
var fb = mongoose.Schema({

    accessToken: {
        type: String,
        required: true
    },
    data_access_expiration_time: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    expiresIn: {
        type: Number,
        required: true
    },
    id: {
        type: Number,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    pictureUrl: {
        type: String,
        required: false
    },
    reauthorize_required_in: {
        type: Number,
        required: true
    },
    signedRequest: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    userID: {
        type: Number,
        required: true,
        unique: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    CreatedDate: {
        type: Date,
        required: true,
        default: Date.now()
    }

})

fb.post('save', function (error, doc, next) {

    console.log("fb Test:", doc)
    if (error.code === 11000) {
        next(new Error('There was a duplicate key error'));
    } else {
        next(error);
    }
});


fb.post('save', function (doc) {
    usermaster.findOne({ email: doc.email }).then(
        record => {
            if (record) {
                var obj = {
                    fb_id: doc._id,
                    FirstTimeLogin: false
                }
                usermaster.updateOne({ _id: record._id }, { $set: obj }).then(
                    doc => {

                    },
                    err => {

                    }
                )

            }
            else {
                var obj = {
                    email: doc.email,
                    fb_id: doc._id
                }
                usermaster.create(obj).then(
                    saveData => {

                    },
                    err => {

                    }
                )

            }

        },
        err => {

        })
});


// fb.index({ "_id": 1 });
fb.plugin(autoIncrement.plugin, { model: "facebookmaster", startAt: 1, incrementBy: 1 });
module.exports = mongoose.model("facebookmaster", fb);