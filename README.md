# uxgen

Run this and get a fully functioning site with SASS, Autoprefixer, and BrowserSync.

## Requirements

- Node (http://nodejs.org)
- Yeoman (http://yeoman.io)
- Grunt (http://gruntjs.com)

These dependencies are installed automatically if you use one of the scripts below.

## Installation

### OS X

Running the command below in a terminal will install Nvm, Node, Yeoman, and Grunt (if needed) and then install the generator as a global package. You may need to run this as `sudo` user and enter your password.

```
bash -c "$(curl https://7c42ce73f8853826cd1e3a5d47002c7ff693164f:x-oauth-basic@raw.githubusercontent.com/unumux/generator-unumux/master/setup/osx.sh)"
```

### Windows

Running the command below at your command prompt will install Git, Node, Yeoman, and Grunt (if needed) and then install the generator as a global package

```
@powershell -NoProfile -ExecutionPolicy unrestricted -Command "$wc=new-object net.webclient;$wc.Headers.Add('Authorization', 'Basic N2M0MmNlNzNmODg1MzgyNmNkMWUzYTVkNDcwMDJjN2ZmNjkzMTY0Zjp4LW9hdXRoLWJhc2ljCg==');$wc.DownloadString('https://7c42ce73f8853826cd1e3a5d47002c7ff693164f:x-oauth-basic@raw.githubusercontent.com/unumux/generator-unumux/master/setup/win.ps1') | iex"
```


## Usage

You will first need to make a folder for your project. Then, open a command line and cd to the folder. For example, if the folder you want to create your project in is C:\Projects\some-project, type:

```
cd C:\Projects\some-project
yo unumux
```

This could take a little bit of time as it installs your packages. After the project scaffold is created, just run grunt:

```
grunt debug
```

You can then access your development site at http://localhost:3000

## Features

### SASS

Creating a new scss file inside of the css folder will automatically include it inside of the site.scss file. These files need to be prefixed with an "__" to be included. You can also prefix a file with a double underscore "___" to put them at the top of the app.scss file, before the bower files are included. This is useful for things such as variables and mixins.

### Autoprefixer

All vendor prefixes are handled for you. Just type the unprefixed version of a property, and the output file will include the required prefixes.

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

## Dev Mode (Developers only)

This is only needed when working on the generator. This should NOT be used when running the generator.

```
yo unumux --dev
```

This will install the local copy of the UI Framework defined in the environment variable FRAMEWORKPATH.

## Changelog
- 1.0.0: Initial Release
- 1.1.0: Bug fixes; OS X installation script

## Upcoming features

- Generator options
- Lots of bug fixes
- Better JS handling
- Multiple scaffolds for different project requirements
- Update process
