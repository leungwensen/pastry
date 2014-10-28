/* jshint strict: true, undef: true, unused: true */
/* global module */
var pastry = require('pastry');

module.exports = function (grunt) {
    'use strict';
    var pkg = grunt.file.readJSON('package.json');

    grunt.initConfig({
        pkg: pkg,

        path: {
            release: 'release'
        },

        clean: {
            src: [
                '<%= path.release %>'
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
            src: 'src/**/*.js',
            options: {
                specs: 'test/jasmine/*.spec.js',
                vendor: [
                    'src/core.js'
                ]
            }
        },

        uglify: {
            options: {
            },
            core: {
                files: {
                    '<%= pkg.main %>' : 'src/core.js',
                    '<%= path.release%>/<%= pkg.version %>/<%= pkg.name %>.amd.min.js' : 'src/amd/*.js'
                }
            }
        }
    });

    pastry.each([
        'clean',
        'jasmine',
        'jshint',
        'uglify'
    ], function (task) {
        grunt.loadNpmTasks('grunt-contrib-' + task);
    });

    grunt.registerTask('default', [
        'jasmine',
        'jshint',
        'clean',
        'uglify'
    ]);
    grunt.registerTask('travis', [
        'jasmine',
        'jshint'
    ]);
};

