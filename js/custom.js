(function() {
	'use strict';

	/*----------------------------------------
		Detect Mobile
	----------------------------------------*/
	var isMobile = {
		Android: function() {
			return navigator.userAgent.match(/Android/i);
		},
			BlackBerry: function() {
			return navigator.userAgent.match(/BlackBerry/i);
		},
			iOS: function() {
			return navigator.userAgent.match(/iPhone|iPad|iPod/i);
		},
			Opera: function() {
			return navigator.userAgent.match(/Opera Mini/i);
		},
			Windows: function() {
			return navigator.userAgent.match(/IEMobile/i);
		},
			any: function() {
			return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
		}
	};

	/*----------------------------------------
		Carousel
	----------------------------------------*/
	var owlCarousel = function(){

		var owl = jQuery('.owl-carousel-carousel');
		owl.owlCarousel({
			items: 3,
			loop: true,
			margin: 20,
			nav: true,
			dots: true,
			smartSpeed: 800,
			autoHeight: true,
			navText: [
		      "<i class='icon-keyboard_arrow_left owl-direction'></i>",
		      "<i class='icon-keyboard_arrow_right owl-direction'></i>"
	     	],
	     	responsive:{
	        0:{
	            items:1
	        },
	        600:{
	            items:2
	        },
	        1000:{
	            items:3
	        }
	    	}
		});

		var owl = jQuery('.owl-carousel-fullwidth');
		owl.owlCarousel({
			items: 1,
			loop: true,
			margin: 20,
			nav: false,
			dots: true,
			smartSpeed: 800,
			autoHeight: true,
			autoplay: true,
			navText: [
		      "<i class='icon-keyboard_arrow_left owl-direction'></i>",
		      "<i class='icon-keyboard_arrow_right owl-direction'></i>"
	     	]
		});

		var owl = jQuery('.owl-work');
		owl.owlCarousel({
			stagePadding: 150,
			loop: true,
			margin: 20,
			nav: true,
			dots: false,
			mouseDrag: false,
			autoWidth: true,
			autoHeight: true,
	    autoplay: true,
	    autoplayTimeout:2000,
	    autoplayHoverPause:true,
			navText: [	
				"<i class='icon-chevron-thin-left'></i>",
				"<i class='icon-chevron-thin-right'></i>"
			],
			responsive:{
			  0:{
		      items:1,
		      stagePadding: 10
			  },
			  500:{
			  	items:2,
		      stagePadding: 20
			  },
			  600:{
		      items:2,
		      stagePadding: 40
			  },
			  800: {
			  	items:2,
			  	stagePadding: 100
			  },
			  1100:{
		      items:3
			  },
			  1400:{
		      items:4
			  },
			}
		});
	};

	/*----------------------------------------
		Slider
	----------------------------------------*/
	var flexSlider = function() {
	  jQuery('.flexslider').flexslider({
	    animation: "fade",
	    prevText: "",
	    nextText: "",
	    slideshow: true
	  });
	}

	/*----------------------------------------
		Animate Scroll
	----------------------------------------*/
    //
	// var contentWayPoint = function() {
	// 	var i = 0;
	// 	jQuery('.itb-animate').waypoint( function( direction ) {
    //
	// 		if( direction === 'down' && !jQuery(this.element).hasClass('itb-animated') ) {
    //
	// 			i++;
    //
	// 			jQuery(this.element).addClass('item-animate');
	// 			setTimeout(function(){
    //
	// 				jQuery('body .itb-animate.item-animate').each(function(k){
	// 					var el = jQuery(this);
	// 					setTimeout( function () {
	// 						var effect = el.data('animate-effect');
	// 						if ( effect === 'fadeIn') {
	// 							el.addClass('fadeIn itb-animated');
	// 						} else if ( effect === 'fadeInLeft') {
	// 							el.addClass('fadeInLeft itb-animated');
	// 						} else if ( effect === 'fadeInRight') {
	// 							el.addClass('fadeInRight itb-animated');
	// 						} else {
	// 							el.addClass('fadeInUp itb-animated');
	// 						}
	// 						el.removeClass('item-animate');
	// 					},  k * 30, 'easeInOutExpo' );
	// 				});
    //
	// 			}, 100);
    //
	// 		}
    //
	// 	} , { offset: '95%' } );
	// };

	var navbarState = function() {

		$(window).scroll(function(){

			var st = $(this).scrollTop();

			if ( st > 5 ) {
				$('.itb-navbar').addClass('scrolled');
			} else {
				$('.itb-navbar').removeClass('scrolled');
			}

		});
	};


	var initPhotoSwipeFromDOM = function(gallerySelector) {

    // parse slide data (url, title, size ...) from DOM elements
    // (children of gallerySelector)
    var parseThumbnailElements = function(el) {
        var thumbElements = el.childNodes,
            numNodes = thumbElements.length,
            items = [],
            figureEl,
            linkEl,
            size,
            item;

        for(var i = 0; i < numNodes; i++) {

            figureEl = thumbElements[i]; // <figure> element

            // include only element nodes
            if(figureEl.nodeType !== 1) {
                continue;
            }

            linkEl = figureEl.children[0]; // <a> element
            console.log(figureEl);
            size = linkEl.getAttribute('data-size').split('x');

            // create slide object
            item = {
                src: linkEl.getAttribute('href'),
                w: parseInt(size[0], 10),
                h: parseInt(size[1], 10)
            };



            if(figureEl.children.length > 1) {
                // <figcaption> content
                item.title = figureEl.children[1].innerHTML;
            }

            if(linkEl.children.length > 0) {
                // <img> thumbnail element, retrieving thumbnail url
                item.msrc = linkEl.children[0].getAttribute('src');
            }

            item.el = figureEl; // save link to element for getThumbBoundsFn
            items.push(item);
        }

        return items;
    };

    // find nearest parent element
    var closest = function closest(el, fn) {
        return el && ( fn(el) ? el : closest(el.parentNode, fn) );
    };

    // triggers when user clicks on thumbnail
    var onThumbnailsClick = function(e) {
        e = e || window.event;
        e.preventDefault ? e.preventDefault() : e.returnValue = false;

        var eTarget = e.target || e.srcElement;

        // find root element of slide
        var clickedListItem = closest(eTarget, function(el) {
            return (el.tagName && el.tagName.toUpperCase() === 'FIGURE');
        });

        if(!clickedListItem) {
            return;
        }

        // find index of clicked item by looping through all child nodes
        // alternatively, you may define index via data- attribute
        var clickedGallery = clickedListItem.parentNode,
            childNodes = clickedListItem.parentNode.childNodes,
            numChildNodes = childNodes.length,
            nodeIndex = 0,
            index;

        for (var i = 0; i < numChildNodes; i++) {
            if(childNodes[i].nodeType !== 1) {
                continue;
            }

            if(childNodes[i] === clickedListItem) {
                index = nodeIndex;
                break;
            }
            nodeIndex++;
        }



        if(index >= 0) {
            // open PhotoSwipe if valid index found
            openPhotoSwipe( index, clickedGallery );
        }
        return false;
    };

    // parse picture index and gallery index from URL (#&pid=1&gid=2)
    var photoswipeParseHash = function() {
        var hash = window.location.hash.substring(1),
        params = {};

        if(hash.length < 5) {
            return params;
        }

        var vars = hash.split('&');
        for (var i = 0; i < vars.length; i++) {
            if(!vars[i]) {
                continue;
            }
            var pair = vars[i].split('=');
            if(pair.length < 2) {
                continue;
            }
            params[pair[0]] = pair[1];
        }

        if(params.gid) {
            params.gid = parseInt(params.gid, 10);
        }

        return params;
    };

    var openPhotoSwipe = function(index, galleryElement, disableAnimation, fromURL) {
		  var pswpElement = document.querySelectorAll('.pswp')[0],
		      gallery,
		      options,
		      items;

		  items = parseThumbnailElements(galleryElement);

		  // define options (if needed)
		  options = {

		      // define gallery index (for URL)
		      galleryUID: galleryElement.getAttribute('data-pswp-uid'),

		      getThumbBoundsFn: function(index) {
		          // See Options -> getThumbBoundsFn section of documentation for more info
		          var thumbnail = items[index].el.getElementsByTagName('img')[0], // find thumbnail
		              pageYScroll = window.pageYOffset || document.documentElement.scrollTop,
		              rect = thumbnail.getBoundingClientRect();

		          return {x:rect.left, y:rect.top + pageYScroll, w:rect.width};
		      }

		  };

		  // PhotoSwipe opened from URL
		  if(fromURL) {
		      if(options.galleryPIDs) {
		          // parse real index when custom PIDs are used
		          // http://photoswipe.com/documentation/faq.html#custom-pid-in-url
		          for(var j = 0; j < items.length; j++) {
		              if(items[j].pid == index) {
		                  options.index = j;
		                  break;
		              }
		          }
		      } else {
		          // in URL indexes start from 1
		          options.index = parseInt(index, 10) - 1;
		      }
		  } else {
		      options.index = parseInt(index, 10);
		  }

		  // exit if index not found
		  if( isNaN(options.index) ) {
		      return;
		  }

		  if(disableAnimation) {
		      options.showAnimationDuration = 0;
		  }

		  // Pass data to PhotoSwipe and initialize it
		  gallery = new PhotoSwipe( pswpElement, PhotoSwipeUI_Default, items, options);
		  gallery.init();
		};

		// loop through all gallery elements and bind events
		var galleryElements = document.querySelectorAll( gallerySelector );

		for(var i = 0, l = galleryElements.length; i < l; i++) {
		  galleryElements[i].setAttribute('data-pswp-uid', i+1);
		  galleryElements[i].onclick = onThumbnailsClick;
		}

		// Parse URL and open gallery if it contains #&pid=3&gid=1
		var hashData = photoswipeParseHash();
		if(hashData.pid && hashData.gid) {
		  openPhotoSwipe( hashData.pid ,  galleryElements[ hashData.gid - 1 ], true, true );
		}
	};

	var galleryMasonry = function() {
		// isotope
		if (jQuery('.portfolio-feed').length > 0 ) {
			var $container = $('.portfolio-feed');
			$container.imagesLoaded(function() {
				$container.isotope({
				  itemSelector: '.grid-item',
				  percentPosition: true,
				  masonry: {
				    columnWidth: '.grid-sizer',
				    gutter: '.gutter-sizer'
				  }
				});
			});
		}

	};

	var stellarInit = function() {
		if( !isMobile.any() ) {
			$(window).stellar();
		}
	};

	var dateTimePicker = function() {
		$('#time').timepicker();
		$('#date').datepicker({
		  'format': 'm/d/yyyy',
		  'autoclose': true
		});
	};


	// Page Nav
	var clickMenu = function() {

		$('.navbar-nav a:not([class="external"]), .footer-nav a').click(function(event){

			var target = $(this).attr('href'),
				n = $(target);
				// if (isMobile.any()) {
				// 	$('.navbar-toggle').click();
				// }
				if ( n.length ) {
			    	$('html, body').animate({
			        	scrollTop: n.offset().top
			    	}, 2000, 'easeInOutExpo');
			   }

		    event.preventDefault();
		    return false;
		});


	};

    $('body').scrollspy({
        target: '#navbar-collapse',
        offset: 50
    });
    
    function footerReveal() {
    	if($(window).width() > 768) $('.footer-reveal').height($('.itb-footer').outerHeight());
    	else $('.footer-reveal').height(0)

            $(window).scroll(function(){
                var st = $(this).scrollTop();

                if ( $('.footer-reveal').height() > 0 ) {
                    if(st > $(window).height()){
                        $('.itb-footer').css('opacity', '1')
					}else{
                        $('.itb-footer').css('opacity', '0')
					}
                }else{
                    $('.itb-footer').css('opacity', '1')
				}

            });

    }


    // map

    var initMap = function () {
        L.TileLayer.Grayscale = L.TileLayer.extend({
            options: {
                quotaRed: 21,
                quotaGreen: 71,
                quotaBlue: 8,
                quotaDividerTune: 0,
                quotaDivider: function() {
                    return this.quotaRed + this.quotaGreen + this.quotaBlue + this.quotaDividerTune;
                }
            },

            initialize: function (url, options) {
                options.crossOrigin = true;
                L.TileLayer.prototype.initialize.call(this, url, options);

                this.on('tileload', function(e) {
                    this._makeGrayscale(e.tile);
                });
            },

            _createTile: function () {
                var tile = L.TileLayer.prototype._createTile.call(this);
                tile.crossOrigin = "Anonymous";
                return tile;
            },

            _makeGrayscale: function (img) {
                if (img.getAttribute('data-grayscaled'))
                    return;

                img.crossOrigin = '';
                var canvas = document.createElement("canvas");
                canvas.width = img.width;
                canvas.height = img.height;
                var ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0);

                var imgd = ctx.getImageData(0, 0, canvas.width, canvas.height);
                var pix = imgd.data;
                for (var i = 0, n = pix.length; i < n; i += 4) {
                    pix[i] = pix[i + 1] = pix[i + 2] = (this.options.quotaRed * pix[i] + this.options.quotaGreen * pix[i + 1] + this.options.quotaBlue * pix[i + 2]) / this.options.quotaDivider();
                }
                ctx.putImageData(imgd, 0, 0);
                img.setAttribute('data-grayscaled', true);
                img.src = canvas.toDataURL();
            }
        });

        L.tileLayer.grayscale = function (url, options) {
            return new L.TileLayer.Grayscale(url, options);
        };

        //  mapping

        var mymap = L.map('map', {scrollWheelZoom: false}).setView([51.505, -0.09], 13);

        L.tileLayer.grayscale('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
            maxZoom: 18,
            attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
            id: 'mapbox.streets'
        }).addTo(mymap);

        L.marker([51.5, -0.09]).addTo(mymap)

    };


	jQuery(function(){
		navbarState();
		// if (jQuery('.itb-gallery').length > 0) {
			initPhotoSwipeFromDOM('.itb-gallery');
		// }
		galleryMasonry();
		stellarInit();
		dateTimePicker();
		clickMenu();
	});

	jQuery(window).load(function(){
		owlCarousel();
		flexSlider();
		footerReveal();
        initMap();
	});

})();