(function () { "use strict";
var Session = function() { }
$hxExpose(Session, "Session");
Session.__name__ = ["Session"];
Session.prototype = {
	__class__: Session
}
var Type = function() { }
Type.__name__ = ["Type"];
Type.getClassName = function(c) {
	var a = c.__name__;
	return a.join(".");
}
var haxe = {}
haxe.Timer = function(time_ms) {
	var me = this;
	this.id = setInterval(function() {
		me.run();
	},time_ms);
};
haxe.Timer.__name__ = ["haxe","Timer"];
haxe.Timer.delay = function(f,time_ms) {
	var t = new haxe.Timer(time_ms);
	t.run = function() {
		t.stop();
		f();
	};
	return t;
}
haxe.Timer.prototype = {
	run: function() {
		console.log("run");
	}
	,stop: function() {
		if(this.id == null) return;
		clearInterval(this.id);
		this.id = null;
	}
	,__class__: haxe.Timer
}
var js = {}
js.Boot = function() { }
js.Boot.__name__ = ["js","Boot"];
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
var plugin = {}
plugin.misterpah = {}
plugin.misterpah.Completion = function() { }
$hxExpose(plugin.misterpah.Completion, "plugin.misterpah.Completion");
plugin.misterpah.Completion.__name__ = ["plugin","misterpah","Completion"];
plugin.misterpah.Completion.main = function() {
	var plugin_path = ".." + Utils.path.sep + "plugin" + Utils.path.sep + Type.getClassName(plugin.misterpah.Completion) + Utils.path.sep + "bin";
	Utils.loadJavascript(plugin_path + "/regex.execAll.js");
	Utils.loadJavascript(plugin_path + "/mkdir.js");
	plugin.misterpah.Completion.register_listener();
}
plugin.misterpah.Completion.register_listener = function() {
	Main.message.listen("plugin.misterpah.Editor:handle_getCompletion_complete.build_complete","plugin.misterpah.Completion",plugin.misterpah.Completion.build_completion,null);
	Main.message.listen("plugin.misterpah.Completion:static_completion","plugin.misterpah.Completion",plugin.misterpah.Completion.static_completion,null);
}
plugin.misterpah.Completion.static_completion = function() {
	console.log("dumb completion");
	var find_completion = sessionStorage.find_completion;
	var file = "";
	if(Utils.fs.existsSync(Main.session.project_folder + Utils.path.sep + "completion") == false) make_dir(Main.session.project_folder + Utils.path.sep + "completion");
	var file_exists = Utils.fs.existsSync(Main.session.project_folder + Utils.path.sep + "completion" + Utils.path.sep + find_completion + ".completion");
	if(file_exists) {
		file = Utils.system_openFile(Main.session.project_folder + Utils.path.sep + "completion" + Utils.path.sep + find_completion + ".completion");
		sessionStorage.static_completion = file;
		Main.message.broadcast("plugin.misterpah.Completion:static_completion.complete","plugin.misterpah.Completion");
	} else {
		console.log(find_completion);
		console.log("no static completion");
		Utils.system_get_completion(sessionStorage.cursor_index);
	}
}
plugin.misterpah.Completion.build_completion = function() {
	console.log("building completion");
	var find_completion = sessionStorage.find_completion;
	var completion_content = sessionStorage.build_completion;
	Utils.system_createFile(Main.session.project_folder + Utils.path.sep + "completion" + Utils.path.sep + find_completion + ".completion");
	Utils.system_saveFile(Main.session.project_folder + Utils.path.sep + "completion" + Utils.path.sep + find_completion + ".completion",completion_content);
	haxe.Timer.delay(function() {
		Main.message.broadcast("plugin.misterpah.Completion:static_completion","plugin.misterpah.Completion");
	},1000);
}
plugin.misterpah.Completion.depecrated_build_completion = function() {
	console.log("build completion");
	var txt = Main.file_stack.find(Main.session.active_file)[1];
	var findVar = regex_matchVar(txt);
	var findFunction = regex_matchFunction(txt);
	var findClass = regex_matchClass(txt);
	var findPackage = regex_matchPackage(txt);
	var findImport = regex_matchImport(txt);
	var package_name = findPackage[0][1];
	var class_name = $.trim(findClass[0][1]);
	console.log(package_name + "." + class_name + ".completion");
	var completion_file_content = [];
	completion_file_content.push(findImport);
	completion_file_content.push(findPackage);
	completion_file_content.push(findClass);
	completion_file_content.push(findVar);
	completion_file_content.push(findFunction);
	var completion_content = JSON.stringify(completion_file_content);
	console.log(completion_content);
	Utils.system_createFile(Main.session.project_folder + Utils.path.sep + "completion" + Utils.path.sep + package_name + "." + class_name + ".completion");
	Utils.system_saveFile(Main.session.project_folder + Utils.path.sep + "completion" + Utils.path.sep + package_name + "." + class_name + ".completion",completion_content);
}
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
plugin.misterpah.Completion.main();
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
