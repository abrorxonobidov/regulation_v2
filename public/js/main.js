function popupWindow(url, title, w, h) {
    if (url.length === 0) {
        url = document.location.href;
    }
    let left = (screen.width / 2) - (w / 2);
    let top = (screen.height / 2) - (h / 2);
    return window.open(url, title, 'toolbar=yes, location=no, directories=no, status=no, menubar=no, scrollbars=yes, resizable=no, copyhistory=no, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left);
}

$(document).ready(function () {

    $('a[href^="#"]').on("click", function (event) {
        event.preventDefault();
    });
    $('#refresh-captcha').on('click', function(e){
        e.preventDefault();
        $('#my-captcha-image').yiiCaptcha('refresh');
    });

    $('.head_menu .dropdown').hover(function () {
        $(this).addClass('open');
    }, function () {
        $(this).removeClass('open');
    });


    /** Menu */
    $('#dismiss, .overlay').on('click', function () {
        $('#sidebar').removeClass('active');
        $('.overlay').fadeOut();
    });

    $('#sidebarCollapse').on('click', function () {
        $('#sidebar').addClass('active');
        $('.overlay').fadeIn();
        $('.collapse.in').toggleClass('in');
        $('a[aria-expanded=true]').attr('aria-expanded', 'false');
    });
    $('.btn_close').click(function (e) {
        e.preventDefault();
        let obj = $('#collapseList');
        $(obj).animate({
            height: ($(obj).hasClass('active')) ? 242 : document.getElementById("collapseList").scrollHeight
        }, 100);

        $(obj).toggleClass('active');
        $(this).toggleClass('open');
    });
    /** END Menu */

    $('body').append('<div class="scrollUp"></div>');
    $(window).scroll(function () {
        if ($(this).scrollTop() > 300) {
            $('.scrollUp').fadeIn();
        } else {
            $('.scrollUp').fadeOut();
        }
    });
    $('.scrollUp').click(function(){
        $("html, body").animate({
            scrollTop: 0
        }, 600);
        return false;
    });





});