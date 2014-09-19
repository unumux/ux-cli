# uxgen

Run this and get a fully functioning site with SASS, Coffeescript, Autoprefixer, and BrowserSync.

## Requirements

- Node (http://nodejs.org)
- Yeoman (http://yeoman.io)
- Gulp (http://gulpjs.com)

## Installation

```
npm install unumux/generator-unumux
```

## Usage

You will first need to make a folder for your project. Then, open a command line and cd to the folder. For example, if the folder you want to create your project in is C:\Projects\some-project, type:

```
cd C:\Projects\some-project
yo unumux
```

This could take a little bit of time as it installs your packages. After the project scaffold is created, just run gulp:

```
gulp
```

You can then access your development site at http://localhost:3000

## Features

### SASS

Creating a new scss file inside of the css folder will automatically include it inside of the app.scss file. These files need to be prefixed with an "_" to be included. You can also prefix a file with a double underscore "__" to put them at the top of the app.scss file, before the bower files are included. This is useful for things such as variables and mixins.

### Autoprefixer

All vendor prefixes are handled for you. Just type the unprefixed version of a property, and the output file will include the required prefixes.

### CoffeeScript

.coffee files created inside the js folder will be converted to JS and have a script tag injected into the index.html file.

### Javascript

.js files created inside the js folder will have script tags injected into the index.html file.

### Bower

Installing new libraries is easy with bower. For example, to install jQuery, just type:

```
bower install jquery --save
```

jQuery will be downloaded from GitHub into the components folder, and corresponding script tags, css link tags, and scss includes will be injected. The --save is important as it adds the library as a project dependency, and won't be injected without it.

#### Bower troubleshooting

If the bower package is installed but the necessary tags aren't injected, then the bower package you installed may not have been set up correctly by it's author. For this to work correctly, the package's bower.json must have a "main" property to indicate what files are to be used by the application. This can be fixed by opening your bower.json in your project root, and adding to the overrides section. For example, if we installed a package called "broken-package", and it needs a JS file and CSS file included (named broken-package.js and broken-package.css), we would add this to the overrides section:

```
"overrides": {
	"broken-package": {
		"main": [
			"broken-package.js",
			"broken-package.css"
		]
	}
}
```

### Building

Building the project will concatenate all of the SCSS, JS/CoffeeScript, and Bower packages. It will then uglify/minify them. The output will be put in the /build folder

## Upcoming features

- Generator options
- Lots of bug fixes
- Better JS handling
- Integration with UI Framework
- Multiple scaffolds for different project requirements
- Update process
