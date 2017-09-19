
(function(document, window, $) {
    'use strict';
  
    var Site = window.Site;
    var list_raffle;
  
    $(document).ready(function($) {
        Site.run();

        list_raffle = document.getElementById('list_raffles');

        var param = {'idx':""};
        loadPrizes(param, function(winners){
            renderPrizes(winners);
        });

        loadRaffles(function(raffles){
            renderRaffles(raffles);
        });

    });

    function renderPrizes(winners) {
        for (var i=0; i<winners.length; i++) {
            var title = winners[i].title;
            console.log('title', title);
        }
    }

    function renderRaffles(raffles) {
        
        for (var i=0; i<raffles.length; i++) {
            var title = raffles[i].title;
            var description = raffles[i].description;
            var isClosed = raffles[i].isClosed;
            var raffles_num = raffles[i].raffles_num;
            var winners = raffles[i].winners;
        
            var winners_number = winners!=null?winners.length:0;
            
            list_raffle.innerHTML += "<div class='list-group-item'><div class='list-content'><span class='item-right'>" +
            +winners_number+"</span><span class='list-text'>" + title + "</span></div></div>"; 
        }
    }

    function loadPrizes(param, callback) {
        $.ajax({
            url: "/winners/getPrizes",
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
      var filtering = $('#exampleFootableFiltering');
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
  