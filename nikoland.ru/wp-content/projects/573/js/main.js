
	(function() {
		var trigger = document.querySelector('.segmenter'),
		segmenter = new Segmenter( trigger, {
			pieces: 8,
			positions: [
				{top: 0, left: 0, width: 100, height: 100},
				{top: 0, left: 0, width: 100, height: 100},
				{top: 0, left: 0, width: 100, height: 100},
				{top: 0, left: 0, width: 100, height: 100},			
				{top: 0, left: 0, width: 100, height: 100},
				{top: 0, left: 0, width: 100, height: 100},
				{top: 0, left: 0, width: 100, height: 100},
				{top: 0, left: 0, width: 100, height: 100}

			],
			shadows: false,
			parallax: true,
			parallaxMovement: {min: 10, max: 30},
			animation: {
				duration: 2500,
				easing: 'easeOutExpo',
				delay: 0,
				opacity: .05,
				translateZ: {min: 10, max: 25}
			},
			onReady: function() {
						segmenter.animate();
			}
		});
	})();



