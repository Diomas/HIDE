(function () { "use strict";
var HxOverrides = function() { }
HxOverrides.__name__ = ["HxOverrides"];
HxOverrides.remove = function(a,obj) {
	var i = 0;
	var l = a.length;
	while(i < l) {
		if(a[i] == obj) {
			a.splice(i,1);
			return true;
		}
		i++;
	}
	return false;
}
HxOverrides.iter = function(a) {
	return { cur : 0, arr : a, hasNext : function() {
		return this.cur < this.arr.length;
	}, next : function() {
		return this.arr[this.cur++];
	}};
}
var Lambda = function() { }
Lambda.__name__ = ["Lambda"];
Lambda.indexOf = function(it,v) {
	var i = 0;
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var v2 = $it0.next();
		if(v == v2) return i;
		i++;
	}
	return -1;
}
var Session = function() { }
$hxExpose(Session, "Session");
Session.__name__ = ["Session"];
Session.prototype = {
	__class__: Session
}
var Std = function() { }
Std.__name__ = ["Std"];
Std.string = function(s) {
	return js.Boot.__string_rec(s,"");
}
var StringTools = function() { }
StringTools.__name__ = ["StringTools"];
StringTools.replace = function(s,sub,by) {
	return s.split(sub).join(by);
}
var Type = function() { }
Type.__name__ = ["Type"];
Type.getClassName = function(c) {
	var a = c.__name__;
	return a.join(".");
}
var js = {}
js.Boot = function() { }
js.Boot.__name__ = ["js","Boot"];
js.Boot.__string_rec = function(o,s) {
	if(o == null) return "null";
	if(s.length >= 5) return "<...>";
	var t = typeof(o);
	if(t == "function" && (o.__name__ || o.__ename__)) t = "object";
	switch(t) {
	case "object":
		if(o instanceof Array) {
			if(o.__enum__) {
				if(o.length == 2) return o[0];
				var str = o[0] + "(";
				s += "\t";
				var _g1 = 2, _g = o.length;
				while(_g1 < _g) {
					var i = _g1++;
					if(i != 2) str += "," + js.Boot.__string_rec(o[i],s); else str += js.Boot.__string_rec(o[i],s);
				}
				return str + ")";
			}
			var l = o.length;
			var i;
			var str = "[";
			s += "\t";
			var _g = 0;
			while(_g < l) {
				var i1 = _g++;
				str += (i1 > 0?",":"") + js.Boot.__string_rec(o[i1],s);
			}
			str += "]";
			return str;
		}
		var tostr;
		try {
			tostr = o.toString;
		} catch( e ) {
			return "???";
		}
		if(tostr != null && tostr != Object.toString) {
			var s2 = o.toString();
			if(s2 != "[object Object]") return s2;
		}
		var k = null;
		var str = "{\n";
		s += "\t";
		var hasp = o.hasOwnProperty != null;
		for( var k in o ) { ;
		if(hasp && !o.hasOwnProperty(k)) {
			continue;
		}
		if(k == "prototype" || k == "__class__" || k == "__super__" || k == "__interfaces__" || k == "__properties__") {
			continue;
		}
		if(str.length != 2) str += ", \n";
		str += s + k + " : " + js.Boot.__string_rec(o[k],s);
		}
		s = s.substring(1);
		str += "\n" + s + "}";
		return str;
	case "function":
		return "<function>";
	case "string":
		return o;
	default:
		return String(o);
	}
}
js.Boot.__interfLoop = function(cc,cl) {
	if(cc == null) return false;
	if(cc == cl) return true;
	var intf = cc.__interfaces__;
	if(intf != null) {
		var _g1 = 0, _g = intf.length;
		while(_g1 < _g) {
			var i = _g1++;
			var i1 = intf[i];
			if(i1 == cl || js.Boot.__interfLoop(i1,cl)) return true;
		}
	}
	return js.Boot.__interfLoop(cc.__super__,cl);
}
js.Boot.__instanceof = function(o,cl) {
	if(cl == null) return false;
	switch(cl) {
	case Int:
		return (o|0) === o;
	case Float:
		return typeof(o) == "number";
	case Bool:
		return typeof(o) == "boolean";
	case String:
		return typeof(o) == "string";
	case Dynamic:
		return true;
	default:
		if(o != null) {
			if(typeof(cl) == "function") {
				if(o instanceof cl) {
					if(cl == Array) return o.__enum__ == null;
					return true;
				}
				if(js.Boot.__interfLoop(o.__class__,cl)) return true;
			}
		} else return false;
		if(cl == Class && o.__name__ != null) return true;
		if(cl == Enum && o.__ename__ != null) return true;
		return o.__enum__ == cl;
	}
}
js.Boot.__cast = function(o,t) {
	if(js.Boot.__instanceof(o,t)) return o; else throw "Cannot cast " + Std.string(o) + " to " + Std.string(t);
}
js.Browser = function() { }
js.Browser.__name__ = ["js","Browser"];
var plugin = {}
plugin.misterpah = {}
plugin.misterpah.Editor = function() { }
$hxExpose(plugin.misterpah.Editor, "plugin.misterpah.Editor");
plugin.misterpah.Editor.__name__ = ["plugin","misterpah","Editor"];
plugin.misterpah.Editor.main = function() {
	plugin.misterpah.Editor.init();
}
plugin.misterpah.Editor.plugin_path = function() {
	return "../plugin/" + Type.getClassName(plugin.misterpah.Editor) + "/bin";
}
plugin.misterpah.Editor.init = function() {
	plugin.misterpah.Editor.tab_index = new Array();
	plugin.misterpah.Editor.tab_cursor = new Array();
	plugin.misterpah.Editor.completion_list = new Array();
	plugin.misterpah.Editor.track_cursor = true;
	Utils.loadJavascript(plugin.misterpah.Editor.plugin_path() + "/codemirror-3.15/lib/codemirror.js");
	Utils.loadJavascript(plugin.misterpah.Editor.plugin_path() + "/codemirror-3.15/mode/haxe/haxe.js");
	Utils.loadJavascript(plugin.misterpah.Editor.plugin_path() + "/codemirror-3.15/addon/edit/matchbrackets.js");
	Utils.loadJavascript(plugin.misterpah.Editor.plugin_path() + "/codemirror-3.15/addon/edit/closebrackets.js");
	Utils.loadJavascript(plugin.misterpah.Editor.plugin_path() + "/codemirror-3.15/addon/fold/foldcode.js");
	Utils.loadJavascript(plugin.misterpah.Editor.plugin_path() + "/codemirror-3.15/addon/fold/foldgutter.js");
	Utils.loadJavascript(plugin.misterpah.Editor.plugin_path() + "/codemirror-3.15/addon/selection/active-line.js");
	Utils.loadJavascript(plugin.misterpah.Editor.plugin_path() + "/codemirror-3.15/addon/hint/show-hint.js");
	Utils.loadJavascript(plugin.misterpah.Editor.plugin_path() + "/js/codemirror.hint.haxe.js");
	Utils.loadJavascript(plugin.misterpah.Editor.plugin_path() + "/js/jquery.xml2json.js");
	Utils.loadCss(plugin.misterpah.Editor.plugin_path() + "/codemirror-3.15/lib/codemirror.css");
	Utils.loadCss(plugin.misterpah.Editor.plugin_path() + "/codemirror-3.15/addon/hint/show-hint.css");
	Utils.loadCss(plugin.misterpah.Editor.plugin_path() + "/codemirror-3.15/theme/xq-light.css");
	plugin.misterpah.Editor.create_ui();
	plugin.misterpah.Editor.register_hooks();
}
plugin.misterpah.Editor.create_ui = function() {
	new $("#editor_position").css("display","none");
	new $("#editor_position").append("<div  id='misterpah_editor_tabs_position'><ul class='nav nav-tabs'></ul></div>");
	new $("#editor_position").append("<div class='ui-layout-center' id='misterpah_editor_cm_position'></div>");
	new $("#misterpah_editor_cm_position").append("<textarea style='display:none;' name='misterpah_editor_cm_name' id='misterpah_editor_cm'></textarea>");
	plugin.misterpah.Editor.cm = CodeMirror.fromTextArea(js.Browser.document.getElementById("misterpah_editor_cm"),{ lineNumbers : true, indentUnit : 4, tabSize : 4, indentWithTabs : true, cursorHeight : 0.85, mode : "haxe", theme : "xq-light", matchBrackets : true, autoCloseBrackets : true, foldCode : true, foldGutter : true, styleActiveLine : true});
	CodeMirror.on(plugin.misterpah.Editor.cm,"cursorActivity",function(cm) {
		if(plugin.misterpah.Editor.track_cursor == true) {
			var path = Main.session.active_file;
			var tab_number = Lambda.indexOf(plugin.misterpah.Editor.tab_index,path);
			var cursor = cm.getCursor();
			plugin.misterpah.Editor.tab_cursor[tab_number] = [cursor.line,cursor.ch];
			console.log(plugin.misterpah.Editor.tab_cursor);
		}
	});
	CodeMirror.on(plugin.misterpah.Editor.cm,"change",function(cm) {
		var path = Main.session.active_file;
		if(path == "") {
			console.log("ignore");
			return;
		}
		var file_obj = Main.file_stack.find(path);
		Main.file_stack.update_content(path,cm.getValue());
		var cursor_pos = cm.indexFromPos(cm.getCursor());
		if(cm.getValue().charAt(cursor_pos - 1) == ".") {
			Main.message.broadcast("core:FileMenu.saveFile","plugin.misterpah.Editor");
			plugin.misterpah.Editor.cursor_type = ".";
			Utils.system_get_completion(cursor_pos);
			sessionStorage.cursor_pos = cm.getCursor().ch;
		}
		if(cm.getValue().charAt(cursor_pos - 1) == "(") {
			Main.message.broadcast("core:FileMenu.saveFile","plugin.misterpah.Editor");
			plugin.misterpah.Editor.cursor_type = "(";
			Utils.system_get_completion(cursor_pos);
			sessionStorage.cursor_pos = cm.getCursor().ch;
		}
	});
	plugin.misterpah.Editor.editor_resize();
}
plugin.misterpah.Editor.register_hooks = function() {
	plugin.misterpah.Editor.cursor_type = "";
	new $(js.Browser.document).on("show.bs.tab",null,function(e) {
		var target = new $(e.target);
		plugin.misterpah.Editor.show_tab(target.attr("data-path"),false);
		var tab_number = Lambda.indexOf(plugin.misterpah.Editor.tab_index,Main.session.active_file);
		var unshowed_tab = plugin.misterpah.Editor.tab_cursor[tab_number];
		var cursor_pos = CodeMirror.Pos(unshowed_tab[0],unshowed_tab[1]);
		plugin.misterpah.Editor.cm.setCursor(cursor_pos);
	});
	new $(js.Browser.document).on("plugin.misterpah.FileAccess:open_file.complete",null,function() {
		new $("#editor_position").css("display","block");
		plugin.misterpah.Editor.make_tab();
	});
	new $(js.Browser.window).on("resize",null,function() {
		plugin.misterpah.Editor.editor_resize();
	});
	new $(js.Browser.document).on("core:utils.system_get_completion.complete",null,plugin.misterpah.Editor.handle_getCompletion_complete);
	new $(js.Browser.document).on("plugin.misterpah.FileAccess:close_file.complete",null,plugin.misterpah.Editor.close_tab);
}
plugin.misterpah.Editor.handle_getCompletion_complete = function(event,data) {
	var completion_array = $.xml2json(data);
	console.log(completion_array);
	plugin.misterpah.Editor.completion_list = new Array();
	if(plugin.misterpah.Editor.cursor_type == ".") {
		console.log(completion_array);
		if(js.Boot.__instanceof(completion_array,String)) {
		} else {
			var _g1 = 0, _g = completion_array.i.length;
			while(_g1 < _g) {
				var each = _g1++;
				plugin.misterpah.Editor.completion_list.push(completion_array.i[each].n);
			}
		}
		CodeMirror.showHint(plugin.misterpah.Editor.cm,haxeHint);
	} else if(plugin.misterpah.Editor.cursor_type == "(") {
		console.log(completion_array);
		var cur_pos = plugin.misterpah.Editor.cm.getCursor();
		completion_array = StringTools.replace(completion_array,"->",",");
		var completion_array_exploded = completion_array.split(",");
		var return_type = completion_array_exploded.pop();
		completion_array = completion_array_exploded.join(",");
		completion_array = StringTools.replace(completion_array,"Void","");
		completion_array = " " + Std.string(completion_array);
		plugin.misterpah.Editor.completion_list.push(completion_array);
		CodeMirror.showHint(plugin.misterpah.Editor.cm,haxeHint);
		plugin.misterpah.Editor.cm.setCursor(cur_pos);
	}
}
plugin.misterpah.Editor.editor_resize = function() {
	var win = Utils.gui.Window.get();
	var win_height = js.Boot.__cast(win.height , Int);
	var doc_height = new $(js.Browser.document).height();
	var nav_height = new $(".nav").height();
	var tab_height = new $("#misterpah_editor_tabs_position").height();
	new $(".CodeMirror").css("height",win_height - nav_height - tab_height - 38 + "px");
}
plugin.misterpah.Editor.close_tab = function() {
	var path = Main.session.active_file;
	var tab_number = Lambda.indexOf(plugin.misterpah.Editor.tab_index,path);
	new $("#misterpah_editor_tabs_position li:eq(" + tab_number + ")").remove();
	Main.session.active_file = "";
	plugin.misterpah.Editor.cm.setOption("value","");
	HxOverrides.remove(plugin.misterpah.Editor.tab_index,path);
	if(plugin.misterpah.Editor.tab_index.length < 1) new $("#editor_position").css("display","none"); else new $("#misterpah_editor_cm_position").css("display","none");
}
plugin.misterpah.Editor.make_tab = function() {
	var path = Main.session.active_file;
	var file_obj = Main.file_stack.find(path);
	plugin.misterpah.Editor.tab_index.push(path);
	plugin.misterpah.Editor.tab_cursor.push([0,0]);
	new $("#misterpah_editor_tabs_position ul").append("<li><a data-path='" + path + "' data-toggle='tab'>" + file_obj[2] + "</a></li>");
	plugin.misterpah.Editor.show_tab(path);
	plugin.misterpah.Editor.cm.setOption("value",file_obj[1]);
	plugin.misterpah.Editor.editor_resize();
}
plugin.misterpah.Editor.show_tab = function(path,tabShow) {
	if(tabShow == null) tabShow = true;
	plugin.misterpah.Editor.track_cursor = false;
	var file_obj = Main.file_stack.find(path);
	var tab_number = Lambda.indexOf(plugin.misterpah.Editor.tab_index,path);
	Main.session.active_file = path;
	plugin.misterpah.Editor.cm.setOption("value",file_obj[1]);
	if(tabShow == true) $("#misterpah_editor_tabs_position li:eq(" + tab_number + ") a").tab("show");
	new $("#misterpah_editor_cm_position").css("display","block");
	plugin.misterpah.Editor.cm.refresh();
	plugin.misterpah.Editor.track_cursor = true;
}
function $iterator(o) { if( o instanceof Array ) return function() { return HxOverrides.iter(o); }; return typeof(o.iterator) == 'function' ? $bind(o,o.iterator) : o.iterator; };
var $_, $fid = 0;
function $bind(o,m) { if( m == null ) return null; if( m.__id__ == null ) m.__id__ = $fid++; var f; if( o.hx__closures__ == null ) o.hx__closures__ = {}; else f = o.hx__closures__[m.__id__]; if( f == null ) { f = function(){ return f.method.apply(f.scope, arguments); }; f.scope = o; f.method = m; o.hx__closures__[m.__id__] = f; } return f; };
if(Array.prototype.indexOf) HxOverrides.remove = function(a,o) {
	var i = a.indexOf(o);
	if(i == -1) return false;
	a.splice(i,1);
	return true;
};
String.prototype.__class__ = String;
String.__name__ = ["String"];
Array.prototype.__class__ = Array;
Array.__name__ = ["Array"];
var Int = { __name__ : ["Int"]};
var Dynamic = { __name__ : ["Dynamic"]};
var Float = Number;
Float.__name__ = ["Float"];
var Bool = Boolean;
Bool.__ename__ = ["Bool"];
var Class = { __name__ : ["Class"]};
var Enum = { };
js.Browser.window = typeof window != "undefined" ? window : null;
js.Browser.document = typeof window != "undefined" ? window.document : null;
plugin.misterpah.Editor.main();
function $hxExpose(src, path) {
	var o = typeof window != "undefined" ? window : exports;
	var parts = path.split(".");
	for(var ii = 0; ii < parts.length-1; ++ii) {
		var p = parts[ii];
		if(typeof o[p] == "undefined") o[p] = {};
		o = o[p];
	}
	o[parts[parts.length-1]] = src;
}
})();
