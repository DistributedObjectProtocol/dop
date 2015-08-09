syncio={create: function(){}}
syncio.path=function(a,b){syncio.path.recursive.call({circular:[]},a,b,[])},syncio.path.recursive=function(a,b,c){for(var d in a){if(c.push(d),0==this.stop)return;this.stop=b(c,a[d],d,a),a[d]&&"object"==typeof a[d]&&a[d]!==a&&-1==this.circular.indexOf(a[d])&&(this.circular.push(a[d]),syncio.path.recursive.call(this,a[d],b,c)),c.pop()}};




syncio.observe = function( object, callback, path ) {

	Object.defineProperty( object, '_path', {value: path});

	Object.observe(object, callback);

	syncio.path(object, function(subpath, object) {

		var newpath = path.concat(subpath);

		if ( object !== null && typeof object == 'object' ) {

			Object.defineProperty( object, '_path', {value: newpath} );

			Object.observe(object, callback);

		}

	});

};

syncio.create.prototype.observe = function(changes) {

	for (var i=0; i<changes.length; i++) {
		
		var path = changes[i].object._path.slice(0);
		path.push( changes[i].name )

		if (
			(changes[i].type == 'update' || changes[i].type == 'add') &&
			changes[i].object[changes[i].name] !== null &&
			typeof changes[i].object[changes[i].name] == 'object'
		) {
			syncio.observe(changes[i].object[changes[i].name], this.observe, path );
		}

		console.log( changes[i].type, path, changes[i].oldValue );
		console.log()

	}

};





// setTimeout(function(){

MYSERVE = new syncio.create();
MYOBJECT = {
    foo: 0,
    bar: 1,
    obj: {
        paco: 2,
        pil: 3,
        arr: [1,2,3,4]
    }
};

syncio.observe(MYOBJECT, MYSERVE.observe.bind(MYSERVE), [12345] );

MYOBJECT.obj.arr[2] = 'ONE';
MYOBJECT.obj.arr = 'TWO';
MYOBJECT.foo = 'THREE';
MYOBJECT.bar = 'FOUR';
// delete MYOBJECT.obj.arr;
MYOBJECT.obj.arr = [1,2,3,{paco:'pil'}];
setTimeout(function(){
	console.log('reobserve')
	MYOBJECT.obj.arr[3].paco = 'porras';
},1)


// },5000)
