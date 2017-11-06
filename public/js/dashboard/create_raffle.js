var tbl_raffles;

$(document).ready(function(){
  Site.run();

  tbl_raffles = $('#tbl_raffles').DataTable();

  $('#datetimepicker').datetimepicker({
      inline: false,
      sideBySide: false
  });

  var datetimepicker = $("#datetimepicker").data("DateTimePicker");      
  $("#datetimepicker").on("dp.change", function (e) {
        $('#frm_create_raffle').formValidation('revalidateField', 'ending_date');
  });
  // Used events
  var drEvent = $('#input-file-now').dropify();

  drEvent.on('dropify.beforeClear', function(event, element){
      return confirm("Do you really want to delete \"" + element.file.name + "\" ?");
  });

  drEvent.on('dropify.afterClear', function(event, element){
      console.log('File deleted');
  });

  drEvent.on('dropify.errors', function(event, element){
      console.log('Has Errors');
  });

  $("#frm_create_raffle").unbind("submit").bind("submit", function(e){
    e.preventDefault();

    var title = $("#title").val();
    if (title.length < 0) {
      alert("You should input description.");
      return false;
    }

    var des = $("#description").val();
    console.log(des);
    if (des.length < 10){
      alert("You should input description.");
      return false;
    }

    if (datetimepicker.date() == null){
      alert("You should select date");
      return false;
    }

    var milisecondsSince1970 = datetimepicker.date().unix();

    var imgBase64 = "";
    if ($("#input-file-now").parent().hasClass("has-preview")) {
        var parent = $("#input-file-now").parent();
        var preview = parent.find(".dropify-render")[0];
        var img = preview.firstChild;
        imgBase64 = $(img).attr("src");
    } else {
      alert("You should select cover image.");
      return false;
    }

    var param = {
      title: $("#title").val(),
      description: $("#description").val(),
      ending_date: milisecondsSince1970,
      raffles_num: $("#raffles_num").val(),
      winners_num: $("#winners_num").val(),
      base64Image: imgBase64
    };

    var loadingSpinner = Ladda.create(this);
    loadingSpinner.start();

    $.ajax({
      url: "/create_raffle",
      method: "POST",
      data: param,
      success: function(res){
        
        loadingSpinner.stop();

        if (res.success) {
          location.href = "/dashboard/create_raffle";
        } else {
          alert(res.error);
        }
      }
    });

    return false;

  });
  
  GetData(function(raffles){
      renderData(raffles);
  });
});

function renderData(raffles) {
  for (var i=0; i<raffles.length; i++) {
      var title = raffles[i].title;
      var description = raffles[i].description;
      var isClosed = raffles[i].isClosed;
      var ending_date = timeFormater(raffles[i].ending_date);
      var raffles_num = raffles[i].raffles_num;
      tbl_raffles.row.add([title, description, isClosed, ending_date, raffles_num]).draw(false);
  }
}

function timeFormater(UNIX_timestamp){
  var dateTimeString = moment(UNIX_timestamp).format("MM/DD/YYYY HH:mm");
  return dateTimeString;
}

function timeConverter(UNIX_timestamp){
  var a = new Date(UNIX_timestamp);
  var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var year = a.getFullYear();
  var month = months[a.getMonth()];
  var date = a.getDate();
  var hour = a.getHours();
  var min = a.getMinutes();
  var sec = a.getSeconds();
  var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min;// + ':' + sec ;
  return time;
}

function GetData(callback) {
  $.ajax({
      url: "/create_raffle/getData",
      method: "POST",
      success: function(res) {
          if (res.success) {
              callback(res.data);
          } else {
              callback([]);
          }
      }
  });
}

(function(){
    $('#frm_create_raffle').formValidation({
      framework: "bootstrap",
      button: {
        selector: '#btn_submit',
        disabled: 'disabled'
      },
      icon: null,
      fields: {
        title: {
          validators: {
            notEmpty: {
              message: 'Title is required'
            },
            stringLength: {
              min: 6,
              max: 42
            },
            // regexp: {
            //   regexp: /^[a-zA-Z0-9]+$/
            // }
          }
        },
        description:{
          validators: {
            notEmpty: {
              message: 'Description is required'
            },
            stringLength: {
              min: 10,
              max: 5000
            }
          }
        },
        ending_date: {
          validators: {
            notEmpty: {
              message: 'Ending Date is required'
            },
            date: {
              format: 'MM/DD/YYYY hh:mm am'
            }
          }
        },
        raffles_num: {
          validators: {
            notEmpty: {
              message: 'This field is required'
            },
            integer: {
              message: 'The value is not an number'
            }
          }
        },
        winners_num: {
          validators: {
            notEmpty: {
              message: 'This field is required'
            },
            integer: {
              message: 'The value is not an number'
            }
          }
        }
      }
    });
})(document, window, jQuery);