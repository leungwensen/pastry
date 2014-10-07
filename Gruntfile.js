/* jshint strict: true, undef: true, unused: true */
/* global module */
module.exports = function (grunt) {
    'use strict';
    var pkg = grunt.file.readJSON('package.json');

    grunt.initConfig({
        pkg: pkg,

        clean: {
            src: [
                'dist/',
                'release/'
            ]
        },

        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            files: {
                gruntfile: [
                    'Gruntfile.js'
                ],
                bin: [
                    'bin/js/*.js'
                ],
                json: [
                    'doc/json/*.json',
                    'package.json'
                ],
                src: [
                    'src/**/*.js'
                ],
                spec: [
                    'spec/*.js'
                ]
            }
        },

        jasmine: {
            src: 'src/*.js',
            options: {
                specs: 'test/jasmine/*.spec.js'
            }
        },

        uglify: {
            options: {
            },
            core: {
                files: {
                    '<%= pkg.main %>': 'src/core.js'
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.registerTask('default' , [
        'jasmine',
        'jshint',
        'uglify'
    ]);
};

