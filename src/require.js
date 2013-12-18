;(function(global) {
	var require = global.require = function(oScope, r) {
		return r = function(fileString) {
			if (oScope.err) return;

			if (require._config.globals && require._config.globals[fileString]) fileString = require._config.globals[fileString];

			// console.log(fileString);
			var iScope = {
				file: fileString.split("/")
			};
			// console.log(iScope.file);
			
			var __filename = iScope.file.join("/") + '.js';
			// console.log("__filename",__filename)
			var __dirname = iScope.file.pop() && iScope.file.join("/");

			if (oScope.loadedJS[__filename]) return oScope.loadedJS[__filename];

			if (oScope.loadingHash[__filename]) {
				throw new Error("Circular Reference to <" + __filename + ">");
			}

			oScope.loadingHash[__filename] = true;
			(iScope.requestObj = new XMLHttpRequest()).open('GET', __filename, false);
			iScope.requestObj.send();
			
			if (iScope.requestObj.status == 404 || !(iScope.loadedCode = iScope.requestObj.responseText)) throw new Error(oScope.errorMsg + __filename + '> Not Found');
			var subrequire = function(f){
				return require(require.processURI(__dirname,f));
			};
			try {
				eval('require.loadedJS["' + __filename + '"]=' + (iScope.wrappedCode = '(function(module,require,__filename,__dirname,iScope,oScope,r,fileString,subrequire){var exports=module.exports;//@ sourceURL=' + __filename + '\n' + iScope.loadedCode + '\n;return module.exports;/* END REQUIRED FILE */})') + '({exports:{}},subrequire,__filename,__dirname);');
			} catch (e) {
				oScope.err = true;
				// console.log("EVAL ERROR", __filename);
				try {
					esprima.parse(iScope.loadedCode);
					// console.log("ESPRIMA PASSED", __filename);
				} catch (er) {
					console.error(oScope.errorMsg + __filename + '> Line ' + er.lineNumber + ' Column ' + er.column + ' -> ' + er.description);
					throw er;
				}
				console.error(oScope.errorMsg + __filename + '> ' + (e.description || e.message));
				throw e;
			}
			return oScope.loadedText.push({
				n: __filename,
				d: __dirname,
				c: iScope.wrappedCode
			}) && oScope.loadedJS[__filename];
		}, r.loadedJS = oScope.loadedJS, r.loadedText = oScope.loadedText, r._ = oScope, r;
	}({
		loadingHash: {},
		loadedText: [],
		loadedJS: {},
		err: false,
		errorMsg: 'REQUIRE ERROR: <',
	});
	require._config = {}

	require.processURI = function(d, f) {
		if (/^(https?:)?\/\//.test(f)) return f;
		// console.log("GLOBALS", require._config.globals)
		if (require._config.globals && require._config.globals[f]) return require._config.globals[f];
		if (/^\//.test(f)) return f;
		var p = (d+"/"+f).split('/');
		for (var i = 0; i < p.length; i++) {
			if (p[i] == '..' && p[i - 1] && p[i - 1] != '..') {
				p.splice(i - 1, 2);
				i = i - 2;
			}
			if (p[i] == '.') p.splice(i,1);
		}
		return p.join('/');
	};

	require.save = function() {
		var outCode = [],
			loadedCode = require.loadedText,
			a = document.createElement("a");
		for (var i = 0; i < loadedCode.length; i++) outCode.push('{n:"' + loadedCode[i].n + '",d:"' + loadedCode[i].d + '",c:' + loadedCode[i].c + '}');

		outCode = new Blob(["window.require.load([" + outCode.join(",") + "])"], { type: "text/javascript" });
		a.download = "concat.js";
		a.href = window.URL.createObjectURL(outCode);
		a.click();
	};

	require.config = function(p) { require._config = p; };

	require.load = function(mods) {
		var init = function(loadedMod) {
				require.loadedJS[loadedMod.n] = loadedMod.c({
					exports: {}
				}, function(f) {
					return require(loadedMod.d + '/' + f);
				});
			};
		for (var i = 0; i < mods.length; i++) {
			init(mods[i]);
		}
	};
})(window);