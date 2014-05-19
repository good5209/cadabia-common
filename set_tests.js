Tinytest.add('Set - new Set', function (test) {
	test.isNotNull(new Cadabia.Set());
	
	try {
		Cadabia.Set();
		test.isFalse(true, 'Set() should be fail');
	} catch (e) {
		test.isFalse(false);
	}
});

Tinytest.add('Set - check type', function (test) {
	var set = new Cadabia.Set();
	test.equal(typeof(set), 'object');
	test.instanceOf(set, Cadabia.Set);
});

Tinytest.add('Set - check field', function (test) {
	var set = new Cadabia.Set();
	test.notEqual(set.elements, 'undefined');
	test.equal(set.elements, {});
});

Tinytest.add('Set - objectKey', function (test) {
	test.equal(Cadabia.Set.objectKey(null), 'null'); // null
	test.equal(Cadabia.Set.objectKey('null'), 'String:"null"'); // null string
	test.equal(Cadabia.Set.objectKey('a'), 'String:"a"'); // string
	test.equal(Cadabia.Set.objectKey(0), 'Number:0'); // number
	test.equal(Cadabia.Set.objectKey([1, 2, 3]), 'Array:[1,2,3]'); // array
	test.equal(Cadabia.Set.objectKey({'k':'key', 'v':'value'}), 'Object:{"k":"key","v":"value"}'); // object
	test.equal(Cadabia.Set.objectKey(new Cadabia.Set()), 'Set:{"elements":{}}'); // class object
});

Tinytest.add('Set - contains', function (test) {
	var set = new Cadabia.Set();
	test.isFalse(set.contains(''));
	
	test.isFalse(set.contains('a'));
	set.elements[Cadabia.Set.objectKey('a')] = 'a';
	test.isTrue(set.contains('a'));
	
	test.isFalse(set.contains('b'));
	set.elements[Cadabia.Set.objectKey('b')] = 'b';
	test.isTrue(set.contains('b'));
});

Tinytest.add('Set - add', function (test) {
	var set = new Cadabia.Set();
	
	test.isFalse(set.contains('a'));
	test.isTrue(set.add('a'));
	test.isTrue(set.contains('a'));
	test.isFalse(set.add('a')); // add again
	
	test.isFalse(set.contains('b'));
	test.isTrue(set.add('b'));
	test.isTrue(set.contains('b'));
	test.isFalse(set.add('b')); // add again
	
	test.isFalse(set.contains({}));
	test.isTrue(set.add({}));
	test.isTrue(set.contains({}));
	
	var obj = {};
	obj.key = "value";
	test.isFalse(set.contains(obj));
	set.add(obj);
	test.isTrue(set.contains(obj));
});

Tinytest.add('Set - remove', function (test) {
	var set = new Cadabia.Set();
	test.isFalse(set.contains('a'));
	test.isFalse(set.contains('b'));
	test.isFalse(set.remove('a'));
	test.isFalse(set.remove('b'));
	
	set.add('a');
	set.add('b');
	test.isTrue(set.contains('a'));
	test.isTrue(set.contains('b'));
	
	test.isTrue(set.remove('a'));
	test.isFalse(set.contains('a'));
	test.isTrue(set.contains('b'));
	test.isFalse(set.remove('a')); // remove again
	
	test.isTrue(set.remove('b'));
	test.isFalse(set.contains('a'));
	test.isFalse(set.contains('b'));
	test.isFalse(set.remove('b')); // remove again
});

Tinytest.add('Set - isEmpty', function (test) {
	var set = new Cadabia.Set();
	test.isTrue(set.isEmpty());
	
	set.add({});
	test.isFalse(set.isEmpty());
	
	set.remove({});
	test.isTrue(set.isEmpty());
	
	set.add('a');
	set.add('b');
	test.isFalse(set.isEmpty());
});

Tinytest.add('Set - equals', function (test) {
	var set1 = new Cadabia.Set();
	var set2 = new Cadabia.Set();
	test.isTrue(set1.equals(set2));
	test.isTrue(set2.equals(set1));
	
	set1.add('a');
	test.isFalse(set1.equals(set2));
	test.isFalse(set2.equals(set1));
	
	set2.add('a');
	test.isTrue(set1.equals(set2));
	test.isTrue(set2.equals(set1));
	
	set2.add('b');
	test.isFalse(set1.equals(set2));
	test.isFalse(set2.equals(set1));
	
	set1.add('b');
	test.isTrue(set1.equals(set2));
	test.isTrue(set2.equals(set1));
	
	set1.remove('c');
	test.isTrue(set1.equals(set2));
	test.isTrue(set2.equals(set1));
	
	set1.remove('a');
	test.isFalse(set1.equals(set2));
	test.isFalse(set2.equals(set1));
});

Tinytest.add('Set - clone', function (test) {
	var set = new Cadabia.Set();
	test.isTrue(set.isEmpty());
	
	set.add('a');
	set.add('b');
	var cloneSet = set.clone();
	test.instanceOf(set, Cadabia.Set);
	test.isTrue(cloneSet.contains('a'));
	test.isTrue(cloneSet.contains('b'));
	test.isTrue(set.equals(cloneSet));
	test.isTrue(cloneSet.equals(set));
	
	set.remove('a');
	test.isTrue(cloneSet.contains('a'));
	test.isTrue(cloneSet.contains('b'));
	test.isFalse(set.equals(cloneSet));
	test.isFalse(cloneSet.equals(set));
	
	cloneSet.remove('a');
	test.isFalse(cloneSet.contains('a'));
	test.isTrue(cloneSet.contains('b'));
	test.isTrue(set.equals(cloneSet));
	test.isTrue(cloneSet.equals(set));
});

Tinytest.add('Set - size', function (test) {
	var set = new Cadabia.Set();
	test.equal(set.size(), 0);
	
	set.add('a');
	set.add('b');
	test.equal(set.size(), 2);
	
	set.remove('a');
	test.equal(set.size(), 1);
});

Tinytest.add('Set - each', function (test) {
	var set = new Cadabia.Set();
	set.add('a');
	set.add('b');
	set.add('c');
	set.each(function (element) {
		set.remove(element);
	});
	test.isTrue(set.isEmpty());
	
	set.add('a');
	set.add('b');
	set.add('c');
	set.each(function (element) {
		set.add(element + '2');
	});
	test.isTrue(set.contains('a2'));
	test.isTrue(set.contains('b2'));
	test.isTrue(set.contains('c2'));
});

Tinytest.add('Set - union', function (test) {
	var set1 = new Cadabia.Set();
	set1.add('a');
	set1.add('b');
	set1.add('c');
	var set2 = new Cadabia.Set();
	set2.add('b');
	set2.add('d');
	set2.add('e');
	var set3 = new Cadabia.Set();
	set3.add('a');
	set3.add('b');
	set3.add('c');
	set3.add('d');
	set3.add('e');
	
	var unionSet = set1.union(set2);
	test.instanceOf(unionSet, Cadabia.Set);
	test.isTrue(unionSet.equals(set3));
});

Tinytest.add('Set - intersection', function (test) {
	var set1 = new Cadabia.Set();
	set1.add('a');
	set1.add('b');
	set1.add('c');
	var set2 = new Cadabia.Set();
	set2.add('b');
	set2.add('d');
	set2.add('e');
	var set3 = new Cadabia.Set();
	set3.add('b');
	
	var intersectSet = set1.intersection(set2);
	test.instanceOf(intersectSet, Cadabia.Set);
	test.isTrue(intersectSet.equals(set3));
});

Tinytest.add('Set - difference', function (test) {
	var set1 = new Cadabia.Set();
	set1.add('a');
	set1.add('b');
	set1.add('c');
	var set2 = new Cadabia.Set();
	set2.add('b');
	set2.add('d');
	set2.add('e');
	var set3 = new Cadabia.Set();
	set3.add('a');
	set3.add('c');
	
	var differentSet = set1.difference(set2);
	test.instanceOf(differentSet, Cadabia.Set);
	test.isTrue(differentSet.equals(set3));
});
