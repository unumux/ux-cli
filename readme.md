# UX-CLI - The UX Team's Command Line Interface

This tool is used to run the UX Team's build tools. Additionally, it can scaffold out a basic site structure if one does not already exist.

## Automated Installation

A one-time setup can be run to automatically get the requirements and to install the ux-cli tool. There are seperate commands to run on OS X and Windows.


### OS X

Running the command below in a terminal will install Nvm, Node, and ux-cli (if needed). You may need to run this as `sudo` user and enter your password.

```
bash -c "$(curl https://raw.githubusercontent.com/unumux/ux-cli/master/setup/osx.sh)"
```

### Windows

Running the command below at your command prompt will install Git, Node, Yeoman, and Grunt (if needed) and then install the generator as a global package

```
@powershell -NoProfile -ExecutionPolicy unrestricted -Command "$wc=new-object net.webclient;$wc.DownloadString('raw.githubusercontent.com/unumux/ux-cli/master/setup/win.ps1') | iex"
```

## Manual Installation

Node v0.12.x is required. Node can be installed from: http://nodejs.org.

UX-CLI can be installed by opening your terminal (Command line in Windows) and running:

```
npm install -g @unumux/ux-cli
```

After installation of the tool, the tool can be used by using 'cd' to navigate to the folder you want to run the UI-Framework from and typing "ux".


## Usage

The tool installs the latest version of the UI-Framework (if not already installed). This is done on a per-project basis, so different projects may be running different versions of the UI-Framework. It also creates a configuration file, ux.json, that saves paths for SASS and Javascript files.

## Configuration questions

On first run, the tool will ask several questions to create the configuration file. An explanation of each of those questions is below.

### UI Framework not found. Would you like to install it? (Y/n)

This requires a yes if you want to continue. It will install the UI-Framework in the current directory.

### ux.json not found. Would you like to create one? (Y/n)

This is also required (and likely soon to be removed). It uses the following questions to create a ux.json configuration file.

### No styles, scripts, or markup were found. Would you like to scaffold a basic site?

This question is only asked if the tool is run in an empty folder. If you choose "Y", it will create a basic HTML, JS, and SCSS file.

### Where are your SCSS files stored?

The tool scans the folder for subfolders which contain SCSS files. If there are multiple folders with SCSS files, it will prompt you to choose the correct one.

### Where are your JS files stored?

The tool scans the folder for subfolders which contain JS files. If there are multiple folders with JS files, it will prompt you to choose the correct one.

### What other files/folders should trigger a refresh in the browser when files are changed? (Press <space> to select)

These files, when changed, will trigger the browser to refresh. Automatically searches for HTML, ASPX, and CSS files.

### Should Javascript files be processed with Browserify?

Javascript files can be processed with Browserify. This allows you to 'require' external JS files and libraries. This is optional, as it's not acceptable for all projects. It also runs Babel, to enable the usage of ES6 functions. More information can be found in the readme for the UI-Framework.

### Which JS file is your main (entry) file?

If using Browserify, a "main" JS file is required. This file is the one that will be passed into Browserify. Multiple files are not yet supported.

### Is this a static site?

If this is a Sitecore or ASP.NET site, you should answer no to this. Otherwise, answer yes.

### Would you like to install any additional libraries? (Press <space> to select)

Choose additional libraries to install. These are not automatically inserted into your styles, markup, or scripts. You will need to @import them for stylesheets. For example, to use colonial-branding in your SCSS files, type:

```
@import "colonial-branding/main";
```

If you are using browserify, using JS files is just as easy. For example, to use jQuery, just type:

```
var $ = require "jquery";
```

If you are not using Browserify, or if you have any files that aren't SCSS/JS, then they will need to be copied from Bower to a folder in your project and then included using the appropriate tag inside of your markup.

## Options

The tool supports several options

### ux --login

Setup global login information.

### ux --reconfigure

This option allows you to recreate the ux.json configuration file. This is not needed if a ux.json file does not already exist


### ux --no-packages

By default, the tool automatically installs npm and bower dependencies. This option will prevent those installs from running. Same as running `ux --no-bower --no-npm`


### ux --no-bower

Same as `--no-packages`, but only disabled bower installations

### ux --no-npm

Same as `--no-packages`, but only disables npm installation.

### ux [taskname]

UX can be passed the name of a gulp task, and it will pass it to gulp. For example, `ux styles` would run a single SASS compilation.

### ux --install

During initial project setup, UX asks for a list of packages to install (such as colonial-branding and jQuery). This process can be run at a later time by using the --install switch.
