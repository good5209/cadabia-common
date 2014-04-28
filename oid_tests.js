Tinytest.add('Oid - new Oid', function (test) {
	new Cadabia.Oid('prefix', 'class', 'object');
});

Tinytest.add('Oid - check type', function (test) {
	var oid = new Cadabia.Oid('prefix', 'class', 'object');
	test.equal(typeof(oid), 'object');
	test.equal(oid instanceof Cadabia.Oid, true);
});

Tinytest.add('Oid - check field', function (test) {
	var oid = new Cadabia.Oid('prefix', 'class', 'object');
	test.equal(oid.prefix, 'prefix');
	test.equal(oid.class, 'class');
	test.equal(oid.objects, ['object']);
	
	var oid = new Cadabia.Oid('prefix2', 'class2', 'object2');
	test.equal(oid.prefix, 'prefix2');
	test.equal(oid.class, 'class2');
	test.equal(oid.objects, ['object2']);
});

Tinytest.add('Oid - getPrefix', function (test) {
	var oid = new Cadabia.Oid('prefix', 'class', 'object');
	test.equal(oid.getPrefix(), 'prefix');
	
	oid = new Cadabia.Oid('prefix2', 'class', 'object');
	test.equal(oid.getPrefix(), 'prefix2');
	
	// null prefix, meaning default prefix
	oid = new Cadabia.Oid(null, 'class', 'object');
	test.equal(oid.getPrefix(), null);
});

Tinytest.add('Oid - getClass', function (test) {
	var oid = new Cadabia.Oid('prefix', 'class', 'object');
	test.equal(oid.getClass(), 'class');
	
	oid = new Cadabia.Oid('prefix', 'class2', 'object');
	test.equal(oid.getClass(), 'class2');
});

Tinytest.add('Oid - getObjects', function (test) {
	var oid = new Cadabia.Oid('prefix', 'class', 'object');
	test.equal(oid.getObjects(), ['object']);
	
	oid = new Cadabia.Oid('prefix', 'class', ['object']);
	test.equal(oid.getObjects(), ['object']);
	
	oid = new Cadabia.Oid('prefix', 'class', ['object1', 'object2']);
	test.equal(oid.getObjects(), ['object1', 'object2']);
	
	// object will sorted
	oid = new Cadabia.Oid('prefix', 'class', ['b', 'a', 'c']);
	test.equal(oid.getObjects(), ['a', 'b', 'c']);
	
	// null object, meaning all objects
	oid = new Cadabia.Oid('prefix', 'class', null);
	test.equal(oid.getObjects(), null);
	
	oid = new Cadabia.Oid('prefix', 'class', true);
	test.equal(oid.getObjects(), null);
	
	oid = new Cadabia.Oid('prefix', 'class', [0, 1, false]);
	test.equal(oid.getObjects(), null);
});

Tinytest.add('Oid - addObjects', function (test) {
	var oid = new Cadabia.Oid('prefix', 'class', 'a');
	test.equal(oid.getObjects(), ['a']);
	
	oid.addObjects('e');
	test.equal(oid.getObjects(), ['a', 'e']);
	
	oid.addObjects('c');
	test.equal(oid.getObjects(), ['a', 'c', 'e']);
	
	oid.addObjects(['0', 'd', 'f', 'b', 'a']);
	test.equal(oid.getObjects(), ['0', 'a', 'b', 'c', 'd', 'e', 'f']);
});

Tinytest.add('Oid - toString', function (test) {
	var oid = new Cadabia.Oid(null, 'class', null);
	test.equal(oid.toString(), '@class');
	
	oid = new Cadabia.Oid('prefix', 'class', null);
	test.equal(oid.toString(), 'prefix:@class');
	
	oid = new Cadabia.Oid(null, 'class', 'object');
	test.equal(oid.toString(), '@class[object]');
	
	oid = new Cadabia.Oid(null, 'class', ['object1', 'object2']);
	test.equal(oid.toString(), '@class[object1;object2]');
	
	oid = new Cadabia.Oid('prefix', 'class', 'object');
	test.equal(oid.toString(), 'prefix:@class[object]');
	
	oid = new Cadabia.Oid('prefix', 'class', ['object1', 'object2']);
	test.equal(oid.toString(), 'prefix:@class[object1;object2]');
});
