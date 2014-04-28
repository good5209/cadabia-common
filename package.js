Package.describe({
  summary: "Cadabia common, basic class"
});

Package.on_use(function (api, where) {
  api.export('Cadabia');
  // base export variable
  api.add_files('cadabia-common.js', ['client', 'server']);
  // data structure class
  api.add_files('set.js', ['client', 'server']);
  api.add_files('oid.js', ['client', 'server']);
  api.add_files('oidset.js', ['client', 'server']);
});

Package.on_test(function (api) {
  api.use(['cadabia-common', 'tinytest', 'test-helpers'], ['client', 'server']);

  //api.add_files('cadabia-common_tests.js', ['client', 'server']);
  api.add_files('oid_tests.js', ['client', 'server']);
  api.add_files('set_tests.js', ['client', 'server']);
  api.add_files('oidset_tests.js', ['client', 'server']);
});
