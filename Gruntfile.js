var exec = require('child_process').exec;

module.exports = function (grunt) {
    'use strict';

    var pkg = grunt.file.readJSON('package.json');

    grunt.registerTask('compileTemplates', function () {
        exec('./bin/js/compileTemplate.js', function (error, stdout, stderr) {
            console.log(error, stdout, stderr);
        });
    });

    require('time-grunt')(grunt);

    require('load-grunt-config')(grunt, {
        init: true,
        data: {
            pkg        : pkg,
            banner     : '/*! <%= pkg.name %> - v<%= pkg.version %> */',
            host       : '127.0.0.1',
            port       : 9090,
            livereload : 32599,

            path: {
                build : 'build',
                dist  : 'dist/<%= pkg.version %>',
                src   : 'src',
                test  : 'test'
            },

            rjsOption: {
                paths: {
                    'pastry/pastry'     : 'empty:',
                    'pastry/event/base' : 'empty:',
                    'pastry/Module'     : 'empty:'
                },
                wrap: {
                    startFile: [
                        '<%= path.src %>/pastry/pastry.js',
                        '<%= path.src %>/pastry/event/base.js',
                        '<%= path.src %>/pastry/module/define.js'
                    ]
                }
            },

            build: {
                core       : '<%= path.src %>/pastry/pastry.js',
                amd        : '<%= path.src %>/amd-loader.js',
                nodejs     : '<%= path.build %>/nodejs.js',
                components : '<%= path.build %>/components.js',
                css: {
                    '<%= path.build %>/pastry.css'        : '<%= path.src %>/pastry/stylesheet/pastry.less',
                    '<%= path.build %>/components.css'    : '<%= path.src %>/pastry/stylesheet/components.less',
                    '<%= path.build %>/theme/default.css' : '<%= path.src %>/pastry/stylesheet/theme/default.less',
                },
                font: {
                    expand : true,
                    cwd    : '<%= path.src %>/pastry/stylesheet/',
                    src    : 'font/**',
                    dest   : '<%= path.build %>/',
                }
            },

            dist: {
                js: {
                   '<%= path.dist %>/pastry.components.min.js' : '<%= build.components %>',
                   '<%= path.dist %>/pastry.amd.min.js'        : '<%= build.nodejs %>',
                   '<%= path.dist %>/pastry.min.js'            : '<%= build.core %>',
                   '<%= path.dist %>/pastry.nodejs.min.js'     : '<%= build.amd %>'
                },
                css: {
                   '<%= path.dist %>/pastry.min.css'               : '<%= path.build %>/pastry.css',
                   '<%= path.dist %>/pastry.components.min.css'    : '<%= path.build %>/components.css',
                   '<%= path.dist %>/pastry.theme-default.min.css' : '<%= path.build %>/theme/default.css',
                },
                font: {
                    expand : true,
                    cwd    : '<%= path.src %>/pastry/stylesheet/',
                    src    : 'font/**',
                    dest   : '<%= path.dist %>/',
                }
            }
        }
    });
};
