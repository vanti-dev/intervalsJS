module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
        all: ['Gruntfile.js', 'src/*.js', 'test/*.js'],
        options: {
            esversion: 6
        }
    },
    jsdoc: {
        dist: {
            src: ['src/*.js'],
            options: {
                destination: 'docs'
            }
        }
    },
    mocha_istanbul: {
        coverage: {
            src: 'test'
        }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-jsdoc');
  grunt.loadNpmTasks('grunt-mocha-istanbul');

  // Default task(s).
  grunt.registerTask('default', ['jshint', 'jsdoc', 'mocha_istanbul']);

};
