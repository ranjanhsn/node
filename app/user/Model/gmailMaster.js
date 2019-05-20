var mongoose = require("mongoose");
// var mongoose = restful.mongoose;
var autoIncrement = require("mongoose-auto-increment");
autoIncrement.initialize(mongoose.connection);
var usermaster = require('./userMaster')

var gmail = mongoose.Schema({

    El: {
        type: Number,
        required: true,
        unique: true
    },
    access_token: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },
    expires_at: {
        type: Number,
        required: true,
    },
    familyName: {
        type: String,
        required: true,
    },
    givenName: {
        type: String,
        required: true,
    },
    first_issued_at: {
        type: Number,
        required: true,
    },
    googleId: {
        type: Number,
        required: true,
    },
    imageUrl: {
        type: String,
        required: false,
    },
    login_hint: {
        type: String,
        required: false,
    },
    name: {
        type: String,
        required: false,
    },
    scope: {
        type: String,
        required: false,
    },
    tokenId: {
        type: String,
        required: true,
    },
    token_type: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
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

gmail.post('save', function (error, doc, next) {

    console.log("gmail Test:", doc)
    if (error.code === 11000) {
        next(new Error('There was a duplicate key error'));
    } else {
        next(error);
    }
});

gmail.post('save', function (doc) {
    usermaster.findOne({ email: doc.email }).then(
        record => {
            if (record) {
                var obj = {
                    Gmail_id: doc._id,
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
                    Gmail_id: doc._id
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

// gmail.index({ "_id": 1 });
gmail.plugin(autoIncrement.plugin, { model: "gmailMaster", startAt: 1, incrementBy: 1 });
module.exports = mongoose.model("gmailMaster", gmail);