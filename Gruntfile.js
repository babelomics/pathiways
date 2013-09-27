/*global module:false*/
module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        meta: {
            version: '1.0.11',
            jsorolla: {
                dir: '/lib/jsorolla/',
                utils: {
                    version: '1.0.0',
                    dir: '<%= meta.jsorolla.dir %>build/utils/<%= meta.jsorolla.utils.version %>/'
                },
                opencga: {
                    version: '1.0.0',
                    dir: '<%= meta.jsorolla.dir %>build/opencga/<%= meta.jsorolla.opencga.version %>/'
                }
            }
        },
        banner: '/*! PROJECT_NAME - v<%= meta.version %> - ' +
            '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
            '* http://PROJECT_WEBSITE/\n' +
            '* Copyright (c) <%= grunt.template.today("yyyy") %> ' +
            'OpenCB; Licensed GPLv2 */\n',
        // Task configuration.
        concat: {
            options: {
                banner: '<%= banner %>',
                stripBanners: true
            },
            build: {
                src: [
//                    'src/pw-config.js',
                    'src/pathiways.js',
                    'src/pathiways-form.js',
                    'src/pathipred-form.js'
                ],
                dest: 'build/<%= meta.version %>/pathiways-<%= meta.version %>.js'
            }
        },
        uglify: {
            options: {
                banner: '<%= banner %>'
            },
            build: {
                src: '<%= concat.build.dest %>',
                dest: 'build/<%= meta.version %>/pathiways-<%= meta.version %>.min.js'
            }
        },
        copy: {
            build: {
                files: [
                    {   expand: true, cwd: './src', src: ['pw-config.js'], dest: 'build/<%= meta.version %>/' },
                    {   expand: true, cwd: './<%= meta.jsorolla.dir %>', src: ['vendor/**'], dest: 'build/<%= meta.version %>/' },
                    {   expand: true, cwd: './<%= meta.jsorolla.dir %>', src: ['styles/**'], dest: 'build/<%= meta.version %>/' }, // includes files in path and its subdirs
                    {   expand: true, cwd: './<%= meta.jsorolla.utils.dir %>', src: ['utils*.js'], dest: 'build/<%= meta.version %>/' },
                    {   expand: true, cwd: './<%= meta.jsorolla.opencga.dir %>', src: ['opencga*.js', 'worker*'], dest: 'build/<%= meta.version %>/' }
                ]
            }
        },
        clean: {
            build: ["build/<%= meta.version %>/"]
        },

        vendorPath: 'build/<%= meta.version %>/vendor',
        stylesPath: 'build/<%= meta.version %>/styles',
        htmlbuild: {
            build: {
                src: 'src/pathiways.html',
                dest: 'build/<%= meta.version %>/',
                options: {
                    beautify: true,
                    scripts: {
                        'js': 'build/<%= meta.version %>/pathiways-<%= meta.version %>.min.js',
                        'vendor': [
                            'build/<%= meta.version %>/vendor/underscore*.js',
                            'build/<%= meta.version %>/vendor/backbone*.js',
                            'build/<%= meta.version %>/vendor/jquery.min.js',
                            'build/<%= meta.version %>/vendor/jquery.qtip*.js',
                            'build/<%= meta.version %>/vendor/jquery.sha1*.js',
                            'build/<%= meta.version %>/vendor/jquery.cookie*.js',
                            'build/<%= meta.version %>/vendor/purl*.js',
                            'build/<%= meta.version %>/vendor/utils*.min.js',
                            'build/<%= meta.version %>/vendor/opencga*.min.js'
                        ],
                        opencga: [
                            'build/<%= meta.version %>/utils*.min.js',
                            'build/<%= meta.version %>/opencga*.min.js'
                        ]
                    },
                    styles: {
                        'css': ['<%= stylesPath %>/css/style.css'],
                        'vendor': [
                            'build/<%= meta.version %>/vendor/jquery.qtip*.css'
                        ]
                    }
                }
            }
        },
        rename: {
            html: {
                files: [
                    {src: ['build/<%= meta.version %>/pathiways.html'], dest: 'build/<%= meta.version %>/index.html'}
                ]
            }
        },

        'curl-dir': {
            long: {
                src: [
                    'http://ajax.googleapis.com/ajax/libs/jquery/1.10.1/jquery.min.js',
                    'http://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.4.4/underscore-min.js',
                    'http://cdnjs.cloudflare.com/ajax/libs/backbone.js/1.0.0/backbone-min.js',
                    'http://cdnjs.cloudflare.com/ajax/libs/jquery-cookie/1.3.1/jquery.cookie.js',
                    'http://cdnjs.cloudflare.com/ajax/libs/jquery-url-parser/2.2.1/purl.min.js',
                    'http://jsapi.bioinfo.cipf.es/ext-libs/jquery-plugins/jquery.sha1.js',
                    'http://jsapi.bioinfo.cipf.es/ext-libs/qtip2/jquery.qtip.min.js',
                    'http://jsapi.bioinfo.cipf.es/ext-libs/qtip2/jquery.qtip.min.css'
                ],
                dest: 'vendor'
            }
        },

        hub: {
            all: {
                src: ['lib/jsorolla/Gruntfile.js'],
                tasks: ['utils','opencga']
            }
        }

    });

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
//    grunt.loadNpmTasks('grunt-contrib-jshint');
//    grunt.loadNpmTasks('grunt-contrib-qunit');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-rename');
    grunt.loadNpmTasks('grunt-html-build');
    grunt.loadNpmTasks('grunt-curl');
    grunt.loadNpmTasks('grunt-hub');

    grunt.registerTask('log-deploy', 'Deploy path info', function (version) {
        grunt.log.writeln("DEPLOY COMMAND: scp -r build/{version} cafetero@mem16:/httpd/bioinfo/www-apps/pathiways/");
    });

    // Default task.
    grunt.registerTask('default', ['clean', 'concat', 'uglify', 'hub:all', 'copy', 'htmlbuild', 'rename:html', 'log-deploy']);

};
