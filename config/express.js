var express = require('express');
const  bodyParser = require('body-parser');
const jwt = require('express-jwt');
const jwtAuthz = require('express-jwt-authz');
const jwksRsa = require('jwks-rsa');
const cors = require('cors');
require('dotenv').config();

const config = require('./config');

module.exports = function () {
    var app = express();
    app.use(cors());
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(bodyParser.json());

    console.log("AUDI:",process.env.AUTH0_AUDIENCE)


    const checkJwt = jwt({
        // Dynamically provide a signing key based on the kid in the header and the singing keys provided by the JWKS endpoint.
        secret: jwksRsa.expressJwtSecret({
          cache: true,
          rateLimit: true,
          jwksRequestsPerMinute: 5,
          jwksUri: `https://${config.AUTH0_DOMAIN}/.well-known/jwks.json`
        }),
        audience: process.env.AUTH0_AUDIENCE,
        // audience:`https://${config.AUTH0_DOMAIN}/api/v2/`,// process.env.AUTH0_AUDIENCE,
        issuer: `https://${config.AUTH0_DOMAIN}/`,
        algorithms: ['RS256']
      });


    //   const checkJwt = jwt({  // Dynamically provide a signing key based on the kid in the header and the singing keys provided by the JWKS endpoint.
    //     secret: jwksRsa.expressJwtSecret({
    //       cache: true,
    //       rateLimit: true,
    //       jwksRequestsPerMinute: 5,
    //       jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`
    //     }),
    //     audience: process.env.AUTH0_AUDIENCE,
    //     issuer: `https://${process.env.AUTH0_DOMAIN}/`,
    //     algorithms: ['RS256']
    //   });
      
      const checkScopes = jwtAuthz([ 'email' ]);
      const checkScopesAdmin = jwtAuthz([ 'write:messages' ]);

    app.all('/', function (req, res) {

        res.send("<p>Server is working</p>")

    })

    app.post('/api/check',checkJwt,function(req,res,next){

        console.log(req.headers)

        res.json({Status:200})



    })

    require('../app/routes')(app);

    return app;

}