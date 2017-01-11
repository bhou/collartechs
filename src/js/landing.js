(function($) {
  // jQuery to collapse the navbar on scroll
  function collapseNavbar() {
    if ($(".navbar").offset().top > 50) {
      $(".navbar-fixed-top").addClass("top-nav-collapse");
    } else {
      $(".navbar-fixed-top").removeClass("top-nav-collapse");
    }
  }

  $(window).scroll(collapseNavbar);
  $(document).ready(collapseNavbar);

  // jQuery for page scrolling feature - requires jQuery Easing plugin
  $(function() {
    $('a.page-scroll').bind('click', function(event) {
      var $anchor = $(this);
      $('html, body').stop().animate({
        scrollTop: $($anchor.attr('href')).offset().top
      }, 1500, 'easeInOutExpo');
      event.preventDefault();
    });
  });

  // Closes the Responsive Menu on Menu Item Click
  $('.navbar-collapse ul li a').click(function() {
    $(this).closest('.collapse').collapse('toggle');
  });

  $(function(){
      $('#goal-text').typed({
        strings: ['understand', 'develop', 'test', 'debug'],
        typeSpeed: 100,
        loop: true
      });
  });

  /* library tabs */
  var tabs = ['#tab-lib-js', '#tab-lib-java'];
  $('#libraries-tabs > a').click(function(e) {
    e.preventDefault();
    
    $('#libraries-tabs > a').removeClass('active-tab');
    $(e.target).addClass('active-tab');

    $('.tab-content').hide();
    $($(e.target).attr('href')).show();
  });
}(jQuery));
