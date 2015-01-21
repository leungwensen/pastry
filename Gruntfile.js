var pastry = require('./dist/node-debug.js'),
    exec = require('child_process').exec;

module.exports = function (grunt) {
    'use strict';

    var pkg = grunt.file.readJSON('package.json');

    grunt.registerTask('linkFontFiles', function () {
        var target = 'release/' + pkg.version;
        exec(
            pastry.sprintf('echo %s | ./bin/sh/linkFontFiles.sh', target),
            function (error, stdout, stderr) {
                console.log(error, stdout, stderr);
            }
        );
    });

    grunt.registerTask('compileTemplatesAndBuild', function () {
        exec('make', function (error, stdout, stderr) {
            console.log(error, stdout, stderr);
        });
    });

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
            banner     : '/*! <%= pkg.name %> - v<%= pkg.version %> */' + grunt.util.linefeed,
            host       : '127.0.0.1',
            port       : 9090,
            livereload : 32599,
            path: {
                src     : 'src',
                dist    : 'dist',
                release : 'release'
            },
            modules: {
                amd     : require('./data/js/amdModules.js'),
                node    : require('./data/js/nodeModules.js'),
                browser : require('./data/js/browserModules.js')
            },
            dist: {
                amd     : '<%= path.src %>/amd-debug.js',
                node    : '<%= path.dist %>/node-debug.js',
                browser : '<%= path.dist %>/browser-debug.js',
                css     : '<%= path.dist %>/debug.css'
            }
        }
    });
};
