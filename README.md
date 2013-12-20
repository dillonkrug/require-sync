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


