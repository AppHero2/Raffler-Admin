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
    $("#frm_signup").formValidation({
        framework: "bootstrap",
      button: {
        selector: '#btn_signup',
        disabled: 'disabled'
      },
      icon: null,
      fields: {
        name: {
          validators: {
            notEmpty: {
              message: 'The full name is required and cannot be empty'
            }
          }
        },
        email: {
          validators: {
            notEmpty: {
              message: 'The email address is required and cannot be empty'
            },
            emailAddress: {
              message: 'The email address is not valid'
            }
          }
        }
      }
    });
}