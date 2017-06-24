/******

Sections
--------
1. Basic
2. Navbar
3. Scroll Links and Scroll Detection
4. On-Scroll Animations
5. Hero
6. Separator Carousel
7. Gallery
8. Countdown
9. Parallax
10. RSVP

******/






(function ($) {
	"use strict";







	/* 1. Basic */

	var $body = $('body'),
		$nav = $('nav'),
		$preloader = $('.preloader'),
		$sections = $('section');

	window.onload = function(){
		setImgAsBg();
		setupNav();
		navFixedSwitch();
		setupScrollLinks();
		detectScroll();

		setupSectionHero();
		setupSeparatorCarousel();
		setupSectionGallery();
		setupCountdown();
		setupParallax();
		setupRSVP();

		$preloader.addClass('done');
		setTimeout(function(){
			$preloader.remove();
		}, 500);
	};

	$(window).on('resize orientationchange', function(){
		resizeAndOrientationChangeHandler();
	});

	function resizeAndOrientationChangeHandler(){
		$nav.data('waypoint').context.refresh();
		$sections.each(function(index, el) {
			var $el = $(el);

			if ($el.data('waypoint') !== undefined){
				$el.data('waypoint').context.refresh();
			}
		});
		setupMenuWrapper();
	}

	function setImgAsBg(){
		$('.img-as-bg').each(function(index, el) {
			var $img = $(el);

			$img.parent().css('background-image', 'url("' + $img.attr('src') + '")');
			$img.remove();
		});
	}







	/* 2. Navbar */

	function setupNav(){
		$('button.open-menu').on('click', function(){
			$nav.toggleClass('opened');
		});
		setupMenuWrapper();
	}

	function setupMenuWrapper(){
		var menuHeight = $nav.find('ul.menu').innerHeight(),
			$menuWrapper = $nav.find('.menu-wrapper');

		if (menuHeight <= window.innerHeight){
			$menuWrapper.css('max-height', menuHeight).css('overflow', 'hidden');
		} else{
			$menuWrapper.css('max-height', window.innerHeight).css('overflow', 'auto');
		}
	}

	function navFixedSwitch(){
		var waypoint = new Waypoint({
			element: $nav.get(0),
			handler: function(direction) {
				if (direction === 'up'){
					$nav.removeClass('nav-fixed');
				} else{
					$nav.addClass('nav-fixed');
				}
			},
		});
		$nav.data('waypoint', waypoint);
	}







	/* 3. Scroll Links and Scroll Detection */

	function setupScrollLinks(){
		$('.scroll-link').on('click', function (e) {
			e.preventDefault();
			var $this = $(this),
				target = $this.attr('href'),
				offset = ($body.hasClass('admin-bar') ? 32 : 0) + ($body.hasClass('nav-vertical') ? 0 : 48);

			if (target.indexOf('#') === 0 && !$body.hasClass('scrolling')){
				$body.addClass('scrolling').add('html').animate({
					scrollTop: $(target).offset().top - offset + 1
				}, 400, function(){
					$body.removeClass('scrolling');
					if ($this.parents('nav').length>0){
						$nav.removeClass('opened').find('.menu-wrapper').animate({
							scrollTop: 0,
						}, 400);
					}
				});
			}
		});
	}

	function detectScroll(){
		$sections.each(function(index, section) {
			var $section = $(section),
			id = $section.attr('id'),
			offset = ($body.hasClass('admin-bar') ? 32 : 0) + ($body.hasClass('nav-vertical') ? 0 : 48) + $nav.innerHeight(),
			menu = null;

			$nav.find('a').each(function(index, el) {
				if (el.hash === '#' + id) menu = el;
			});

			if (menu === null) return true;

			$section.data('menu', menu);

			var waypoint = new Waypoint({
				element: section,
				handler: function(direction) {
					var $li = $( $section.data('menu') ).parent();
					if (direction === 'up'){
						$li.removeClass('current-menu-item');
						$li = $( $section.prevAll('section').eq(0).data('menu') ).parent();
					}
					$li.addClass('current-menu-item');
					$li.siblings().removeClass('current-menu-item');
				},
				'offset': offset
			});

			$section.data('waypoint', waypoint);
		});
	}






	/* 4. On-Scroll Animations */

	function onScrollHandler(){
		var $win = $(window),
			winHeight = window.innerHeight,
			previousWinScrollTop = 0;

		var winScrollTop = $win.scrollTop();
		if (winScrollTop - previousWinScrollTop >= 0){
			$('.animation-chain').each(function(index, el) {
				var $el = $(el);
				if (winScrollTop > $el.offset().top - winHeight/4*3){
					var animationName = $el.data('animation');
					if (animationName === undefined || animationName === ''){
						animationName = 'fadeInUp';
					}
					$el.animateCssChain(animationName);
				}
			});
		}
		previousWinScrollTop = winScrollTop;
		window.requestAnimationFrame(onScrollHandler);
	}

	$.fn.extend({
		animateCss: function (animationName) {
			var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
			$(this).addClass('animated ' + animationName).one(animationEnd, function() {
				$(this).removeClass(animationName);
			});
		},
		animateCssChain: function (animationName, delay){
			if (delay === undefined || delay === null || delay === '') delay = 0.1;

			$(this).children().each(function(index, el) {
				var $el = $(el);
				if ($el.hasClass('animated')) return true;
				$el.css({
					'-webkit-animation-delay': delay*index + 's',
					'animation-delay': delay*index + 's'
				}).animateCss(animationName);
			});
		}
	});






	/* 5. Hero */

	 function setupSectionHero(){
		var $carouselHero =  $('section.section-hero .owl-carousel');
		$carouselHero.imagesLoaded(function() {
			$carouselHero.owlCarousel({
				loop:true,
				margin:0,
				nav:false,
				items:1,
				autoHeight:false,
				dots: true,
				autoplay: true,
				autoplayTimeout:5000,
				autoplayHoverPause:false,
				smartSpeed: 1000,
				animateOut: 'fadeOut'
			});
			setTimeout(function(){
				window.requestAnimationFrame(onScrollHandler);
				setTimeout(function(){
					$('.section-hero .cta').animateCss('fadeInUp');
				}, 1000);
			}, 600);
		});

		$('.section-hero .scroll-down').on('click', function(){
			$body.add('html').animate({
				scrollTop: $nav.offset().top
			}, 1000);
		});
	 }






	/* 6. Separator Carousel */

	 function setupSeparatorCarousel(){
		var $separatorCarousel =  $('.separator-carousel .owl-carousel');
		$separatorCarousel.imagesLoaded(function() {
			$separatorCarousel.owlCarousel({
				loop:true,
				margin:0,
				nav:true,
				items:4,
				autoHeight:true,
				dots: false,
				autoplay: true,
				autoplayTimeout:5000,
				responsive : {
					0 : {
						items : 1,
					},
					480 : {
						items : 3,
					},
					992 : {
						items : 4,
					}
				}
			});
			$separatorCarousel.magnificPopup({
				delegate: 'a',
				type: 'image',
				gallery:{enabled:true}
			});
		});
	 }







	/* 7. Gallery */

	function setupSectionGallery(){
		var $galleryGrid = $('.gallery-grid');
		if ( $.fn.imagesLoaded !== undefined && $.fn.isotope !== undefined ){
			$galleryGrid.imagesLoaded(function () {
				$galleryGrid.isotope({
					itemSelector: '.gallery-grid-item',
					layoutMode: 'masonry',
					initLayout: false,
				}).on( 'layoutComplete', function (e) {
					detectScroll();
				} ).isotope();
			});
			$galleryGrid.find('.gallery-grid-item').each(function(index, el) {
				if ($(el).find('ul.video').length > 0){
					$('<img />')
						.attr('src', 'img/youtube-play.svg')
						.addClass('gallery-video-icon')
						.prependTo(el);
				}
			});
		}

		var $galleryCats = $('.gallery-cats a');
		$galleryCats.on('click', function(e){
			e.preventDefault();
			var cat = $(this).data('cat');
			if (cat !== '*') {
				cat = '.' + cat;
			}
			$galleryGrid.isotope({
				filter: cat
			});
		});

		var $galleryItems = $('#gallery .gallery-grid-item'),
			$galleryModal = $('.gallery-modal'),
			$galleryModalNavPrev = $('.gallery-modal .modal-nav-prev'),
			$galleryModalNavNext = $('.gallery-modal .modal-nav-next'),
			$galleryModalNavClose = $('.gallery-modal .modal-nav-close'),
			$galleryOverlay = $('.gallery-overlay'),
			$galleryOpenModal = $('.gallery-open-modal');

		$galleryModalNavPrev.on('click',function(e){
			e.preventDefault();
			$galleryItems.filter('.current').prev().trigger('click');
		});

		$galleryModalNavNext.on('click',function(e){
			e.preventDefault();
			$galleryItems.filter('.current').next().trigger('click');
		});

		$galleryModalNavClose.on('click',function(e){
			e.preventDefault();
			$galleryOverlay.trigger('click');
		});

		$galleryOpenModal.on('click', function(e){
			e.preventDefault();
			$(this).parents('.gallery-grid-item').trigger('click');
		});

		function openGalleryModal(){
			setTimeout(function(){
				$galleryModal.addClass('opened');
				$galleryOverlay.addClass('loaded');
			}, 300);
		}

		$galleryItems.on('click', function(e){
			if (e.target.tagName.toLowerCase() !== 'img' && !$(e.target).hasClass('gallery-grid-item')) return;
			var $this = $(this),
				$info = $this.find('.gallery-info'),
				$left = $galleryModal.find('.left'),
				$right = $galleryModal.find('.right'),
				$imageList = $this.find('ul.image-list'),
				$video = $this.find('ul.video');

			$this.addClass('current').siblings().removeClass('current');

			// modal navigation
			$galleryModalNavPrev.parent().toggleClass('enabled', $this.prev().length > 0);
			$galleryModalNavNext.parent().toggleClass('enabled', $this.next().length > 0);

			// load info into modal
			$left.empty().append( $info.clone() );
			$right.empty();

			// create carousel for images
			if ($imageList.length > 0){
				var $carousel = $('<div />').addClass('owl-carousel owl-theme');
				$imageList.find('img').each(function(index, el) {
					var $img = $(el).clone();

					$img.attr('src', $img.data('src'));
					if ($img.hasClass('img-vertical')){
						$img.css('max-height', window.innerHeight - 240);
					}
					$('<div />').addClass('item').append($img).appendTo($carousel);
				});
				$right.append($carousel);

				$carousel.imagesLoaded(function() {
					$carousel.owlCarousel({
						loop:true,
						margin:0,
						nav:false,
						items:1,
						autoHeight:true,
						dots: true,
					});
					openGalleryModal();
				});
			}

			// load video into modal
			if ($video.length > 0){
				var $iframe = $video.find('iframe'),
					src = $iframe.data('src'),
					$wideScreen = $('<div />').addClass('wide-screen');

				if (src.indexOf('youtube') !== -1){
					// YouTube video
					var	srcSplit = src.split('?'),
						srcMain = null,
						srcPure = null;

					if (srcSplit.length > 0){
						srcMain = srcSplit[0];
						srcPure = srcMain.split('/');
						srcPure = srcPure.pop();

						var $thumbnail = $('<a />').attr({'href': '#'}).append(
								$('<img/>').attr(
									{'src': 'http://i.ytimg.com/vi/'+ srcPure + '/maxresdefault.jpg'}
								)
							);

						$wideScreen.append($thumbnail);
						$wideScreen.imagesLoaded(function(){
							$right.append($wideScreen);
							openGalleryModal();
						});

						$thumbnail.on('click', function(e){
							e.preventDefault();
							src = src+'&autoplay=1';
							$wideScreen.empty().append( $iframe.clone().attr({'src': src}) );
						});
					}
				} else{
					$wideScreen.append(
						$iframe.clone().attr({'src': src}).on('load', function(){
							openGalleryModal();
						})
					);
					$right.append($wideScreen);
				}
			}

			$galleryOverlay.css('display','flex');
			setTimeout(function(){
				$galleryOverlay.addClass('opened');
			},100);
		});

		$galleryOverlay.on('click', function(e){
			if (!$(e.target).hasClass('gallery-overlay')) return;
			$galleryModal.find('.right').empty();
			$galleryModal.removeClass('opened');
			setTimeout(function(){
				$galleryOverlay.removeClass('opened');
				setTimeout(function(){
					$galleryOverlay.hide();
					$galleryOverlay.removeClass('loaded');
				}, 300);
			}, 300);
		});
	}






	/* 8. Countdown */

	function setupCountdown(){
		var $countdownArea = $('.countdown-area'),
			$h2 = $countdownArea.prev('h2');

		$countdownArea.countdown($countdownArea.data('final-date'), {elapse: true}).on('update.countdown', function(event){
			if (event.elapsed){
				$h2.html($h2.data('after-countdown'));
				$countdownArea.html($countdownArea.data('after-countdown'));
			} else{
				$countdownArea.html(event.strftime('<ul><li><span class="digits">%-D</span><span class="unit">Day%!D</span></li><li><span class="digits">%-H</span><span class="unit">Hour%!H</span></li><li><span class="digits">%-M</span><span class="unit">Minute%!M</span></li><li><span class="digits">%-S</span><span class="unit">Second%!S</span></li></ul>'));
			}
		});
	}







	/* 9. Parallax */

	function setupParallax(){
		var $parallax = $('.parallax');
		if ($parallax.length > 0){
			$parallax.parallax({
				mode: 1
			});
		}
	}






	/* 10. RSVP */

	function setupRSVP(){
		$('.btn-event-rsvp').on('click', function(e){
			e.preventDefault();
			var event = $(this).data('event'),
				$option = $('form.rsvp option[value=' + event + ']'),
				$li = $('.section-rsvp ul.events>li[data-event=' + event + ']');

			$option.prop('selected', true);
			$li.addClass('selected');
			$body.add('html').animate({
				scrollTop: $('.section-rsvp').offset().top
			}, 400);
		});

		$('.section-rsvp ul.events>li').on('click', function(){
			var $this = $(this),
				event = $this.data('event'),
				$option = $('form.rsvp option[value=' + event + ']');

			if ($this.hasClass('selected')){
				$option.prop('selected', false);
			} else{
				$option.prop('selected', true);
			}

			$this.toggleClass('selected');
		});
	}

})(jQuery);