// constructor
/*
 * Object ID
 * prefix: prefix, clazz: class name, object: object list
 */
function Oid(prefix, clazz, objects) {
	// prefix
	if (_.isString(prefix)) {
		this.prefix = prefix;
	} else {
		this.prefix = null;
	}
	
	// class
	if (_.isString(clazz)) {
		this.class = clazz;
	}
	
	// objects
	this.objects = [];
	this.addObjects(objects);
}

// static method
/*
 * experiment function
 * parse JSON string to Oid object
 */
Oid.parseJson = function (json) {
	var obj = JSON.parse(json);
	var result = new Oid();
	for (var key in obj) {
		result[key] = obj[key];
	}
	return result;
}

// instance method
/*
 * add objects into this Oid
 */
Oid.prototype.addObjects = function(objects) {
	var self = this;
	if (!_.isArray(objects)) { // convert argument to array
		var objects = [objects];
	}
	self.objects = _.union(
		self.objects,
		_.filter(objects, _.isString)); // keep string elements only
	self.objects.sort();
}

/*
 * get prefix string
 */
Oid.prototype.getPrefix = function () {
	return this.prefix;
}

/*
 * get class string
 */
Oid.prototype.getClass = function () {
	return this.class;
}

/*
 * get objects string array
 */
Oid.prototype.getObjects = function () {
	var self = this;
	return (
		_.isEmpty(self.objects)
		? null
		: self.objects);
}

/*
 * get this Oid string format
 */
Oid.prototype.toString = function () {
	var self = this;
	var prefixString = self.getPrefix();
	prefixString = (prefixString === null
		? ''
		: prefixString);
	
	var classString = '@' + self.getClass();
	
	var objectsString = self.getObjects();
	objectsString = (objectsString === null
		? ''
		: '['
			// concatenate all objects as string, between with ';'
			+ _.reduce(
				_.rest(objectsString), // remain elements
				function (memo, each) {return memo + ';' + each;}, // concat function
				_.first(objectsString)) // first element
			+ ']');
	
	return prefixString + classString + objectsString;
}

// export
Cadabia.Oid = Oid;
