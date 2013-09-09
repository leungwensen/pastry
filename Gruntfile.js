'use strict';

module.exports = function(grunt) {
  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),
    banner: '/* '                                                                          +
            '<%= pkg.title || pkg.name %> v<%= pkg.version %>\n'                           +
            '<%= pkg.homepage ? "*  " + pkg.homepage + "\\n" : "" %>'                      +
            '*  Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
            '  Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',

    clean: {
      src: ['dist/css', 'dist/font', 'dist/js']
    },
    concat: {
      options: {
        banner: '<%= banner %>',
        stripBanners: true
      },
      dist: {
        src: ['js/<%= pkg.name %>.js'],
        dest: 'dist/js/<%= pkg.name %>.js'
      },
    },
    qunit: {
      options: {
        inject: 'test/unit/phantom.js'
      },
      files: ['test/**/*.html']
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
          jshintrc: 'test/.jshintrc'
        },
        src: ['test/**/*.js']
      },
    },
    sass: {
        dist: {
            files: {
                'dist/css/<%= pkg.name %>.css': 'scss/<%= pkg.name %>.scss'
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

    cssmin: {
        add_banner: {
            options: {
                banner: '<%= banner %>'
            },
            files: {
                'dist/css/<%= pkg.name %>.css': ['dist/css/<%= pkg.name %>.css']
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
        src: '<%= concat.dist.dest %>',
        dest: 'release/js/<%= pkg.name %>.min.js'
      },
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
      },
    },

  });

  grunt.loadNpmTasks('grunt-contrib-clean'  );
  grunt.loadNpmTasks('grunt-contrib-concat' );
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-copy'   );
  grunt.loadNpmTasks('grunt-contrib-cssmin' );
  grunt.loadNpmTasks('grunt-contrib-jshint' );
  grunt.loadNpmTasks('grunt-contrib-qunit'  );
  grunt.loadNpmTasks('grunt-contrib-sass'   );
  grunt.loadNpmTasks('grunt-contrib-uglify' );
  grunt.loadNpmTasks('grunt-contrib-watch'  );
  grunt.loadNpmTasks('grunt-jekyll'         );

  grunt.registerTask('default', ['jshint', 'qunit', 'clean', 'concat', 'sass', 'copy']);
  grunt.registerTask('release', ['jshint', 'qunit', 'clean', 'concat', 'sass', 'copy', 'uglify', 'cssmin']);
};
