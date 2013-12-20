;(function(global) {
	var require = global.require = function(os, r) {
		return r = function(path) {
			if (os.err) return;
			if (require._config.globals && require._config.globals[path]) path = require._config.globals[path];
			var rs = { f: path+".js", d: path.split('/').slice(0,-1).join('/') },
				subrequire = function(f){ return require(require.processURI(rs.d,f)); };
			if (os.parsed[rs.f]) return os.parsed[rs.f];
			if (os.loading[rs.f]) throw os.err=1, new Error("Circular Reference to <" + rs.f + ">");
			os.loading[rs.f] = true;
			(rs.req = new XMLHttpRequest()).open('GET', rs.f, false);
			rs.req.send();
			
			if (rs.req.status==404||!(rs.code=rs.req.responseText))throw new Error('REQUIRE ERROR: <' + rs.f + '> Not Found');
			try {
				eval('require.parsed["' + rs.f + '"]=(function(module,require,__filename,__dirname,rs,os,r,path,subrequire){var exports=module.exports;//@ sourceURL=' + rs.f + '\n' + rs.code + '\n;return module.exports;/* END REQUIRED FILE */})({exports:{}},subrequire,rs.f,rs.d);');
			} catch (e) {
				os.err = true;
				try {
					esprima.parse(rs.code);
				} catch (er) {
					console.error('REQUIRE ERROR: <' + rs.f + '> Line ' + er.lineNumber + ' Column ' + er.column + ' -> ' + er.description);
					throw er;
				}
				console.error('REQUIRE ERROR: <' + rs.f + '> ' + (e.description || e.message));
				throw e;
			}
			return os.parsed[rs.f];
		}, r.parsed = os.parsed, r._ = os, r;
	}({
		loading: {},
		parsed: {},
		err: false
	});
	require._config = {};

	require.processURI = function(d, f) {
		if (/^(https?:)?\/\//.test(f)) return f;
		if (require._config.globals && require._config.globals[f]) return require._config.globals[f];
		if (/^\//.test(f)) return f;
		var p = (d+"/"+f).split('/');
		for (var i = 0; i < p.length; i++) {
			if (p[i] == '..' && p[i-1] && p[i-1]!='..') p.splice(i - 1, 2),i-=2;
			if (p[i] == '.') p.splice(i,1);
		}
		return p.join('/');
	};

	require.config = function(p) { require._config = p; };

})(window);