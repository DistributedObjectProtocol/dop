module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        copy: {
            main: { 
                files: [

                // Util
                {
                    src: 'server/src/util/typeof.js',
                    dest: 'browser/src/util/typeof.js',
                },{
                    src: 'server/src/util/promise.js',
                    dest: 'browser/src/util/promise.js',
                },{
                    src: 'server/src/util/path.js',
                    dest: 'browser/src/util/path.js',
                },{
                    src: 'server/src/util/merge.js',
                    dest: 'browser/src/util/merge.js',
                },{
                    src: 'server/src/util/arguments.js',
                    dest: 'browser/src/util/arguments.js',
                },{
                    src: 'server/src/util/get.js',
                    dest: 'browser/src/util/get.js',
                }

                // Core
                ,{
                    src: 'server/src/core/parse.js',
                    dest: 'browser/src/core/parse.js',
                },{
                    src: 'server/src/core/stringify.js',
                    dest: 'browser/src/core/stringify.js',
                },{
                    src: 'server/src/core/protocol.js',
                    dest: 'browser/src/core/protocol.js',
                },{
                    src: 'server/src/core/osp.js',
                    dest: 'browser/src/core/osp.js',
                },{
                    src: 'server/src/core/configure.js',
                    dest: 'browser/src/core/configure.js',
                },{
                    src: 'server/src/core/observe.js',
                    dest: 'browser/src/core/observe.js',
                },{
                    src: 'server/src/core/create_remote_function.js',
                    dest: 'browser/src/core/create_remote_function.js',
                },{
                    src: 'server/src/core/request.js',
                    dest: 'browser/src/core/request.js',
                },{
                    src: 'server/src/core/response.js',
                    dest: 'browser/src/core/response.js',
                },{
                    src: 'server/src/core/resolve.js',
                    dest: 'browser/src/core/resolve.js',
                },{
                    src: 'server/src/core/reject.js',
                    dest: 'browser/src/core/reject.js',
                }


                // OSP
                ,{
                    src: 'server/src/on/request.js',
                    dest: 'browser/src/on/request.js',
                },{
                    src: 'server/src/on/_request.js',
                    dest: 'browser/src/on/_request.js',
                }




                // API
                ,{
                    src: 'server/src/user/request.js',
                    dest: 'browser/src/api/request.js',
                }



                ],
            }
        },

        // symlink: {
        //     expanded: {
        //         files: [{
        //             src: 'server/src/core/protocol.js',
        //             dest: 'browser/src/core/protocol.js'
        //         }, {
        //             src: 'server/src/util/typeof.js',
        //             dest: 'browser/src/core/typeof.js'
        //         }],
        //     }
        // },


        concat: {
            options: {
                process: function(src, filepath) {
                    return '\n\n\n\n//////////  ' + filepath + '\n' + src;
                }
            },
            dist: {
                src: [
                    'server/src/synko.js',
                    'server/src/core/*',
                    'server/src/api/*',
                    'server/src/on/*',
                    'server/src/user/*',
                    'server/src/util/*',
                    'server/src/connector/*'
                ],
                dest: 'server/dist/<%= pkg.name %>.js'
            }
        },

        watch: {
            scripts: {
                files: ['server/src/*','server/src/*/*'],
                tasks: ['default'],
                options: {
                    spawn: false,
                },
            },
        },

    });



    // grunt.loadNpmTasks('grunt-contrib-symlink');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-watch');

    //grunt.registerTask('default', ['symlink', 'concat', 'uglify', 'jshint', 'watch']);
    grunt.registerTask('default', ['copy','concat','watch']);



};
