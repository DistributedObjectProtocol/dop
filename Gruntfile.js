module.exports = function(grunt) {

    var dop = 'dop.js';
    var dopnodejs = 'dop.nodejs.js';
    var dopmin = 'dop.min.js';

    // Project configuration.
    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        watch: {
            scripts: {
                files: ['src/**', 'package.json'],
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
                dest: 'dist/'+dopnodejs
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
                dest: 'dist/'+dop
            }
        },


        'string-replace': {
            dist: {
                files: {
                    'dist/': ['dist/'+dop,'dist/'+dopnodejs],
                },
                options: {
                    replacements: [{
                        pattern: /{{VERSION}}/ig,
                        replacement: '<%= pkg.version %>'
                    }]
                }
            }
        },


        uglify: {
            build: {
                src: 'dist/'+dop,
                dest: 'dist/'+dopmin
            },
            options: {
                banner: '/* dop@<%= pkg.version %> - (c) 2016 Josema Gonzalez - MIT Licensed */\n'
            }
        },

        replace: {
            dist: {
                options: {
                    patterns: [
                        {
                            match: /\.core\./g,
                            replacement: '.c.'
                        },
                        {
                            match: /\.util\./g,
                            replacement: '.u.'
                        },
                        {
                            match: /\.protocol\./g,
                            replacement: '.p.'
                        }
                    ]
                },
                files: [
                    {
                        expand: true,
                        flatten: true,
                        src: 'dist/'+dopmin,
                        dest: 'dist'
                    }
                ]
            }
        },

        'optimize-js': {
            options: {
                sourceMap: false,
                silent: false
            },
            dist: {
                files: {
                    'dist/dop.min.opt.js': 'dist/'+dopmin
                }
            }
        }

    });



    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-replace');
    grunt.loadNpmTasks('grunt-optimize-js');
    grunt.loadNpmTasks('grunt-string-replace');


    var tasks = ['copy', 'concat:nodejs', 'concat:browser', 'string-replace', 'uglify',  /*'replace', 'optimize-js'*/];
    if (grunt.option('build') === undefined)
        tasks.push('watch');
    grunt.registerTask('default', tasks);


};
