Tinytest.add('OidSet - new OidSet', function (test) {
	test.isNotNull(new Cadabia.OidSet());
});

Tinytest.add('OidSet - check type', function (test) {
	var set = new Cadabia.OidSet();
	test.equal(typeof(set), 'object');
	test.instanceOf(set, Cadabia.Set);
	test.instanceOf(set, Cadabia.OidSet);
});

Tinytest.add('OidSet - check field', function (test) {
	var set = new Cadabia.OidSet();
	test.notEqual(set.elements, 'undefined');
	test.equal(set.elements, {});
});

Tinytest.add('OidSet - contains', function (test) {
	var set = new Cadabia.OidSet();
	var oid = new Cadabia.Oid(null, '', null);
	test.isFalse(set.contains(oid));
	
	var oid1 = new Cadabia.Oid(null, 'class', null);
	test.isFalse(set.contains(oid1));
	// such element is a set, that set contain added Oid
	(set.elements[Cadabia.OidSet.objectKey(oid1)] = new Cadabia.Set())
		.add(oid1);
	test.isTrue(set.contains(oid1));
	
	var oid2 = new Cadabia.Oid('prefix', 'class', null);
	test.isFalse(set.contains(oid2));
	(set.elements[Cadabia.OidSet.objectKey(oid2)] = new Cadabia.Set())
		.add(oid2);
	test.isTrue(set.contains(oid2));
});

Tinytest.add('OidSet - add', function (test) {
	var set = new Cadabia.OidSet();
	
	var oid1 = new Cadabia.Oid(null, 'class', null);
	test.isFalse(set.contains(oid1));
	test.isTrue(set.add(oid1));
	test.isTrue(set.contains(oid1));
	test.isFalse(set.add(oid1)); // add again
	
	var oid2 = new Cadabia.Oid('prefix', 'class', null);
	test.isFalse(set.contains(oid2));
	test.isTrue(set.add(oid2));
	test.isTrue(set.contains(oid2));
	test.isFalse(set.add(oid2)); // add again
	
	var oid3 = new Cadabia.Oid('prefix', 'class', 'object');
	test.isFalse(set.contains(oid3));
	test.isTrue(set.add(oid3));
	test.isTrue(set.contains(oid3));
	test.isFalse(set.add(oid3)); // add again
});

Tinytest.add('OidSet - remove', function (test) {
	var set = new Cadabia.OidSet();
	var oid1 = new Cadabia.Oid(null, 'class', null);
	var oid2 = new Cadabia.Oid('prefix', 'class', null);
	
	test.isFalse(set.contains(oid1));
	test.isFalse(set.contains(oid2));
	test.isFalse(set.remove(oid1));
	test.isFalse(set.remove(oid2));
	
	set.add(oid1);
	set.add(oid2);
	test.isTrue(set.contains(oid1));
	test.isTrue(set.contains(oid2));
	
	test.isTrue(set.remove(oid1));
	test.isFalse(set.contains(oid1));
	test.isTrue(set.contains(oid2));
	test.isFalse(set.remove(oid1)); // remove again
	
	test.isTrue(set.remove(oid2));
	test.isFalse(set.contains(oid1));
	test.isFalse(set.contains(oid2));
	test.isFalse(set.remove(oid2)); // remove again
});

Tinytest.add('OidSet - isEmpty', function (test) {
	var set = new Cadabia.OidSet();
	test.isTrue(set.isEmpty());
	
	var oid1 = new Cadabia.Oid(null, 'class', null);
	set.add(oid1);
	test.isFalse(set.isEmpty());
	
	set.remove(oid1);
	test.isTrue(set.isEmpty());
	
	var oid2 = new Cadabia.Oid('prefix', 'class', null);
	set.add(oid1);
	set.add(oid2);
	test.isFalse(set.isEmpty());
});

Tinytest.add('OidSet - equals', function (test) {
	var set1 = new Cadabia.OidSet();
	var set2 = new Cadabia.OidSet();
	test.isTrue(set1.equals(set2));
	test.isTrue(set2.equals(set1));
	
	var oid1 = new Cadabia.Oid('prefix', 'class1', 'object');
	var oid2 = new Cadabia.Oid('prefix', 'class2', null);
	var oid3 = new Cadabia.Oid('prefix', 'class3', 'object2');
	
	set1.add(oid1);
	test.isFalse(set1.equals(set2));
	test.isFalse(set2.equals(set1));
	
	set2.add(oid1);
	test.isTrue(set1.equals(set2));
	test.isTrue(set2.equals(set1));
	
	set2.add(oid2);
	test.isFalse(set1.equals(set2));
	test.isFalse(set2.equals(set1));
	
	set1.add(oid2);
	test.isTrue(set1.equals(set2));
	test.isTrue(set2.equals(set1));
	
	set1.remove(oid3);
	test.isTrue(set1.equals(set2));
	test.isTrue(set2.equals(set1));
	
	set1.remove(oid1);
	test.isFalse(set1.equals(set2));
	test.isFalse(set2.equals(set1));
});

Tinytest.add('OidSet - clone', function (test) {
	var set = new Cadabia.OidSet();
	test.isTrue(set.isEmpty());
	
	var oid1 = new Cadabia.Oid('prefix', 'class1', 'object');
	var oid2 = new Cadabia.Oid('prefix', 'class2', null);
	set.add(oid1);
	set.add(oid2);
	var cloneSet = set.clone();
	test.isTrue(cloneSet.contains(oid1));
	test.isTrue(cloneSet.contains(oid2));
	test.isTrue(set.equals(cloneSet));
	test.isTrue(cloneSet.equals(set));
	
	set.remove(oid1);
	test.isTrue(cloneSet.contains(oid1));
	test.isTrue(cloneSet.contains(oid2));
	test.isFalse(set.equals(cloneSet));
	test.isFalse(cloneSet.equals(set));
	
	cloneSet.remove(oid1);
	test.isFalse(cloneSet.contains(oid1));
	test.isTrue(cloneSet.contains(oid2));
	test.isTrue(set.equals(cloneSet));
	test.isTrue(cloneSet.equals(set));
});

Tinytest.add('OidSet - size', function (test) {
	var set = new Cadabia.OidSet();
	test.equal(set.size(), 0);
	
	var oid1 = new Cadabia.Oid('prefix', 'class1', 'object');
	var oid2 = new Cadabia.Oid('prefix', 'class2', null);
	var oid3 = new Cadabia.Oid('prefix', 'class1', 'object2');
	set.add(oid1);
	set.add(oid2);
	test.equal(set.size(), 2);
	
	set.add(oid3);
	test.equal(set.size(), 3);
	
	set.remove(oid1);
	test.equal(set.size(), 2);
	
	set.remove(oid3);
	test.equal(set.size(), 1);
	
	set.remove(oid2);
	test.equal(set.size(), 0);
});

Tinytest.add('OidSet - each', function (test) {
	var set = new Cadabia.OidSet();

	var oid1 = new Cadabia.Oid('prefix', 'class1', 'object');
	var oid2 = new Cadabia.Oid('prefix', 'class2', 'object2');
	var oid3 = new Cadabia.Oid('prefix', 'class3', 'object3');
	set.add(oid1);
	set.add(oid2);
	set.add(oid3);
	set.each(function (oid) {
		set.remove(oid);
	});
	test.isTrue(set.isEmpty());
	
	set.add(oid1);
	set.add(oid2);
	set.add(oid3);
	var oid12 = new Cadabia.Oid('prefix', 'class12', 'object');
	var oid22 = new Cadabia.Oid('prefix', 'class22', 'object2');
	var oid32 = new Cadabia.Oid('prefix', 'class32', 'object3');
	set.each(function (oid) { // append '2' after each Oid class name
		set.add(new Cadabia.Oid(oid.getPrefix(), oid.getClass() + '2', oid.getObject()));
	});
	test.isTrue(set.contains(oid12));
	test.isTrue(set.contains(oid22));
	test.isTrue(set.contains(oid32));
});

Tinytest.add('OidSet - union', function (test) {
	var oid1 = new Cadabia.Oid('prefix1', 'class1', 'object1');
	var oid2 = new Cadabia.Oid('prefix2', 'class2', 'object2');
	var oid3 = new Cadabia.Oid('prefix3', 'class3', 'object3');
	var oid4 = new Cadabia.Oid('prefix4', 'class4', 'object4');
	var oid5 = new Cadabia.Oid('prefix5', 'class5', 'object5');
	
	var set1 = new Cadabia.OidSet();
	set1.add(oid1);
	set1.add(oid2);
	set1.add(oid3);
	var set2 = new Cadabia.OidSet();
	set2.add(oid2);
	set2.add(oid4);
	set2.add(oid5);
	var set3 = new Cadabia.OidSet();
	set3.add(oid1);
	set3.add(oid2);
	set3.add(oid3);
	set3.add(oid4);
	set3.add(oid5);
	
	var unionSet = set1.union(set2);
	test.isTrue(unionSet.equals(set3));
	test.instanceOf(unionSet, Cadabia.OidSet);
});

Tinytest.add('OidSet - intersection', function (test) {
	var oid1 = new Cadabia.Oid('prefix1', 'class1', 'object1');
	var oid2 = new Cadabia.Oid('prefix2', 'class2', 'object2');
	var oid3 = new Cadabia.Oid('prefix3', 'class3', 'object3');
	var oid4 = new Cadabia.Oid('prefix4', 'class4', 'object4');
	var oid5 = new Cadabia.Oid('prefix5', 'class5', 'object5');
	
	var set1 = new Cadabia.OidSet();
	set1.add(oid1);
	set1.add(oid2);
	set1.add(oid3);
	var set2 = new Cadabia.OidSet();
	set2.add(oid2);
	set2.add(oid4);
	set2.add(oid5);
	var set3 = new Cadabia.OidSet();
	set3.add(oid2);
	
	var intersectSet = set1.intersection(set2);
	test.isTrue(intersectSet.equals(set3));
	test.instanceOf(intersectSet, Cadabia.OidSet);
});

Tinytest.add('OidSet - difference', function (test) {
	var oid1 = new Cadabia.Oid('prefix1', 'class1', 'object1');
	var oid2 = new Cadabia.Oid('prefix2', 'class2', 'object2');
	var oid3 = new Cadabia.Oid('prefix3', 'class3', 'object3');
	var oid4 = new Cadabia.Oid('prefix4', 'class4', 'object4');
	var oid5 = new Cadabia.Oid('prefix5', 'class5', 'object5');
	
	var set1 = new Cadabia.OidSet();
	set1.add(oid1);
	set1.add(oid2);
	set1.add(oid3);
	var set2 = new Cadabia.OidSet();
	set2.add(oid2);
	set2.add(oid4);
	set2.add(oid5);
	var set3 = new Cadabia.OidSet();
	set3.add(oid1);
	set3.add(oid3);
	
	var differentSet = set1.difference(set2);
	test.isTrue(differentSet.equals(set3));
	test.instanceOf(differentSet, Cadabia.OidSet);
});

/*
Tinytest.add('OidSet - toString', function (test) {
	var set = new Cadabia.OidSet();
	test.equal(set.toString(), '');
});
*/

Tinytest.add('OidSet.ObjectSet - new ObjectSet', function (test) {
	test.isNotNull(new Cadabia.OidSet.ObjectSet());
});

Tinytest.add('OidSet.ObjectSet - check type', function (test) {
	var set = new Cadabia.OidSet.ObjectSet();
	test.equal(typeof(set), 'object');
	test.instanceOf(set, Cadabia.Set);
	test.instanceOf(set, Cadabia.OidSet.ObjectSet);
});

Tinytest.add('OidSet.ObjectSet - check field', function (test) {
	var set = new Cadabia.OidSet.ObjectSet();
	test.notEqual(set.elements, 'undefined');
	test.notEqual(set.excludes, 'undefined');
	test.equal(set.elements, {});
	test.equal(set.excludes, {});
});

Tinytest.add('OidSet.ObjectSet - contains', function (test) {
	var set = new Cadabia.OidSet.ObjectSet();
	test.isFalse(set.contains('a'));
	test.isFalse(set.contains('b'));
	test.isFalse(set.contains(null));
	
	set.elements[Cadabia.Set.objectKey('a')] = 'a';
	test.isTrue(set.contains('a'));
	test.isFalse(set.contains('b'));
	test.isFalse(set.contains(null));
	
	set.elements[Cadabia.Set.objectKey('b')] = 'b';
	test.isTrue(set.contains('a'));
	test.isTrue(set.contains('b'));
	test.isFalse(set.contains(null));
	
	set.elements[Cadabia.Set.objectKey(null)] = null;
	test.isTrue(set.contains('a'));
	test.isTrue(set.contains('b'));
	test.isTrue(set.contains(null));
	
	set = new Cadabia.OidSet.ObjectSet();
	test.isFalse(set.contains('a'));
	test.isFalse(set.contains('b'));
	test.isFalse(set.contains(null));
	
	set.elements[Cadabia.Set.objectKey(null)] = null;
	test.isTrue(set.contains('a'));
	test.isTrue(set.contains('b'));
	test.isTrue(set.contains(null));
});

Tinytest.add('OidSet.ObjectSet - add', function (test) {
	var set = new Cadabia.OidSet.ObjectSet();
	test.isFalse(set.contains('a'));
	test.isTrue(set.add('a'));
	test.isTrue(set.contains('a'));
	test.isFalse(set.add('a')); // add again
	
	test.isFalse(set.contains('b'));
	test.isTrue(set.add('b'));
	test.isTrue(set.contains('b'));
	test.isFalse(set.add('b')); // add again
	
	test.isFalse(set.contains(null));
	test.isTrue(set.add(null));
	test.isTrue(set.contains(null));
	test.isFalse(set.add(null)); // add again
	
	test.isTrue(set.contains('c'));
	test.isFalse(set.add('c')); // null mean all objects in this class
	test.isTrue(set.contains('c'));
	
	set = new Cadabia.OidSet.ObjectSet();
	test.isFalse(set.contains('a'));
	test.isFalse(set.contains('b'));
	test.isFalse(set.contains(null));
	
	test.isTrue(set.add(null));
	test.isTrue(set.contains('a'));
	test.isTrue(set.contains('b'));
	test.isTrue(set.contains(null));
});

Tinytest.add('OidSet.ObjectSet - remove', function (test) {
	var set = new Cadabia.OidSet.ObjectSet();
	test.isFalse(set.contains('a'));
	test.isFalse(set.contains('b'));
	test.isFalse(set.remove('a'));
	test.isFalse(set.remove('b'));
	test.isFalse(set.remove(null));
	
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
	
	set.add(null);
	test.isTrue(set.contains('a'));
	test.isTrue(set.contains('b'));
	test.isTrue(set.contains('c'));
	test.isTrue(set.contains(null));
	
	test.isTrue(set.remove('a'));
	test.isFalse(set.contains('a'));
	test.isTrue(set.contains('b'));
	test.isTrue(set.contains('c'));
	test.isFalse(set.contains(null));
	test.isFalse(set.remove('a')); // remove again
	
	test.isTrue(set.remove('b'));
	test.isFalse(set.contains('a'));
	test.isFalse(set.contains('b'));
	test.isTrue(set.contains('c'));
	test.isFalse(set.contains(null));
	test.isFalse(set.remove('b')); // remove again
	
	test.isTrue(set.remove(null));
	test.isFalse(set.contains('a'));
	test.isFalse(set.contains('b'));
	test.isFalse(set.contains('c'));
	test.isFalse(set.contains(null));
	test.isFalse(set.remove(null)); // remove again
});

Tinytest.add('OidSet.ObjectSet - isEmpty', function (test) {
	var set = new Cadabia.OidSet.ObjectSet();
	test.isTrue(set.isEmpty());
	
	set.add('a');
	test.isFalse(set.isEmpty());
	
	set.remove('a');
	test.isTrue(set.isEmpty());
	
	set.add('a');
	set.add('b');
	test.isFalse(set.isEmpty());
	
	set.remove(null);
	test.isTrue(set.isEmpty());
});

Tinytest.add('OidSet.ObjectSet - equals', function (test) {
	var set1 = new Cadabia.OidSet.ObjectSet();
	var set2 = new Cadabia.OidSet.ObjectSet();
	test.isTrue(set1.equals(set1));
	test.isTrue(set1.equals(set2));
	test.isTrue(set2.equals(set1));
	
	set1.add('a');
	test.isTrue(set1.equals(set1));
	test.isFalse(set1.equals(set2));
	test.isFalse(set2.equals(set1));
	
	set2.add('a');
	test.isTrue(set2.equals(set2));
	test.isTrue(set1.equals(set2));
	test.isTrue(set2.equals(set1));
	
	set1.remove('b');
	test.isTrue(set1.equals(set2));
	test.isTrue(set2.equals(set1));
	
	set1.add(null);
	test.isFalse(set1.equals(set2));
	test.isFalse(set2.equals(set1));
	
	set2.add(null);
	test.isTrue(set1.equals(set2));
	test.isTrue(set2.equals(set1));
	
	set1.remove('a');
	set2.remove('b');
	test.isFalse(set1.equals(set2));
	test.isFalse(set2.equals(set1));
	
	set1.remove('b');
	set2.remove('a');
	test.isTrue(set1.equals(set2));
	test.isTrue(set2.equals(set1));
	
	set1.add(null);
	test.isFalse(set1.equals(set2));
	test.isFalse(set2.equals(set1));
	
	set1.remove(null);
	test.isFalse(set1.equals(set2));
	test.isFalse(set2.equals(set1));
	
	set2.remove(null);
	test.isTrue(set1.equals(set2));
	test.isTrue(set2.equals(set1));
});

Tinytest.add('OidSet.ObjectSet - clone', function (test) {
	var set = new Cadabia.OidSet.ObjectSet();
	test.isTrue(set.isEmpty());
	
	set.add('a');
	set.add('b');
	var cloneSet = set.clone();
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
	
	set = new Cadabia.OidSet.ObjectSet();
	set.add(null);
	set.remove('a');
	set.remove('b');
	var cloneSet = set.clone();
	test.isFalse(cloneSet.contains('a'));
	test.isFalse(cloneSet.contains('b'));
	test.isTrue(cloneSet.contains('c'));
	test.isTrue(set.equals(cloneSet));
	test.isTrue(cloneSet.equals(set));
	
	set.remove('c');
	test.isFalse(cloneSet.contains('a'));
	test.isFalse(cloneSet.contains('b'));
	test.isTrue(cloneSet.contains('c'));
	test.isFalse(set.equals(cloneSet));
	test.isFalse(cloneSet.equals(set));
	
	cloneSet.remove('c');
	test.isFalse(cloneSet.contains('a'));
	test.isFalse(cloneSet.contains('b'));
	test.isFalse(cloneSet.contains('c'));
	test.isTrue(cloneSet.contains('d'));
	test.isTrue(set.equals(cloneSet));
	test.isTrue(cloneSet.equals(set));
});

Tinytest.add('OidSet.ObjectSet - size', function (test) {
	try {
		var set = new Cadabia.OidSet.ObjectSet();
		set.size();
		test.isFalse(true, 'ObjectSet.size() should be fail');
	} catch (e) {
		test.isFalse(false);
	}
});
