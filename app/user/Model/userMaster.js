var mongoose = require("mongoose");
// var mongoose = restful.mongoose;
var autoIncrement = require("mongoose-auto-increment");
autoIncrement.initialize(mongoose.connection);

var user = mongoose.Schema({


    email:{
        type: String,
        required: true,
        unique: true
    }, 
    fb_id:{
        type: Number,
        required: false,
    },
    Gmail_id:{
        type: Number,
        required: false,
    },
    isActive: {
        type: Boolean,
        default: true
    }, 
    CreatedDate: {
        type: Date,
        required: true,
        default: Date.now()
    },
    FirstTimeLogin:{
        type: Boolean,
        default: true
    }

})

user.post('save', function(error, doc, next) {

    console.log("fb Test:",doc)
    if (error.code === 11000) {
      next(new Error('There was a duplicate key error'));
    } else {
      next(error);
    }
  });




// fb.index({ "_id": 1 });
user.plugin(autoIncrement.plugin, { model: "usermaster", startAt: 1, incrementBy: 1 });
module.exports = mongoose.model("usermaster", user);