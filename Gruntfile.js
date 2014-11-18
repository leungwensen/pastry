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
            src: 'release/<%= pkg.version %>/pastry.node.min.js',
            options: {
                specs: 'test/jasmine/**/*.spec.js'
            }
        },

        uglify: {
            options: {
            },
            core: {
                files: {
                    '<%= pkg.main %>'    : pkg.nodeModules,
                    '<%= pkg.browser %>' : pkg.browserModules
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
        'jshint',
        'uglify',
        'jasmine'
    ]);
    grunt.registerTask('travis', [
        'jshint',
        'jasmine'
    ]);
};

