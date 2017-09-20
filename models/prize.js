var firebase = require("firebase");

Prize = () => {

}


/**
 * @param: idx : raffle id
 * @description: get prizes from idx on firebase
 */
Prize.getData = (idx, callback) => {
    LoadWinners(idx, (err, prizes) => {
        callback(err, prizes);  
    });
}

LoadWinners = (idx, callback) => {
    console.log(idx);
    var queryPrizes;
    if (idx) {
        queryPrizes = firebase.database().ref().child('Prizes').orderByChild('idx').equalTo(idx);
        queryPrizes.once('value', function(snapshot) {
            console.log(snapshot, snapshot.val());
            if (snapshot.val() != null) {
                var prizes = [];
                console.log(snapshot.val());
                snapshot.forEach(function(obj){
                    
                });
                callback(null, prizes);
            } else {
                callback("error");
            }
        });
    } else {
        queryPrizes = firebase.database().ref().child('Prizes');
        queryPrizes.once('value', function(snapshot) {
            if (snapshot.val() != null) {
                var prizes = [];
                console.log(snapshot.val());
                snapshot.forEach(function(obj){
                    var key = obj.key;
                    for(var index in obj.val()){
                        prizes.push(obj.val()[index]);
                    }
                });
                callback(null, prizes);
            } else {
                callback("error");
            }
        });
    }
    
}

module.exports = Prize;