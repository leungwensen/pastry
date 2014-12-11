/* jshint strict: true, undef: true, unused: true */
/* global module */

var pastry = require('pastry');

module.exports = function (grunt) {
    'use strict';
    var pkg  = grunt.file.readJSON('package.json'),
        conf = {
            browserModules : require('./data/js/browserModules.js'),
            nodeModules    : require('./data/js/nodeModules.js')
        },
        banner = '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
            '<%= grunt.template.today("yyyy-mm-dd") %> */';

    pastry.extend(pkg, {
        main    : pastry.sprintf(pkg.main   , pkg.version),
        browser : pastry.sprintf(pkg.browser, pkg.version)
    });

    grunt.initConfig({
        pkg: pkg,

        dist: {
            browser : 'dist/browser-debug.js',
            node    : 'dist/node-debug.js',
            css     : 'dist/debug.css'
        },

        path: {
            release: 'release'
        },

        clean: {
            src: [
                '<%= path.release %>'
            ]
        },

        concat: {
            options: {
                separator    : '',
                stripBanners : true,
                banner       : banner
            },
            browserDebug: {
                src  : conf.browserModules,
                dest : '<%= dist.browser %>'
            },
            nodeDebug: {
                src  : conf.nodeModules,
                dest : '<%= dist.node %>'
            },
        },

        cssmin: {
            release: {
                files: {
                    'release/<%= pkg.version %>/pastry.min.css': '<%= dist.css %>'
                }
            }
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
            src: '<%= dist.node %>',
            options: {
                specs: 'test/jasmine/**/*.spec.js'
            }
        },

        less: {
            development: {
                files: {
                    '<%= dist.css %>' : 'src/ui/less/main.less'
                }
            }
        },

        uglify: {
            options: {
                banner: banner
            },
            release: {
                files: {
                    '<%= pkg.browser %>' : '<%= dist.browser %>',
                    '<%= pkg.main %>'    : '<%= dist.node %>'
                }
            }
        }
    });

    pastry.each([
        'clean',
        'concat',
        'cssmin',
        'jasmine',
        'jshint',
        'less',
        'uglify'
    ], function (task) {
        grunt.loadNpmTasks('grunt-contrib-' + task);
    });

    grunt.registerTask('default', [
        'jshint',
        'concat',
        'jasmine',
        'less'
    ]);
    grunt.registerTask('release', [
        'jshint',
        'concat',
        'jasmine',
        'uglify',
        'less',
        'cssmin'

    ]);
    grunt.registerTask('travis', [
        'jshint',
        'jasmine'
    ]);
};

