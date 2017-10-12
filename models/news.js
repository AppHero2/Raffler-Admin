var firebase = require("firebase");

News = () => {

}

/**
 * @param: id
 * @description: If id is null, return all data
 */
News.getData = (id, callback) => {
    GetAllData((err, newses) => {
        if (id) {

        } else {
            callback(err, newses);
        }
    });
    
}

News.saveData = (data, callback) => {
    var newsRef = firebase.database().ref().child('News').child('1-admin').push();
    var key = newsRef.key;
    data.idx = key;
    newsRef.set(data, function(error){
        if (error) {
            callback({
                success: false,
                error : error
            });
        } else {
            callback({
                success: true
            });

            News.sendToAll(data);
        }
    });
}

News.sendToAll = (data) => {
    var pushTokens = new Array();
    firebase.database().ref().child('PushTokens').once('value', function(snapshot){
        if (snapshot.val() != null){ 
            snapshot.forEach(function(obj){
                var userId = obj.key;
                var pushToken = obj.val();
                pushTokens.push(pushToken);
                var newsRef = firebase.database().ref('News').child(userId).push();
                var idx = newsRef.key;
                var news = {
                    'idx' : idx,
                    'title': data.title,
                    'content': data.content,
                    'isRead' : false,
                    'newsType' : 2,
                    'createdAt' : data.createdAt * 1,
                    'updatedAt' : data.updatedAt * 1
                };
                newsRef.set(news, function(error){
                    if (error) {
                        console.log('News', error);
                    }
                });
            });

            if (pushTokens.length > 0) {
                sendPushNotification(data.title, pushTokens);
            }
        }
    });
}

function sendPushNotification(message, pushTokens){
    global.push_client.createNotification({
        contents: {
            contents: message
        },
        specific: {
            include_player_ids: pushTokens
        },
        attachments: {
            data: {
                hello: message
            }
        }
    }).then(success => {
        console.log('sendPush', success);
    })
}

GetAllData = (callback) => {
    firebase.database().ref().child('News').child('1-admin').once('value', function(snapshot){
        if (snapshot.val() != null){
            var newses = [];
            snapshot.forEach(function(obj){
                var key = obj.key;
                var idx = obj.val().idx;
                var title = obj.val().title;
                var content = obj.val().content;
                var createdAt = obj.val().createdAt;
                var updatedAt = obj.val().updatedAt;
                newses.push({
                    'idx'         : idx,
                    'title'       : title,
                    'content'     : content,
                    'createdAt'   : createdAt,
                    'updatedAt'   : updatedAt
                });
            });
            callback(null, newses);
        } else {
            callback("error");
        }
    });
}

module.exports = News;