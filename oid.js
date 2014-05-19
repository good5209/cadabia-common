// constructor
/*
 * Object ID
 * prefix: prefix, clazz: class name, object: object list
 * throws: throw exception when class name is invalid
 */
function Oid(prefix, clazz, object) {
	var self = this;
	if (!(self instanceof Oid)) {
		throw new Error('use "new" to construct a Oid');
	}
	// prefix
	self.prefix = (_.isString(prefix)
		? prefix
		: null);
	
	// class
	if (_.isString(clazz)) {
		self.class = clazz;
	} else {
		throw 'Oid class name cannot be null';
	}
	
	// objects
	self.object = (_.isString(object)
		? object
		: null);
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
Oid.prototype.getObject = function () {
	return this.object;
}

/*
 * get this Oid string format
 */
Oid.prototype.toString = function () {
	var self = this;
	var prefixString = self.getPrefix();
	prefixString = (prefixString === null
		? ''
		: prefixString + ':');
	
	var classString = '@' + self.getClass();
	
	var objectString = self.getObject();
	objectString = (objectString === null
		? ''
		: '[' + objectString + ']');
	
	return prefixString + classString + objectString;
}

// export
Cadabia.Oid = Oid;
