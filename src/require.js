!(function(global) {

	var require = global.require = function(oScope, r) {
		return r = function(fileString) {
			if (oScope.err) return;
			var iScope = {
				pointer: fileString.split('/'),
				counter: 0
			};
			for (; iScope.counter < iScope.pointer.length; iScope.counter++) {
				iScope.pointer[iScope.counter] == '..' && 
				iScope.pointer[iScope.counter - 1] && 
				iScope.pointer[iScope.counter - 1] != '..' && 
				(iScope.pointer.splice(iScope.counter - 1, 2), iScope.counter -= 2);
			}
			iScope.file = iScope.pointer.join('/');
			iScope.fullFileName = iScope.file + '.js';
			iScope.fileDirectory = iScope.pointer.pop() && iScope.pointer.join('/');

			if (oScope.loadedJS[iScope.file]) return oScope.loadedJS[iScope.file];
			
			(iScope.requestObj = new XMLHttpRequest()).open('GET', iScope.fullFileName, false);
			iScope.requestObj.send();
			
			if (iScope.requestObj.status == 404 || !(iScope.loadedCode = iScope.requestObj.responseText)) throw new Error(oScope.errorMsg + iScope.fullFileName + '> Not Found');
			try {
				eval('require.loadedJS["' + iScope.file + '"]=' + (iScope.wrappedCode = '(function(module,require,iScope,oScope,r,fileString){var exports=module.exports;//@ sourceURL=' + iScope.fullFileName + '\n' + iScope.loadedCode + '\n;return module.exports;/* END REQUIRED FILE */})') + '({exports:{}},function(f){return require("' + iScope.fileDirectory + '/"+f)});');
			} catch (e) {
				oScope.err = 1;
				try {
					esprima.parse(iScope.loadedCode);
				} catch (e) {
					throw oScope.console.error(oScope.errorMsg + iScope.fullFileName + '> Line ' + e.lineNumber + ' Column ' + e.column + ' -> ' + e.description), e;
				}
				throw oScope.console.error(e.stack), e;
			}
			return oScope.loadedText.push({
				n: iScope.file,
				d: iScope.fileDirectory,
				c: iScope.wrappedCode
			}) && oScope.loadedJS[iScope.file];
		}, r.loadedJS = oScope.loadedJS, r.loadedText = oScope.loadedText, r._ = oScope, r;
	}({
		loadedText: [],
		loadedJS: {},
		err: false,
		console: console,
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