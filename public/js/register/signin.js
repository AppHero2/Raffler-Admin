window.onload = function() {
    initComponent();
    initEventHandler();
}

function initComponent() {
    initValidation();
}

function initEventHandler() {

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