module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    watch: {
        scripts: {
            files: ['src/*.js'],
            tasks: [ 'jshint', 'jsdoc'],
        },
    },
    jshint: {
        all: ['Gruntfile.js', 'src/*.js', 'test/*.js'],
        options: {
            esversion: 6
        }
    },
    jsdoc: {
        dist: {
            src: ['src/*.js', 'src/_utils.js'],
            options: {
                destination: 'docs',
                template: 'node_modules/docdash',
                readme: 'README.md'
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
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Default task(s).
  grunt.registerTask('default', ['jshint', 'jsdoc', 'mocha_istanbul']);

};
