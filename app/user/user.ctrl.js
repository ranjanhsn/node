var user = {};
var fbModel = require("./Model/fbMaster");
var gmailModel = require("./Model/gmailMaster");
var usermaster = require('./Model/userMaster');

user.register = (req, res, next) => {
    try {

        // console.log(req.body);

        var inputField = req.body;

        if (inputField.type == "facebook") {

            var obj = {
                email: inputField.email,
                userID: inputField.userID,
                id: inputField.id
            }

            fbModel.findOne(obj).then(
                record => {
                    if (record) {
                        var UpdatePayload = {
                            accessToken: inputField.accessToken,
                            data_access_expiration_time: inputField.data_access_expiration_time,
                            expiresIn: inputField.expiresIn,
                            reauthorize_required_in: inputField.reauthorize_required_in,
                            signedRequest: inputField.signedRequest,
                            pictureUrl: inputField.pictureUrl
                        }
                        //Update Record start
                        fbModel.updateOne({ _id: record._id }, { $set: UpdatePayload }).then(
                            updateDate => {
                                next();
                                // record.accessToken = inputField.accessToken;
                                // record.data_access_expiration_time = inputField.data_access_expiration_time;
                                // record.expiresIn = inputField.expiresIn,
                                //     record.reauthorize_required_in = inputField.reauthorize_required_in;
                                // record.signedRequest = inputField.signedRequest;
                                // record.pictureUrl = inputField.pictureUrl;

                                // var obj = {
                                //     Status: 200,
                                //     message: "Account login sucessfully",
                                //     Data: record
                                // }

                                // res.json(obj)

                            },
                            err => {
                                var obj = {
                                    Status: 400,
                                    message: err.message
                                }
                                res.json(obj)
                            })
                        //Update Record end
                    }
                    else {

                        //create new Record start
                        var fbSchema = new fbModel(req.body)
                        fbSchema.save().then(
                            createData => {
                                next();
                                // var obj = {
                                //     Status: 200,
                                //     message: "Account created sucessfully",
                                //     Data: createData
                                // }

                                // res.json(obj)
                            },
                            err => {
                                var obj = {
                                    Status: 400,
                                    message: err.message
                                }
                                res.json(obj)
                            }

                        )
                        //create new Record end
                    }

                },
                err => {
                    var obj = {
                        Status: 400,
                        message: err.message
                    }
                    res.json(obj)
                }
            )


        }

        else if (inputField.type == "google") {

            var obj = {
                email: inputField.email,
                googleId: inputField.googleId
            }


            gmailModel.findOne(obj).then(
                record => {
                    if (record) {
                        var payload = {
                            access_token: inputField.accessToken,
                            token_type: inputField.token_type,
                            expires_at: inputField.expires_at,
                            expires_in: inputField.expires_in,
                            first_issued_at: inputField.first_issued_at,
                            tokenId: inputField.tokenId,
                            login_hint: inputField.login_hint,
                            scope: inputField.scope,
                            familyName: inputField.familyName,
                            givenName: inputField.givenName,
                            imageUrl: inputField.imageUrl,
                            name: inputField.imageUrl
                        }

                        gmailModel.updateOne({ _id: record._id }, { $set: payload }).then(
                            gmailData => {
                                next();
                                // record.access_token = inputField.accessToken;
                                // record.token_type = inputField.token_type;
                                // record.expires_at = inputField.expires_at;
                                // record.expires_in = inputField.expires_in;
                                // record.first_issued_at = inputField.first_issued_at;
                                // record.tokenId = inputField.tokenId;
                                // record.login_hint = inputField.login_hint;
                                // record.scope = inputField.scope;
                                // record.familyName = inputField.familyName;
                                // record.givenName = inputField.givenName;
                                // record.imageUrl = inputField.imageUrl;
                                // record.name = inputField.imageUrl;
                                // var obj = {
                                //     Status: 200,
                                //     message: "Account login sucessfully",
                                //     Data: record
                                // }

                                // res.json(obj)

                            },
                            err => {
                                var obj = {
                                    Status: 400,
                                    message: err.message
                                }
                                res.json(obj)
                            }
                        )

                    }
                    else {
                        gmailModel.create(inputField).then(
                            createData => {
                                next();
                                // var obj = {
                                //     Status: 200,
                                //     message: "Account created sucessfully",
                                //     Data: createData
                                // }
                                // res.json(obj)
                            },
                            err => {
                                var obj = {
                                    Status: 400,
                                    message: err.message
                                }
                                res.json(obj)
                            }
                        )
                    }
                },
                err => {
                    var obj = {
                        Status: 400,
                        message: err.message
                    }
                    res.json(obj)
                }
            )
        }

    }
    catch (err) {
        var obj = {
            Status: 400,
            message: err.message
        }
        res.json(obj)
    }
}

user.login = (req, res, next) => {
    try {
        setTimeout(function () {
        usermaster.aggregate([

            {
                "$lookup": {
                    "from": "gmailmasters",
                    "localField": "Gmail_id",
                    "foreignField": "_id",
                    "as": "Gmail"
                }
            },
            {
                "$lookup": {
                    "from": "facebookmasters",
                    "localField": "fb_id",
                    "foreignField": "_id",
                    "as": "Fb"
                }
            },

            { $match: { "email": req.body.email } }
        ]).then(
            doc => {
                var message = "";

                if(doc[0].FirstTimeLogin)
                {
                 message = "Account created sucessfully";
                }
                else{
                    message ="Account login sucessfully";
                }

                var obj = {
                    LoginType:req.body.type,
                    Status: 200,
                    message: message,
                    Data: doc[0]
                }
                res.json(obj)

            },
            err => {
                var obj = {
                    Status: 400,
                    message: err.message
                }
                res.json(obj)
            }
        )

    }, 4000); 
    }
    catch (err) {
        var obj = {
            Status: 400,
            message: err.message
        }
        res.json(obj)
    }

}

module.exports = user;