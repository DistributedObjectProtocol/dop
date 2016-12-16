module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        watch: {
            scripts: {
                files: ['src/**'],
                tasks: ['default'],
                options: {
                    spawn: false,
                },
            },
        },

        copy: {
            main: {
                src: 'node_modules/dop-transports/connect/websocket.js',
                dest: 'src/env/browser/websocket.js',
            },
        },

        concat: {
            options: {
                banner: '/*\n' +
                ' * dop@<%= pkg.version %>\n' +
                ' * www.distributedobjectprotocol.org\n' +
                ' * (c) 2016 Josema Gonzalez\n' +
                ' * MIT License.\n' +
                ' */\n',
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
            },
            options: {
                banner: '/* dop@<%= pkg.version %> - (c) 2016 Josema Gonzalez - MIT Licensed */\n'
            }
        },

        'optimize-js': {
            options: {
                sourceMap: false,
                silent: false
            },
            dist: {
                files: {
                    'dist/browser.min.opt.js': 'dist/browser.min.js'
                }
            }
        }

    });



    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-optimize-js');


    var tasks = ['copy', 'concat:nodejs', 'concat:browser', 'uglify'/*, 'optimize-js'*/];
    if (grunt.option('build') === undefined)
        tasks.push('watch');
    grunt.registerTask('default', tasks);


};
