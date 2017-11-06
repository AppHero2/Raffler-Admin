var tbl_news;

$(document).ready(function(){
    Site.run();

  tbl_news = $('#tbl_news').DataTable();

  $("#frm_send_news").unbind("submit").bind("submit", function(e){
      e.preventDefault();
  
      var title = $("#title").val();
      if (title.length < 0) {
        alert("You should input description.");
        return false;
      }
  
      var content = $("#content").val();
      console.log(content);
      if (content.length < 1){
        alert("You should input description.");
        return false;
      }
  
      var param = {
        'title': $("#title").val(),
        'content': $("#content").val()
      };

      var loadingSpinner = Ladda.create(this);
      loadingSpinner.start();
  
      $.ajax({
        url: "/send_news",
        method: "POST",
        data: param,
        success: function(res){
          
          loadingSpinner.stop();
  
          if (res.success) {
            location.href = "/send_news";
          } else {
            alert(res.error);
          }
        }
      });
  
      return false;
  
    });   

    GetData(function(newses){
      renderData(newses);
    });

});

function GetData(callback) {
  $.ajax({
      url: "/send_news/getData",
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

function renderData(newses) {
  for (var i=0; i<newses.length; i++) {
      var title = newses[i].title;
      var content = newses[i].content;
      var updatedAt = timeFormater(newses[i].updatedAt*1);
      tbl_news.row.add([title, content, updatedAt]).draw(false);
  }
}

function timeFormater(UNIX_timestamp){
  var dateTimeString = moment(UNIX_timestamp).format("MM/DD/YYYY HH:mm");
  return dateTimeString;
}

(function(){
    $('#frm_send_news').formValidation({
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
              min: 5,
              max: 42
            },
          }
        },
        content:{
          validators: {
            notEmpty: {
              message: 'Content is required'
            },
            stringLength: {
              min: 1,
              max: 500
            }
          }
        }
      }
    });
})(document, window, jQuery);