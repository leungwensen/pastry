'use strict';

module.exports = function(grunt) {
    var pkg = grunt.file.readJSON('package.json');

    grunt.initConfig({

        // project settings
        pkg: pkg,
        banner: '/* ' +
                '<%= pkg.title || pkg.name %> v<%= pkg.version %>\n' +
                '<%= pkg.homepage ? "*  " + pkg.homepage + "\\n" : "" %>' +
                '*  Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
                '  Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',

        // build and test
        clean: {
            src: ['dist/css', 'dist/font', 'dist/js']
        },
        concat: {
            dist: {
                options: {
                    banner: '<%= banner %>' + '\n"use strict";\n\n',
                    stripBanners: true,
                    process: function(src, filepath) {
                        return src.replace(/(^|\n)[ \t]*('use strict'|"use strict");?\s*/g, '$1');
                    },
                },
                files: {
                    'dist/js/<%= pkg.name %>-<%= pkg.version %>.js': pkg.jsFiles,
                }

            }
        },
        jshint: {
            gruntfile: {
                options: {
                    jshintrc: '.jshintrc'
                },
                src: 'Gruntfile.js'
            },
            src: {
                options: {
                    jshintrc: 'js/.jshintrc'
                },
                src: ['js/**/*.js']
            },
            test: {
                options: {
                    jshintrc: 'spec/.jshintrc'
                },
                src: ['spec/*.js']
            }
        },
        jasmine: {
            src : 'dist/js/*.js',
            options : {
                specs  : 'spec/brick.*.spec.js',
                vendor : 'dist/js/*.js'
            }
        },
        sass: {
            dist: {
                files: {
                    'dist/css/<%= pkg.name %>-<%= pkg.version %>.css': 'scss/<%= pkg.name %>.scss'
                }
            }
        },
        copy: {
            main: {
                files: [{
                    expand: true,
                    src: ["font/*"],
                    dest: 'dist/'
                }, {
                    expand: true,
                    src: ["font/*"],
                    dest: 'release/'
                }]
            }
        },

        // release
        cssmin: {
            add_banner: {
                options: {
                    banner: '<%= banner %>'
                },
                files: {
                    'release/css/<%= pkg.name %>-<%= pkg.version %>.min.css': [
                        'dist/css/<%= pkg.name %>-<%= pkg.version %>.css'
                    ]
                }
            },
            minify: {
                expand: true,
                cwd: 'release/css/',
                src: ['dist/css/<%= pkg.name %>.css'],
                dest: 'release/css/',
                ext: '.min.css'
            }
        },
        uglify: {
            options: {
                banner: '<%= banner %>'
            },
            dist: {
                src: 'dist/js/<%= pkg.name %>-<%= pkg.version %>.js',
                dest: 'release/js/<%= pkg.name %>-<%= pkg.version %>.min.js'
            }
        },

        connect: {
            server: {
                options: {
                    port: 3000,
                    base: '.'
                }
            }
        },
        jekyll: {
            docs: {}
        },
        validation: {
            options: {
                reset: true
            },
            files: {
                src: ["_gh_pages/**/*.html"]
            }
        },
        watch: {
            gruntfile: {
                files: '<%= jshint.gruntfile.src %>',
                tasks: ['jshint:gruntfile']
            },
            src: {
                files: '<%= jshint.src.src %>',
                tasks: ['jshint:src', 'qunit']
            },
            test: {
                files: '<%= jshint.test.src %>',
                tasks: ['jshint:test', 'qunit']
            }
        }
    });

    // npm tasks
    grunt.loadNpmTasks('grunt-contrib-clean'  );
    grunt.loadNpmTasks('grunt-contrib-concat' );
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-copy'   );
    grunt.loadNpmTasks('grunt-contrib-cssmin' );
    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.loadNpmTasks('grunt-contrib-jshint' );
    grunt.loadNpmTasks('grunt-contrib-sass'   );
    grunt.loadNpmTasks('grunt-contrib-uglify' );
    grunt.loadNpmTasks('grunt-contrib-watch'  );
    grunt.loadNpmTasks('grunt-jekyll'         );

    // grunt tasks
    grunt.registerTask('travis' , ['jshint', 'concat', 'jasmine']);
    grunt.registerTask('default', ['jshint', 'concat', 'jasmine', 'sass', 'copy']);
    grunt.registerTask('release', ['jshint', 'concat', 'jasmine', 'sass', 'copy', 'uglify', 'cssmin']);
};
