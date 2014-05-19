// constructor
/*
 * OidSet
 * set of Oids
 */
function OidSet() {
	var self = this;
	if (!(self instanceof OidSet)) {
		throw new Error('use "new" to construct a OidSet');
	}
	/*
	 * field can't inherit
	 * see: http://blog.iamjason.com/2012/01/javascriptprototype.html
	 *
	 * elements is a set of sets
	 * each 'elements[oid.prefix + oid.class]' is a set of oids,
	 * store every oid with same prefix and class name
	 */
	self.elements = {};
}

// inherit Cadabia.Set
/*
 * reference:
 * http://openhome.cc/Gossip/JavaScript/ClassSimulation.html
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Introduction_to_Object-Oriented_JavaScript#Inheritance
 */
OidSet.prototype = new Cadabia.Set();
OidSet.prototype.constructor = OidSet;

// instance method
/*
 * add elemenet to set
 * return true: success, false: element already added
 */
OidSet.prototype.add = function(obj) {
	var self = this;
	var key = OidSet.objectKey(obj);
	if (!self.contains(obj)) {
		if (_.isUndefined(self.elements[key])) {
			// set of oids
			self.elements[key] = new Cadabia.SortedSet();
			
			// sort elements
			self.elements = _.reduce(
				_.pairs(self.elements).sort(OidSet.elementCompare),
				function (memo, each) {
					memo[each[0]] = each[1];
					return memo;
				}, {});
		}
		// add all objects in this class, and this class has some objects
		if ((obj.getObject() === null) && !self.elements[key].isEmpty()) {
			// clear this class
			self.elements[key] = new Cadabia.SortedSet();
		}
		return self.elements[key].add(obj.getObject());
	}
	return false;
}

/*
 * remove element from set
 * return true: success, false: element not exist
 */
OidSet.prototype.remove = function(obj) {
	var self = this;
	var key = OidSet.objectKey(obj);
	var set = self.elements[key];
	if (!_.isUndefined(set)
		&& (set instanceof Cadabia.SortedSet)
		// try remove object
		&& set.remove(obj.getObject())) {
		// delete set when it already empty
		if (set.isEmpty()) {
			delete self.elements[key];
		}
		return true;
	}
	return false;
}

/*
 * check set contain such element
 */
OidSet.prototype.contains = function(obj) {
	var self = this;
	var set = self.elements[OidSet.objectKey(obj)];
	return (!_.isUndefined(set)
		&& (set instanceof Cadabia.SortedSet)
		// this set contains all objects
		&& (set.contains(null)
			// or contains specify object
			|| set.contains(obj.getObject())));
}

/*
 * check set is empty
 * when self.elements is empty, meaning OidSet is empty
 * 
 * OidSet.prototype.isEmpty = function() {}
 */

/*
 * check this set is equal to another set
 *
 * OidSet.prototype.equals = function(set) {}
 */

/*
 * clone all contain elements to a new set
 */
OidSet.prototype.clone = function() {
	var self = this;
	var result = new OidSet();
	_.each(
		self.elements,
		function (set, key) { // clone each set
			result.elements[key] = set.clone();
		});
	return result;
}

/*
 * count elements
 */
OidSet.prototype.size = function() {
	var self = this;
	return _.reduce(
		// collect all set.size()
		_.map(self.elements, function (set) {return set.size();}),
		// sum them
		function (memo, size) {return memo + size;},
		0
	);
}

/*
 * apply function with every elements
 * function: function (eachOid)
 */
OidSet.prototype.each = function(fun) {
	var self = this;
	if (_.isFunction(fun)) {
		var setsOids = _.map(self.elements, function (set, key) {
			// convert json string key to object
			var key = JSON.parse(key);
			// collect all elements in this set
			var setElements = [];
			set.each(function (element) {setElements.push(element)});
			// generate Oid objects
			return _.map(setElements, function (element) {
				return new Cadabia.Oid(key.prefix, key.class, element);
			});
		});
		
		// apply fun on each oids
		_.each(_.flatten(setsOids), function (oid) {fun(oid);});
	}
}

/*
 * union with another set
 * OidSet.prototype.union = function(set) {}
 */

/*
 * intersection with another set
 */
OidSet.prototype.intersection = function(set) {
	var self = this;
	var result = new OidSet();
	if (self.size() < set.size()) {
		self.each(function (value) {
			if (set.contains(value)) {
				result.add(value);
			}
		});
	} else {
		set.each(function (value) {
			if (self.contains(value)) {
				result.add(value);
			}
		});
	}
	return result;
}

/*
 * difference with another set
 * Set.prototype.difference = function(set) {}
 */

/*
 * get this OidSet all oids json array
 */
OidSet.prototype.toJSON = function () {
	var result = [];
	this.each(function (oid) {result.push(oid);});
	return result;
}

/*
 * get this OidSet string format
 */
OidSet.prototype.toString = function () {
	var self = this;
	var oidList = self.toJSON();
	
	var oidTree = _.reduce(
		// group by prefix name
		_.groupBy(oidList, function (oid) {return JSON.stringify(oid.prefix)}),
		function (memo, oids, prefix) {
			// group by class name
			memo[prefix] = _.groupBy(oids, function (oid) {return JSON.stringify(oid.class)});
			return memo;
		}, {});
	
	return _.map(oidTree, function (classNode, prefix) {
		var prefix = JSON.parse(prefix);
		return (
			// prefix string
			(prefix === null)
				? '@' // default prefix, mean localhost
				: prefix + ':@')
			+ _.map(classNode,
				function (oids, className) {
					// class string
					return JSON.parse(className)
						+ (!_.some(oids, function (oid) {return oid.object === null;})
							// not all objects, enumerate contain objects, separate with ';'
							? '[' + _.map(oids, function (oid) {return oid.object;}).join(';') + ']'
							// contain all objects
							: '');
				}).join(';'); // separate with ';' between class
	}).join(';'); // separate with ';' between prefix
}

// static method
/*
 * generate element's key, for identify elements
 */
OidSet.objectKey = function (oid) {
	return JSON.stringify({
		prefix: oid.getPrefix(),
		class: oid.getClass()
	});
}
/*
 * elements sort's custom compare function
 * if 'null' exist, it will first
 */
OidSet.elementCompare = function(a, b) {
	// convert key (json string) to object
	var a = [JSON.parse(a[0]), a[1]];
	var b = [JSON.parse(b[0]), b[1]];
	if ((a[0].prefix === null) && (b[0].prefix === null)) {
		// both null prefix, continue compare class name
	} else 	if (a[0].prefix === null) {
		return -1;
	} else if (b[0].prefix === null) {
		return 1;
	}
	var aString = a[0].prefix + '-' + a[0].class;
	var bString = b[0].prefix + '-' + b[0].class;
	if (aString > bString) {
		return 1;
	} else if (aString < bString) {
		return -1;
	}
	return 0;
}

// export
Cadabia.OidSet = OidSet;
