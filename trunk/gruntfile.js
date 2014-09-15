module.exports = function(grunt) {
    // Project Configuration
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        watch: {
            jade: {
                files: ['app/views/**'],
                options: {
                    livereload: true
                }
            },
            js: {
                files: ['public/js/**', 'app/**/*.js'],
                tasks: ['jshint'],
                options: {
                    livereload: true
                }
            },
            html: {
                files: ['public/views/**'],
                options: {
                    livereload: true
                }
            },
            css: {
                files: ['public/css/**'],
                options: {
                    livereload: true
                }
            }
        },
        copy: {
            main: {
                files: [
                    // includes files within path and its sub-directories
                    {expand: true, cwd: 'bower_components', src: ['**/*'], dest: 'public/lib/'},
                    {expand: true, cwd: 'public/css', src: ['bootstrap-cerulean.min.css'], dest: 'public/lib/bootstrap/dist/css/'},
                    {expand: true, cwd: 'CoreChanges', src: ['ui-bootstrap-tpls.js'], dest: 'public/lib/angular-bootstrap/'},
                    {expand: true, cwd: 'CustomJSBuilds', src: ['modernizr.custom.min.js'], dest: 'public/lib/modernizr/'}
                ]
            }
        },
        jshint: {
            all: ['gruntfile.js', 'public/js/**/*.js', 'test/mocha/**/*.js', 'test/karma/**/*.js', 'app/**/*.js']
        },
        nodemon: {
            dev: {
                script: 'app.js',
                options: {
                    ignore: ['README.md', 'node_modules/**', '.DS_Store'],
                    ext: 'js',
                    watch: ['app', 'config'],
                    delayTime: 1,
                    env: {
                        PORT: 3000
                    },
                    cwd: __dirname
                }
            }
        },
        concurrent: {
            tasks: ['nodemon', 'watch'],
            options: {
                logConcurrentOutput: true
            }
        },
        mochaTest: {
            options: {
                reporter: 'spec'
            },
            src: ['test/mocha/**/*.js']
        },
        env: {
            test: {
                NODE_ENV: 'test'
            }
        },
        karma: {
            unit: {
                configFile: 'test/karma/karma.conf.js'
            }
        }
    });

    //Load NPM tasks 
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-nodemon');
    grunt.loadNpmTasks('grunt-concurrent');
    grunt.loadNpmTasks('grunt-env');

    //Making grunt default to force in order not to break the project.
    grunt.option('force', true);

    //Default task(s).
    grunt.registerTask('default', ['jshint','copy', 'concurrent']);

    //Test task.
    grunt.registerTask('test', ['env:test', 'mochaTest', 'karma:unit']);
};