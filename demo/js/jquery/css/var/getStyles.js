module.exports = function( elem ) {
	return elem.ownerDocument.defaultView.getComputedStyle( elem, null );
};
