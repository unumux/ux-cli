# UX-CLI - The UX Team's Command Line Interface

This tool is used to run the UX Team's build tools. Additionally, it can scaffold out a basic site structure if one does not already exist.

## Installation

Node v0.10.x or v0.12.x are required. Node can be installed from: http://nodejs.org.

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



## Options

The tool supports several options

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
