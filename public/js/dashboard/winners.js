
(function(document, window, $) {
    'use strict';
  
    var Site = window.Site;
  
    $(document).ready(function($) {
        Site.run();

        var param = {'idx':""};
        loadWinners(param, function(winners){
            renderWinners(winners);
            $("#total_count").text(winners.length);
        });

        loadRaffles(function(raffles){
            renderRaffles(raffles);
        });

    });

    function renderWinners(winners) {
        $('#tbl_winners tbody tr').remove();
        for (var i=0; i<winners.length; i++) {
            var phone = winners[i].phone;
            var title = winners[i].raffle_title;
            var updatedAt = winners[i].updatedAt;
            var status = winners[i].status;
            var updatedAt = timeFormater(winners[i].updatedAt);
            var lbl_span = "";
            if (status == 0) {
                lbl_span = "<span class='label label-table label-dark'>Pending</span>";
            } else if (status == 1) {
                lbl_span = "<span class='label label-table label-success'>Awarded</span>";
            } else if (status == 2) {
                lbl_span = "<span class='label label-table label-danger'>Aborted</span>";
            }

            $('#tbl_winners_body').append(
                "<tr>" +
                    "<td>" + phone + "</td>" +
                    "<td>" + title + "</td>" +
                    "<td>" + updatedAt + "</td>" +
                    "<td>" + lbl_span + "</td>" +
                "</tr>"
            )
        }
    }

    function renderRaffles(raffles) {
        
        for (var i=0; i<raffles.length; i++) {
            var idx = raffles[i].idx;
            var title = raffles[i].title;
            var description = raffles[i].description;
            var isClosed = raffles[i].isClosed;
            var raffles_num = raffles[i].raffles_num;
            var winners = raffles[i].winners;
    
            var winners_number = winners!=null?winners.length:0;
            
            $("#list_raffles").append(
                "<div class='list-group-item' id=" + idx + ">" + 
                    "<div class='list-content'>" +
                        "<span class='item-right'>" +
                            winners_number + 
                        "</span>" +
                        "<span class='list-text'>" + 
                            title + 
                        "</span>" + 
                    "</div>" + 
                "</div>"
            );
        }
        $(".list-group-item").click(function(elem){
            var idx = $(elem.currentTarget).attr("id");
            var param = {'idx': idx};
            loadWinners(param, function(winners){
                renderWinners(winners);
            });
        });
    }

    function timeFormater(UNIX_timestamp){
        var dateTimeString = moment(UNIX_timestamp).format("MM/DD/YYYY HH:mm");
        return dateTimeString;
    }

    function loadWinners(param, callback) {
        $.ajax({
            url: "/winners/getWinnerInfo",
            method: "POST",
            data: param,
            success: function(res) {
                if (res.success) {
                    callback(res.data);
                } else {
                    callback([]);
                }
            }
        });
    }

    function loadRaffles(callback) {
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
  
    // Filtering
    // ---------
    (function() {
      var filtering = $('#tbl_winners');
      filtering.footable().on('footable_filtering', function(e) {
        var selected = $('#filteringStatus').find(':selected').val();
        e.filter += (e.filter && e.filter.length > 0) ? ' ' + selected : selected;
        e.clear = !e.filter;
      });
  
      // Filter status
      $('#filteringStatus').change(function(e) {
        e.preventDefault();
        filtering.trigger('footable_filter', {
          filter: $(this).val()
        });
      });
  
      // Search input
      $('#filteringSearch').on('input', function(e) {
        e.preventDefault();
        filtering.trigger('footable_filter', {
          filter: $(this).val()
        });
      });
      
    })();
  
  })(document, window, jQuery);
  