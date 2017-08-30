$(document).ready(function(){
    Site.run();

    // Used events
    var drEvent = $('#input-file-now').dropify();

    drEvent.on('dropify.beforeClear', function(event, element){
        return confirm("Do you really want to delete \"" + element.file.name + "\" ?");
    });

    drEvent.on('dropify.afterClear', function(event, element){
        alert('File deleted');
    });

    drEvent.on('dropify.errors', function(event, element){
        console.log('Has Errors');
    });

    $("#validateButton3").click(function(){
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
        selector: '#validateButton1',
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
        birthday: {
          validators: {
            notEmpty: {
              message: 'Endind Date is required'
            },
            date: {
              format: 'YYYY/MM/DD'
            }
          }
        }
      }
    });
})(document, window, jQuery);