var user = require("./user/user.ctrl");
module.exports = function (app) {

  app.post('/api/registerandlogin',user.register,user.login)


}


