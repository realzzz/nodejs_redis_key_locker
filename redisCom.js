// TODO TODO TODO - please replace your redis client here getAsync + setAsync
redisClient = require('./redisClient').redisClient;
// TODO TODO TODO  this only have isEmptyStr function to judge if a string is empty
util = require('../../util');

var lockKey = exports.lockKey = function(tkey, tvalue, timeout, cb){
    debug('lock key ' + tkey + tvalue + timeout);
    var checkInterval = 100;
    var verifyInterval = 20;
    redisClient.getAsync(tkey).then(function(curValue){
        if (curValue == tvalue) {
            var err = new Error('already locked by yourself');
            cb(err);
        }
        else{
            var rekick = function(){
                var nextTO = timeout - checkInterval;
                if (nextTO > 0) {
                    setTimeout(function(){
                        lockKey(tkey, tvalue, nextTO, cb);
                    }, checkInterval)
                }
                else{
                    var err = new Error('lock time out ');
                    cb(err);
                }
            }
            if (util.isEmptyStr(curValue)) {
                redisClient.setAsync(tkey, tvalue);
                setTimeout(function(){
                    redisClient.getAsync(tkey).then(function(ncurValue){
                        if (ncurValue === tvalue)
                            cb();
                        else
                            rekick();
                    }).catch(function(err){
                        cb(err);
                    })
                }, verifyInterval);
            }
            else
                rekick();
        }
    }).catch(function(err){
        cb(err);
    });
}

var unlockKey = exports.unlockKey = function(tkey, tvalue, cb){
    debug('unlock key ' + tkey + tvalue );
    redisClient.getAsync(tkey).then(function(curValue){
        if (curValue == tvalue) {
            redisClient.setAsync(tkey, "").then(function(){
                cb();
            }).catch(function(err){
                cb(err);
            });
        }
        else{
            var err = new Error('not locked by you');
            cb(err);
        }
    });
}
