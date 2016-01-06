module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        copy: {
            main: { 
                files: [

                // Util
                {
                    src: 'src/util/typeof.js',
                    dest: '../browser/src/util/typeof.js',
                },{
                    src: 'src/util/promise.js',
                    dest: '../browser/src/util/promise.js',
                },{
                    src: 'src/util/path.js',
                    dest: '../browser/src/util/path.js',
                },{
                    src: 'src/util/merge.js',
                    dest: '../browser/src/util/merge.js',
                },{
                    src: 'src/util/arguments.js',
                    dest: '../browser/src/util/arguments.js',
                },{
                    src: 'src/util/get.js',
                    dest: '../browser/src/util/get.js',
                }

                // Core
                ,{
                    src: 'src/core/parse.js',
                    dest: '../browser/src/core/parse.js',
                },{
                    src: 'src/core/stringify.js',
                    dest: '../browser/src/core/stringify.js',
                },{
                    src: 'src/core/protocol.js',
                    dest: '../browser/src/core/protocol.js',
                },{
                    src: 'src/core/osp.js',
                    dest: '../browser/src/core/osp.js',
                },{
                    src: 'src/core/configure.js',
                    dest: '../browser/src/core/configure.js',
                },{
                    src: 'src/core/observe.js',
                    dest: '../browser/src/core/observe.js',
                },{
                    src: 'src/core/create_remote_function.js',
                    dest: '../browser/src/core/create_remote_function.js',
                },{
                    src: 'src/core/request.js',
                    dest: '../browser/src/core/request.js',
                },{
                    src: 'src/core/response.js',
                    dest: '../browser/src/core/response.js',
                },{
                    src: 'src/core/resolve.js',
                    dest: '../browser/src/core/resolve.js',
                },{
                    src: 'src/core/reject.js',
                    dest: '../browser/src/core/reject.js',
                }


                // OSP
                ,{
                    src: 'src/on/request.js',
                    dest: '../browser/src/on/request.js',
                },{
                    src: 'src/on/_request.js',
                    dest: '../browser/src/on/_request.js',
                }




                // API
                ,{
                    src: 'src/user/request.js',
                    dest: '../browser/src/api/request.js',
                }



                ],
            }
        },

        // symlink: {
        //     expanded: {
        //         files: [{
        //             src: 'src/core/protocol.js',
        //             dest: '../browser/src/core/protocol.js'
        //         }, {
        //             src: 'src/util/typeof.js',
        //             dest: '../browser/src/core/typeof.js'
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
                    'src/syncio.js',
                    'src/core/*',
                    'src/api/*',
                    'src/on/*',
                    'src/user/*',
                    'src/util/*',
                    'src/connector/*'
                ],
                dest: 'lib/<%= pkg.name %>.js'
            }
        },

        watch: {
            scripts: {
                files: ['src/*','src/*/*'],
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
