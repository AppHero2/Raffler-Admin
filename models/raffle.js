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
    firebase.database().ref().child('Raffles').push(data);
}

GetAllData = (callback) => {
    firebase.database().ref().child('Raffles').once('value', function(snapshot){
        if (snapshot.val() != null){
            var raffles = [];
            snapshot.forEach(function(obj){
                var key = obj.key;
                var description = obj.val().description;
                var ending_date = obj.val().ending_date;
                var raffles_num = obj.val().raffles_num;
                var winners_num = obj.val().winners_num;
                var imageLink = obj.val().imageLink;
                var isClosed = obj.val().isClosed;
                
                raffles.push({
                    key         : key,
                    description : description,
                    ending_date : ending_date,
                    raffles_num : raffles_num,
                    winners_num : winners_num,
                    imageLink   : imageLink,
                    isClosed    : isClosed
                });
            });
            callback(null, raffles);
        } else {
            callback("error");
        }
        
    });
}

module.exports = Raffle;