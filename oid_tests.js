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
	test.equal(oid.object, 'object');
	
	var oid = new Cadabia.Oid('prefix2', 'class2', 'object2');
	test.equal(oid.prefix, 'prefix2');
	test.equal(oid.class, 'class2');
	test.equal(oid.object, 'object2');
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

Tinytest.add('Oid - getObject', function (test) {
	var oid = new Cadabia.Oid('prefix', 'class', 'object1');
	test.equal(oid.getObject(), 'object1');
	
	oid = new Cadabia.Oid('prefix', 'class', 'object2');
	test.equal(oid.getObject(), 'object2');
	
	// null object, meaning all objects
	oid = new Cadabia.Oid('prefix', 'class', null);
	test.equal(oid.getObject(), null);
	
	// not string object will be convert to null
	oid = new Cadabia.Oid('prefix', 'class', true);
	test.equal(oid.getObject(), null);
	
	oid = new Cadabia.Oid('prefix', 'class', ['object', 1, false]);
	test.equal(oid.getObject(), null);
});

Tinytest.add('Oid - toString', function (test) {
	var oid = new Cadabia.Oid(null, 'class', null);
	test.equal(oid.toString(), '@class');
	
	oid = new Cadabia.Oid('prefix', 'class', null);
	test.equal(oid.toString(), 'prefix:@class');
	
	oid = new Cadabia.Oid(null, 'class', 'object');
	test.equal(oid.toString(), '@class[object]');
	
	oid = new Cadabia.Oid('prefix', 'class', 'object');
	test.equal(oid.toString(), 'prefix:@class[object]');
});
