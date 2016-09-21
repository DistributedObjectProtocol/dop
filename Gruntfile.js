module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        watch: {
            scripts: {
                files: ['src/*','src/*/*','src/*/*/*','src/*/*/*/*'],
                tasks: ['default'],
                options: {
                    spawn: false,
                },
            },
        },

        concat: {
            options: {
                process: function(src, filepath) {
                    return '\n//////////  ' + filepath + '\n' + src + '\n\n\n';
                }
            },
            nodejs: {
                src: [
                    'src/dop.js',
                    'src/env/nodejs/**', // needed here dop.core.listener.prototype = Object.create( dop.util.emitter.prototype );
                    'src/util/*',
                    'src/api/*',
                    'src/core/**',
                    'src/protocol/*',
                    'src/node/*',
                    'src/umd.js'
                ],
                dest: 'dist/nodejs.js'
            },
            browser: {
                src: [
                    'src/dop.js',
                    'src/env/browser/**', // needed here dop.core.listener.prototype = Object.create( dop.util.emitter.prototype );
                    'src/util/*',
                    'src/api/*',
                    'src/core/**',
                    'src/protocol/*',
                    'src/node/*',
                    'src/umd.js'
                ],
                dest: 'dist/browser.js'
            }
        },

        uglify: {
            build: {
                src: 'dist/browser.js',
                dest: 'dist/browser.min.js'
            }
        },

    });



    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');


    grunt.registerTask('default', ['concat:nodejs', 'concat:browser', 'uglify', 'watch']);




};
