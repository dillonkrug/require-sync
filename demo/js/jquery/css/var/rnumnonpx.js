var pnum = require("../../var/pnum");
module.exports = new RegExp( "^(" + pnum + ")(?!px)[a-z%]+$", "i" );
