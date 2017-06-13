module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    watch: {
        scripts: {
            files: ['src/*.js', "test/*.js", "main.js"],
            tasks: [ 'default'],
        },
    },
    jshint: {
        all: ['Gruntfile.js', 'src/*.js', 'test/*.js', 'main.js'],
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
    },
    eslint: {
        src: ["src/*.js", "main.js"]
    },

    gh-pages: {
      src: ["docs/*"]
    }

  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-jsdoc');
  grunt.loadNpmTasks('grunt-mocha-istanbul');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks("gruntify-eslint");
  grunt.loadNpmTasks('grunt-gh-pages');

  // Default task(s).
  grunt.registerTask('default', ['jshint', 'eslint', 'mocha_istanbul']);
  grunt.registerTask('docs', ['jsdoc', 'gh-pages']);

};
