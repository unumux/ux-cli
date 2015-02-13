'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var yosay = require('yosay');

var UxgenGenerator = yeoman.generators.Base.extend({
  initializing: function () {
    this.pkg = require('../package.json');
  },

  prompting: function () {
    var done = this.async();
    this.prompt([
      {
        type: 'list',
        name: 'type',
        message: 'What type of project is this?',
        choices: [
          { name: "New static site", value: "static" },
          { name: "Adding UI Framework to existing site (not yet implemented)", value: "add" }
        ]
      },
      {
        type: 'confirm',
        name: 'newFolder',
        message: "Would you like a new folder created?",
        when: function(a) {
          return a.type === 'static'
        }
      },
      {
        type: 'input',
        name: 'folderName',
        message: "Folder name",
        when: function(a) {
          return a.newFolder
        }
      }
    ], function(answers) {
      this.folderName = answers.folderName;
      done();
    }.bind(this));
  },

  writing: {
    app: function () {
      if(this.folderName) {
        this.mkdir(this.folderName)
        process.chdir(this.folderName);
      }

      this.directory('static', '.');
      this.template('common/_bower.json', 'bower.json');
      this.template('common/_Gruntfile.js', 'Gruntfile.js');
      this.template('common/_package.json', 'package.json');


      // this.src.copy('_package.json', 'package.json');
      // this.src.copy('_bower.json', 'bower.json');
      // this.src.copy('_Gruntfile.js', 'Gruntfile.js');
      // this.src.copy('index.html', 'index.html');
      // this.src.copy('scss/site.scss', 'scss/site.scss');
      // this.src.copy('js/site.js', 'js/site.js');
      // this.src.copy('js/modernizr/modernizr.2.7.1.min.js','js/modernizr/modernizr.2.7.1.min.js')
    }
  },

  end: function () {
    this.installDependencies();
  }
});

module.exports = UxgenGenerator;
