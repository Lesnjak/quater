/* HELPERS */

window.requestAnimFrame = (function() {
  return window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    function(callback){
    window.setTimeout(callback, 1000 / 60);
  };
})();

function debounce(func, wait, immediate) {
  var timeout;
  return function() {
    var context = this, args = arguments;
    var later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
};

function rafThrottle(fn) {
  var busy = false;
  return function() {
    if (busy) return;
    busy = true;
    fn.apply(this, arguments);
    requestAnimFrame(function() {
      busy = false;
    });
  };
};




$(document).ready(function() {

  // Main page
  $(function () {
    
    var $mainPage = $('.js-main-page');
    var $contactsPage = $('.js-contacts-page');
    //if(!$mainPage.length && !$contactsPage.length) return;

    // Mobile detection hell
    var $mobileChecker = $(".mobile-checker");
    function isIE(v) {
      return RegExp('msie' + (!isNaN(v)?('\\s'+v):''), 'i').test(navigator.userAgent);
    };
    function isIE11Plus() {
      return !(window.ActiveXObject) && "ActiveXObject" in window;
    };

    function isTouchAvailable() {
      return 'ontouchstart' in window
        || 'onmsgesturechange' in window;
    };

    function isTouchDevice() {
      return (isTouchAvailable() && !isIE(10) && !isIE11Plus());
    };

    function isMobileLayout() {
      return isTouchDevice() || +$mobileChecker.css("opacity");
    };

    function checkIfSmallMobile() {
      return $mobileChecker.css("display") === "inline";
    }

    var isMobile = isMobileLayout();
    var isSmallMobile = checkIfSmallMobile();
    var isTouch = isTouchDevice();

    var videoSrc = "/wp-content/themes/nikoland/video/2418730.mp4";
    var isVideoAdded = false;

    function setVideoSrc() {
      var $video = $(".fs-pages__bg-video");
      if(!$video.length) return;

      $(".fs-pages__bg-video")[0].src = videoSrc;
      isVideoAdded = true;
    }
    
    if (!isMobile) setVideoSrc();

    if (isTouch) {
      $("body").addClass("is-touch");
    }

    var nua = navigator.userAgent;

    var is_android = (nua.indexOf('Mozilla/5.0') > -1 && nua.indexOf('Android ') > -1 && nua.indexOf('AppleWebKit') > -1);

    function getAndroidVersion() {
      var match = nua.match(/Android\s([0-9\.]*)/);
      return match ? match[1] : false;
    };

    var androidVersion = getAndroidVersion();

    var isOldAndroid;

    if (androidVersion) {
      isOldAndroid = parseFloat(androidVersion.slice(0,3)) < 4;
    }

    if (isOldAndroid) {
      $("body").addClass("old-android");
    }

    function checkIfOldMobileSafari() {
      var nualc = nua.toLowerCase();
      var version = nualc.match(/version[^\s]+/);
      var isIpad = nualc.match(/ipad/);
      if (!isIpad) return false;
      if (!version) return false;
      version = parseInt(version[0].slice(8), 10);
      return version <= 7;
    };

    var isOldMobileSafari = checkIfOldMobileSafari();

    if (isOldMobileSafari) {
      $("body").addClass("old-mob-safari");
    }

    var $body = $("body");
    var $window = $(window);
    var $contentInner = $(".main-content__inner");
    var winW = $window.width();
    var winH = $window.height();

    var curPage = 1;
    var numOfPages = $(".fs-page").length;
    var fsScrollTime = 1000;
    var desktopFsScrollingInitDelay = 2000;
    var fsSwipeThreshold = 30;
    var formSlideTime = 700;
    var projectOpenAT = 500;
    var scrolling = false;
    var $mainContent = $(".nikoland-main-page");
    var $fsPages = $(".fs-pages");
    var $fsCont = $(".fs-pages__cont");
    var $fsPage = $(".fs-page");
    var $projectPlaceholder = $(".project-placeholder");
    var $projectPlcInner = $(".project-placeholder__inner");
    var $projectPlcHeading = $(".project-placeholder__heading");
    var $projectContainer = $(".project-container");
    var $projectContent = $(".project-container__content");
    var $projectCloseBtn = $(".project-close-btn");
    var $bgVideoCont = $(".fs-pages__video-container");
    var $bgVideo = $(".fs-pages__bg-video");
    var $awwwards = $(".awwwards-ribbon");
    var $nikoProject = $(".niko-project");
    var $3dPageOuter = $(".fs-page__3d-content-outer");
    var $3dPage = $(".fs-page__3d-content");
    var $fullpageHeight = $(".js-fullpage-height");
    var $contactForm = $(".contact-form");
    var scrollDownVisible = true;
    var sliderInactive = true;
    var sliderSwipeActive = false;
    var parallaxPageActive = false;
    var contactFormActive = false;
    var projectActive = false;
    var noClick = false;
    var projectOpening = false;

    var $nikoPreloader = $(".nikoland-preloader");
    var preloaderRect = ".nikoland-preloader__svg-rect";
    var preloaderAT = 2; // seconds
    var preloaderFadeAT = 500;

    var $sliderCont = $(".projects-slider__cont");
    var $nikoProject = $(".niko-project");
    var nikoProjectHRatio = 0.666;
    var nikoProjectHeight;
    var sliderSidePadding;
    var realSliderWidth;
    var maxSwipeX;
    var sliderProgress = 0;
    var startX = 0;
    var sliderXPos = 0;
    var swipeDeltaX = 0;
    var swipeSpeedCoef = 1;
    var edgeSwipeSlowCoef = 0.5;
    var sliderSlideAT = 500;
    var sliderAnimating = false;
    var sliderMinScale = 0.5;
    var sliderSwipeRAF;
    var mousedDownFired = false;

    function changeDynamicSizes() {
      nikoProjectHeight = winH * nikoProjectHRatio;
      $fullpageHeight.height(winH);
      $sliderCont.css("margin-top", nikoProjectHeight / -2 + "px");
      $nikoProject.width(nikoProjectHeight);
    };

    function activateVideo() {
      if (!$bgVideo.length) return;
      $bgVideoCont.removeClass("inactive");
      $bgVideo[0].play();
    };

    function deactivateVideo() {
      if (!$bgVideo.length) return;
      $bgVideo[0].pause();
      $bgVideoCont.addClass("inactive");
    };

    if (isMobile) {
      changeDynamicSizes();
      deactivateVideo();

      $body.addClass("is-mobile");

      $(".projects-slider").removeClass("inactive");
      sliderInactive = false;

      $(document).on("mousedown", ".projects-slider__cont", sliderSwipeStart);
      sliderSwipeActive = true;
    }

    if (isSmallMobile) {
      $3dPageOuter.height($contactForm.outerHeight(true));
    }

    if ($contactsPage.length) {
      $(document).on("mousemove", ".fs-pages", parallaxBgHandler);
      parallaxPageActive = true;
    }

    function initFsScrolling(delay) {
      var delay = delay || 0;
      setTimeout(function() {
        document.addEventListener("mousewheel", fsScrollHandler);
        document.addEventListener("DOMMouseScroll", fsScrollHandler);
        document.addEventListener("keydown", fsKeydownHandler);
      }, delay);
    };

    function removeFsScrolling() {
      document.removeEventListener("mousewheel", fsScrollHandler);
      document.removeEventListener("DOMMouseScroll", fsScrollHandler);
      document.removeEventListener("keydown", fsKeydownHandler);
    };

    function switchToDesktop() {
      initFsScrolling();

      if($mainPage.length) {
        activateVideo();
      }

      $body.removeClass("is-mobile");

      if (!isVideoAdded) setVideoSrc();
    };

    function switchToMobile() {
      removeFsScrolling();

      $body.addClass("is-mobile");

      $(".fs-page.active").removeClass("active");
      $(".fs-page-1").addClass("active");
      curPage = 1;

      deactivateVideo();

      $(document).off("mousemove", ".fs-pages", parallaxBgHandler);
      parallaxPageActive = false;
    };

    function switchLayoutOnResize() {
      var newLayoutIsMobile = isMobileLayout();
      if (newLayoutIsMobile) changeDynamicSizes();
      isSmallMobile = checkIfSmallMobile();
      if (isSmallMobile) {
        $3dPageOuter.height($contactForm.outerHeight(true));
      } else {
        $3dPageOuter.attr("style", "");
      }
      if (newLayoutIsMobile === isMobile) return;
      if (newLayoutIsMobile) switchToMobile();

      if (!newLayoutIsMobile) {
        $fullpageHeight.attr("style", "");
        $sliderCont.attr("style", "");
        $nikoProject.attr("style", "");
        switchToDesktop();
      }

      isMobile = newLayoutIsMobile;
    };

    /* PRELOADER */

    function afterPreloader() {
      $nikoPreloader.addClass("finished");
      
      setTimeout(function() {
        $body.addClass("content-loaded");
        $nikoPreloader.addClass("preloader-hidden");
        $fsPages.addClass("active");

        if (!isMobile) initFsScrolling(desktopFsScrollingInitDelay);
      }, preloaderFadeAT * 1.2);      
    };

    if ($mainPage.length){
      TweenLite.set(preloaderRect, {transformOrigin: "0 50%", x: "-100%", opacity: 1});
      TweenLite.to(preloaderRect, preloaderAT, {x: "0%", onComplete: afterPreloader});
    }

    if( $('.js-about').length ){
      $body.addClass("content-loaded");
      $nikoPreloader.addClass("preloader-hidden");
      $fsPages.addClass("active");
      if (!isMobile) initFsScrolling();
    }

    var is_iPad = navigator.userAgent.match(/iPad/i) != null;

    if(is_iPad){
      $(window).bind('orientationchange', function (event) {
        if (window.matchMedia("(orientation: landscape)").matches){
          $('body').addClass('ipad');                    
        }
        else{
          $('body').removeClass('ipad');
        }
      });
      if (window.matchMedia("(orientation: landscape)").matches) {
        $('body').addClass('ipad');        
      }
    }

    /* END OF PRELOADER */

    /* FULLPAGE SCROLLING */

    function scrollPages() {
      scrolling = true;

      $fsPages.addClass("js-moving");

      TweenLite.set($fsCont, {y: (curPage - 1) * -100 + "%", force3D: true});

      $(".fs-page.active").removeClass("active");
      $(".fs-page-"+ curPage).addClass("active");

      if (curPage === 1) {
        activateVideo();
        $awwwards.removeClass("inactive");
      } else {
        deactivateVideo();
        $awwwards.addClass("inactive");
      }

      if (sliderInactive && curPage === 2) {
        $(".projects-slider").removeClass("inactive");
        sliderInactive = false;
      }

      if (scrollDownVisible && curPage === 2) {
        // $(".first-page__scroll-down").addClass("hidden");
        scrollDownVisible = false;
      }

      if (curPage == 2) {
        var projectGrid = $('.projects-grid');
        projectGrid.on("mousewheel DOMMouseScroll", function(e) {
        if (e.originalEvent.detail > 0 || e.originalEvent.wheelDelta < 0) {
        // if (e.originalEvent.deltaY > 0){
          if (projectGrid.scrollTop() + projectGrid.innerHeight() >= projectGrid[0].scrollHeight) {
            initFsScrolling();
          }
        }
        else{
          if (projectGrid.scrollTop() <= 0){            
            initFsScrolling();
          }
        }            
            
        });

        if ($mainPage.length){
          removeFsScrolling();
        }
        // $(document).on("mousedown", ".projects-slider__cont", sliderSwipeStart);
        // $(document).on("keydown", sliderKeydownHandler);
        // sliderSwipeActive = true;
      } else if (sliderSwipeActive) {
        // $(document).off("mousedown");
        // $(document).off("keydown", sliderKeydownHandler);
        // sliderSwipeActive = false;
      }

      if (curPage == 3) {
        $(document).on("mousemove", ".fs-pages", parallaxBgHandler);
        parallaxPageActive = true;
      } else if (parallaxPageActive) {
        $(document).off("mousemove", ".fs-pages", parallaxBgHandler);
        parallaxPageActive = false;
      }

      setTimeout(function() {
        $fsPages.removeClass("js-moving")
        scrolling = false;
      }, fsScrollTime);
    };

    function navigateUp() {
      if (curPage === 1) return;
      curPage--;
      scrollPages();
    };

    function navigateDown() {
      if (curPage === numOfPages) return;
      curPage++;
      scrollPages();
    };

    function fsScrollHandler(e) {
      if (scrolling) return;
      if (e.wheelDelta > 0 || e.detail < 0) {
        navigateUp();
      } else { 
        navigateDown();
      }
    };

    function fsKeydownHandler(e) {
      if (scrolling) return;
      if (e.which === 38) {
        navigateUp();
      } else if (e.which === 40) {
        navigateDown();
      }
    };

    $(document).on("click", ".first-page__scroll-down", function() {
      navigateDown();
    });

    /* END OF FS SCROLLING */

    /* LAST PAGE PARALLAX */

    var parallaxRatio = 1 / 6;

    function parallaxBgHandler(e) {
      var x = e.pageX;
      var deltaXPerc = (winW/2 - x) / winW * 100 * parallaxRatio;
      var $parallaxBg = $(".fs-page__parallax-bg-inner", this);
      TweenLite.to($parallaxBg, 0.5, {x: deltaXPerc + "%", force3D: true});
    };

    /* PROJECTS SLIDER SWIPE */

    var swipeForce3D = true;

    function calcSliderDimensions() {
      var allProjectsWidth = Math.ceil($nikoProject.width()) * $nikoProject.length;

      sliderSidePadding = parseInt($sliderCont.css("padding-left"), 10);
      realSliderWidth = allProjectsWidth + sliderSidePadding * 2;
      maxSwipeX = realSliderWidth - winW;
      var finalWidth = (isTouch) ? allProjectsWidth : realSliderWidth;
      $sliderCont.width(finalWidth + 10);
    };

    calcSliderDimensions();

    function animateSliding(x) {
      sliderAnimating = true;
      $sliderCont.addClass("with-transition");
      TweenLite.set($sliderCont, {x: x, scale: 1, force3D: swipeForce3D});

      setTimeout(function() {
        sliderXPos = x;
        sliderProgress = x / (realSliderWidth - winW);
        if (sliderProgress < -1) sliderProgress = -1;
        $sliderCont.removeClass("with-transition");
        sliderAnimating = false;
      }, sliderSlideAT);
    };

    function sliderKeydownHandler(e) {
      var projectWidth = $nikoProject.width();
      var nextPosition = sliderXPos;
      if (e.which === 37) {
        if (sliderXPos === 0) return;
        nextPosition += projectWidth;
      } else if (e.which === 39) {
        if (sliderXPos === -maxSwipeX) return;
        nextPosition -= projectWidth;
      }
      if (sliderAnimating) return;
      if (nextPosition > 0) nextPosition = 0;
      if (nextPosition < -maxSwipeX) nextPosition = -maxSwipeX;
      animateSliding(nextPosition);
    };

    function sliderSwipeStart(e) {
      mousedDownFired = true;
      e.preventDefault();
      startX =  e.pageX;

      $body.addClass("no-select");

      $(document).on("mousemove", sliderSwipe);

      $(document).on("mouseup", sliderSwipeEnd);
    };

    var sliderSwipe = rafThrottle(function(e) {
      noClick = true;
      var x = e.pageX;

      if (!x) return;

      swipeDeltaX = (x - startX) * swipeSpeedCoef;

      var xPos = sliderXPos + swipeDeltaX;
      var sliderScale = 1;
      var transformOrigin = "50% 50%";

      if (xPos > 0) {
        xPos *= edgeSwipeSlowCoef;
        sliderScale = 1 - Math.abs(xPos / winW);
        transformOrigin = "0 50%";
      }
      if (xPos < -maxSwipeX) {
        var diff = (-maxSwipeX - xPos) * edgeSwipeSlowCoef * 0.7;
        xPos = -maxSwipeX - diff;
        sliderScale = 1 - Math.abs(diff / winW);
        transformOrigin = maxSwipeX + "px 50%";
      }
      if (sliderScale < sliderMinScale) sliderScale = sliderMinScale;

      sliderProgress = xPos / (realSliderWidth - winW);

      TweenLite.set($sliderCont, {x: xPos, scale: sliderScale, transformOrigin: transformOrigin, force3D: swipeForce3D});
    });

    var sliderSwipeEnd = function(e) {
      $body.removeClass("no-select");

      $(document).off("mousemove mouseup");

      if (Math.abs(swipeDeltaX) < 5) noClick = false;

      if (!swipeDeltaX) return;

      sliderXPos += swipeDeltaX;
      if (sliderXPos > 0) animateSliding(0);
      if (sliderXPos < -maxSwipeX) animateSliding(-maxSwipeX);
      swipeDeltaX = 0;

      setTimeout(function() {
        noClick = false;
      }, 0);
    };

    function sliderAfterResize() {
      var newSliderPosition = (realSliderWidth - winW) * sliderProgress;
      animateSliding(newSliderPosition);
    };

    var resizeFn = debounce(function() {
      winW = $window.width();
      winH = $window.height();
      switchLayoutOnResize();
      calcSliderDimensions();
      sliderAfterResize();
      if (contactFormActive) {
        TweenLite.set($3dPage, {x: $contactForm.outerWidth(true) * -1, rotationY: 10, scale: 0.8});
      }
    }, 150);

    $window.on("resize", resizeFn);

    TweenLite.set($3dPage, {x: "0%", force3D: true});

    if (isOldAndroid) {
      TweenLite.set($contactForm, {x: "100%"});
    }

    $(document).on("click", ".last-page__form-button", function() {
      $fsPages.addClass("js-moving form-active");
      $(document).off("mousemove", ".fs-pages", parallaxBgHandler);
      TweenLite.set($3dPage, {x: $contactForm.outerWidth(true) * -1, rotationY: 10, scale: 0.8});
      if (isOldAndroid) {
        TweenLite.to($contactForm, formSlideTime / 1000, {x: "0%", ease: Power1.easeInOut});
      }
      contactFormActive = true;

      setTimeout(function() {
        $fsPages.removeClass("js-moving");
      }, formSlideTime);
    });

    $(document).on("click", ".contact-form__close", function() {
      $fsPages.addClass("js-moving").removeClass("form-active");
      TweenLite.set($3dPage, {x: 0, rotationY: 0, scale: 1});
      if (isOldAndroid) {
        TweenLite.to($contactForm, formSlideTime / 1000, {x: "100%", ease: Power2.easeOut});
      }
      contactFormActive = false;

      setTimeout(function() {
        $fsPages.removeClass("js-moving");
        $(document).on("mousemove", ".fs-pages", parallaxBgHandler);
      }, formSlideTime);
    });

    var emailRegexp = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;

    function addEmptyClassToInput($input) {
      $input.addClass("empty");

      setTimeout(function() {
        $input.removeClass("empty");
      }, 500);
    };

    function validateInput($input) {
      var val = $input.val();
      var len = $.trim(val).length;
      if (!len) {
        addEmptyClassToInput($input);
        return false;
      }
      if ($input.hasClass("js-val-name") && len < 2 || 
          $input.hasClass("js-val-email") && !emailRegexp.test(val) || 
          $input.hasClass("js-val-msg") && len < 3) {
        $input.addClass("invalid");
        return false;
      }
      return true;
    };

    function validateForm($form) {
      var validState = true;
      var $reqInputs = $(".js-val-req", $form);
      $reqInputs.each(function() {
        var $input = $(this);
        var inputState = validateInput($input);
        if (!inputState) {
          validState = false;
          return;
        }
      });
      return validState;
    };

    $(document).on("keyup", ".js-val-req", function() {
      $(this).removeClass("invalid");
    });
    
    var $statusMsg = $(".contact-form__status-msg");
    var successMsg = "Спасибо что связались с нами";
    var successImg = $('.contact-form__success');

    $(".contact-form").on("submit", function() {
      $statusMsg.removeClass("error");
      var $form = $(this);
      var formValid = validateForm($form);
      if (!formValid) return false;
      $form.ajaxSubmit({
        url: '/wp-admin/admin-ajax.php?action=send_contact_form',
        iframe: true,
        success: function(res) {
          res = jQuery.parseJSON(res);
          if (res.error) {
            $statusMsg.addClass("error");
            $statusMsg.text(res.message);
          } else {
            $form[0].reset();
            successImg.addClass('show');
            // $statusMsg.text(successMsg);
          }
        }
      });
      return false;
    });

    $('.contact-form__success--close').click(function (e) {
      $('.contact-form__success').removeClass('show');
    });

    function setHash(hash, hashTimer, title) {
      var title = title || "Студия Nikoland (Николэнд) – стильные адаптивные сайты от сильнейшей дизайн команды!!!!";
      setTimeout(function(){
      document.title = title;
        window.history.pushState('index', title, hash);
      }, hashTimer);
    };
  /*
    function setAndCenterPlcHeading(text) {
      var ratio = $window.width() / 1800;
      var fontSizesMin = 50;
      var def = 190;
      var newSize = Math.min(Math.max(fontSizesMin, def*ratio), def);
      $projectPlcHeading.css("font-size", newSize + "px");
      $projectPlcHeading.text(text);
      $projectPlcHeading.css("margin-top", ($projectPlcHeading.height() / -2) + "px");
    };*/

    function setPlaceholderBgImage(imgSrc) {
      $projectPlcInner.css("background-image", "url("+ imgSrc +")");
      $projectPlcInner.data("img", imgSrc);
    };

    function setPlaceholderTextAndImage($project) {
      var projectHeading = $project.data("heading");
      var projectBgImage = $project.data("bgimage");
      var plcBgImage = $projectPlcInner.data("img");

      //setAndCenterPlcHeading(projectHeading);
      if (projectBgImage !== plcBgImage) {
        setPlaceholderBgImage(projectBgImage);
      }
    };

    $(document).on("mouseenter", ".niko-project", function() {
      if (projectActive) return;
      var projectBgImage = $(this).data("bgimage");
      setPlaceholderBgImage(projectBgImage)
    });

    function addScrollDownToProject($cont) {
      var $scrollDown = $('<div class="first-page__scroll-down"></div>');
      $(".first", $cont).append($scrollDown);
      $scrollDown.css("top");
      $scrollDown.addClass("just-added");
    };
    
    function attachScrollHandlers($cont) {
      projectOpening = false;
      
      /*$cont.on("mousewheel DOMMouseScroll", function(e) {
        if (projectOpening) {
          e.preventDefault();
          return;
        }
        
        var $cont = $(this);
        var scrollTop = $cont.scrollTop();
        var maxScroll = $cont[0].scrollHeight - winH;
        
        if (e.originalEvent.wheelDelta > 0 || e.originalEvent.detail < 0) {
          if (scrollTop === 0) openPrevProject($(".prev-project"));
        } else { 
          if (scrollTop === maxScroll) openNextProject($(".next-project"));
        }
      });*/
    };

    function showLoadedProject($cont, projectName, projectTitle) {
      $mainContent.addClass("hidden");
      
      setTimeout(function() {
        $body.addClass("project-open");
        $cont.addClass("active scrollable");
        $cont.css("top");
        $projectCloseBtn.addClass("active");
        $(".project-preview--cloned").remove();
        addScrollDownToProject($cont);
        setHash(projectName, 0, projectTitle);

        setTimeout(function() {
          $(".project-container.old-project").remove();
          $projectPlaceholder.addClass("hidden");
        }, 32);

        setTimeout(function() {
          attachScrollHandlers($cont);
          $projectPlaceholder.removeClass("active");
        }, 1000);
      }, 0);
    };

    function deleteHiddenProject() {
      calcSliderDimensions();
      setHash("/", 0);
      initFsScrolling();
      $projectContent.empty();
      $projectContainer.addClass("hidden");
      $body.removeClass("project-open");
      window.terminateProjectHandlers();
      
      if (window.removeSpecificProjectHandlers) {
        window.removeSpecificProjectHandlers();
        window.removeSpecificProjectHandlers = null;
      }
      
      projectActive = false;
    };
    
    function openPrevProject($project) {
      projectOpening = true;
      
      var $oldProject = $(".project-container.active");
      var $projFirst = $(".first", $oldProject);
      var $newProject = $('<div class="project-container hidden"><div class="project-container__content"></div></div>');
      var projectName = $project.data("project");
      var projectTitle = $project.data("heading");
      var $content = $(".project-container__content", $newProject);
      
      $contentInner.append($newProject);
      $oldProject.addClass("old-project");
      $newProject.removeClass("hidden");
      
      window.terminateProjectHandlers();
      
      if (window.removeSpecificProjectHandlers) {
        window.removeSpecificProjectHandlers();
        window.removeSpecificProjectHandlers = null;
      }
      
      TweenLite.to($projFirst, projectOpenAT/1000, {y: winH, onComplete: function() {
        $content.load(projectName, function() {
          showLoadedProject($newProject, projectName, projectTitle);
        });
      }});
    };
    
    function openNextProject($project) {
      projectOpening = true;
      
      var $oldProject = $(".project-container.active");
      var $newProject = $('<div class="project-container zero-transition hidden"><div class="project-container__content"></div></div>');
      var projectName = $project.data("project");
      var projectTitle = $project.data("heading");
      var $content = $(".project-container__content", $newProject);
      
      var top = $project[0].getBoundingClientRect().top + $project.outerHeight();
     
      $('html').css('overflow','hidden');
      $contentInner.append($newProject);
    
      TweenLite.set($newProject, {y: top});
      $newProject.removeClass("hidden");

      $oldProject.addClass("old-project  project-leaving-anim");//.removeClass('scrollable');
      window.terminateProjectHandlers();
      
      if (window.removeSpecificProjectHandlers) {
        window.removeSpecificProjectHandlers();
        window.removeSpecificProjectHandlers = null;
      }

      $content.load(projectName, function() {
        setTimeout(function(){
              TweenLite.to($newProject, projectOpenAT/600, {y: 0, ease: Power2.easeIn, onComplete: function() {
                  showLoadedProject($newProject, projectName, projectTitle);
                  $newProject.removeClass('zero-transition');
                  $('html').css('overflow','');
              }});
        },300)  
      });

    };

    //$(document).on("click", ".niko-project", function(e) {
      //if (isTouch) return;
      //e.preventDefault();
      //if (noClick || projectActive) return;
      //projectActive = true;

      //var $project = $(this);
      //var projectName = $project.data("project");
      //var projectTitle = $project.data("heading");

      //setPlaceholderTextAndImage($project);
      //$projectPlaceholder.addClass("active scrollable");
      //removeFsScrolling();
      //$projectContainer.removeClass("hidden");
      //$projectContainer.removeClass("hidden").addClass('transform-helper');
		//$projectContent.load(projectName, function() {
			//$projectContainer.addClass('slide-in-right');
	      //showLoadedProject($projectContainer, projectName, projectTitle);
	    	//setTimeout(function(){
	    		//$projectContainer.removeClass('transform-helper slide-in-right');
	    	//},1300)
	    //});
      /*setTimeout(function() {
        $projectContent.load(projectName, function() {
          showLoadedProject($projectContainer, projectName, projectTitle);
        });
      }, projectOpenAT/2);*/
    //});

    $(document).on("click", ".niko-project", function (e) {
      
      if (mousedDownFired){

          if (isTouch) return;
          e.preventDefault();
          if (noClick) return;
          if (projectActive) return;
          projectActive = true;
    
          var $project = $(this);
          var projectName = $project.data("project");
    
          setPlaceholderTextAndImage($project);
    
          $projectPlaceholder.addClass("active scrollable");
          removeFsScrolling();
          $projectContainer.removeClass("hidden");
    
          
          setTimeout(function () {
            mousedDownFired = false;
            $projectContent.load(projectName, function () {
              showLoadedProject($projectContainer, projectName);
            });
          }, projectOpenAT / 2);

      }      

    });    

    $(document).on("click", ".project-close-btn", function(e) {
      // update cached references in case if project was opened from another project
      $projectContainer = $(".project-container");
      $projectContent = $(".project-container__content");

      e.preventDefault();

      $mainContent.removeClass("hidden");
      $mainContent.css("top");
      $projectContainer.removeClass("active scrollable");
      $projectCloseBtn.removeClass("active");
      $projectPlaceholder.removeClass("hidden");

      setTimeout(deleteHiddenProject, projectOpenAT);
    });

    $(document).on("click", ".project-container .pr", function(e) {
      e.preventDefault();
      
      var $oldProject = $(".project-container.active");
      var $newProject = $('<div class="project-container hidden"><div class="project-container__content"></div></div>');
      var $project = $(this);
      var projectName = $project.data("alias");
      var $dataProject = $(".niko-project[data-project="+projectName+"]");

      $projectCloseBtn.removeClass("active");
      $projectPlaceholder.removeClass("hidden");
      $projectPlaceholder.css("top");

      setPlaceholderTextAndImage($dataProject);

      $contentInner.append($newProject);

      $projectPlaceholder.addClass("active scrollable");
      $newProject.removeClass("hidden");

      setTimeout(function() {
        $(".project-container__content", $newProject).load(projectName, function() {
          showLoadedProject($newProject, projectName);
        });
      }, projectOpenAT/2);

      setTimeout(function() {
        $oldProject.remove();
      }, projectOpenAT * 1.2);
    });
    
    $(document).on("click", ".next-project", function(e) {
      e.preventDefault();
      if (projectOpening) return;
      
      var $project = $(this);
      
      openNextProject($project);
    });
    
    /* OFF-CANVAS MENU */
  
    var $contacts = $(".niko-contacts");
    var $mainContent = $(".main-content");
    var menuActive = false;
    
    $(document).on("click", ".niko-contacts", function() {
      if (menuActive) return;
      $("body").addClass("menu-active");
      deactivateVideo();
      
      setTimeout(function() {
        menuActive = true;
      }, 0);
    });
    
    $(document).on("click", function(e) {
      if (!menuActive || $(e.target).closest(".main-content__menu").length) return;
      $("body").removeClass("menu-active");
      menuActive = false;
      activateVideo();
    });
    
    $(document).on("click", ".menu__close-btn", function() {
      $("body").removeClass("menu-active");
      menuActive = false;
      activateVideo();
    });
    
    var morphAT = 0.5;
    var morphDelay = 3;
    var morphBurgerNext = true;
    
    function morphMenuBtn() {
      var nextShape = (morphBurgerNext) ? "burger" : "bird";
      morphBurgerNext = !morphBurgerNext;
      setTimeout(function() {
        TweenLite.to(".menu-btn-path", morphAT, {morphSVG: ".svg-path-"+ nextShape, delay: morphDelay, onComplete: morphMenuBtn});
      }, 0);
    };
    
    morphMenuBtn();

  });

  // Services page
  $(function () {
    var $service = $('.js-service-one');
    if(!$service.length) return;

    $service.on('click', function(){
      var $that = $(this);

      $that
        .toggleClass('_active')
        .siblings($service).removeClass('_active')
    });
  });

  // About page
  $(function () {
    var $wr = $('.js-about');
    if(!$wr.length) return;

    var $fsWr = $('.js-fs-cont');
    var $fsPage = $('.js-fs-page');

      
  });


  // contact-form

  (function(){

    $('.contact-form input[type=file]').change(function() {
      var isChange = $(this).val();
      var fileName = $(this).val().replace(/C:\\fakepath\\/i, '');

      if(isChange){
        $('.contact-form .contact-form__label').hide();
        $('.contact-form__file-name').addClass('show');
        $('.contact-form__file-name span').html('Файл: ' + fileName);
      }
    });

    $('.contact-form__file-close').click(function() {
      $('.contact-form input[type=file]').val('');
      $('.contact-form .contact-form__label').show();
      $('.contact-form__file-name').removeClass('show');
    });
    
  })();


});

