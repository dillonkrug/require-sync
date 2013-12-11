!(function(global) {

	var require = global.require = function(oScope, r) {
		return r = function(fileString) {
			console.log(fileString);
			if (oScope.err) return;
			var iScope = {
				pointer: fileString.split('/'),
				i: 0
			};
			for (; iScope.i < iScope.pointer.length; iScope.i++) {
				iScope.pointer[iScope.i] == '..' && 
				iScope.pointer[iScope.i - 1] && 
				iScope.pointer[iScope.i - 1] != '..' && 
				(iScope.pointer.splice(iScope.i - 1, 2), iScope.i -= 2);
			}
			var __filename = iScope.pointer.join('/') + '.js';
			var __dirname = iScope.pointer.pop() && iScope.pointer.join('/');

			if (oScope.loadedJS[__filename]) return oScope.loadedJS[__filename];

			if (oScope.loadingHash[__filename]) {
				throw new Error("Circular Reference to <" + __filename + ">");				
			};

			oScope.loadingHash[__filename] = true;
			(iScope.requestObj = new XMLHttpRequest()).open('GET', __filename, false);
			iScope.requestObj.send();
			
			if (iScope.requestObj.status == 404 || !(iScope.loadedCode = iScope.requestObj.responseText)) throw new Error(oScope.errorMsg + __filename + '> Not Found');
			try {
				eval('require.loadedJS["' + __filename + '"]=' + (iScope.wrappedCode = '(function(module,require,iScope,oScope,r,fileString){var exports=module.exports;//@ sourceURL=' + __filename + '\n' + iScope.loadedCode + '\n;return module.exports;/* END REQUIRED FILE */})') + '({exports:{}},function(f){return require("' + __dirname + '/"+f)});');
			} catch (e) {
				oScope.err = true;
				try {
					esprima.parse(iScope.loadedCode);
				} catch (e) {
					throw console.error(oScope.errorMsg + __filename + '> Line ' + e.lineNumber + ' Column ' + e.column + ' -> ' + e.description), e;
				}
				throw console.error(oScope.errorMsg + __filename + '> ' + (e.description || e.message)), e;
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
		errorMsg: 'REQUIRE ERROR: <'
	});

	require.save = function() {
		var outCode = [],
			loadedCode = require.loadedText,
			a = document.createElement("a");
		for (var i = 0; i < loadedCode.length; i++) outCode.push('{n:"' + loadedCode[i].n + '",d:"' + loadedCode[i].d + '",c:' + loadedCode[i].c + '}');

		outCode = new Blob(["window.require.load([" + outCode.join(",") + "])"], { type: "text/javascript" });
		a.download = "concat.js";
		a.href = window.URL.createObjectURL(outCode)
		a.click();
	};

	require.load = function(mods) {
		for (var i = 0; i < mods.length; i++) {
			(function(loadedMod) {
				require.loadedJS[loadedMod.n] = loadedMod.c({
					exports: {}
				}, function(f) {
					return require(loadedMod.d + '/' + f)
				})
			})(mods[i]);
		}
	};


})(window);