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
    done();
  },

  writing: {
    app: function () {
      this.dest.mkdir('components');

      this.src.copy('_package.json', 'package.json');
      this.src.copy('_bower.json', 'bower.json');
      this.src.copy('_Gruntfile.js', 'Gruntfile.js');
      this.src.copy('index.html', 'index.html');
      this.src.copy('css/site.scss', 'css/site.scss');
      this.src.copy('js/site.js', 'js/site.js');
    }
  },

  end: function () {
    this.installDependencies();
  }
});

module.exports = UxgenGenerator;
