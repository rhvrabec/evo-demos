;(function(window)
{
	var mCurrentSlide = 0;

	window.SlideScrollUp = function()
	{
		window.scrollBy(0, -100)
	}

	window.SlideScrollDown = function()
	{
		window.scrollBy(0, 100)
	}

	window.SlideShowStart = function()
	{
		mCurrentSlide = 0;
		SlideShowHideAll();
		SlideShowShowSlide(mCurrentSlide);
	}

	window.SlideShowNext = function()
	{
		SlideShowHideSlide(mCurrentSlide);

		mCurrentSlide = mCurrentSlide + 1;

		if (mCurrentSlide >= SlideShowGetNoOfSlides())
		{
			mCurrentSlide = 0;
		}

		SlideShowShowSlide(mCurrentSlide);
	}

	window.SlideShowPrev = function()
	{
		SlideShowHideSlide(mCurrentSlide);

		mCurrentSlide = mCurrentSlide - 1;

		if (mCurrentSlide < 0)
		{
			mCurrentSlide = SlideShowGetNoOfSlides() - 1;
		}

		SlideShowShowSlide(mCurrentSlide);
	}

	function SlideShowGetAllSlides()
	{
		return document.getElementsByTagName('div');
	}

	function SlideShowGetNoOfSlides()
	{
		return SlideShowGetAllSlides().length;
	}

	function SlideShowShowSlide(index)
	{
		SlideShowHideAll();

		var allSlides = SlideShowGetAllSlides();

		var slide = allSlides.item(index);

	// Show the slide.
	slide.style.display = 'block';
	}

	function SlideShowHideSlide(index)
	{
		var allSlides = SlideShowGetAllSlides();

		allSlides.item(index).style.display = 'none';
	}

	function SlideShowHideAll()
	{
		var allSlides = SlideShowGetAllSlides();
		for (var i = 0; i < allSlides.length; i++)
		{
			allSlides.item(i).style.display = 'none';
		}
	}

	function NavigateSlides(x, y)
	{
		var width = window.innerWidth;
		if (x < 100)
		{
			// Touched top egde of page.
			SlideShowPrev();
		}
		else if (x > width - 100)
		{
			// Touched right edge of page.
			SlideShowNext();
		}
		else if (y < 100)
		{
			// Touched left edge of page.
			SlideShowStart();
		}
	}

	//window.onclick = function(event)
	function ClickHandler(event)
	{
		NavigateSlides(event.clientX, event.clientY)
	}

	function TouchHandler(event)
	{
		//event.preventDefault();
		var x = event.targetTouches[0].pageX;
		var y = event.targetTouches[0].pageY;
		NavigateSlides(x, y)
	}

	// Enable navigation by clicking/touching.
	if ('ontouchstart' in window)
	{
		window.addEventListener('touchstart', TouchHandler, true);
	}
	else
	{
		window.addEventListener('click', ClickHandler, true);
	}

	window.addEventListener('DOMContentLoaded', function(e)
	{
		SlideShowStart();
	});

})(window);
