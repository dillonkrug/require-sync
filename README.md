require-sync
============

NodeJS style require() in the browser.  No build necessary.


```html
	<script type="text/javascript" src="../src/require.js"></script>
	<script type="text/javascript">
		

		// include esprima for better debugging.
		var esprima = require("../lib/esprima");

		// this works, but a more effective demonstration is including all of the 75+ source files
		// var jQuery = require("//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min");

		var $ = jQuery = require("js/jquery/jquery");

		$(function() {
			$("body").append("<span>IT WORKED!</span>");

			var btn = $("<button>Click to download concatenated files</button>");

			$("body").append(btn);

			btn.click(function() { require.save() });

		});
		

	</script>
```

require('file')
---
- relative paths work.  Other formats might not.
- even if you have an index.js, you must specify the file name (no '.js')

require.load([ scripts ])
---
```javascript
require.load([{
	n: 'path/to/file.js', 	// includes the file name (__filename)
	d: 'path/to', 		// the directory embedded requires wil be relative to (__dirname)
	c: < wrapped code >	// function(module, require){ /* your code here */ return module.exports; }
}, ... ]);
```
- will work best with code generated by the save function.  See concat.js for examples of wrapped code
TODO
- accept unwrapped code

require.save()
---
concats all active scripts and uses HTML5 Blob API to generate and start a download.

this file is automatically wrapped in a require.load() statement.  just include it with a script tag after require.js

TODO
- Minify as well as concat.
- add exclude list
- allow loading of save files with require.


TODO
- Environment configurations?
- many things.






