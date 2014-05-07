// constructor
/*
 * OidSet
 * set of Oids
 */
function OidSet() {
	/*
	 * field can't inherit
	 * see: http://blog.iamjason.com/2012/01/javascriptprototype.html
	 *
	 * elements is a set of sets
	 * each 'elements[oid.prefix + oid.class]' is a set of oids,
	 * store every oid with same prefix and class name
	 */
	this.elements = {};
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
	if (_.isUndefined(self.elements[key])) {
		self.elements[key] = new Cadabia.Set(); // set of oids
	}
	return self.elements[key].add(obj);
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
		&& (set instanceof Cadabia.Set)
		&& set.remove(obj)) {
		if (set.isEmpty()) { // delete set when it is empty
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
		&& (set instanceof Cadabia.Set)
		&& set.contains(obj));
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
		_.each(
			self.elements,
			function (set) {set.each(fun);} // call each set.each()
		);
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
 * get this OidSet string format
 */
// TODO
OidSet.prototype.toString = function () {
	return '';
}

// static method
/*
 * generate element's key string, for identify elements
 */
OidSet.objectKey = function (oid) {
	return JSON.stringify({
		prefix: oid.getPrefix(),
		class: oid.getClass()
	});
}

// export
Cadabia.OidSet = OidSet;
