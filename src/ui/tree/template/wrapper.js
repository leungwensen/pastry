/* jshint ignore:start */
define("ui/tree/template/wrapper", ["pastry","html/utils"], function (helper) {return function(obj, ne){
var _e=ne?function(s){return s;}:helper.escape,print=function(s,e){_s+=e?(s==null?'':s):_e(s);};obj=obj||{};with(obj){_s='<table class="tree-wrapper table table-hover" id="'+_e(id)+'">'; if (hasHead) { _s+='<thead><tr><th>'+_e(treeColumnName)+'</th>'; helper.each(extraColumns, function (col) { _s+='<th>'+_e(col.label)+'</th>'; }); _s+='</tr></thead>'; } _s+='<tbody></tbody></table>';}return _s;
}});
/* jshint ignore:end */