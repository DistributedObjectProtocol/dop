

module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            options: {
                process: function(src, filepath) {
                    return '\n\n\n\n//////////  ' + filepath + '\n' + src;
                }
            },
            dist: {
                src: [
                    'browser/src/synko.js'
                    ,'browser/src/util/*'
                    ,'browser/src/core/create.js'
                    ,'browser/src/core/*'
                    ,'browser/src/api/*'
                    ,'browser/src/on/*'
                    ,'browser/src/connector/*'
                ],
                dest: 'browser/dist/<%= pkg.name %>.js'
            }
        },
        uglify: {
            build: {
                src: 'browser/dist/<%= pkg.name %>.js',
                dest: 'browser/dist/<%= pkg.name %>-min.js'
            }
        },
        watch: {
            scripts: {
                files: ['browser/src/*','browser/src/*/*'],
                tasks: ['default'],
                options: {
                    spawn: false,
                },
            },
        },
    });



    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');

    //grunt.registerTask('default', ['concat', 'uglify', 'jshint', 'watch']);
    grunt.registerTask('default', ['concat', 'uglify', 'watch']);



};
