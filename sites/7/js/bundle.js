window.addEventListener("load",function(){var t,e,n,r,a,o,s,i,u,l,c,d,m,f,p,h,g,v,w,y,b,I,C,E,A,M;if(e=document.getElementById("canvas")){for(a=e.getContext("2d"),M=e.width=548,m=e.height=435,window.speed=1,window.hightSpeed=!1,window.coef=1.5,window.btnHover=!1,n={x:0,y:0},(A=function(){var t;t=e.getBoundingClientRect(),n.x=t.left,n.y=t.top})(),function(){var t;t=window.requestAnimationFrame||window.mozRequestAnimationFrame||window.webkitRequestAnimationFrame||window.msRequestAnimationFrame,window.requestAnimationFrame=t}(),c=function(t,e){return parseInt(255*Math.sin(2*Math.PI*t+e))},l=function(t,e){return parseInt(255*Math.sin(2*Math.PI/3+2*Math.PI*t+e))},s=function(t,e){return parseInt(255*Math.sin(2*Math.PI/3*2+2*Math.PI*t+e))},r=function(t,e,n){return t>n?n:t<e?e:t},i=function(t,e){return"rgb( "+parseInt((255*coef+c(t,e))/(coef+1))+", "+parseInt((255*coef+l(t,e))/(coef+1))+", "+parseInt((255*coef+s(t,e))/(coef+1))+" )"},y=[],u=function(t,e,n,r){var a,o;return a=t-e,o=n-r,Math.sqrt(a*a+o*o)},o=function(t,e){var n;return n=4*(e*M+t),y[n+3]},C=function(t,e,n,r){var a;return a=4*(n*M+e),t[a+3]=r},d=function(t,e){return Math.floor(Math.random()*(e-t))+t},f=function(t,e){var n;if(n=void 0,/^#([A-Fa-f0-9]{3}){1,2}$/.test(t))return n=t.substring(1).split(""),3===n.length&&(n=[n[0],n[0],n[1],n[1],n[2],n[2]]),n="0x"+n.join(""),"rgba("+[n>>16&255,n>>8&255,255&n].join(",")+","+e+")";throw new Error("Bad Hex")},h=document.getElementById("img"),b=100,t=function(){return this.x=d(-100,100),this.y=d(-100,10),this.size=5*Math.random(),this.speed=d(1,3),this.alpha=0,this},I=[],p=v=0;v<50;p=++v)I.push(new t);p=0,E=function(){var t,e,n,r,s,l,c,h,g,v,w,y,$,b;for(a.clearRect(0,0,M,m),a.beginPath(),y=n=0,g=M;0<=g?n<g:n>g;y=0<=g?++n:--n)a.fillStyle=i(y/M,p/(20/speed)),a.fillRect(y,0,1,m);for(a.fill(),t=a.getImageData(0,0,M,m),$=r=0,v=M;0<=v?r<v:r>v;$=0<=v?++r:--r)for(b=l=0,w=m;0<=w?l<w:l>w;b=0<=w?++l:--l)u(M/2,$,m/2+50,b)<270?C(t.data,$,b,o($,b)):C(t.data,$,b,0);for(a.putImageData(t,0,0),e=a.fillStyle,c=0,s=I.length;c<s;c++)h=I[c],h.y-=h.speed,h.y<-100&&(h.y=d(-50,10)),coef>1.5?h.y<-50?h.alpha=1-h.y/-100:h.alpha<1?h.alpha+=.05:h.alpha=1:h.alpha>0?h.alpha-=.05:h.alpha=0,h.y>-150&&h.y<10&&(a.beginPath(),a.fillStyle=f(e,h.alpha),a.arc(M/2+h.x,m/2+h.y,h.size,0,2*Math.PI),a.fill());p++,window.innerWidth>480&&requestAnimationFrame(E)},w=document.createElement("img"),w.src="img/mask2.png",w.onload=function(){var t,e;t=document.createElement("canvas"),t.width=this.width,t.height=this.height,e=t.getContext("2d"),e.drawImage(w,0,0),y=e.getImageData(0,0,this.width,this.height).data,E()},window.addEventListener("resize",function(){A()}),g=null,$(".hero .btn").on("mouseenter",function(){window.btnHover=!0,g&&clearInterval(g),g=setInterval(function(){return window.coef<5?window.coef*=1.02:clearInterval(g)},16.666)}),$(".hero .btn").on("mouseleave",function(){window.btnHover=!1,g&&clearInterval(g),g=setInterval(function(){return window.coef>1.5?window.coef/=1.02:(clearInterval(g),window.coef=1.5)},16.666)})}});var EasingFunctions;EasingFunctions={linear:function(t){return t},easeInQuad:function(t){return t*t},easeOutQuad:function(t){return t*(2-t)},easeInOutQuad:function(t){return t<.5?2*t*t:-1+(4-2*t)*t},easeInCubic:function(t){return t*t*t},easeOutCubic:function(t){return--t*t*t+1},easeInOutCubic:function(t){return t<.5?4*t*t*t:(t-1)*(2*t-2)*(2*t-2)+1},easeInQuart:function(t){return t*t*t*t},easeOutQuart:function(t){return 1- --t*t*t*t},easeInOutQuart:function(t){return t<.5?8*t*t*t*t:1-8*--t*t*t*t},easeInQuint:function(t){return t*t*t*t*t},easeOutQuint:function(t){return 1+--t*t*t*t*t},easeInOutQuint:function(t){return t<.5?16*t*t*t*t*t:1+16*--t*t*t*t*t}};var initMap,mapStyles;mapStyles=[{featureType:"all",stylers:[{hue:"#16203f"},{invert_lightness:"true"},{saturation:20}]}],initMap=function(){var t,e,n,r,a;a=new google.maps.StyledMapType(mapStyles,{name:"Styled Map"}),t=new google.maps.LatLng(49.4388402,32.0699464),n=new google.maps.Map(document.getElementById("map"),{center:t,zoom:17,disableDefaultUI:!1,scrollwheel:!1,mapTypeControlOptions:{mapTypeIds:[google.maps.MapTypeId.ROADMAP,"map_style"]}}),n.mapTypes.set("map_style",a),n.setMapTypeId("map_style"),e="img/map.svg",r=new google.maps.Marker({position:t,map:n,icon:{url:e,size:new google.maps.Size(56,56)},title:"",visible:!0}),r.setMap(n)};var $,callPopup,easing,isMenuOpened,scrollTo,waitForFinalEvent;waitForFinalEvent=function(){var t;return t={},function(e,n,r){r||(r="Don't call this twice without a uniqueId"),t[r]&&clearTimeout(t[r]),t[r]=setTimeout(e,n)}}(),isMenuOpened=!1,function(t){t.closest=t.closest||function(t){var e;for(e=this;e;){if(e.matches(t))return e;e=e.parentElement}return null}}(Element.prototype),$=function(t,e){var r;return r=[],r=e?"string"==typeof t&&e.querySelectorAll(t)?[].slice.call(e.querySelectorAll(t)):[t]:"string"==typeof t&&document.querySelectorAll(t)?[].slice.call(document.querySelectorAll(t)):[t],r.click=function(t){var e,n,a,o;for(o=[],e=0,n=r.length;e<n;e++)a=r[e],o.push(a.addEventListener("click",function(e){return t(e)}));return o},r.on=function(t,e){var n,a,o,s,i;for(n=[],n=t.match(/\s/gim)?t.split(/\s/gim):[t],i=[],a=0,o=n.length;a<o;a++)t=n[a],i.push(function(){var n,a,o;for(o=[],n=0,a=r.length;n<a;n++)s=r[n],o.push(s.addEventListener(t.replace(/(\s| )/gim),function(t){return e(t)}));return o}());return i},r.hover=function(t,e){var n,a,o,s;for(s=[],n=0,a=r.length;n<a;n++)o=r[n],o.addEventListener("mouseenter",function(e){return t(e)}),e?s.push(o.addEventListener("mouseleave",function(t){return e(t)})):s.push(void 0);return s},r.addClass=function(t){var e,n,a,o;for(o=[],e=0,n=r.length;e<n;e++)a=r[e],o.push(a.classList.add(t));return o},r.removeClass=function(t){var e,n,a,o;for(o=[],e=0,n=r.length;e<n;e++)a=r[e],o.push(a.classList.remove(t));return o},r.src=function(){var t,e,n,a;for(a=[],t=0,e=r.length;t<e;t++)n=r[t],n.getAttribute("src")?a.push(void 0):(n.setAttribute("src",n.getAttribute("data-src")),a.push(n.onload=function(){return this.classList.add("showed")}));return a},r.each=function(t){var e,n,a,o,s;for(s=[],e=n=0,a=r.length;n<a;e=++n)o=r[e],s.push(t(e,o));return s},r.hasClass=function(t){return this[0].classList.contains(t)},r.siblings=function(){var t,e,n,r,a,o,s,i,u;for(n=r=i=this.length;i<=0?r<0:r>0;n=i<=0?++r:--r)this.splice(n,1);for(t=function(t,e){var n;for(n=[];t;)1===t.nodeType&&t!==e&&n.push(t),t=t.nextSibling;return n},e=function(e){return t(e.parentNode.firstChild,e)},u=e(this[0]),a=0,o=u.length;a<o;a++)s=u[a],this.push(s);return this},r.data=function(t){return this[0].getAttribute("data-"+t)},r.val=function(t){return t?n.value=t:this[0].value},r.closest=function(t){var e,n,r,a;if(e=this[0].closest(t)){for(n=r=0,a=this.length;0<=a?r<a:r>a;n=0<=a?++r:--r)this.splice(n,1);this.push(e)}return this},r.last=function(){return this[this.length-1]},r},callPopup=function(t,e){$(e).addClass("showed"),setTimeout(function(){return $(e).addClass("active")},10)},easing={linear:function(t){return t},easeInQuad:function(t){return t*t},easeOutQuad:function(t){return t*(2-t)},easeInOutQuad:function(t){return t<.5?2*t*t:-1+(4-2*t)*t},easeInCubic:function(t){return t*t*t},easeOutCubic:function(t){return--t*t*t+1},easeInOutCubic:function(t){return t<.5?4*t*t*t:(t-1)*(2*t-2)*(2*t-2)+1},easeInQuart:function(t){return t*t*t*t},easeOutQuart:function(t){return 1- --t*t*t*t},easeInOutQuart:function(t){return t<.5?8*t*t*t*t:1-8*--t*t*t*t},easeInQuint:function(t){return t*t*t*t*t},easeOutQuint:function(t){return 1+--t*t*t*t*t},easeInOutQuint:function(t){return t<.5?16*t*t*t*t*t:1+16*--t*t*t*t*t},easeOutCirc:function(t){return Math.sqrt(1- --t*t)}},scrollTo=function(t,e,n,r){var a,o,s,i,u;return u=Date.now(),a=document.documentElement.scrollTop?document.documentElement:document.body,o=a.scrollTop,s=function(t,e){return t<e?t:e},i=function(l){var c,d,m;c=Date.now(),m=s(1,(c-u)/e),d=n(m),a.scrollTop=d*(t-o)+o,m<1?requestAnimationFrame(i):r&&r()},o===t?void r():void requestAnimationFrame(i)},window.addEventListener("load",function(){var t,e,n,r,a;$("img[data-src]").src(),$(".tabs li").click(function(t){var e;e=parseInt(t.target.closest("li").getAttribute("data-tab")),$(".tab, .tabs li").removeClass("active"),$('.tab[data-tab="'+e+'"]').addClass("active"),$('.tabs li[data-tab="'+e+'"]').addClass("active"),t.preventDefault()}),$(".input").each(function(t,e){e.addEventListener("focus",function(){return this.classList.add("active")}),e.addEventListener("blur",function(){if(""===e.value.trim())return this.classList.remove("active")})}),$(".hero .btn").hover(function(t){window.hightSpeed=!0},function(){window.hightSpeed=!1}),$(".popup-close").click(function(t){var e;e=$(t.target.closest(".popup")),e.removeClass("active"),setTimeout(function(){return e.removeClass("showed")},500)}),$("[data-scrollto]").click(function(t){var e;t.preventDefault(),e=$(t.target.closest(".btn").getAttribute("data-scrollto"))[0].getBoundingClientRect().top,scrollTo(e,2e3,easing.easeInOutQuint)}),(n=function(){var t;t=$(".main-footer")[0].getBoundingClientRect().height,$(".section").last().setAttribute("style","padding-bottom: "+((window.innerWidth>480?100:50)+t)+"px"),$(".main-footer")[0].setAttribute("style","margin-top: -"+t+"px")})(),$(window).on("resize",function(){waitForFinalEvent(function(){return n()},300,"")}),a=function(){isMenuOpened?($(".menu-col").addClass("active"),$("html,body").addClass("overlayed")):($(".menu-col").removeClass("active"),$("html,body").removeClass("overlayed"))},$(".menu-toggle-btn").click(function(t){t.preventDefault(),isMenuOpened=!isMenuOpened,a()}),$(".menu-col .close").click(function(t){t.preventDefault(),isMenuOpened=!1,a()}),t=function(t,e,n){return t<e?e:t>n?n:t},e=function(){return document.documentElement&&document.documentElement.scrollTop||document.body.scrollTop},(r=function(){var n;n=e(),$(".main-header")[0].setAttribute("style","background: rgba(23,33,65,"+t(n/400,0,1)+");")})(),$(window).on("scroll",function(){var t;t=e(),r(),0!==$(".hero-section").length&&($(".hero-section .section-title")[0].setAttribute("style","-webkit-transform: translateY("+t/2+"px); -moz-transform: translateY("+t/2+"px); -o-transform: translateY("+t/2+"px); -ms-transform: translateY("+t/2+"px); transform: translateY("+t/2+"px); opacity: "+(1-t/300)+";"),0!==$(".hero-section .subtitle").length&&$(".hero-section .subtitle")[0].setAttribute("style","-webkit-transform: translateY("+t/2.5+"px); -moz-transform: translateY("+t/2.5+"px); -o-transform: translateY("+t/2.5+"px); -ms-transform: translateY("+t/2.5+"px); transform: translateY("+t/2.5+"px); opacity: "+(1-t/300)+";"))}),$("body").removeClass("faded"),$("a[href]").on("mousedown mouseup click touchstart touchend touchmove",function(t){if(!t.target.closest("a").getAttribute("href").match(/#/gim)){if(!t.preventDefault)return t.returnValue=!1,!1;t.preventDefault(),$("body").addClass("faded"),setTimeout(function(){return location.href=t.target.closest("a").getAttribute("href")},510)}})}),window.addEventListener("load",function(){var t;$(".validate-form .input").on("keyup keydown keypress blur",function(e){var n,r,a;a=e.target,r=0,n=[],$(a).closest(".form-group").removeClass("success"),$(a).hasClass("email")&&!t($(a).val().trim())?(n[r]=!0,$(a).closest(".form-group").addClass("error")):$(a).data("mask")&&$(a).val().trim().replace(/_/gim,"").length<$(a).data("mask").length?(n[r]=!0,$(a).closest(".form-group").addClass("error")):$(a).data("minlength")&&$(a).val().trim().length<$(a).data("minlength")?(n[r]=!0,$(a).closest(".form-group").addClass("error")):""===$(a).val().trim()?(n[r]=!0,$(a).closest(".form-group").addClass("error")):(n[r]=!1,$(a).closest(".form-group").removeClass("error"),$(a).closest(".form-group").addClass("success"))}),t=function(t){var e;return e=/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,e.test(t)},$(".validate-form").on("submit",function(e){var n,r,a,o,s,i;for(r=[],o=!1,$(".input",e.target).each(function(e,n){return $(n).closest(".form-group").removeClass("success"),$(n).hasClass("email")&&!t($(n).val().trim())?(r[e]=!0,$(n).closest(".form-group").addClass("error")):$(n).data("mask")&&$(n).val().trim().replace(/_/gim,"").length<$(n).data("mask").length?(r[e]=!0,$(n).closest(".form-group").addClass("error")):$(n).data("minlength")&&$(n).val().trim().length<$(n).data("minlength")?(r[e]=!0,$(n).closest(".form-group").addClass("error")):""===$(n).val().trim()?(r[e]=!0,$(n).closest(".form-group").addClass("error")):(r[e]=!1,$(n).closest(".form-group").removeClass("error"),$(n).closest(".form-group").addClass("success"))}),a=!1,s=0,i=r.length;s<i;s++)n=r[s],n&&(a=!0);a&&e.preventDefault()})});var Validator,errorsDictionary;errorsDictionary={nameLength:"<span>Имя</span> не может быть короче двух символов!",nameIsEmpty:"Введите пожалуйста <span>Имя</span>!",phoneIsEmpty:"Введите пожалуйста <span>номер телефона</span>!",phoneLength:"Введите <span>номер телефона</span> полностью!",emailIsEmpty:"Введите пожалуйста <span>email</span>!",emailValid:"Неправильно введен <span>email</span>! <br> <span>email</span> должен соответствовать шабону: <span>username@example.com</span>",textIsEmpty:"Введите пожалуйста <span>текст сообщения</span>!",textLength:"<span>текст сообщения</span> не может быть короче 20 символов!"},Validator=function(t){var e,n,r,a,o,s;switch(e=!1,n=function(t){var e;return e=/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,e.test(t)},a=function(){var n,r;r=parseInt(t.data("minlength")),n=parseInt(t.attr("maxlength")),""===t.val().trim()?e=errorsDictionary.nameIsEmpty:t.val().trim().length<r&&(e=errorsDictionary.nameLength)},o=function(){var n,r,a,o;o=t.val().trim().replace(/(\+|_|-|\s| )/gim,""),n=t.data("mask").replace(/(\+|_|-|\s| )/gim,""),a=parseInt(t.data("minlength")),r=parseInt(t.val().trim()),""===o?e=errorsDictionary.phoneIsEmpty:o.length<n.length&&(e=errorsDictionary.phoneLength)},r=function(){var r;r=t.val().trim(),""===r?e=errorsDictionary.emailIsEmpty:n(r)||(e=errorsDictionary.emailValid)},s=function(){var n,r;n=parseInt(t.data("minlength")),r=t.val().trim(),""===r?e=errorsDictionary.textIsEmpty:r.length<n&&(e=errorsDictionary.textLength)},t.data("validate")){case"name":a();break;case"phone":o();break;case"email":r();break;case"text":s()}return e};