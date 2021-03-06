Tinytest.add('OidSet - new OidSet', function (test) {
	test.isNotNull(new Cadabia.OidSet());
	
	try {
		Cadabia.OidSet();
		test.isFalse(true, 'OidSet() should be fail');
	} catch (e) {
		test.isFalse(false);
	}
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
	(set.elements[Cadabia.OidSet.objectKey(oid1)] = new Cadabia.SortedSet())
		.add(oid1.getObject());
	test.isTrue(set.contains(oid1));
	
	var oid2 = new Cadabia.Oid('prefix', 'class', null);
	test.isFalse(set.contains(oid2));
	(set.elements[Cadabia.OidSet.objectKey(oid2)] = new Cadabia.SortedSet())
		.add(oid2.getObject());
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
	test.isTrue(set.contains(oid3));
	test.isFalse(set.add(oid3)); // set already contain this object
});

Tinytest.add('OidSet - remove', function (test) {
	var set = new Cadabia.OidSet();
	var oid1 = new Cadabia.Oid(null, 'class', null);
	var oid2 = new Cadabia.Oid('prefix', 'class', null);
	var oid3 = new Cadabia.Oid('prefix', 'class', 'object');
	
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
	
	test.isFalse(set.contains(oid3));
	set.add(oid3);
	test.isFalse(set.contains(oid2));
	test.isTrue(set.contains(oid3));
	
	set.add(oid2);
	test.isTrue(set.contains(oid2));
	test.isTrue(set.contains(oid3));
	test.isFalse(set.remove(oid3)); // reject remove single object in contain all objects set
	
	set.remove(oid2); // null object mean all objects
	test.isFalse(set.contains(oid2));
	test.isFalse(set.contains(oid3));
	
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
	test.instanceOf(cloneSet, Cadabia.OidSet);
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
	test.instanceOf(unionSet, Cadabia.OidSet);
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
	test.instanceOf(intersectSet, Cadabia.OidSet);
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
	test.instanceOf(differentSet, Cadabia.OidSet);
	test.isTrue(differentSet.equals(set3));
	test.instanceOf(differentSet, Cadabia.OidSet);
});

Tinytest.add('OidSet - toJSON', function (test) {
	var set = new Cadabia.OidSet();
	test.equal(set.toJSON(), []);
	
	var oids = [
		[new Cadabia.Oid(null, 'c1', null)],
		[new Cadabia.Oid(null, 'c2', 'o1'),
			new Cadabia.Oid(null, 'c2', 'o2'),
			new Cadabia.Oid(null, 'c2', 'o3')],
		[new Cadabia.Oid('null', 'c2', 'o1'),
			new Cadabia.Oid('null', 'c2', 'o2'),
			new Cadabia.Oid('null', 'c2', 'o3')],
		[new Cadabia.Oid('p1', 'c1', 'o1'),
			new Cadabia.Oid('p1', 'c1', 'o2'),
			new Cadabia.Oid('p1', 'c1', 'o3')],
		[new Cadabia.Oid('p1', 'c3', 'o1'),
			new Cadabia.Oid('p1', 'c3', 'o2'),
			new Cadabia.Oid('p1', 'c3', 'o3')],
		[new Cadabia.Oid('p2', 'c1', 'o1'),
			new Cadabia.Oid('p2', 'c1', 'o2'),
			new Cadabia.Oid('p2', 'c1', 'o3')]
	];
	
	set.add(oids[2][2]);
	set.add(oids[2][0]);
	set.add(oids[2][1]);
	set.add(oids[0][0]);
	set.add(oids[4][1]);
	set.add(oids[4][2]);
	set.add(oids[4][0]);
	set.add(oids[1][2]);
	set.add(oids[1][1]);
	set.add(oids[1][0]);
	set.add(oids[5][0]);
	set.add(oids[5][1]);
	set.add(oids[5][2]);
	set.add(oids[3][0]);
	set.add(oids[3][2]);
	set.add(oids[3][1]);
	
	test.equal(set.toJSON(), _.flatten(oids));
});

Tinytest.add('OidSet - toString', function (test) {
	var set = new Cadabia.OidSet();
	test.equal(set.toString(), '');
	
	var oids = [
		[new Cadabia.Oid(null, 'c1', null)],
		[new Cadabia.Oid(null, 'c2', 'o1'),
			new Cadabia.Oid(null, 'c2', 'o2'),
			new Cadabia.Oid(null, 'c2', 'o3')],
		[new Cadabia.Oid('null', 'c2', 'o1'),
			new Cadabia.Oid('null', 'c2', 'o2'),
			new Cadabia.Oid('null', 'c2', 'o3')],
		[new Cadabia.Oid('p1', 'c1', 'o1'),
			new Cadabia.Oid('p1', 'c1', 'o2'),
			new Cadabia.Oid('p1', 'c1', 'o3')],
		[new Cadabia.Oid('p1', 'c3', 'o1'),
			new Cadabia.Oid('p1', 'c3', 'o2'),
			new Cadabia.Oid('p1', 'c3', 'o3')],
		[new Cadabia.Oid('p2', 'c1', 'o1'),
			new Cadabia.Oid('p2', 'c1', 'o2'),
			new Cadabia.Oid('p2', 'c1', 'o3')]
	];
	_.each(_.flatten(oids), function (oid) {set.add(oid);});
	test.equal(set.toString(), '@c1;c2[o1;o2;o3];null:@c2[o1;o2;o3];p1:@c1[o1;o2;o3];c3[o1;o2;o3];p2:@c1[o1;o2;o3]');
	
	set = new Cadabia.OidSet();
	var oidc1 = new Cadabia.Oid(null, 'class1', null);
	var oidc1o1 = new Cadabia.Oid(null, 'class1', 'object1');
	var oidc1o2 = new Cadabia.Oid(null, 'class1', 'object2');
	var oidc2 = new Cadabia.Oid(null, 'class2', null);
	var oidc2o1 = new Cadabia.Oid(null, 'class2', 'object1');
	var oidc2o2 = new Cadabia.Oid(null, 'class2', 'object2');
	
	var oidp1c1 = new Cadabia.Oid('prefix1', 'class1', null);
	var oidp1c1o1 = new Cadabia.Oid('prefix1', 'class1', 'object1');
	var oidp1c1o2 = new Cadabia.Oid('prefix1', 'class1', 'object2');
	var oidp1c2 = new Cadabia.Oid('prefix1', 'class2', null);
	var oidp1c2o1 = new Cadabia.Oid('prefix1', 'class2', 'object1');
	var oidp1c2o2 = new Cadabia.Oid('prefix1', 'class2', 'object2');
	
	var oidp2c1 = new Cadabia.Oid('prefix2', 'class1', null);
	var oidp2c1o1 = new Cadabia.Oid('prefix2', 'class1', 'object1');
	var oidp2c1o2 = new Cadabia.Oid('prefix2', 'class1', 'object2');
	
	set.add(oidc1);
	test.equal(set.toString(), '@class1');
	
	set.add(oidc1o1); // add object in contain all objects set
	test.equal(set.toString(), '@class1');
	
	set.remove(oidc1);
	set.add(oidc1o1);
	test.equal(set.toString(), '@class1[object1]');
	
	set.add(oidc1o2);
	test.equal(set.toString(), '@class1[object1;object2]');
	
	set.add(oidc1); // add all objects
	test.equal(set.toString(), '@class1');
	
	set = new Cadabia.OidSet();
	set.add(oidc1);
	set.add(oidc2);
	test.equal(set.toString(), '@class1;class2');
	
	set.remove(oidc2);
	set.add(oidc2o2);
	test.equal(set.toString(), '@class1;class2[object2]');
	
	set = new Cadabia.OidSet();
	set.add(oidc1);
	set.add(oidp1c1);
	test.equal(set.toString(), '@class1;prefix1:@class1');
	
	set.remove(oidc1);
	set.add(oidc1o1);
	test.equal(set.toString(), '@class1[object1];prefix1:@class1');
	
	set.add(oidc2o2);
	test.equal(set.toString(), '@class1[object1];class2[object2];prefix1:@class1');
	
	set.remove(oidp1c1);
	set.add(oidp1c1o1);
	test.equal(set.toString(), '@class1[object1];class2[object2];prefix1:@class1[object1]');
	
	set.add(oidp1c2);
	test.equal(set.toString(), '@class1[object1];class2[object2];prefix1:@class1[object1];class2');
	
	set.remove(oidp1c2);
	set.add(oidp1c2o2);
	test.equal(set.toString(), '@class1[object1];class2[object2];prefix1:@class1[object1];class2[object2]');
	
	set.add(oidp1c1o2);
	set.add(oidp1c2o1);
	test.equal(set.toString(), '@class1[object1];class2[object2];prefix1:@class1[object1;object2];class2[object1;object2]');
	
	set.remove(oidp1c1o2);
	set.remove(oidp1c2o1);
	set.add(oidp2c1);
	test.equal(set.toString(), '@class1[object1];class2[object2];prefix1:@class1[object1];class2[object2];prefix2:@class1');
	
	set.remove(oidp2c1);
	set.add(oidp2c1o1);
	test.equal(set.toString(), '@class1[object1];class2[object2];prefix1:@class1[object1];class2[object2];prefix2:@class1[object1]');
	
	set.add(oidc1o2);
	set.add(oidc2o1);
	set.add(oidp1c1o2);
	set.add(oidp1c2o1);
	set.add(oidp2c1o2);
	test.equal(set.toString(), '@class1[object1;object2];class2[object1;object2];prefix1:@class1[object1;object2];class2[object1;object2];prefix2:@class1[object1;object2]');
	
	set.add(oidc1);
	set.add(oidc2);
	set.add(oidp1c1);
	set.add(oidp1c2);
	set.add(oidp2c1);
	test.equal(set.toString(), '@class1;class2;prefix1:@class1;class2;prefix2:@class1');
});
