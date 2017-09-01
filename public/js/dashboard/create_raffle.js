var tbl_raffles;

$(document).ready(function(){
    Site.run();

    tbl_raffles = $('#tbl_raffles').DataTable();

    $('#datetimepicker').datetimepicker({
        inline: false,
        sideBySide: false
    });

    var $dp = $("#datetimepicker").data("DateTimePicker");      
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

      var des = $("#description").val();
      console.log(des);
      if (des.length < 10){
        alert("You should input description.");
        return false;
      }

      if ($dp.date() == null){
        alert("You should select date");
        return false;
      }

      var milisecondsSince1970 = $dp.date().unix();

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
        /*var html = "";
        html += "<tr id=" + raffles[i].key + ">";
        html += "<td>" + i + "</td>";
        html += "<td>" + raffles[i].description + "</td>";
        html += "<td>" + raffles[i].isClosed + "</td>";
        html += "<td>" + timeFormater(moment.unix(raffles[i].ending_date)) + "</td>";
        html += "<td>";
        html +=     "<button type='button' class='btn btn-sm btn-icon btn-pure btn-default' data-toggle='tooltip' data-original-title='Edit'>";
        html +=         "<i class='icon md-wrench' aria-hidden='true'></i>";
        html +=     "</button>";
        html +=     "<button type='button' class='btn btn-sm btn-icon btn-pure btn-default' data-toggle='tooltip' data-original-title='Delete'>";
        html +=         "<i class='icon md-close' aria-hidden='true'></i>";
        html +=     "</button>";
        html += "</td>";
        html += "</tr>";
        $("#tbl_raffles").append(html);*/

        var index = i;
        var description = raffles[i].description;
        var isClosed = raffles[i].isClosed;
        var ending_date = timeFormater(moment.unix(raffles[i].ending_date));
        var raffles_num = raffles[i].raffles_num;
        tbl_raffles.row.add([i, description, isClosed, ending_date, raffles_num]).draw(false);
    }
}

function timeFormater(UNIX_timestamp){
  var dateTimeString = moment(UNIX_timestamp).format("MM/DD/YYYY HH:mm");
  return dateTimeString;
}

function timeConverter(UNIX_timestamp){
  var a = new Date(UNIX_timestamp * 1000);
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
              max: 30
            },
            regexp: {
              regexp: /^[a-zA-Z0-9]+$/
            }
          }
        },
        description:{
          validators: {
            notEmpty: {
              message: 'Description is required'
            },
            stringLength: {
              min: 10,
              max: 500
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