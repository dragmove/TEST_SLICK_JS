(function($) {
	'use strict';

	if(!window.mxm) window.mxm = {};
	if(!mxm.ui) mxm.ui = {};
	if(!mxm.ui.carousel) mxm.ui.carousel = {};

	mxm.ui.carousel.staticWidthCarousel = function(option) {
		var wrap = option.wrap;
		if(!wrap || !wrap.length) return;

		var isSetSlick = false,
			cloneItems = [];

		var items = wrap.children(),
			wrapInnerHtml = String(wrap.html()),
			tmpItem;
		for(var i=0,max=items.length; i<max; i++) {
			tmpItem = $(items.get(i)).clone();
			cloneItems.push(tmpItem);
		}
		setStaticWidthCarousel(option);

		$(window).on('orientationchange', function(event) {
			var angle = window.orientation;
			if(angle === 0 || angle === 180) {
				// window.alert('portrait');
			}else if(angle === 90 || angle === -90) {
				// window.alert('landscape');
			}

			console.log('2nd wrap :', wrap);
			resetStaticWidthCarousel();
		});

		function resetStaticWidthCarousel() {
			wrap.each(function() {
				var container = $(this),
					containerSelf = this;
				if(cloneItems.length <= 0) {
					isSetSlick = false;
					return;
				}
				if(cloneItems.length <= 1) {
					isSetSlick = false;
					return;
				}

				if(containerSelf._$itemWrap) {
					var containerParentWidth = container.parent().width(),
						itemsTotalWidth = (parseInt(option.childrenWidth,10) + parseInt(option.childrenLeftRightMargin,10) * 2) * cloneItems.length; // + parseInt(option.sidePadding,10) * 2;

					if(containerParentWidth < itemsTotalWidth) {
						console.log('simple -> slick');

						containerSelf._$itemWrap.replaceWith(wrapInnerHtml);
						containerSelf._$itemWrap = null;

						var tmpItems = container.children(),
							childNode = tmpItems.children().get(0);
						if(childNode && childNode.nodeName === 'IMG') {
							tmpItems.children().css({
								'width': option.childrenWidth,
								'margin-left': option.childrenLeftRightMargin,
								'margin-right': option.childrenLeftRightMargin
							})
						}

						container.slick(option);
						isSetSlick = true;
					}else{
						console.log('simple -> simple');

						containerSelf._$itemWrap.css({
							// 'position': 'absolute',
							'left': containerParentWidth/2 - itemsTotalWidth/2
						});
						isSetSlick = false;
					}
				}else{
					var containerParentWidth = container.parent().width(),
						itemsTotalWidth = (parseInt(option.childrenWidth,10) + parseInt(option.childrenLeftRightMargin,10) * 2) * cloneItems.length; // + parseInt(option.sidePadding,10) * 2;

					if(containerParentWidth < itemsTotalWidth) {
						console.log('slick -> slick');

						isSetSlick = true;
					}else{
						console.log('slick -> simple');

						container.empty();
						container.removeClass('slick-initialized slick-slider');
						container.html(wrapInnerHtml);

						var tmpItems = container.children(),
							childNode = tmpItems.children().get(0);
						if(childNode && childNode.nodeName === 'IMG') {
							tmpItems.children().css({
								'width': option.childrenWidth,
								'margin-left': option.childrenLeftRightMargin,
								'margin-right': option.childrenLeftRightMargin
							})
						}

						tmpItems.css('float', 'left');
						tmpItems.wrapAll('<div></div>');

						var itemWrap = tmpItems.parent();
						itemWrap.css({
							'position': 'absolute',
							'left': containerParentWidth/2 - itemsTotalWidth/2
						}).append('<div style="clear:both; width:0; height:0; overflow:hidden;"></div>');

						container.get(0)._$itemWrap = itemWrap;
						isSetSlick = false;
					}
				}
			});
		}

		function setStaticWidthCarousel(option) {
			var wrap = option.wrap;
			wrap.each(function() {
				var container = $(this),
					items = container.children();
				$(container).attr('data-item-length', items.length);

				if(items.length <= 0) {
					isSetSlick = false;
					return;
				}
				if(items.length <= 1) {
					var childNode = items.children().get(0);
					if(childNode && childNode.nodeName === 'IMG') {
						items.css({'text-align': 'center'});

						$(childNode).css({
							'width': option.childrenWidth
						})
					}
					isSetSlick = false;
					return;
				}

				var containerParentWidth = container.parent().width(),
					itemsTotalWidth = (parseInt(option.childrenWidth,10) + parseInt(option.childrenLeftRightMargin,10) * 2) * items.length; // + parseInt(option.sidePadding,10) * 2;
				
				var childNode = items.children().get(0);
				if(childNode && childNode.nodeName === 'IMG') {
					items.children().css({
						'width': option.childrenWidth,
						'margin-left': option.childrenLeftRightMargin,
						'margin-right': option.childrenLeftRightMargin
					})
				}
				if(containerParentWidth < itemsTotalWidth) {
					console.log('slick setting');

					container.slick(option);

					//event
					container.on('swipe', function(event, slick, direction) {
						console.log('swipe :', event);
					});

					container.on('beforeChange', function(event, slick, currentSlide, nextSlide){
						console.log('beforeChange :', event);
					});

					container.on('setPosition', function(event, slick, direction) {
						console.log('setPosition :', event);
					});

					isSetSlick = true;
				}else{
					console.log('simple setting');

					items.css('float', 'left');
					items.wrapAll('<div></div>');

					var itemWrap = items.parent();
					itemWrap.css({
						'position': 'absolute',
						'left': containerParentWidth/2 - itemsTotalWidth/2
					}).append('<div style="clear:both; width:0; height:0; overflow:hidden;"></div>');

					container.get(0)._$itemWrap = itemWrap;
					isSetSlick = false;
				}
			});
		}
	};

	$(document).ready(function() {
		init();

		function init() {
			mxm.ui.carousel.staticWidthCarousel({
				wrap: $('.fullscreen-carousel'),
				childrenWidth: '100px',
				childrenLeftRightMargin: '8px',

				/* 
				 * slick parameters
				 */
				accessibility: false, // keyboard 제어 여부
                autoplay: false, // auto rolling 여부
                autoplaySpeed: 3000, // auto rolling 실행 간격

                centerMode: true, 
                centerPadding: '0px',
                // cssEase: 'ease',
                dots:true, // dot 표기 여부
                dotsClass:'slick-dots', // dot css class
                // draggable: true, // enable desktop dragging
                // easing: 'linear' // animate() fallback
                // edgeFriction: 0.15 
                // fade: false
                arrows: true,
                infinite: true,
                initialSlide: 0, //최초 표기되는 slide index. 0부터 시작.
                pauseOnHover: true,
                pauseOnDotsHover: false, // dot hover시, pause 여부
                slidesToShow:1,
                // slidesToScroll:1,
                // speed: 300,
                variableWidth:true // true 설정시, .slick-slide width는 custom 설정 가능하다. false 설정시, container width로 자동 설정.
			});
	
			/*
			mxm.ui.carousel.staticWidthCarousel({
				wrap: $('.centermode-carousel'),
				childrenWidth: '120px',
				childrenLeftRightMargin: '5px',

				accessibility: false, // keyboard 제어 여부
                autoplay: false, // auto rolling 여부
                autoplaySpeed: 3000, // auto rolling 실행 간격

                centerMode: true, 
                centerPadding: '0px',
                // cssEase: 'ease',
                dots:false, // dot 표기 여부
                // dotsClass:'slick-dots', // dot css class
                // draggable: true, // enable desktop dragging
                // easing: 'linear' // animate() fallback
                // edgeFriction: 0.15 
                // fade: false
                arrows: true,
                infinite: true,
                initialSlide: 0, //최초 표기되는 slide index. 0부터 시작.
                pauseOnHover: true,
                pauseOnDotsHover: false, // dot hover시, pause 여부
                // slidesToShow:1,
                // slidesToScroll:1,
                // speed: 300,
                variableWidth:true // true 설정시, .slick-slide width는 custom 설정 가능하다. false 설정시, container width로 자동 설정.
			});
			*/
		}
	});
}(jQuery));
