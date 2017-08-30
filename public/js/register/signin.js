window.onload = function() {
    initComponent();
    initEventHandler();
}

function initComponent() {
    initValidation();
    
}

function initEventHandler() {
  $("#btn_signin").click(function(){
    $("#loadingModal").toggle("modal");
    var param = {
      email: $("#inputEmail").val(),
      password:$("#inputPassword").val()
    };

    $.ajax({
      url: "/signin",
      method: "POST",
      data: param,
      success: function(res){
        $("#loadingModal").toggle("modal");
        if (res.success) {
          location.href = "/dashboard";
        } else {
          alert(res.error);
        }
      }
    });
  });
}

function initValidation() {
    $("#frm_signin").formValidation({
        framework: "bootstrap",
      button: {
        selector: '#btn_signin',
        disabled: 'disabled'
      },
      icon: null,
      fields: {
        password: {
          validators: {
            notEmpty: {
              message: 'Password is required and cannot be empty.'
            }
          },
          stringLength: {
            min: 6
          }
        },
        email: {
          validators: {
            notEmpty: {
              message: 'The email address is required and cannot be empty.'
            },
            emailAddress: {
              message: 'The email address is not valid'
            }
          }
        }
        
      }
    });
}