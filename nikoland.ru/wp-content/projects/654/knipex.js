(function(){
  var domPrRoot = document.querySelector('.knipex');
  var supposedScrollNodes = document.querySelectorAll('.project-container');

  var scrollContainer =  supposedScrollNodes.length  ?
                         supposedScrollNodes[supposedScrollNodes.length - 1] :
                         document.querySelector('.project-content__scroll-cont');

  function getScroll() {
      var forReturn = 0;

      if(scrollContainer === window){
        var supportPageOffset = window.pageXOffset !== undefined;
        var isCSS1Compat = ((document.compatMode || "") === "CSS1Compat");
        forReturn = supportPageOffset ?
            window.pageYOffset :
            isCSS1Compat ?
              document.documentElement.scrollTop :
              document.body.scrollTop;
      }else{
        forReturn = scrollContainer.scrollTop;
      }
      return forReturn;
  }

function getOffsets(elem) {
    var top=0, left=0
    while(elem) {
        top = top + parseFloat(elem.offsetTop)
        left = left + parseFloat(elem.offsetLeft)
        elem = elem.offsetParent        
    }
    
    return {top: Math.round(top), left: Math.round(left)}
}

	;(function () {
	  var pItem = $('.paralaxItem'),
		  scroll = getScroll();

	  onScroll();
	  scrollContainer.addEventListener('scroll', onScroll);
	  scrollContainer.addEventListener('resize', function () {
		onScroll();
	  });

	  
	  function onScroll(e) {
		scroll = getScroll();
		
		pItem.each(function(index, el) {
			var speed = $(this).attr('data-speed');
			var parent = $(this).parents('section');
			var offset = getOffsets(parent[0]).top; 
	    	if(parent.index() == 5){
	          offset = getOffsets(parent[0]).top - 600;
		    }
			if(offset < scroll){
				$(this).css('transform', 'translateY(-' + (scroll - offset) / speed +'%)');
			}
		});
	 
	  }
	  
  })();
})();