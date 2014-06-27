( function( o, a ) {
'use struct';
var mt = {};
mt.invariants = {
	STRIP_COMMENTS: /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg,
	ARGUMENT_NAMES: /([^\s,]+)/g
};

mt.utils = {
	getParamNames: function( func ) {
		var fnStr = func.toString().replace( mt.invariants.STRIP_COMMENTS, '' );
		var result = fnStr.slice( fnStr.indexOf( '(' )+1, fnStr.indexOf( ')' ) ).match( mt.invariants.ARGUMENT_NAMES );
		if( result === null ) {
			result = [];
		}

		return result;
	},
	construct: function( constructor, args ) {
		function F() {
			return constructor.apply( this, args );
		}
		F.prototype = constructor.prototype;
		return new F();
	},
	buildArgsArray: function( paramNames, data ) {
		var args = [], i = 0; l = paramNames.length;
		for(; i < l; i++) {
			args.push( data[ paramNames[ i ] ] );
		}
		return args;
	},
	extend: function( root, data ) {
		for( var n in data ) {
			root[ n ] = data [ n ];
		}
	}
};

mt.extensions = {
	modelToArray: function( modelType, arr, mappingHandler ) {
		var modelArr = [], i = 0, l = arr.length, model;
		for( ; i < l; i++ ) {
			var obj = arr[ i ];
			model = this.modelToObject( modelType, obj, mappingHandler  );
			modelArr.push( model );
		}
		return modelArr;
	},
	modelToObject: function( modelType, obj, mappingHandler ) {
		var model;
		if( mappingHandler ) {
			model = mappingHandler( obj );
		} else {
			var paramNames = mt.utils.getParamNames( modelType ),
				args = mt.utils.buildArgsArray( paramNames, obj );
			model = mt.utils.construct( modelType, args );
			mt.utils.extend( model, obj );
		}
		return model;
	}
};

//Extend native JS Object with modelTo()
o.prototype.modelTo = function( modelType, mappingHandler ) {
	return mt.extensions.modelToObject( modelType, this, mappingHandler );
};
//Extend native JS Array with modelTo()
a.prototype.modelTo = function( modelType, mappingHandler ) {
	return mt.extensions.modelToArray( modelType, this, mappingHandler );
};

} )( window.Object, window.Array );