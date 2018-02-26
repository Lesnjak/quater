(function(){
  var domPrRoot = document.querySelector('.prf-icases-wr');
  var supposedScrollNodes = document.querySelectorAll('.project-container');
  var scrollContainer =  supposedScrollNodes.length ?
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
    var box = elem.getBoundingClientRect();

    var body = document.body;
    var docEl = document.documentElement;

    var scrollTop = scrollContainer == window ? (window.pageYOffset || domPrRoot.scrollTop) : scrollContainer.scrollTop;
    var scrollLeft = scrollContainer == window ? (window.pageXOffset || domPrRoot.scrollLeft) : scrollContainer.scrollLeft;



    var clientTop = docEl.clientTop || body.clientTop || 0;
    var clientLeft = docEl.clientLeft || body.clientLeft || 0;

    var top  = box.top +  scrollTop - clientTop;
    var left = box.left + scrollLeft - clientLeft;
     
    return { top: Math.round(top), left: Math.round(left) };
}

  // Parallax
  ;(function () {
      var domPlxNodes = document.querySelectorAll('.prf-icases-wr [data-plx-styles]'),
          parsedElemsData = [],
          scroll = getScroll(),
          winH = window.innerHeight;

      domPlxNodes.forEach(function(item){
        var plxStyles = JSON.parse(item.getAttribute('data-plx-styles')),
            plxSpeed = item.getAttribute('data-plx-speed');
        parsedElemsData.push({
          element: item,
          speed: plxSpeed,
          styles: plxStyles
        })
      })

      function isSeen(element) {
        if(window.getComputedStyle(element).display == 'none'){
          return false;
        }

        var offsetTop = getOffsets(element).top,
            elH = element.height,
            topCondition = scroll <= offsetTop + elH + winH,
            bottomCondition = scroll + winH >= offsetTop;

        if(!bottomCondition || !topCondition) return false;
        return true;
      }

      onScroll();
      scrollContainer.addEventListener('scroll', onScroll);
      scrollContainer.addEventListener('resize', function () {
        winW = window.width;
        onScroll();
      });

      function onScroll(e) {
        scroll = getScroll();
        parsedElemsData.forEach(function (item) {
            var elemVisible = isSeen(item.element);
            if(!elemVisible) return true;
            var actualScroll = scroll + (winH  * 0.8) - getOffsets(item.element).top;
            if(actualScroll < 0) actualScroll = 0;

            if(item.styles['margin-top']){
              var isReverse = parseInt(item.styles['margin-top']) > 0,
                cssVal = item.speed * actualScroll;

              if(isReverse){
                cssVal = cssVal * -1;
              }
              item.element.style['margin-top'] = cssVal + 'px';
            }
            if(item.styles['x'] || item.styles['y'] || item.styles['z']){
                var x = y = z = 0;
                    if(item.styles['x']){
                      x = item.speed * actualScroll;
                      parseInt(item.styles['x']) > 0 && (x = x * -1);
                    }
                    if(item.styles['y']){
                      y = item.speed * actualScroll;
                      parseInt(item.styles['y']) > 0 && (y = y * -1);
                    }
                    if(item.styles['z']){
                      z = item.speed * actualScroll;
                      parseInt(item.styles['z']) > 0 && (z = z * -1);
                    }
                item.element.style['transform'] = 'translate3d(' + x + '%, ' + y + '%, ' + z + ')';
            }
        })
      }
  })();
})();
