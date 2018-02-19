// 'use strict';
// $(".change-language li").click(function () {
//     var val=$(this).html();
//     $(".select-button ").html(val);
//
//
// });
// $(".change-month li").click(function () {
//     var val=$(this).html();
//     $(".select-month ").html(val);
//     $('#month-checked').click();
//
//
// });
// $(".change-year li").click(function () {
//     var val=$(this).html();
//     $(".select-year ").html(val);
//     $('#year-checked').click();
//
//
// });
// // $('.change-language').on('mouseleave',function () {
// //     $('#menu-open').click();
// //     $('#menu-open-footer').click();
// // });
// // $('form').on('mouseleave',function () {
// //     $('.close-form').click();
// // });
// $('form input').on('mouseover',function () {
//     $(this).css('border','none');
// });
//
// $('.header-form-top .callBack').on('click',function () {
//     var inputName=$('.header-form-top input[name="name"]').val();
//     var inputPhone=$('.header-form-top input[name="phone"]').val();
//     console.log(inputName);
//     if(inputName==""){
//         $('.head-name').css('border','1px solid red');
//     }
//     if(inputPhone==""){
//         $('.head-phone').css('border','1px solid red');
//     }
//     if(inputName && inputPhone){
//         event.preventDefault();
//         // var http = new XMLHttpRequest(), f = this;
//         // http.open("POST", "http://prototypes.agency/contacts.php", true);
//         // http.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
//         // http.send("name=" + f.name.value + "&phone=" + f.phone.value );
//         $('form .callBack').parent()[0].click();
//
//     }
//
// });
// $('#contacts-form').on('click',function (event) {
//
//     var inputName=$('.contacts-form input[name="name"]').val();
//     var inputPhone=$('.contacts-form input[name="phone"]').val();
//     if(inputName==""){
//         $('.contacts-form input[name="phone"]').css('border','1px solid red');
//     }
//     if(inputPhone==""){
//         $('.contacts-form input[name="name"]').css('border','1px solid red');
//     }
//     if(inputName && inputPhone){
//         event.preventDefault();
//      //    var http = new XMLHttpRequest(), f = this;
//      //    http.open("POST", "http://prototypes.agency/contacts.php", true);
//      //    http.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
//      //    http.send("name=" + f.name.value + "&phone=" + f.phone.value + "&email=" + f.email.value + "&area=" + f.area.value );
//      $('.popup-window').css('display','block')
//
//     }
//
// });
// $('.krest-block img').on('click',function () {
//     $('.popup-window').css('display','none')
// })
//
// $('.close-menu').on('click',function () {
//     $('#input-open-menu').click();
// });
// //////////////////////slider/////////////////////
// $('.service-slider').slick({
//     dots: true,
//     infinite: true,
//     speed: 300,
//     slidesToShow: 2,
//
//     responsive: [
//
//         {
//             breakpoint: 993,
//             settings: {
//                 slidesToShow: 1,
//
//             }
//         }
//
//     ]
// });
// $(' .service-slider1').slick({
//     dots: true,
//     infinite: true,
//     speed: 300,
//     slidesToShow: 3,
//
//     responsive: [
//
//         {
//             breakpoint: 993,
//             settings: {
//                 slidesToShow: 2,
//
//             }
//         },
//         {
//             breakpoint: 768,
//             settings: {
//                 slidesToShow: 1,
//
//             }
//         }
//
//     ]
// });
//
//
// ///////////////////////////////////paginations//////////////////////////
// window.onload = function(){
//     var paginationPage = parseInt($('.cdp').attr('actpage'), 10);
//     $('.cdp_i').on('click', function(){
//         var go = $(this).attr('href').replace('#!', '');
//         if (go === '+1') {
//             paginationPage++;
//         } else if (go === '-1') {
//             paginationPage--;
//         }else{
//             paginationPage = parseInt(go, 10);
//         }
//         $('.cdp').attr('actpage', paginationPage);
//     });
// };
$("html").niceScroll({
    cursorcolor:'#6bad02'
});
$(".list, .sc").on("click","a", function (event) {
    event.preventDefault();
    $('.list a').removeClass('activ-green');

    $('.main-block').css('display','block');
    $('.form-section').css('display','none');
    $('.video-box').css('display','none');

    var id  = $(this).attr('href'),
        top = $(id).offset().top;
    $('a[href= "'+id+'"]').addClass('activ-green');
    $('html').animate({scrollTop: top-40}, 500);
});
$(".video-box").click(function () {
    $('.main-block').css('display','block');
    $('.form-section').css('display','none');
    $('.video-box').css('display','none');
})
$('.navbar-brand').click(function () {
    location.reload();
})
$(".button-video").click(function () {
    $('.video-box').css('display','block');
})

$('.toForm').click(function (e) {
    e.preventDefault();
    $('.main-block').css('display','none');
    $('.form-section').css('display','block');
    $('body').addClass('formBody');
    $('.navbar-nav a').removeClass('activ-green');
    $('html, body').animate({scrollTop: 0},500);
});
$('.formBody .head-block .navbar-collapse .navbar-right li a').on('click', function () {
    console.log('xcvxcxcv');
    // $('.main-block').css('display','block');
    // $('.form-section').css('display','none');
    // $('body').removeClass('formBody');
    // return false;
    
});
$('.slider-first').slick({
    infinite: true,
    slidesToShow: 3,
    responsive: [
        {
            breakpoint: 1400,
            settings: {
                slidesToShow: 2
            }
        },
        {
            breakpoint: 993,
            settings: {
                slidesToShow: 1
            }
        }
    ]
});

$('.slider-second').slick({
    infinite: true,
    slidesToShow: 1

});

// poster frame click event
$(document).on('click','.js-videoPoster',function(ev) {
    ev.preventDefault();
    var $poster = $(this);
    var $wrapper = $poster.closest('.js-videoWrapper');
    videoPlay($wrapper);
});

// play the targeted video (and hide the poster frame)
function videoPlay($wrapper) {
    var $iframe = $wrapper.find('.js-videoIframe');
    var src = $iframe.data('src');
    $wrapper.addClass('videoWrapperActive');
    $iframe.attr('src',src);
}

function videoStop($wrapper) {
    if (!$wrapper) {
        var $wrapper = $('.js-videoWrapper');
        var $iframe = $('.js-videoIframe');
    } else {
        var $iframe = $wrapper.find('.js-videoIframe');
    }
    $wrapper.removeClass('videoWrapperActive');
    $iframe.attr('src','');
}

var patternEmail =/^[a-z0-9_-]+@[a-z0-9-]+\.[a-z]{2,6}$/i;
var patternPhone=/^(\s*)?(\+)?([- _():=+]?\d[- _():=+]?){10,15}(\s*)?$/;
$('.text-input input').on('focus',function () {
   $(this).parent().attr('class','text-input')

});

$('.text-input input[name="name"]').on('blur',function () {
    if($(this).val().length < 3){
        $(this).parent().addClass('text-input-bed');
        $('.falsee').css('display', 'block');
    }
    else {
        $(this).parent().addClass('text-input-good');
        $('.falsee').css('display', 'none');
    }

});
$('.text-input input[name="company"]').on('blur',function () {
    if($(this).val().length < 3){
        $(this).parent().addClass('text-input-bed');
        $('.falsee').css('display', 'block');

    }
    else {
        $(this).parent().addClass('text-input-good');
        $('.falsee').css('display', 'none');
    }

});
$('.text-input input[name="Email"]').on('blur',function () {
    if(!patternEmail.test($(this).val())){
        $(this).parent().addClass('text-input-bed');
        $('.falsee').css('display', 'block');
    }
    else {
        $(this).parent().addClass('text-input-good');
        $('.falsee').css('display', 'none');
    }

});
$('.text-input input[name="phone"]').on('blur',function () {
    if(!patternPhone.test($(this).val())){
        $(this).parent().addClass('text-input-bed');
        $('.falsee').css('display', 'block');

    }
    else {
        $(this).parent().addClass('text-input-good');
        $('.falsee').css('display', 'none');
    }

});

$('.form-group ').submit(function (event) {
    var inputName=$('.form-group input[name="name"]').val();
    var inputPhone=$('.form-group input[name="phone"]').val();
    var inputEmail=$('.form-group input[name="Email"]').val();
    var inputCompany=$('.form-group input[name="company"]').val();

    if(inputName ==""){
        $('.form-group input[name="name"]').parent().addClass('text-input-bed');
        $('.falsee').css('display', 'block');
    }
    if(inputEmail ==""){
        $('.form-group input[name="Email"]').parent().addClass('text-input-bed');
        $('.falsee').css('display', 'block');
    }
    if(inputCompany ==""){
        $('.form-group input[name="company"]').parent().addClass('text-input-bed');
        $('.falsee').css('display', 'block');
    }

    if(inputName && inputEmail && inputCompany  && patternEmail.test(inputEmail)){
        console.log('валид здесь');
        $('.succsess').css('display', 'block');
        $('.falsee').css('display', 'none');

        var http = new XMLHttpRequest(), f = this;
        var parameter = $(this).attr('data-parameter');
        var site='';
        if(f.site){
            site=f.site.value;
        }
        http.open("POST", "http://b2.zpz.dp.ua/contacts.php", true);
        http.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        http.send($( this ).serialize());

    }
    event.preventDefault();
});

