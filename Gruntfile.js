module.exports = function(grunt) {
    'use strict';

    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            all: ['Gruntfile.js', 'bin/*', 'lib/**/*.js', 'test/**/*.js']
        },

        watch: {
            src: {
                files: ['bin/*', 'lib/**/*.js'],
                tasks: ['jshint']
            }
        }
    });

    grunt.registerTask('default', ['jshint']);
    grunt.registerTask('watch', ['watch']);
};