/* jshint ignore:start */
define("ui/notify/template/wrapper", ["pastry","html/utils"], function (helper) {return function(obj, ne){
var _e=ne?function(s){return s;}:helper.escape,print=function(s,e){_s+=e?(s==null?'':s):_e(s);};obj=obj||{};with(obj){_s='<div class="notify-wrapper" id="'+_e(id)+'"></div>';}return _s;
}});
/* jshint ignore:end */