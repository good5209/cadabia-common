// constructor
/*
 * Sorted set
 * set elements are sorted
 */
function SortedSet() {
	this.elements = {};
}

// inherit Cadabia.Set
SortedSet.prototype = new Cadabia.Set();
SortedSet.prototype.constructor = SortedSet;

// static method
/*
 * elements sort's custom compare function
 * if 'null' exist, it will first
 */
SortedSet.elementCompare = function(a, b) {
	if (a[0] === 'null') {
		return -1;
	} else if (b[0] === 'null') {
		return 1;
	}
	if (a > b) {
		return 1;
	} else if (a < b) {
		return -1;
	}
	return 0;
}

// instance method
/*
 * add elemenet to set
 * return true: success, false: element already added
 */
SortedSet.prototype.add = function(obj) {
	var self = this;
	if (!self.contains(obj)) {
		self.elements[Cadabia.Set.objectKey(obj)] = obj;
		
		self.elements = _.reduce(
			_.pairs(self.elements) // get all element pairs
				.sort(SortedSet.elementCompare), // sort it by custom function
			function (memo, each) { // add sorted pairs to new object
				memo[each[0]] = each[1];
				return memo;
			}, {});
		return true;
	}
	return false;
}

/*
 * clone all contain elements to a new set
 */
SortedSet.prototype.clone = function() {
	var self = this;
	var result = new SortedSet();
	// just clone elements
	result.elements = _.clone(self.elements);
	return result;
}

/*
 * intersection with another set
 */
SortedSet.prototype.intersection = function(set) {
	var self = this;
	var result = new SortedSet();
	if (self.size() < set.size()) {
		_.each(self.elements, function (value, key) {
			if (set.contains(value)) {
				result.elements[key] = value;
			}
		});
	} else {
		_.each(set.elements, function (value, key) {
			if (self.contains(value)) {
				result.elements[key] = value;
			}
		});
	}
	return result;
}

// export
Cadabia.SortedSet = SortedSet;