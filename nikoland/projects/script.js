// form js
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

var isTouch = isTouchDevice();

if (isTouch) {
  $("body").addClass("is-touch");
}
$(function(){
	
var tUrl = '[type="url"]',
		tText = '[type="text"]',
		tEmail = '[type="email"]',
		tTel = '[type="tel"]',
		tArea = 'textarea',
		req = '[required="required"]',
		subs = '[type="submit"]';
	
var $forms = $('form');


// !== placeholders, focus/blur
function setPlaceholdersAsAvalue($form) {
	$form.find('[placeholder]').each(function(){
		var plchldr = $(this).attr('placeholder');
		$(this).attr({'data-placeholder':plchldr}).val(plchldr);
	});
};

function onFocus($input) {if ($input.val() == '' || $input.val() == $input.attr('data-placeholder')){$input.val('');}};
function onBlur($input) {if ($input.val() == ''){$input.val($input.attr('data-placeholder'));}};


// !== check form
function checkFormState($form) {
	var checked = true;
	$form.find(tText+req).each(function(){
		if (!checkText($(this))) {checked = false;}
	});
	$form.find(tArea+req).each(function(){
		if (!checkArea($(this))) {checked = false;}
	});
	$form.find(tUrl+req).each(function(){
		if (!checkUrl($(this))) {checked = false;}
	});
	$form.find(tTel+req).each(function(){
		if (!checkTel($(this))) {checked = false;}
	});
	$form.find(tEmail+req).each(function(){
		if (!checkEmail($(this))) {checked = false;}
	});
	
	if (!checked) {$form.find(subs).addClass('disabled')}
	else {$form.find(subs).removeClass('disabled')}
};


function checkUrl($input) {
	var checked = true;
	if ($input !== undefined) {
		if ($input.val() == '' || $input.val() == $input.attr('data-placeholder') || $input.val().indexOf('.') == -1 || $input.val().search(/[a-zA-Z]$/) == -1) {checked = false;}
	}
	return checked;
};
function checkText($input) {
	var checked = true;
	if ($input !== undefined) {
		if ($input.val() == '' || $input.val() == $input.attr('data-placeholder')) {checked = false;}
	}	
	return checked;
};
function checkArea($area) {
	var checked = true;
	if ($area !== undefined) {
		if ($area.val() == '' || $area.val() == $area.attr('data-placeholder')) {checked = false;}
	}	
	return checked;
};
function checkTel($input) {
	var checked = true;
	if ($input !== undefined) {
		if ($input.val() == '' || $input.val() == $input.attr('data-placeholder') || $input.val().search(/[a-zA-Z]/) != -1 || $input.val().search(/[а-яА-Я]/) != -1) {checked = false;}
	}
	return checked;
};
function checkEmail($input) {
	var checked = true;
	if ($input !== undefined) {
		if ($input.val() == '' || $input.val() == $input.attr('data-placeholder') || $input.val().indexOf('@') == -1 || $input.val().indexOf('.') == -1 || $input.val().search(/[a-zA-Z]$/) == -1) {checked = false;}
	}	
	return checked;
};	
	
	
	
// !== hang it	
$forms.each(function(){
	
	function reset() {
		$('.prForm').removeClass('active').animate({'height':'0px'}, 400);
		setTimeout(function(){
		$('.f').removeClass('animated').css({'opacity':'1'});
		$('.last-message').fadeOut(0);
		$('.prFooter-button').fadeIn(0);
		$('.prForm form')[0].reset();
		}, 400);
	};
	
	function afterSend() {
		$('html').on('click', function(e){
				/*if (!$(e.target).closest('.prForm').length && !$(e.target).closest('.prFooter-button').length && $(e.target).closest('.f.animated').length) {
					reset();
				}*/
		});		
		
		setTimeout(function(){reset();}, 5000);
		
		/*if ($('html').hasClass('wl76')) {
    	$('.prForm').attr('data-height',$('.prForm').find('.prForm-wrapper').outerHeight());
			if ($('.prForm').hasClass('active')) {$('.prForm').height($('.prForm').find('.prForm-wrapper').outerHeight());}
		}	*/	
	};
	
	
	var $this = $(this);
	setPlaceholdersAsAvalue($this);
	
	$this
		.find('[data-placeholder]')
		.on('focus', function(){onFocus($(this));})
		.on('blur', function(){onBlur($(this));});
		
	$this
		.on('change', function(){checkFormState($(this))});
	
	$this.
		on('submit', function(e){
			if ($(this).find('[type="submit"]').hasClass('disabled')) {
				e.preventDefault();
				$this.find('[data-placeholder]').blur();
			}
			else {
                $.ajax({
                    type: 'POST',
                    dataType: 'json',
                    url: ajaxurl,
                    data: {
                        action: 'send_contact_form',
                        name: $('#contact-name').val(),
                        email: $('#contact-email').val(),
                        telephone: $('#contact-telephone').val(),
                        message: $('#contact-message').val(),
                    },
                    success: function(data){
                        var tm = 300;
                        //$this.find('.f').fadeOut(tm);
                        $this.find('.f').animate({'opacity':'0'}, tm).addClass('animated');
                        $this.find('.last-message').delay(tm).fadeIn(tm);
                        afterSend();
                    }
                });
                e.preventDefault();
				var tm = 300
				$('.last-button').fadeOut(tm);
				$this.find('.f').animate({'opacity':'0'}, tm).addClass('animated');
				$this.find('.last-message').delay(tm).fadeIn(tm);
				afterSend();
			}
		});	
		
	$this.find(req).each(function(){
		$(this).on('keydown', function(){checkFormState($(this).parents('form'))});
	});	
			
	checkFormState($this);
});	


// !== decarations
$(tEmail+req).blur(function(){if ($(this).val().indexOf('@') == -1 || $(this).val().indexOf('.') == -1 || $(this).val().search(/[a-zA-Z]$/) == -1) {$(this).addClass('required')}});
$(tTel+req).blur(function(){if($(this).val().search(/[a-zA-Z]/) != -1 || $(this).val().search(/[а-яА-Я]/) != -1 || $(this).val() == '') {$(this).addClass('required')}});
$(tText+req).blur(function(){if ($(this).val() == $(this).attr('data-placeholder')) {$(this).addClass('required')}});
$(tArea+req).blur(function(){if ($(this).val() == $(this).attr('data-placeholder')) {$(this).addClass('required')}});
$(req).focus(function(){$(this).removeClass('required')});
	
});

// input mask
(function(a){"function"===typeof define&&define.amd?define(["jquery"],a):"object"===typeof exports?a(require("jquery")):a(window.jQuery||window.Zepto)})(function(a){var z=function(b,d,e){b=a(b);var g=this,l=b.val(),m;d="function"===typeof d?d(b.val(),void 0,b,e):d;var c={invalid:[],getCaret:function(){try{var k,r=0,a=b.get(0),f=document.selection,c=a.selectionStart;if(f&&-1===navigator.appVersion.indexOf("MSIE 10"))k=f.createRange(),k.moveStart("character",b.is("input")?-b.val().length:-b.text().length),
r=k.text.length;else if(c||"0"===c)r=c;return r}catch(d){}},setCaret:function(k){try{if(b.is(":focus")){var r,a=b.get(0);a.setSelectionRange?a.setSelectionRange(k,k):a.createTextRange&&(r=a.createTextRange(),r.collapse(!0),r.moveEnd("character",k),r.moveStart("character",k),r.select())}}catch(c){}},events:function(){b.on("keyup.mask",c.behaviour).on("paste.mask drop.mask",function(){setTimeout(function(){b.keydown().keyup()},100)}).on("change.mask",function(){b.data("changed",!0)}).on("blur.mask",
function(){l===b.val()||b.data("changed")||b.trigger("change");b.data("changed",!1)}).on("keydown.mask, blur.mask",function(){l=b.val()}).on("focus.mask",function(k){!0===e.selectOnFocus&&a(k.target).select()}).on("focusout.mask",function(){e.clearIfNotMatch&&!m.test(c.val())&&c.val("")})},getRegexMask:function(){for(var k=[],b,a,c,e,h=0;h<d.length;h++)(b=g.translation[d.charAt(h)])?(a=b.pattern.toString().replace(/.{1}$|^.{1}/g,""),c=b.optional,(b=b.recursive)?(k.push(d.charAt(h)),e={digit:d.charAt(h),
pattern:a}):k.push(c||b?a+"?":a)):k.push(d.charAt(h).replace(/[-\/\\^$*+?.()|[\]{}]/g,"\\$&"));k=k.join("");e&&(k=k.replace(new RegExp("("+e.digit+"(.*"+e.digit+")?)"),"($1)?").replace(new RegExp(e.digit,"g"),e.pattern));return new RegExp(k)},destroyEvents:function(){b.off("keydown keyup paste drop blur focusout ".split(" ").join(".mask "))},val:function(k){var a=b.is("input")?"val":"text";if(0<arguments.length){if(b[a]()!==k)b[a](k);a=b}else a=b[a]();return a},getMCharsBeforeCount:function(a,b){for(var c=
0,f=0,e=d.length;f<e&&f<a;f++)g.translation[d.charAt(f)]||(a=b?a+1:a,c++);return c},caretPos:function(a,b,e,f){return g.translation[d.charAt(Math.min(a-1,d.length-1))]?Math.min(a+e-b-f,e):c.caretPos(a+1,b,e,f)},behaviour:function(b){b=b||window.event;c.invalid=[];var e=b.keyCode||b.which;if(-1===a.inArray(e,g.byPassKeys)){var d=c.getCaret(),f=c.val().length,p=d<f,h=c.getMasked(),l=h.length,n=c.getMCharsBeforeCount(l-1)-c.getMCharsBeforeCount(f-1);c.val(h);!p||65===e&&b.ctrlKey||(8!==e&&46!==e&&(d=
c.caretPos(d,f,l,n)),c.setCaret(d));return c.callbacks(b)}},getMasked:function(b){var a=[],l=c.val(),f=0,p=d.length,h=0,m=l.length,n=1,q="push",v=-1,u,x;e.reverse?(q="unshift",n=-1,u=0,f=p-1,h=m-1,x=function(){return-1<f&&-1<h}):(u=p-1,x=function(){return f<p&&h<m});for(;x();){var y=d.charAt(f),w=l.charAt(h),t=g.translation[y];if(t)w.match(t.pattern)?(a[q](w),t.recursive&&(-1===v?v=f:f===u&&(f=v-n),u===v&&(f-=n)),f+=n):t.optional?(f+=n,h-=n):t.fallback?(a[q](t.fallback),f+=n,h-=n):c.invalid.push({p:h,
v:w,e:t.pattern}),h+=n;else{if(!b)a[q](y);w===y&&(h+=n);f+=n}}b=d.charAt(u);p!==m+1||g.translation[b]||a.push(b);return a.join("")},callbacks:function(a){var g=c.val(),m=g!==l,f=[g,a,b,e],p=function(a,b,c){"function"===typeof e[a]&&b&&e[a].apply(this,c)};p("onChange",!0===m,f);p("onKeyPress",!0===m,f);p("onComplete",g.length===d.length,f);p("onInvalid",0<c.invalid.length,[g,a,b,c.invalid,e])}};g.mask=d;g.options=e;g.remove=function(){var a=c.getCaret();c.destroyEvents();c.val(g.getCleanVal());c.setCaret(a-
c.getMCharsBeforeCount(a));return b};g.getCleanVal=function(){return c.getMasked(!0)};g.init=function(d){d=d||!1;e=e||{};g.byPassKeys=a.jMaskGlobals.byPassKeys;g.translation=a.jMaskGlobals.translation;g.translation=a.extend({},g.translation,e.translation);g=a.extend(!0,{},g,e);m=c.getRegexMask();!1===d?(e.placeholder&&b.attr("placeholder",e.placeholder),b.attr("autocomplete","off"),c.destroyEvents(),c.events(),d=c.getCaret(),c.val(c.getMasked()),c.setCaret(d+c.getMCharsBeforeCount(d,!0))):(c.events(),
c.val(c.getMasked()))};g.init(!b.is("input"))};a.maskWatchers={};var B=function(){var b=a(this),d={},e=b.attr("data-mask");b.attr("data-mask-reverse")&&(d.reverse=!0);b.attr("data-mask-clearifnotmatch")&&(d.clearIfNotMatch=!0);"true"===b.attr("data-mask-selectonfocus")&&(d.selectOnFocus=!0);if(A(b,e,d))return b.data("mask",new z(this,e,d))},A=function(b,d,e){e=e||{};var g=a(b).data("mask"),l=JSON.stringify;b=a(b).val()||a(b).text();try{return"function"===typeof d&&(d=d(b)),"object"!==typeof g||l(g.options)!==
l(e)||g.mask!==d}catch(m){}};a.fn.mask=function(b,d){d=d||{};var e=this.selector,g=a.jMaskGlobals,l=a.jMaskGlobals.watchInterval,m=function(){if(A(this,b,d))return a(this).data("mask",new z(this,b,d))};a(this).each(m);e&&""!==e&&g.watchInputs&&(clearInterval(a.maskWatchers[e]),a.maskWatchers[e]=setInterval(function(){a(document).find(e).each(m)},l));return this};a.fn.unmask=function(){clearInterval(a.maskWatchers[this.selector]);delete a.maskWatchers[this.selector];return this.each(function(){var b=
a(this).data("mask");b&&b.remove().removeData("mask")})};a.fn.cleanVal=function(){return this.data("mask").getCleanVal()};a.applyDataMask=function(){a(document).find(a.jMaskGlobals.maskElements).filter(q.dataMaskAttr).each(B)};var q={maskElements:"input,td,span,div",dataMaskAttr:"*[data-mask]",dataMask:!0,watchInterval:300,watchInputs:!0,watchDataMask:!1,byPassKeys:[9,16,17,18,36,37,38,39,40,91],translation:{0:{pattern:/\d/},9:{pattern:/\d/,optional:!0},"#":{pattern:/\d/,recursive:!0},A:{pattern:/[a-zA-Z0-9]/},
S:{pattern:/[a-zA-Z]/}}};a.jMaskGlobals=a.jMaskGlobals||{};q=a.jMaskGlobals=a.extend(!0,{},q,a.jMaskGlobals);q.dataMask&&a.applyDataMask();setInterval(function(){a.jMaskGlobals.watchDataMask&&a.applyDataMask()},q.watchInterval)});




$(function(){

	var is_touch_device = 'ontouchstart' in document.documentElement;
	var ua = navigator.userAgent.toLowerCase();
	var isAndroid = ua.indexOf("android") > -1; //&& ua.indexOf("mobile");
	var is_windows_touch = false;
	if (navigator.userAgent.toLowerCase().indexOf("windows phone") != -1) {is_windows_touch = true;}
	
	if (is_touch_device) {$('html').addClass('touch');}
	if (is_windows_touch) {$('html').addClass('wp');}
	if (isAndroid) {$('html').addClass('android');}
	
	
	// ! width
	
	var $html = $('html');
		
  function removeWidthClasses(elem) {
    elem.removeClass('wg19 w7613 wl76 w1600');
  };
  
  function setWidthClasses() {
    var w = $html.width();
    if (w > 1600) {removeWidthClasses($html);$html.addClass('wg19 w1600')}
    if (w <= 1600 && w > 1100) {removeWidthClasses($html);$html.addClass('wg19')}
    else if (w <= 1100 && w > 600) {removeWidthClasses($html);$html.addClass('w7613')}
    else if (w <= 600) {removeWidthClasses($html);$html.addClass('wl76')}
  };	
  
  setWidthClasses();
	
	
	// ! height classes
	
	function removeHeightClasses(elem) {
    elem.removeClass('hg50 h3050 hl30');
  };
  
  var windowHeight = 0;
  
  function setHeightClasses() {
    var h = $(window).height();
    windowHeight = h;
    if (h > 500) {removeHeightClasses($html);$html.addClass('hg50')}
    else if (h <= 500 && h > 300) {removeHeightClasses($html);$html.addClass('h3050')}
    else {removeHeightClasses($html);$html.addClass('hl30')}
  };	
  
  setHeightClasses();
	
	// ! first screen
	
	var $firstScreenEls = $('.first, .first-helper');
		
  function setH() {
    $firstScreenEls.height($(window).height());
    $('.first').css({'background-position':'cover'});
  };
  
  setH();
	//$(window).load(function(){firstScreen();});
	
	
	
	// ! fonts
	
	var $fontSizesEls = $('.first h1, .project-preview__heading'),
      fontSizesMin = 50;
      
  function setDefaultFontSize($e) {
    //var def = parseInt($e.css('font-size'));
    var def = 100;
    $e.attr({'data-defaultsize':def}).css({'line-height':'1.05em'});
  };		
  
  function fontSizesSetSize($e) {
    var ratio = $(window).width() / 1800; //1500
    var def = parseInt($e.attr('data-defaultsize'));
    var newSize = Math.min(Math.max(fontSizesMin, def*ratio), def);
    $e.css({'font-size':newSize+'px'});
  };
  
  
  $fontSizesEls.each(function(){
    setDefaultFontSize($(this));
    fontSizesSetSize($(this));
  });
  
  $fontSizesEls.each(function(){fontSizesSetSize($(this));});
	
	
	// ! offset
	
	var $offsetEls = $('.first h1, .project-preview__heading');
		
  /*function setOffsets() {
    $offsetEls.each(function(){
      var $t = $(this);
      $t.css({'margin-top':'-'+($t.height()/2)+'px'});
    });
  };*/
  
  //setOffsets();
	
	
	// ! scroll
	
	var parallaxInited = false;
		
	var parallaxAllow = true;
  var totallyScrolled = 0;
  
  var parallaxDivider = 2.5;
  if (is_touch_device || isAndroid || is_windows_touch) {
    $('.first-helper').remove();
    $('.first').css({'position':'relative'});
    parallaxAllow = false;
  }

  function coverFixedBlock(fixedBlock, e) {
    if (parallaxAllow) {
      totallyScrolled = $(e.target).scrollTop()/parallaxDivider;
      if (totallyScrolled*parallaxDivider > windowHeight) return;
      $(fixedBlock).css('margin-top', totallyScrolled+'px');
    }
  };
  
  function returnDefault() {
    $(fixedBlock).css({'margin-top': 0, 'position':'relative'});
    $('.first-helper').hide();
  };
  
  function parallaxInit() {
    if ($(window).height() > 500) {
      parallaxAllow = true;
      $('.first-helper').show();
    }
    else {
      parallaxAllow = false;
      returnDefault();
    }
  };
  
  
  //init();

  /*$(window).resize(function(){
    init();
  });*/
	
	// ! other projs
	// здесь вот и будем менять на 4 штуки
	
	var $otherProjects = $('.otherProjects .pr'),
      otherProjectsMin = 25;
  
  function otherProjectsSetDefault() {$('.otherProjects .pr-title').attr('data-def', parseInt($('.otherProjects .pr-title').css('font-size')));};
  
  function otherProjectsSetSizes() {
    $otherProjects.each(function(){
      var divider = 3;
      if ($('html').hasClass('w1600')) {divider = 4;}
      else if ($('html').hasClass('w7613')) {divider = 2;}
      else if ($('html').hasClass('wl76')) {divider = 1;}
      var wh = $('.otherProjects .inside').width()/divider - 30;
      var ratio = $(window).width()/1600;
      if (ratio >= 1) {ratio /= 1.6}
      else if (ratio >= 0.7) {ratio /= 1.3;}
      var def = parseInt($(this).find('.pr-title').attr('data-def'));
      $(this).width(wh).height(wh).find('.pr-title').css({'font-size': Math.min(def, Math.max(otherProjectsMin, def*ratio))+'px', 'line-height':'1.1em'});
    });
  }
  
  
  otherProjectsSetDefault();
  otherProjectsSetSizes();
	
	
	
	// ! set logo position
	
	function setLogoPosition() {
		
		var $logo = $('.toremove-logo'),
				$conts = $('.conts'),
				$clsr = $('.toremove-logo--closer'),
				$pclsr = $('.toremove-closer');
				
		if (is_touch_device || is_windows_touch || isAndroid || $('html').hasClass('wl76')) {return false}
		
		var offset = Math.round(Math.min($(window).width() * 0.02, 40));
		$logo.css({'top':Math.round(offset/2.5)+'px', 'left':offset+'px'});
		$clsr.css({'top':Math.round(offset/2.5)+'px', 'left':offset+'px'});
		$pclsr.css({'top':Math.round(offset/2.5)+'px', 'left':offset+'px'});
		$conts.css({'top':Math.round(offset/2.5)+'px', 'left':offset+'px'});
	};
	
	setLogoPosition();
	
	
	
	// ! contacts
	
	function contacts() {
		var $conlink = $('.toremove-logo');
		if (!$conlink.length) {return false;}
		
		var $conts = $('.conts'),
				$closer = $('.toremove-logo--closer'),
				$log = $('.toremove-logo'),
				$othercloser = $('.conts-closer'),
				time = 200;
		
		$conlink.on('click', function(e){
			e.preventDefault();
		
			if ($(this).hasClass('active')) {
				$conts.fadeOut(time);
				$closer.fadeOut(time).removeClass('rotateCloser');
				$log.fadeIn(time);
				$conlink.removeClass('active');
				
			}
			else {
				$conts.fadeIn(time);
				$log.fadeOut(time);
				$closer.fadeIn(time).addClass('rotateCloser');
				$conlink.addClass('active');
				$('.toremove-closer').css({'z-index':'22'});
			}	
			
		});
		
		function close(e) {
			e.preventDefault();
			$conts.fadeOut(time);
			$closer.fadeOut(time).removeClass('rotateCloser');
			$log.fadeIn(time);
			$conlink.removeClass('active');
			setTimeout(function(){$('.toremove-closer').css({'z-index':'910'});}, time);
		};
		
		$othercloser.on('click', function(e){
			close(e);
		});
		
		$closer.on('click', function(e){
			close(e);
		});
		
	};
	
	contacts();
	
	
	
	/* NEW-NEW-NEW */
	
	$('#contact-telephone').val('').mask('+7 (000) 000-00-00', {
    placeholder: 'Телефон'
  });
  
  
  var $form = $('.prForm'),
      formTime = 400;
  
  function setAttr() {
    $form.attr('data-height',$form.find('.prForm-wrapper').outerHeight());
    if ($form.hasClass('active')) {$form.height($form.find('.prForm-wrapper').outerHeight());}
  };
  
  function hideFormClickHandler(e) {
    if (!$(e.target).closest('.prForm').length && !$(e.target).closest('.prFooter-button').length && !$('.f.animated').length) {hideForm(formTime, $('.prFooter-button'))}
    $('html').off('click', hideFormClickHandler);
  };
  
  function showForm($button) {
    $form.addClass('active').animate({'height':$form.attr('data-height')+'px'}, formTime);
    $button.fadeOut(formTime);
    $('html, body').animate({scrollTop: 100000000}, formTime);
    $form.find('input:first').focus();
    
    $('html').on('click', hideFormClickHandler);
  };
  
  function hideForm(t, $button) {
    if ($button) {$button.fadeIn(formTime);}
    $form.removeClass('active').animate({'height':'0px'}, t);
  };
  
  
  setAttr();
  hideForm(0);
  
  $('.prFooter-button').on('click', function(e){
    e.preventDefault();
    if ($html.hasClass('wl76') || isTouch) {
      if ($form.hasClass('active')) {hideForm(formTime, $('.prFooter-button'));}
      else {showForm($('.prFooter-button'));}
    } else {
      $(".project-footer").addClass("form-active");
    }
  });
  
  $(".project-form__close").on("click", function() {
    $(".project-footer").removeClass("form-active");
  });
  
  var emailRegexp = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;

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

  $(".project-form .js-val-req").on("keyup", function() {
    $(this).removeClass("invalid");
  });
  
  var $statusMsg = $(".project-form__status-msg");
  var successMsg = "Спасибо что связались с нами";

  $(".project-form").submit(function() {
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
          $statusMsg.text(successMsg);
        }
      }
    });
    return false;
  });
  
  function projectResizeHandler() {
    setWidthClasses();
    setHeightClasses();
    setH();
    $fontSizesEls.each(function(){fontSizesSetSize($(this));});
    //setOffsets();
    otherProjectsSetSizes();
    setLogoPosition();
    setAttr();
  };
  
  function projectLoadHandler() {
    //setOffsets();
  };
  
  function projectScrollHandler(e) {
    coverFixedBlock('.first', e);
  };
  
  $(window).on("resize", projectResizeHandler);
  $(window).on("load", projectLoadHandler);
  $(window).on("scroll", projectScrollHandler);
  $(".project-container, .project-content__scroll-cont").on("scroll", projectScrollHandler);
  
  window.terminateProjectHandlers = function() {
    $(window).off("resize", projectResizeHandler);
    $(window).off("load", projectLoadHandler);
    $(window).off("scroll", projectScrollHandler);
    $(".project-container").off("scroll", projectScrollHandler);
  };
  
  /* OFF-CANVAS MENU */
  
  var $contacts = $(".project-menu-btn");
  var $mainContent = $(".project-content");
  var menuActive = false;
  
  $(document).on("click", ".project-menu-btn", function() {
    if (menuActive) return;
    $(this).closest(".project-content").addClass("menu-active");
    
    setTimeout(function() {
      menuActive = true;
    }, 0);
  });
  
  $(document).on("click", function(e) {
    if (!menuActive || $(e.target).closest(".project-content__menu").length) return;
    $(".project-content.menu-active").removeClass("menu-active");
    menuActive = false;
  });
  
  $(document).on("click", ".project-menu__close-btn", function() {
    $(this).closest(".project-content").removeClass("menu-active");
    menuActive = false;
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
  
  var projectOpening = false;
  var projectOpenAT = 500;
  var $scrollCont = $(".project-content__scroll-cont");
  
  function setHash(hash, hashTimer, title) {
    var title = title || "Студия Nikoland (Николэнд) – стильные адаптивные сайты от сильнейшей дизайн команды!!!!";
    setTimeout(function(){
      document.title = title;
      window.history.pushState('index', title, hash);
    }, hashTimer);
  };
  
  function addScrollDownToProject($cont) {
    var $scrollDown = $('<div class="first-page__scroll-down"></div>');
    $(".first", $cont).append($scrollDown);
    $scrollDown.css("top");
    $scrollDown.addClass("just-added");
  };
  /*
  function attachScrollHandlers($cont, removeAfter) {
    if (isTouch) return;
    projectOpening = false;
    
    $cont.on("mousewheel DOMMouseScroll", function(e) {
      if (projectOpening) {
        e.preventDefault();
        return;
      }
      
      var $cont = $(this);
      var scrollTop = $cont.scrollTop();
      var maxScroll = $cont[0].scrollHeight - $(window).height();
      
      if (e.originalEvent.wheelDelta > 0 || e.originalEvent.detail < 0) {
        if (scrollTop === 0) {
          openPrevProject($(".prev-project"));
          if (removeAfter) $cont.off("mousewheel DOMMouseScroll");
        }
        
      } else { 
        if (scrollTop === maxScroll) {
          openNextProject($(".next-project"));
          if (removeAfter) $cont.off("mousewheel DOMMouseScroll");
        }
      }
    });
  };*/
  
  function showLoadedProject($cont, projectName, title,callbacks) {
    //$mainContent.addClass("hidden");
    
    setTimeout(function() {
      //$body.addClass("project-open");
      $cont.addClass("active scrollable");
      $cont.css("top");
      //$projectCloseBtn.addClass("active");
      //$(".project-preview--cloned").remove();
      addScrollDownToProject($cont);
      setHash(projectName, 0, title);
      $(".old-project-cont").remove();
      projectOpening = false;
	/*
      setTimeout(function() {
        attachScrollHandlers($cont);
      }, 1000);*/
    }, 0);
  };
  
  function openPrevProject($project) {
    projectOpening = true;
    
    var $oldProject = $(".project-container.active, .project-content__main");
    //var $projFirst = $(".project-content__main .first");
    var $newProject = $('<div class="project-container hidden"><div class="project-container__content"></div></div>');
    var projectName = $project.data("project");
    var projectTitle = $project.data("heading");
    var $content = $(".project-container__content", $newProject);
    
    $scrollCont.append($newProject);
    $oldProject.addClass("old-project-cont");
    $newProject.removeClass("hidden").addClass('new-project');
    
    window.terminateProjectHandlers();
      
    if (window.removeSpecificProjectHandlers) {
      window.removeSpecificProjectHandlers();
      window.removeSpecificProjectHandlers = null;
    }
    /*
    TweenLite.to($projFirst, projectOpenAT/1000, {y: $(window).height(), onComplete: function() {
      $(".unique-project-css").remove();
      $content.load(projectName, function() {
        showLoadedProject($newProject, projectName, projectTitle);
      });
    }});*/
    setTimeout(function (argument) {
		$(".unique-project-css").remove();
		$content.load(projectName, function() {
        	showLoadedProject($newProject, projectName, projectTitle);
		});
    }, projectOpenAT/1000)
  };
  
  function openNextProject($project) {
    
    projectOpening = true;
    
    var $oldProject = $(".project-container.active, .project-content__main");
    var $newProject = $('<div class="project-container zero-transition project-container--in-scroll-cont hidden"><div class="project-container__content"></div></div>');
    var projectName = $project.data("project");
    var projectTitle = $project.data("heading");
    var $content = $(".project-container__content", $newProject);
    
    var top = $project[0].getBoundingClientRect().top + $project.outerHeight();

    //$('html').css('overflow','hidden');

    $oldProject.addClass("old-project-cont project-leaving-anim");
    $scrollCont.addClass('no-scroll');

    $scrollCont.append($newProject);
    TweenLite.set($newProject, {y: top});

    $newProject.removeClass("hidden");
     
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
			       		//$newProject.removeClass('loading');
			  			//$(".unique-project-css").eq(0).remove();
              window.location=projectName;
		      	}});
	  	},300)	
    });
    
  };
  
  function nextProjectClickHandler(e) {
    if (isTouch) return;
    e.preventDefault();
    if (projectOpening) return;
    
    var $project = $(this);
    
    //$scrollCont.off("mousewheel DOMMouseScroll");
    
    openNextProject($project);
  };
  
  if (!$(".project-container").length) {
    morphMenuBtn();
    $(document).on("click", ".next-project", nextProjectClickHandler);
    projectOpening = false;
    // attachScrollHandlers($scrollCont, true);
  }
  
  
});