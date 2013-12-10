var jQuery = require("../core");


// Support: Android 2.3
// Workaround failure to string-cast null input
jQuery.parseJSON = function( data ) {
	return JSON.parse( data + "" );
};

module.exports = jQuery.parseJSON;

