Tinytest.add('SortedSet - new SortedSet', function (test) {
	test.isNotNull(new Cadabia.SortedSet());
});

Tinytest.add('SortedSet - check type', function (test) {
	var set = new Cadabia.SortedSet();
	test.equal(typeof(set), 'object');
	test.instanceOf(set, Cadabia.Set);
	test.instanceOf(set, Cadabia.SortedSet);
});

Tinytest.add('SortedSet - check field', function (test) {
	var set = new Cadabia.SortedSet();
	test.notEqual(set.elements, 'undefined');
	test.equal(set.elements, {});
});

Tinytest.add('SortedSet - objectKey', function (test) {
	test.equal(Cadabia.Set.objectKey(null), 'null'); // null
	test.equal(Cadabia.Set.objectKey('a'), 'String:"a"'); // string
	test.equal(Cadabia.Set.objectKey(0), 'Number:0'); // number
	test.equal(Cadabia.Set.objectKey([1, 2, 3]), 'Array:[1,2,3]'); // array
	test.equal(Cadabia.Set.objectKey({'k':'key', 'v':'value'}), 'Object:{"k":"key","v":"value"}'); // object
	test.equal(Cadabia.Set.objectKey(new Cadabia.Set()), 'Set:{"elements":{}}'); // class object
});

Tinytest.add('SortedSet - contains', function (test) {
	var set = new Cadabia.SortedSet();
	test.isFalse(set.contains(''));
	
	test.isFalse(set.contains('a'));
	set.elements[Cadabia.Set.objectKey('a')] = 'a';
	test.isTrue(set.contains('a'));
	
	test.isFalse(set.contains('b'));
	set.elements[Cadabia.Set.objectKey('b')] = 'b';
	test.isTrue(set.contains('b'));
});

Tinytest.add('SortedSet - add', function (test) {
	var set = new Cadabia.SortedSet();
	
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

Tinytest.add('SortedSet - remove', function (test) {
	var set = new Cadabia.SortedSet();
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

Tinytest.add('SortedSet - isEmpty', function (test) {
	var set = new Cadabia.SortedSet();
	test.isTrue(set.isEmpty());
	
	set.add({});
	test.isFalse(set.isEmpty());
	
	set.remove({});
	test.isTrue(set.isEmpty());
	
	set.add('a');
	set.add('b');
	test.isFalse(set.isEmpty());
});

Tinytest.add('SortedSet - equals', function (test) {
	var set1 = new Cadabia.SortedSet();
	var set2 = new Cadabia.SortedSet();
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

Tinytest.add('SortedSet - clone', function (test) {
	var set = new Cadabia.SortedSet();
	test.isTrue(set.isEmpty());
	
	set.add('a');
	set.add('b');
	var cloneSet = set.clone();
	test.instanceOf(cloneSet, Cadabia.SortedSet);
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

Tinytest.add('SortedSet - size', function (test) {
	var set = new Cadabia.SortedSet();
	test.equal(set.size(), 0);
	
	set.add('a');
	set.add('b');
	test.equal(set.size(), 2);
	
	set.remove('a');
	test.equal(set.size(), 1);
});

Tinytest.add('SortedSet - each', function (test) {
	var set = new Cadabia.SortedSet();
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

Tinytest.add('SortedSet - union', function (test) {
	var set1 = new Cadabia.SortedSet();
	set1.add('a');
	set1.add('b');
	set1.add('c');
	var set2 = new Cadabia.SortedSet();
	set2.add('b');
	set2.add('d');
	set2.add('e');
	var set3 = new Cadabia.SortedSet();
	set3.add('a');
	set3.add('b');
	set3.add('c');
	set3.add('d');
	set3.add('e');
	
	var unionSet = set1.union(set2);
	test.instanceOf(unionSet, Cadabia.SortedSet);
	test.isTrue(unionSet.equals(set3));
});

Tinytest.add('SortedSet - intersection', function (test) {
	var set1 = new Cadabia.SortedSet();
	set1.add('a');
	set1.add('b');
	set1.add('c');
	var set2 = new Cadabia.SortedSet();
	set2.add('b');
	set2.add('d');
	set2.add('e');
	var set3 = new Cadabia.SortedSet();
	set3.add('b');
	
	var intersectSet = set1.intersection(set2);
	test.instanceOf(intersectSet, Cadabia.SortedSet);
	test.isTrue(intersectSet.equals(set3));
});

Tinytest.add('SortedSet - difference', function (test) {
	var set1 = new Cadabia.SortedSet();
	set1.add('a');
	set1.add('b');
	set1.add('c');
	var set2 = new Cadabia.SortedSet();
	set2.add('b');
	set2.add('d');
	set2.add('e');
	var set3 = new Cadabia.SortedSet();
	set3.add('a');
	set3.add('c');
	
	var differentSet = set1.difference(set2);
	test.instanceOf(differentSet, Cadabia.SortedSet);
	test.isTrue(differentSet.equals(set3));
});

Tinytest.add('SortedSet - test sorted elements', function (test) {
	var set = new Cadabia.SortedSet();
	
	test.isFalse(set.contains('b'));
	test.isTrue(set.add('b'));
	test.isTrue(set.contains('b'));
	
	test.isFalse(set.contains('a'));
	test.isTrue(set.add('a'));
	test.isTrue(set.contains('a'));
	
	test.isFalse(set.contains('c'));
	test.isTrue(set.add('c'));
	test.isTrue(set.contains('c'));
	
	test.isFalse(set.contains(null));
	test.isTrue(set.add(null));
	test.isTrue(set.contains(null));
	
	test.equal(set.elements, {'null':null, 'String:"a"':'a', 'String:"b"':'b', 'String:"c"':'c'});
	
	set = new Cadabia.SortedSet();
	set.add('b');
	set.add('a');
	set.add('c');
	set.add(null);
	test.equal(set.elements, {'null':null, 'String:"a"':'a', 'String:"b"':'b', 'String:"c"':'c'});
	
	set.remove('b');
	test.equal(set.elements, {'null':null, 'String:"a"':'a', 'String:"c"':'c'});
	
	set.remove(null);
	test.equal(set.elements, {'String:"a"':'a', 'String:"c"':'c'});
	
	set.remove('c');
	test.equal(set.elements, {'String:"a"':'a'});
	
	set.remove('a');
	test.equal(set.elements, {});
});
