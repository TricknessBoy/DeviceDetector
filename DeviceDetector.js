/**
*	打开页面所使用的终端信息  TricknessBoy 2016/12/08
**/
;(function(win, doc, undefined){
    "use strict";
    var deviceDetector,
        previousDevice,
        u,
        app,
        userAgent,
        television,
        language,
        orientationEvent,
        handleOrientation,
        strHandleOrientation,
        find;

    previousDevice = win.deviceDetector;
    deviceDetector = {};

    win.deviceDetector = deviceDetector;

    u = win.navigator.userAgent;
    app = win.navigator.appVersion;
    userAgent = u.toLocaleLowerCase();
    language = (win.navigator.browserLanguage || win.navigator.language).toLowerCase();

    /**======deviceDetector main function======**/
    //终端设备信息
    deviceDetector.infos = function() {
        return u;
    };

    //支持语言
    deviceDetector.lan = function() {
        return language;
    };

    //ios系统
    deviceDetector.ios = function() {
        return this.iphone() || this.ipod() || this.ipad();
    };

    deviceDetector.iphone = function(){
        return !this.windows() && find('iphone');
    };

    deviceDetector.ipod = function(){
        return find('ipod');
    };

    deviceDetector.ipad = function () {
        return find('ipad');
    };

    //android系统
    deviceDetector.android = function () {
        return !this.windows() && find('android');
    };

    deviceDetector.androidPhone = function () {
        return this.android() && find('mobile');
    };

    deviceDetector.androidTablet = function () {
        return this.android() && !find('mobile');
    };

    deviceDetector.blackberry = function () {
        return find('blackberry') || find('bb10') || find('rim');
    };

    deviceDetector.blackberryPhone = function () {
        return this.blackberry() && !find('tablet');
    };

    deviceDetector.blackberryTablet = function () {
        return this.blackberry() && find('tablet');
    };

    //windows系统
    deviceDetector.windows = function(){
        return find('windows');
    };

    deviceDetector.windowsPhone = function () {
        return this.windows() && find('phone');
    };

    deviceDetector.windowsTablet = function () {
        return this.windows() && (find('touch') && !this.windowsPhone());
    };

    deviceDetector.fxos = function () {
        return (find('(mobile;') || find('(tablet;')) && find('; rv:');
    };

    deviceDetector.fxosPhone = function () {
        return this.fxos() && find('mobile');
    };

    deviceDetector.fxosTablet = function () {
        return this.fxos() && find('tablet');
    };

    deviceDetector.meego = function () {
        return find('meego');
    };

    deviceDetector.cordova = function () {
        return win.cordova && location.protocol === 'file:';
    };

    deviceDetector.nodeWebkit = function () {
        return typeof win.process === 'object';
    };

    //Mac系统
    deviceDetector.Mac = function(){
        return find('mac');  //Mac
    };

    //Linux系统
    deviceDetector.Linux = function(){
        return find('linux');  //linux
    };

    //是否是手机
    deviceDetector.mobile = function () {
        return this.androidPhone() || this.iphone() || this.ipod() || this.windowsPhone() || this.blackberryPhone() || this.fxosPhone() || this.meego();
    };

    //是否是平板
    deviceDetector.tablet = function () {
        return this.ipad() || this.androidTablet() || this.blackberryTablet() || this.windowsTablet() || this.fxosTablet();
    };

    //是否是电脑
    deviceDetector.desktop = function () {
        return !this.tablet() && !this.mobile();
    };

    //是否是电视机
    deviceDetector.television = function() {
        var i, tvString;
        television = ["googletv","viera","smarttv","internet.tv","netcast","nettv","appletv","boxee", "kylo","roku","dlnadoc","roku","pov_tv","hbbtv","ce-html"];
        i = 0;
        while (i < television.length) {
            if (find(television[i])) {
                return true;
            }
            i++;
        }
        return false;
    };

    //浏览器检测
    deviceDetector.trident = function(){
        return find('trident');//IE内核
    };
    deviceDetector.presto = function(){
        return find('presto');//opera内核
    };
    deviceDetector.webKit = function(){
        return find('applewebkit');//苹果、谷歌内核
    };
    deviceDetector.gecko = function(){
        return find('gecko') && !find('khtml');//火狐内核
    };
    deviceDetector.webApp = function(){
        return !find('safari');//是否web应该程序，没有头部与底部
    };

    deviceDetector.safri = function(){
        return this.webKit() && find('gecko') && !find('chrome');
    };
    deviceDetector.chorme = function(){

        return this.webKit() && find('gecko') && find('chrome') && !find('opr');
    };
    deviceDetector.opera = function(){
        return this.webKit() && find('gecko') && find('chrome') && find('opr');
    };
    deviceDetector.firefox = function(){
        return this.gecko() && find('firefox');
    };
    deviceDetector.IEEdge = function(){
        return this.trident() && find('gecko');
    };
    deviceDetector.IE10 = function(){
        return this.trident() && find('msie 10.0');
    };
    deviceDetector.IE9 = function(){
        return this.trident() && find('msie 9.0');
    };
    deviceDetector.IE8 = function(){
        return this.trident() && find('msie 8.0');
    };
    deviceDetector.IE7= function(){
        return this.trident() && find('msie 7.0');
    };
    deviceDetector.IE6 = function(){
        return this.trident() && find('msie 6.0');
    };

    //竖屏、横屏
    deviceDetector.HandleOrientation = function () {
        if(!deviceDetector.desktop()){
            if(win.orientation == 180 || win.orientation==0){
                strHandleOrientation = "portrait";
            }
            if(win.orientation == 90 || win.orientation == -90){
                strHandleOrientation = "landscape";
            }
            return strHandleOrientation;
			//deviceDetector.HandleOrientationState = strHandleOrientation;
        }else{
            return undefined;
        }
    };

    //是否支持canvas
    deviceDetector.canvas = function(){
        return !! win.CanvasRenderingContext2D;
    };

    //是否支持webgl
    deviceDetector.webgl = function(){
        return (function () {
            try {
                var canvas = document.createElement( 'canvas' );
                return !! ( window.WebGLRenderingContext && ( canvas.getContext( 'webgl' ) || canvas.getContext( 'experimental-webgl' ) ) );
            }catch ( e ) {
                return false;
            }
        })();
    };

    //是否支持多线程
    deviceDetector.workers = function(){
        return !! window.Worker;
    };

    //是否支持文件接口
    deviceDetector.fileapi = function(){
        return window.File && window.FileReader && window.FileList && window.Blob;
    };

    deviceDetector.noConflict = function () {
        win.deviceDetector = previousDevice;
        return this;
    };

    // Private Utility Functions start  ===============//
    find = function(needle) {
        return userAgent.indexOf(needle) !== -1;
    };
    handleOrientation = function(){
        if(win.orientation==180||win.orientation==0){
            strHandleOrientation = "portrait";
        }
        if(win.orientation==90||win.orientation==-90){
            strHandleOrientation = "landscape";
        }
        deviceDetector.HandleOrientationState = strHandleOrientation;
        //alert(deviceDetector.HandleOrientationState);
    };

    if (Object.prototype.hasOwnProperty.call(win, "onorientationchange")) {
        orientationEvent = "orientationchange";
    } else {
        orientationEvent = "resize";
    }
    if (win.addEventListener) {
        win.addEventListener(orientationEvent, handleOrientation, false);
    } else if (win.attachEvent) {
        win.attachEvent(orientationEvent, handleOrientation);
    } else {
        win[orientationEvent] = handleOrientation;
    }
    //handleOrientation();

    if (typeof define === 'function' && typeof define.amd === 'object' && define.amd) {
        define(function() {
            return deviceDetector;
        });
    } else if (typeof module !== 'undefined' && module.exports) {
        module.exports = deviceDetector;
    } else {
        win.deviceDetector = deviceDetector;
    }
})(window, document);