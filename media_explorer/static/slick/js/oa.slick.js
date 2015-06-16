/* oa.slick.js */

$(document).ready(function(){
//(function($) {
  "use strict";
  var slidesToUse, slidesToUse1024, slidesToUse800, slidesToUse600, slidesToUse400;
  var reset = 0;
	$('.slider-nav').on('init',function(event, slick){
		$('.slider-nav .slick-slide[data-slick-index="0"]').addClass('on');
   		var totalSlides = $('.slider-nav .slick-slide:not(.slick-cloned)').length;
		var undersize = false;
		//console.log("totalslides="+totalSlides);
		if(totalSlides<=5){
			slidesToUse = 5;
			slidesToUse1024 = 4;
			slidesToUse800 = 3;
			slidesToUse600 = 2;
			slidesToUse400 = 1;
			switch (totalSlides) {
			    case 2: 
			        slidesToUse = 2, slidesToUse1024 = 2, slidesToUse800 = 2, slidesToUse600 = 2; 
			        //console.log("case2");
			        if(Modernizr.mq('only all and (min-width: 400px)')){
			        	undersize = true;
			        	//console.log("case2-true");
			        }
			        break; //end 2 slides 
			    case 3: 
			       slidesToUse = 3, slidesToUse1024 = 3; 
			       //console.log("case3");
			        if(Modernizr.mq('only all and (min-width: 600px)')){
			        	undersize = true;
			        	//console.log("case3-true");
			        } 
			        break; //end 3 slides
			    case 4: 
			        slidesToUse = 4; 
			        //console.log("case4");
			        if(Modernizr.mq('only all and (min-width: 1024px)')){
			        	undersize = true;
			        	//console.log("case4-true");
			        }  
			        break; //end 4 slides
			    case 5: 
			        slidesToUse = 5; 
			        //console.log("case5");
			        if(Modernizr.mq('only all and (min-width: 1160px)')){
			        	undersize = true; 
			        	//console.log("case5-true");
			        }  
			        break; //end 5 slides 
			};
			if(undersize == true){
				$('.slider-nav').addClass('undersize');
				$('.slider-nav').addClass('undersizetrue');
				$(".slider-nav .slick-slide").each(function(){
					if($(this).attr("aria-hidden") == "false"){
						$(this).removeClass("slick-active");
						$(this).removeClass("slick-center");
						$(this).attr("aria-hidden", true);
					}
				});
			}
		}
		else{
			slidesToUse = 5;
		}
   	});
   var slider = $('.slider').slick({
	  slidesToShow: 1,
	  slidesToScroll: 1,
	  arrows: true,
	  fade: false,
	  swipe:true,
	  swipeToSlide: true,
	  asNavFor: '.slider-nav',
	  lazyLoad: 'ondemand'
	}).on({
		beforeChange: function(event, slick, current_slide_index, next_slide_index) {
	        $('.slider-nav .slick-slide[data-slick-index='+current_slide_index+']').removeClass('on');
	        $('.slider-nav .slick-slide[data-slick-index='+next_slide_index+']').addClass('on');
	    }, 
	    afterChange: function(event,slick, currentSlide){
	    	var currentSlide = slider.slick('slickCurrentSlide');
			sliderCap.slick('slickGoTo',currentSlide,true);
			sliderNav.slick('slickGoTo',currentSlide,true);
		}
    });
   	
	var sliderNav = $('.slider-nav').slick({
	  slidesToShow: 5,
	  slidesToScroll: 5,
	  asNavFor: '.slider',
	  dots: false,
	  centerMode: true,
	  arrows: true,
	  infinite: true,
	  focusOnSelect: true,
	  swipe:false,
	  swipeToSlide: false,
	  draggable: false,
	  responsive: [
	    {
	      breakpoint: 1160,
	      settings: {
	        slidesToShow: 4,
	        slidesToScroll: 4
	      }
	    },
	    {
	      breakpoint: 1024,
	      settings: {
	        slidesToShow: 4,
	        slidesToScroll: 4
	      }
	    },
	    {
	      breakpoint: 800,
	      settings: {
	        slidesToShow: 3,
	        slidesToScroll: 3
	      }
	    },
	    {
	      breakpoint: 600,
	      settings: {
	        slidesToShow: 2,
	        slidesToScroll: 2
	      }
	    },
	    {
	      breakpoint: 400,
	      settings: {
	        slidesToShow: 1,
	        slidesToScroll: 1
	      }
	    }]
	});
	
	var sliderCap = $('.slider-captions').slick({
	  slidesToShow: 1,
	  slidesToScroll: 1,
	  dots: false,
	  arrows:false,
	  centerMode: false,
	  fade: false,
	  swipe: false,
	  swipeToSlide: false,
	  focusOnSelect: false
	});
	if($(".slider-nav").hasClass('undersize')){
		var sliderNav = $(".slider-nav").slick({
			slidesToShow: slidesToUse,
			slidesToScroll: 5,
			infinite:false,
			arrows: false,
			centerMode:false
		})
		.on('afterChange',function(event,slick,currentSlide){
			var nowSlide = slider.slick('slickCurrentSlide');
			$(".slider-nav .slick-slide").each(function(){

				if($(this).attr("data-slick-index") == nowSlide){
					$(this).addClass("slick-active");
					$(this).addClass("slick-center");
				}
				else{
					if($(this).hasClass("slick-active")){ $(this).removeClass("slick-active");}
					if($(this).hasClass("slick-center")){ $(this).removeClass("slick-center");}
				}
			});
		});
		sliderNav.slick('slickSetOption','infinite','false');
		sliderNav.slick('slickSetOption','centerMode','false');
		$(".slider-nav").append('<button type="button" data-role="none" class="slick-prev disabled" aria-label="previous">Previous</button>');
		$(".slider-nav").append('<button type="button" data-role="none" class="slick-next disabled" aria-label="next">Next</button>');
	}
	if(sliderNav.slick('slickGetOption','centerMode')=="false"){
		$(".slider-nav .slick-slide").each(function(){
			if($(this).hasClass("slick-center")){ $(this).removeClass("slick-center");}
		});
		$(".slider-nav .slick-slide").first().addClass("slick-center");
		
	}

$(".slider-nav .slick-prev.disabled").on('click',function(e){
	e.preventDefault();
});

$(".slider-nav .slick-next").on('click',function(e){
	e.preventDefault();
});
	
});
//})(jQuery);