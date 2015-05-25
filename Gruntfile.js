
module.exports = function (grunt) {
    'use strict';

    var spawn = require( "child_process" ).spawn,
        pkg   = grunt.file.readJSON('package.json');

    grunt.registerTask('compileTemplates', function () {
        var done = this.async();
        spawn('node', [
            './bin/js/compileTemplate.js',
        ], {
            stdio: "inherit"
        }).on("close", function(code) {
            done(code === 0);
        });
    });

    grunt.registerTask('promiseAPlusTests', function () {
        var done = this.async();
        spawn('node', [
            'node_modules/.bin/promises-aplus-tests',
            'test/promise/promise.adapter.js',
        ], {
            stdio: "inherit"
        }).on("close", function(code) {
            done(code === 0);
        });
    });

    require('time-grunt')(grunt);

    require('load-grunt-config')(grunt, {
        init: true,
        data: {
            pkg: pkg,
            banner: '/*! <%= pkg.name %> - v<%= pkg.version %> */',
            host: '127.0.0.1',
            port: 9090,
            livereload: 32599,

            path: {
                build: 'build',
                dist: 'dist/<%= pkg.version %>',
                src: 'src',
                test: 'test'
            },

            rjsOption: {
                paths: {
                    'pastry/pastry': 'empty:',
                    'pastry/event': 'empty:',
                    'pastry/locale/*': 'empty:',
                    'pastry/Module': 'empty:'
                },
                wrap: {
                    startFile: [
                        '<%= path.src %>/pastry/pastry.js',
                        '<%= path.src %>/pastry/event/event.js',
                        '<%= path.src %>/pastry/module/define.js'
                    ]
                }
            },

            build: {
                core: '<%= path.src %>/pastry/pastry.js',
                amd: '<%= path.src %>/amd-loader.js',
                nodejs: '<%= path.build %>/nodejs.js',
                ui: '<%= path.build %>/ui.js',
                css: {
                    '<%= path.build %>/pastry.css': '<%= path.src %>/pastry/stylesheet/pastry.less',
                    '<%= path.build %>/ui.css': '<%= path.src %>/pastry/stylesheet/ui.less',
                    '<%= path.build %>/theme/default.css': '<%= path.src %>/pastry/stylesheet/theme/default.less',
                },
                font: {
                    expand: true,
                    cwd: '<%= path.src %>/pastry/stylesheet/',
                    src: 'font/**',
                    dest: '<%= path.build %>/',
                }
            },

            dist: {
                js: {
                   '<%= path.dist %>/pastry.ui.min.js': '<%= build.ui %>',
                   '<%= path.dist %>/pastry.amd.min.js': '<%= build.amd %>',
                   '<%= path.dist %>/pastry.min.js': '<%= build.core %>',
                   '<%= path.dist %>/pastry.nodejs.min.js': '<%= build.nodejs %>'
                },
                css: {
                   '<%= path.dist %>/pastry.min.css': '<%= path.build %>/pastry.css',
                   '<%= path.dist %>/pastry.ui.min.css': '<%= path.build %>/ui.css',
                   '<%= path.dist %>/pastry.theme-default.min.css': '<%= path.build %>/theme/default.css',
                },
                font: {
                    expand: true,
                    cwd: '<%= path.src %>/pastry/stylesheet/',
                    src: 'font/**',
                    dest: '<%= path.dist %>/',
                }
            }
        }
    });
};

