$(document).ready(function () {

    $('#fadeandscale').popup({
        pagecontainer: '.container',
        transition: 'all 0.3s'
    });

});

$(function() {
  $(".btn").click(function() {
    $(".form-signin").toggleClass("form-signin-left");
    $(".form-signup").toggleClass("form-signup-left");
    $(".frame").toggleClass("frame-long");
    $(".signup-inactive").toggleClass("signup-active");
    $(".signin-active").toggleClass("signin-inactive");
    $(".forgot").toggleClass("forgot-left");
    $(this)
      .removeClass("idle")
      .addClass("active");
  });
});

$(function() {
  $(".btn-signup").click(function() {
    $(".nav").toggleClass("nav-up");
    $(".form-signup-left").toggleClass("form-signup-down");
    $(".success").toggleClass("success-left");
    $(".frame").toggleClass("frame-short");
  });
});

$(document).ready(function(){
    $(".menu_bar_btn").click(function(){
        $(".fix_menu").slideToggle("slow");
    });
});


