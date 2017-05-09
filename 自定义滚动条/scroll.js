    /* 
  * @Author: dothin前端
  * @Date:   2015-11-21 00:12:15
  * @Last Modified by:   dothin前端
  * @Last Modified time: 2015-11-21 00:29:12
  */
 ! function() {
     var EventUtil = {
         addHandler: function(obj, type, handler) {
             if (obj.addEventListener) {
                 obj.addEventListener(type, handler, false);
             } else if (obj.attachEvent) {
                 obj.attachEvent("on" + type, handler);
             } else {
                 obj["on" + type] = handler;
             }
         },
         removeHandler: function(obj, type, handler) {
             if (obj.removeEventListener) {
                 obj.removeEventListener(type, handler, false);
             } else if (obj.detachEvent) {
                 obj.detachEvent("on" + type, handler);
             } else {
                 obj["on" + type] = null;
             }
         },
         getEvent: function(event) {
             return event ? event : window.event;
         },
         getTarget: function(event) {
             return event.target || event.srcElement;
         },
         preventDefault: function(event) {
             if (event.preventDefault) {
                 event.preventDefault();
             } else {
                 event.returnValue = false;
             }
         },
         stopPropagation: function(event) {
             if (event.stopPropagation) {
                 event.stopPropagation();
             } else {
                 event.cancelBubble = true;
             }
         },
         getWheelDelta: function(event) {
             if (event.wheelDelta) {
                 return event.wheelDelta;
             } else {
                 return -event.detail * 40;
             }
         }
     };
     //tip:滚动条上面的长度可变的按钮
     //scrollBar：滚动条
     //section：内容父级
     //article：内容
     function ScrollBar(tip, scrollBar, section, article) {
         this.oTip = document.getElementById(tip);
         this.oScrollBar = document.getElementById(scrollBar);
         this.oSection = document.getElementById(section);
         this.oArticle = document.getElementById(article);
         var _this = this;
         this.init();
         this.oTip.onmousedown = function(ev) {
             _this.Down(ev);
             return false;
         };
         //给需要加滚动事件的元素加滚动事件
         EventUtil.addHandler(this.oSection, 'mousewheel', function(ev) {
             _this.onMouseWheel(ev);
         }); //ie,chrome
         EventUtil.addHandler(this.oSection, 'DOMMouseScroll', function(ev) {
             _this.onMouseWheel(ev);
         }); //ff
         EventUtil.addHandler(this.oScrollBar, 'mousewheel', function(ev) {
             _this.onMouseWheel(ev);
         }); //ie,chrome
         EventUtil.addHandler(this.oScrollBar, 'DOMMouseScroll', function(ev) {
             _this.onMouseWheel(ev);
         }); //ff
     };
     //初始化滚动条，内容不够时隐藏滚动条，滚动条按钮长度由内容长度决定
     ScrollBar.prototype.init = function() {
         if (this.oSection.offsetHeight >= this.oArticle.offsetHeight) {
             this.oScrollBar.style.display = 'none';
         } else {
             this.oTip.style.height = 100 * this.oScrollBar.offsetHeight / (this.oArticle.offsetHeight - this.oSection.offsetHeight) + 'px';
             //document.title = this.oTip.style.height;
         }
         //各浏览器行高，字体大小，字体类型，不一致，要想初始化滚动条一致，先统一样式
     };
     ScrollBar.prototype.Down = function(ev) {
         var oEvent = EventUtil.getEvent(ev);
         var _this = this;
         this.maxH = this.oScrollBar.offsetHeight - this.oTip.offsetHeight;
         this.disY = oEvent.clientY - this.oTip.offsetTop;
         document.onmousemove = function(ev) {
             _this.fnMove(ev);
             return false;
         }
         document.onmouseup = function(ev) {
             _this.Up(ev);
         }
     };
     ScrollBar.prototype.fnMove = function(ev) {
         var oEvent = EventUtil.getEvent(ev);
         var t = oEvent.clientY - this.disY;
         this.Move(t);
     };
     ScrollBar.prototype.onMouseWheel = function(ev) {
         var oEvent = EventUtil.getEvent(ev);
         this.maxH = this.oScrollBar.offsetHeight - this.oTip.offsetHeight;
         this.disY = oEvent.clientY - this.oTip.offsetTop;
         if (EventUtil.getWheelDelta(oEvent) > 0) {
             var t = this.oTip.offsetTop - 10;
             this.Move(t);
         } else {
             var t = this.oTip.offsetTop + 10;
             this.Move(t);
         }
         EventUtil.preventDefault(oEvent);
     };
     ScrollBar.prototype.Move = function(t) {
         if (t < 0) {
             t = 0;
         } else if (t > this.maxH) {
             t = this.maxH;
         }
         this.oTip.style.top = t + 'px';
         this.contentH = this.oArticle.offsetHeight - this.oSection.offsetHeight;
         this.oArticle.style.top = -this.contentH * this.oTip.offsetTop / this.maxH + 'px';
     };
     ScrollBar.prototype.Up = function(ev) {
         document.onmousemove = document.onmouseup = null;
     };
     window.ScrollBar = ScrollBar;
 }(); 