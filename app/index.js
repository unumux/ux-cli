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
      this.src.copy('_Gulpfile.js', 'Gulpfile.js');
      this.src.copy('index.html', 'index.html');
      this.src.copy('css/app.scss', 'css/app.scss');
      this.src.copy('js/app.coffee', 'js/app.coffee');
      this.src.copy('partials/partial.html', 'partials/partial.html');
      this.src.copy('.bowerrc', '.bowerrc');
    }
  },

  end: function () {
    this.installDependencies();
  }
});

module.exports = UxgenGenerator;
