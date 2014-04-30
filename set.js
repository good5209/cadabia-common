// constructor
function Set() {
	this.elements = {};
}

// instance method
/*
 * add elemenet to set
 * return true: success, false: element already added
 */
Set.prototype.add = function(obj) {
	var self = this;
	if (!self.contains(obj)) {
		self.elements[Set.objectKey(obj)] = obj;
		return true;
	}
	return false;
}

/*
 * remove element to set
 * return true: success, false: element not exist
 */
Set.prototype.remove = function(obj) {
	var self = this;
	if (self.contains(obj)) {
		delete self.elements[Set.objectKey(obj)];
		return true;
	}
	return false;
}

/*
 * check set contain such element
 */
Set.prototype.contains = function(obj) {
	var self = this;
	return _.has(self.elements, Set.objectKey(obj));
}

/*
 * check set is empty
 * see also: http://stackoverflow.com/questions/4994201/is-object-empty
 */
Set.prototype.isEmpty = function() {
	var self = this;
	return _.isEmpty(self.elements);
}

/*
 * check this set is equal to another set
 */
Set.prototype.equals = function(set) {
	var self = this;
	return _.isEqual(self, set);
}

/*
 * clone all contain elements to a new set
 */
Set.prototype.clone = function() {
	var self = this;
	var result = new Set();
	// just clone elements
	result.elements = _.clone(self.elements);
	return result;
}

/*
 * count elements
 */
Set.prototype.size = function() {
	var self = this;
	return _.keys(self.elements).length;
}

/*
 * apply function with every elements
 * function: function (eachElement)
 */
Set.prototype.each = function(fun) {
	var self = this;
	if (_.isFunction(fun)) {
		_.each(_.values(self.elements), fun);
	}
}

/*
 * union with another set
 */
Set.prototype.union = function(set) {
	var self = this;
	var result = self.clone();
	set.each(function (value) {result.add(value);});
	return result;
}

/*
 * intersection with another set
 */
Set.prototype.intersection = function(set) {
	var self = this;
	var result = new Set();
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

/*
 * difference with another set
 */
Set.prototype.difference = function(set) {
	var self = this;
	var result = self.clone();
	set.each(function(value) {result.remove(value);});
	return result;
}

// static method
/*
 * generate element's key string, for identify elements
 */
Set.objectKey = function (obj) {
	return obj.constructor.name + ":" + JSON.stringify(obj);
}

// export
Cadabia.Set = Set;