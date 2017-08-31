$(document).ready(function(){
    Site.run();

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

    $("#btn_submit").click(function(){
        if ($("#input-file-now").parent().hasClass("has-preview")) {
            var parent = $("#input-file-now").parent();
            var preview = parent.find(".dropify-render")[0];
            var img = preview.firstChild;
            var imgBase64 = $(img).attr("src");
        }
    });
    
});

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
            }
          }
        },
        ending_time: {
          validators: {
            notEmpty: {
              message: 'Ending Time is required'
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