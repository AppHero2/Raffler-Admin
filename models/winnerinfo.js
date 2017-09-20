var firebase = require("firebase");

WinnerInfo = () => {

}

WinnerInfo.getData = (idx, callback) => {
    LoadWinners(idx, (err, prizes) => {
        callback(err, prizes);  
    });
}

LoadWinners = (idx, callback) => {
    if (idx) {
        var query = firebase.database().ref().child('WinnerInfo').child(idx);
        query.once('value', function(snapshot) {
            var prizes = [];
            if (snapshot.val() != null) { 
                for(var index in snapshot.val()){
                    prizes.push(snapshot.val()[index]);
                }
            }
            callback(null, prizes);
        });
    } else {
        var query = firebase.database().ref().child('WinnerInfo');
        query.once('value', function(snapshot) {
            var prizes = [];
            if (snapshot.val() != null) {
                snapshot.forEach(function(obj){
                    for(var index in obj.val()){
                        prizes.push(obj.val()[index]);
                    }
                });
            }
            callback(null, prizes);
        });
    }
    
}

module.exports = WinnerInfo;