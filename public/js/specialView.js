var curUrl = window.location.href;
var arCurUrl = curUrl.split('/');
var noImageTitle = 'Без картинки';
var setImageTitle = 'С картинкой';
switch (arCurUrl[3]){
    case 'uz':
        noImageTitle = 'Расмсиз';
        setImageTitle = 'Расмли';
        break;
    case 'oz':
        noImageTitle = 'Rasmsiz';
        setImageTitle = 'Rasmli';
        break;
    case 'en':
        noImageTitle = 'Without a picture';
        setImageTitle = 'With a picture';
        break;
}

function makeSetImage() {
    $('html').removeClass( "noImage" );
    //$('.spcImage').removeClass( "spcSetImage" );
    $('.spcNoImage').removeClass( "spcSetImage" );
    $('.spcNoImage').attr('data-original-title', setImageTitle);
    $.removeCookie('specialViewImage', {path: '/'});
}

function makeNoImage() {
    $('html').stop().addClass( "noImage" );
    $('.spcNoImage').addClass( "spcSetImage" );
    $('.spcNoImage').attr('data-original-title', noImageTitle);
    $.cookie("specialViewImage", 'noImage', {path: '/'});
}

function offImages(){
    if ($.cookie("specialViewImage") == 'noImage'){
        makeSetImage();
    } else {
        makeNoImage();
    }
}


var min = 14,
    max = 30;

function setFontSize(size) {
    if (size < min) {
        size = min;
    }
    if (size > max) {
        size = max;
    }

    $('.title, .chart_box_title, .projects_title, .popular_projects').css({'font-size': parseInt(size) + 12 + 'px'});/*26*/
    $('.title_in').css({'font-size': parseInt(size) + 10 + 'px'});/*24*/
    $('.doc_lists li a, .com_lists li>span, .tab_content_in p').css({'font-size': parseInt(size) + 2 + 'px'});/*16*/
    $('.header_list li a.title_name, a.btn_close, .most_no_exemplary_list li, .tech_title, .mini_title').css({'font-size': parseInt(size) + 6 + 'px'});/*20*/
    $('.most_feature, .footer_menu .navbar-nav li a, .default_text, .tech_text, .start_list li span, .tab_content_in_text, .text_id, .projects_list li a').css({'font-size': parseInt(size) + 4 + 'px'});/*18*/
    $('').css({'font-size': parseInt(size) - 2 + 'px'});/*12*/
    $('').css({'font-size': parseInt(size) - 4 + 'px'});/*10*/
    $('').css({'font-size': parseInt(size) + 14 + 'px'});/*28*/
    $('').css({'font-size': parseInt(size) + 16 + 'px'});/*30*/

    $('.popular_projects_lists .grid-item a').css({'font-size': size + 'px'});/*14*/

}

function makeNormal(){
    $('html').removeClass('blackAndWhite blackAndWhiteInvert');
    $.removeCookie('specialView', {path: '/'});
}

function makeBlackAndWhite(){
    makeNormal();
    $('html').addClass('blackAndWhite');
    $.cookie("specialView", 'blackAndWhite', {path: '/'});
}

function makeBlackAndWhiteDark(){
    makeNormal();
    $('html').addClass('blackAndWhiteInvert');
    $.cookie("specialView", 'blackAndWhiteInvert', {path: '/'});
}

function saveFontSize(size){
    $.cookie("fontSize", size, {path: '/'});
}
function changeSliderText(sliderId, value){
    var position = Math.round(Math.abs((value - min) * (100 / (max - min))));
    $('#' + sliderId).prev('.sliderText').children('.range').text(position);
}

$(document).ready(function (){
    var appearance = $.cookie("specialView");
    switch (appearance) {
        case 'blackAndWhite':
            makeBlackAndWhite();
            break;
        case 'blackAndWhiteInvert':
            makeBlackAndWhiteDark();
            break;
    }

    $('.no-propagation').click(function (e) {
        e.stopPropagation();
    });

    $('.appearance .spcNormal').click(function () {
        makeNormal();
    });
    $('.appearance .spcWhiteAndBlack').click(function () {
        makeBlackAndWhite();

    });
    $('.appearance .spcDark').click(function () {
        makeBlackAndWhiteDark();
    });
    $('.appearance .spcNoImage').click(function () {
        offImages();
    });


    $('#fontSizer').slider({
        min: min,
        max: max,
        range: "min",
        slide: function (event, ui) {
            setFontSize(ui.value);
            changeSliderText('fontSizer', ui.value);
        },
        change: function (event, ui) {
            saveFontSize(ui.value);
        }
    });

    var fontSize = $.cookie("fontSize");
    if (typeof(fontSize) != 'undefined') {
        $("#fontSizer").slider('value', fontSize);
        setFontSize(fontSize);
        changeSliderText('fontSizer', fontSize);
    }

    /****************zoomSizer********************/
    $('#zoomSizer').slider({
        min: minzoom,
        max: maxzoom,
        range: "min",
        slide: function (event, ui) {
            setzoomSizer(ui.value);
            changeSliderTextZoom('zoomSizer', ui.value);
        },
        change: function (event, ui) {
            // savezoomSizer(ui.value);
        }
    });

    var zoomSizer = $.cookie("zoomSizer");
    if (typeof(zoomSizer) != 'undefined') {
        $("#zoomSizer").slider('value', zoomSizer);
        setzoomSizer(zoomSizer);
        changeSliderTextZoom('zoomSizer', zoomSizer);
    }

});

var minzoom = 0,
    maxzoom = 5; /** максимум 5 **/

function savezoomSizer(size) {
    $.session("zoomSizer", size, {path: '/'});
}

function changeSliderTextZoom(sliderId, value) {
    var position = Math.round(Math.abs(100 - (20 * (maxzoom - value))));
    $('#' + sliderId).prev('.sliderZoom').children('.range').text(position);
}
function setzoomSizer(size) {
    if (size < minzoom) {
        size = minzoom;
    }
    if (size > maxzoom) {
        size = maxzoom;
    }
    $('body').css({
        // 'zoom': '1.' + parseInt(size),
        // '-ms-zoom': '1.' + parseInt(size),
        // '-webkit-zoom': '1.' + parseInt(size),
        // '-moz-zoom': '1.' + parseInt(size),
        // '-o-zoom': '1.' + parseInt(size),
        '-webkit-transform': 'scale(1.'+parseInt(size)+')',
        '-moz-transform': 'scale(1.'+parseInt(size)+')',
        '-ms-transform': 'scale(1.'+parseInt(size)+')',
        'transform': 'scale(1.'+parseInt(size)+')',
        '-webkit-transform-origin': 'top center',
        '-moz-transform-origin': 'top center',
        '-ms-transform-origin': 'top center',
        'transform-origin': 'top center',
        // '-webkit-transform': 'scale(1.'+parseInt(size)+')',
        // 'transform': "scale(1."+parseInt(size)+")",
        // 'margin-top': ""+ (parseInt(size) + 20) +"%",
    });

}