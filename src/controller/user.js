var jwt = require('jsonwebtoken');
var squel = require('squel');
var db = require('../core/db');
var httpMsg = require('../core/httpMsg');
var settings = require('../settings');

exports.authenticate = function(req, resp) {
    try{
        if (!req.body) throw new Error("Input not valid");
        var data = req.body;

        if(data){

            var sql = squel.select()
                    .from("API_Users")
                    .field("Username")
                    .where("Username = ?", data.Username)
                    .where("UPassword = ?", data.Password)
                    .where("ProjectName = ?", data.ProjectName)
                    .where("ApiStatus = ?", "A")
                    .toString();

            db.executeSqlWithConnection(settings.dbConfig, sql, function(callback, err) {
                if (err){
                    console.log(err);
                    httpMsg.show500(req, resp, err);
                }else {
                    if (data && callback.length > 0){
                        var user = callback[0];
                        if (user.Username === req.body.Username)
                        {
                            var token = jwt.sign({
                                Username: user.Username
                                }, settings.secert, {
                                expiresIn: 3600 // expires in 24 hours
                            });

                            resp.writeHead(200, {"Content-Type":"application/json"});
                            resp.write(JSON.stringify({
                              auth:{
                                authenticated:true,
                                status: 'success',
                                message:'',
                                token: token
                              },
                              user:{
                                Username: user.Username
                                }
                              }));
                            resp.end();

                        }else{
                            httpMsg.sendAuthFail(req, resp, "Username not match.");
                        }
                    }
                    else {
                        httpMsg.sendAuthFail(req, resp, "Find not found Username: " + data.Username + " or Password incorrect.");
                    }
                }
            });
        }
        else {
            throw new Error("Input not valid");
        }

    }catch (ex) {
        httpMsg.show500(req, resp, ex);
    }
};
