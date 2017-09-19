var firebase = require("firebase");

Raffle = () => {

}

/**
 * @param: id
 * @description: If id is null, return all data
 */
Raffle.getData = (id, callback) => {
    GetAllData((err, raffles) => {
        if (id) {

        } else {
            callback(err, raffles);
        }
    });
    
}

Raffle.saveData = (data, callback) => {
    var rafflesRef = firebase.database().ref().child('Raffles').push();
    var key = rafflesRef.key;
    data.idx = key;
    rafflesRef.set(data, function(error){
        if (error) {
            callback({
                success: false,
                error : error
            });
        } else {
            callback({
                success: true
            });
        }
    });
}

GetAllData = (callback) => {
    firebase.database().ref().child('Raffles').once('value', function(snapshot){
        if (snapshot.val() != null){
            var raffles = [];
            snapshot.forEach(function(obj){
                var key = obj.key;
                var title = obj.val().title;
                var description = obj.val().description;
                var ending_date = obj.val().ending_date;
                var raffles_num = obj.val().raffles_num;
                var winners_num = obj.val().winners_num;
                var imageLink = obj.val().imageLink;
                var isClosed = obj.val().isClosed;
                var isPublished = obj.val().isPublished;
                var winners = obj.val().winners;
                
                raffles.push({
                    'key'         : key,
                    'title'       : title,
                    'description' : description,
                    'ending_date' : ending_date,
                    'raffles_num' : raffles_num,
                    'winners_num' : winners_num,
                    'imageLink'   : imageLink,
                    'isClosed'    : isClosed,
                    'isPublished' : isPublished,
                    'winners'     : winners
                });
            });
            callback(null, raffles);
        } else {
            callback("error");
        }
        
    });
}

module.exports = Raffle;