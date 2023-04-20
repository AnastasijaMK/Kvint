$(document).ready(function(){

    // Корректировка отображения всплывающих окон в мобильных браузерах
    function calcVH() {
        let vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }
    calcVH();


    // Маски
    $("input[type='tel']").mask("+7 (999) 999 99 99");
    // Перенос курсора в начало поля
    $.fn.setCursorPosition = function (pos) {
        if ($(this).get(0).setSelectionRange) {
            $(this).get(0).setSelectionRange(pos, pos);
        } else if ($(this).get(0).createTextRange) {
            var range = $(this).get(0).createTextRange();
            range.collapse(true);
            range.moveEnd('character', pos);
            range.moveStart('character', pos);
            range.select();
        }
    };
    $('input[type="tel"]').click(function () {
        if ($(this).val() == "+7 (___) ___ __ __") {
            $(this).setCursorPosition(4);
        }
    });


    // Плавная прокрутка к якорю
    if ($(window).width() > 1199) {
        const smoothLinks = document.querySelectorAll('a[href^="#"]');
        for (let smoothLink of smoothLinks) {
            smoothLink.addEventListener('click', function (e) {
                e.preventDefault();
                const id = smoothLink.getAttribute('href');
                document.querySelector(id).scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            });
        };
    } else {
        $("body").on('click', '[href*="#"]', function(e){
            e.preventDefault();
            if($('.popup__menu').hasClass('active')) {
                $('body').css('position', '');
            }

            var idName = $(this).attr('href').replace('#','');
            var element = document.getElementById(idName);
            var headerOffset = 110;
            var elementPosition = element.getBoundingClientRect().top;
            var offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            if($('.popup__menu').hasClass('active')) {
                $('header').removeClass('menu-opened');
                $('.popup__menu').removeClass('active');
                window.scrollTo({
                    top: offsetPosition,
                    behavior: "auto"
                });
                $('html').css('scroll-behavior', '');
            } else {
                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    }


    // Слайдер новостей на первом экране
    $('section#intro .intro__news--list').slick({
        arrows: false,
        autoplay: true,
        speed: 300,
        autoplaySpeed: 8000,
        infinite: true,
        fade: true,
        responsive: [
            {
                breakpoint: 767,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    touchMove: true,
                    arrows: false,
                    autoplay: true,
                    speed: 300,
                    autoplaySpeed: 4000,
                    infinite: true,
                    variableWidth: true,
                    fade: false
                }
            }
        ]
    });


    // Слайдер новостей в разделе новостей на моб версии
    $('section#news .news__mobile').slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        touchMove: true,
        arrows: false,
        dots: true,
        swipeToSlide: true,
        variableWidth: true,
        fade: false,
        infinite: false
    });


    // Определяем количество экранов
    function countSections() {
        $('main section').each(function(){
            let sectionID = $(this).attr('id');
            $('.sections__nav ul').append('<li><a href="#' + sectionID + '"><span></span></a></li>');
        });
    }
    if($(window).width() > 1199) {
        countSections();
    }

    // Определяем текущий слайд
    findCurrentSlide();
    $('main').scroll(function(){
        findCurrentSlide();
    });
    function findCurrentSlide() {
        $('section').each(function(){
            let sectionTop = Math.round($(this).offset().top);
            if (sectionTop == 0) {
                let sectionID = $(this).attr('id');
                $('.sections__nav li a').each(function(){
                    if ($(this).attr('href').replace('#','') == sectionID) {
                        $('.sections__nav li a').removeClass('active');
                        $(this).addClass('active');
                    }
                });
                $('.wrapper').attr('data-section-active', sectionID);
            }
        });
    };

    // Подстановка фона для шапки при скролле
    function checkHeaderBg() {
        if ($(window).scrollTop() > 10) {
            $('header').addClass('scrolled');
        } else {
            $('header').removeClass('scrolled');
        }
    }
    if ($(window).width() < 1200) {
        checkHeaderBg();
    }
    $(window).scroll(function(){
        if ($(window).width() < 1200) {
            checkHeaderBg();
        }
    });


    // Корректировка отображения первого экрана на планшете и моб версии
    if ($(window).width() < 1200 && $(window).width() > 767 && $('.wrapper').hasClass('main-page')) {
        setTimeout(()=>{
            let introTextHeight = $('section#intro .intro__text').height();
            $('section#intro .container').css('padding-top', 'calc(100vh - ' + introTextHeight + 'px - 30px)');
        }, 200);
    }


    // Мобильное меню
    $('.header__burger').click(function(){
        calcVH();
        if ($('header').hasClass('menu-opened')) {
            $('header').removeClass('menu-opened');
            $('.popup__menu').removeClass('active');

            $('body').css('position', '');
            $(window).scrollTop($('body').attr('data-scroll'));
            $('html').css('scroll-behavior', '');
        } else {
            $('header').addClass('menu-opened');
            $('.popup__menu').addClass('active');

            $('body').attr('data-scroll', $(window).scrollTop());
            $('body').css('position', 'fixed');
            $('html').css('scroll-behavior', 'auto');
        }
    });


    // Оставить заявку
    $('.j-leave-request').click(function(e){
        e.preventDefault();
        if(!$(this).hasClass('sent')) {
            let buttonActive = true;
            let patternMail = /^([a-z0-9_-]+\.)?[a-z0-9_-]+@[a-z0-9-]+\.([a-z]{1,6}\.)?[a-z]{2,6}$/i;

            $(this).closest('form').find('.warning').removeClass('warning');

            $(this).closest('form').find('input:required').each(function(){
                if ($(this).val().trim() == "" || ($(this).attr('name') == 'EMAIL' && $(this).val().search(patternMail) !== 0)) {
                    $(this).closest('label').addClass('warning');
                    buttonActive = false;
                }
            });

            if (buttonActive) {
                $(this).removeClass('is-blicked');
                // Анимация фона кнопки
                var parentOffset = $(this).offset();
                if ($(this).is(e.target) || $(this).find(e.target).length > 0) {
                    var relX = e.pageX - parentOffset.left,
                        relY = e.pageY - parentOffset.top;
                } else {
                    var relX = 0,
                        relY = 0;
                }
                $(this).find('.button--bg').css({top:relY, left:relX})
                // Анимация текста кнопки
                $(this).find('span').not('.button--bg').css('opacity',0);
                setTimeout(()=>{
                    $(this).find('span').not('.button--bg').remove();
                    $(this).addClass('sent');
                    $(this).append('<span>Заявка отправлена</span>');
                    $(this).find('span').css('opacity',1);
                },300);
                $(this).closest('form').find('input').val('');

                if($(this).closest('.popup').length > 0) {
                    setTimeout(()=>{
                        popupClose();
                    }, 3000);
                }
            }
        }
    });


    // Снятие предупреждения о заполнении поля
    $('form input').on('click', function(){
        $(this).closest('label').removeClass('warning');
    });


    // Оставить заявку
    $('.j-leave-request-popup').click(function(){
        $('.wrapper--shadow').addClass('active');
        if ($(window).width() < 768) {
            $('body').css('position','fixed');
        }
        $('.popup[data-popup="presentation"]').addClass('active');
        if($('.wrapper').hasClass('main-page') && $(window).width() < 768) {
            $('.popup[data-popup="presentation"] .popup__title.xs').html('Оставить заявку на презентацию <span class="highlighted">оператора KVINT!</span>');
        } else {
            $('.popup[data-popup="presentation"] .popup__title.xs').html('Оставить заявку на <span class="highlighted">подключение голосового оператора</span>');
        }
    });


    // Закрыть всплывающие окна
    $('.popup__close, .wrapper--shadow').click(function(){
        popupClose();
    });

    // Закрыть всплывающие окна
    function popupClose() {
        $('.popup.active form label').removeClass('warning');
        $('.popup.active').removeClass('active');
        $('.wrapper--shadow').removeClass('active');
        if ($(window).width() < 768) {
            $('body').css('position','');
        }
    }

    // Оставить заявку
    $('button[type="submit"]').click(function(e){
        e.preventDefault();
        if(!$(this).hasClass('sent')) {
            let buttonActive = true;
            let patternMail = /^([a-z0-9_-]+\.)?[a-z0-9_-]+@[a-z0-9-]+\.([a-z]{1,6}\.)?[a-z]{2,6}$/i;

            $(this).closest('form').find('.warning').removeClass('warning');

            $(this).closest('form').find('input:required').each(function(){
                if ($(this).val().trim() == "" || ($(this).attr('name') == 'EMAIL' && $(this).val().search(patternMail) !== 0)) {
                    $(this).closest('label').addClass('warning');
                    buttonActive = false;
                }
            });

            if (buttonActive) {
                $(this).removeClass('is-blicked');
                // Анимация фона кнопки
                var parentOffset = $(this).offset();
                if ($(this).is(e.target) || $(this).find(e.target).length > 0) {
                    var relX = e.pageX - parentOffset.left,
                        relY = e.pageY - parentOffset.top;
                } else {
                    var relX = 0,
                        relY = 0;
                }
                $(this).find('.button--bg').css({top:relY, left:relX})
                // Анимация текста кнопки
                $(this).find('span').not('.button--bg').css('opacity',0);
                setTimeout(()=>{
                    $(this).find('span').not('.button--bg').remove();
                    $(this).addClass('sent');
                    $(this).append('<span>Заявка отправлена</span>');
                    $(this).find('span').css('opacity',1);
                },300);
                $(this).closest('form').find('input').val('');

                if($(this).closest('.popup').length > 0) {
                    setTimeout(()=>{
                        popupClose();
                    }, 3000);
                }
            }
        }
    });


    // Расчет размера фото на первом экране
    function calcImgSize() {
        if($(window).width() < 768) {
            var contentPart1 = +(($('main section:first-of-type').css('padding-top')).replace('px',''));
            var contentPart2 = $('main section:first-of-type .intro__text').outerHeight(true);
            var contentPart3 = +(($('main section:first-of-type .intro__picture').css('bottom')).replace('px',''));
            var imgHeight = contentPart1 + contentPart2 + contentPart3 + 10;
            if($('main').attr('data-main') == 'promotion') {
                imgHeight -= 25;
            }
            if($('main').attr('data-main') == 'call-center') {
                imgHeight += 20;
            }
            if($('main').attr('data-main') == 'ivr') {
                imgHeight += 10;
            }
            if($('main').attr('data-main') == 'grocery') {
                imgHeight -= 130;
            }
            $('main section:first-of-type .intro__picture').css('max-height', 'calc(100vh - ' + imgHeight + 'px)');
            $('main section:first-of-type .intro__picture picture').css('max-height', 'calc(100vh - ' + imgHeight + 'px)');
            $('main section:first-of-type .intro__picture img').css('max-height', 'calc(100vh - ' + imgHeight + 'px)');
        }
    }
    if(!$('.wrapper').hasClass('main-page')) {
        setTimeout(()=>{
            calcImgSize();
        }, 100);
    }
    $(window).resize(function(){
        if(!$('.wrapper').hasClass('main-page')) {
            calcImgSize();
        }
    });


    // Слайдеры
    if($(window).width() < 768) {
        $('#steps .advantages__wrap').find('h2').prependTo($('#steps .container'));
        $('#steps .advantages__wrap').find('.cloud').appendTo($('#steps .container'));
        $('#steps .advantages__wrap').slick({
            slidesToShow: 1,
            slidesToScroll: 1,
            variableWidth: true,
            dots: true,
            arrows: false,
            infinite: false,
            swipeToSlide: true
        });

        $('#customer_advantages .advantages__wrap').find('h2').prependTo($('#customer_advantages .container'));
        $('#customer_advantages .advantages__wrap').find('.cloud').appendTo($('#customer_advantages .container'));
        $('#customer_advantages .advantages__wrap').slick({
            slidesToShow: 1,
            slidesToScroll: 1,
            variableWidth: true,
            dots: true,
            arrows: false,
            infinite: false,
            swipeToSlide: true
        });

        $('#business_advantages .advantages__wrap').find('h2').prependTo($('#business_advantages .container'));
        $('#business_advantages .advantages__wrap').find('.cloud').appendTo($('#business_advantages .container'));
        $('#business_advantages .advantages__wrap').slick({
            slidesToShow: 1,
            slidesToScroll: 1,
            variableWidth: true,
            dots: true,
            arrows: false,
            infinite: false,
            swipeToSlide: true
        });


        $('#business_advantages .advantages__list').slick({
            slidesToShow: 1,
            slidesToScroll: 1,
            variableWidth: true,
            dots: true,
            arrows: false,
            infinite: true,
            swipeToSlide: true
        });
    }


    // Анимация цифр в блоке "Почему стоит внедрить Kvint сейчас"
    animateCount();
    if ($(window).width() > 1199) {
        $('main').scroll(function() {
            animateCount();
        });
    } else {
        $(window).scroll(function() {
            animateCount();
        });
    }
    function animateCount() {
        $('section#statistics .statistics__block .counter').each(function(index){
            var targetBlock = $(this);
            var targetBlockValue = +$(this).attr('data-counter');
            if ($(window).width() > 1199) {
                var scrollEvent = (targetBlock.offset().top < $('main').height() && targetBlock.offset().top > 0);
            } else {
                var scrollEvent = ($(window).scrollTop() > (targetBlock.offset().top - $(window).height()));
            }
            if(scrollEvent && !$(this).hasClass('counted')) {
                setTimeout(()=>{
                    $(this).closest('.title').css('visibility', 'visible');
                }, 200);
                $({numberValue: 1}).stop(true, true).delay(1000).animate({numberValue: targetBlockValue}, {
                    duration: 2000,
                    easing: "linear",
                    step: function(val) {
                        $('section#statistics .statistics__block .counter').eq(index).html(Math.ceil(val));
                    }
                });
                $(this).addClass('counted');
            }
        });
    }
});