'use strict';

module.exports = function (grunt) {
  // load all grunt tasks
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    watch: {
      files: [
        'www/*.js',
        'www/**/*.js',
        '!www/app.cat.js',
      ],
      tasks: ['build'],
      options: {
        spawn: true,
      },
    },

    concat: {
      app: {
        src: [
          'www/app.js',
          'www/**/*.js',
          'www/**/**/*.js',
          '!www/app.cat.js',
        ],
        dest: 'www/app.cat.js'
      }
    },

  });
  require('matchdep').filter('grunt-*').forEach(grunt.loadNpmTasks);
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  grunt.registerTask('build', ['concat']);
  grunt.registerTask('local', ['build', 'watch']);
};