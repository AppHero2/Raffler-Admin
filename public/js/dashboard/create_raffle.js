$(document).ready(function(){
    Site.run();

    $('#datetimepicker').datetimepicker();
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

    $("#frm_create_raffle").submit(function(e){
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

      console.log(param);

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

      return true;
    });
    
    GetData(function(raffles){
        renderData(raffles);
    });
});

function renderData(raffles) {
    for (var i=0; i<raffles.length; i++) {
        var html = "";
        html += "<tr id=" + raffles[i].key + ">";
        html += "<td>" + raffles[i].description + "</td>";
        html += "<td>" + raffles[i].isClosed + "</td>";
        html += "<td>" + raffles[i].ending_date + "</td>";
        html += "<td>";
        html +=     "<button type='button' class='btn btn-sm btn-icon btn-pure btn-default' data-toggle='tooltip' data-original-title='Edit'>";
        html +=         "<i class='icon md-wrench' aria-hidden='true'></i>";
        html +=     "</button>";
        html +=     "<button type='button' class='btn btn-sm btn-icon btn-pure btn-default' data-toggle='tooltip' data-original-title='Delete'>";
        html +=         "<i class='icon md-close' aria-hidden='true'></i>";
        html +=     "</button>";
        html += "</td>";
        html += "</tr>";
        $("#tbl-raffles").append(html);
    }
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