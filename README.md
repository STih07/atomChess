# zen-typescript-starter-project

Modern and minimalist TypeScript front end starter project using ES6 modules
with optional bundling. Fully customizable.

You might not need an advanced set up like
[create-react-app](https://github.com/facebook/create-react-app) even if you are
using React, this project is for people who:

- Want to use only what is needed and have total control over their development
- Don't have to support legacy browsers and resent having the bloat and cruft
  force fed to them
- Enjoy fine tuning their own development environment without having to worry
  about a one-way eject option or insanely complex webpack scripts.

## Tooling

This starter project uses the best and most minimal tools to make development a
delight.

Uses [ESlint](https://eslint.org/),
[typescript-eslint](https://github.com/typescript-eslint/typescript-eslint) /
[eslint-config-prettier](https://github.com/prettier/eslint-config-prettier) for
linting.

Uses [Mocha](https://mochajs.org/) with [jsdom](https://github.com/jsdom/jsdom)
and Node.js's built in strict [assert](https://nodejs.org/api/assert.html) for
tests.

Uses [rollup.js](https://rollupjs.org/guide/en) and
[rollup-plugin-closure-compiler](https://github.com/ampproject/rollup-plugin-closure-compiler)
for optional bundling and minification if required.

## Usage

### Installation

`npm install` or pnpm/yarn install

### Run NPM Scripts.

Use the NPM scripts via the Visual Studio Code interface or command line.

Typical use might be run 'start-typescript-development' to start compilation,
testing, and linting. This will continuously convert all newly edited TypeScript
files to .js files in the same directory. Use the recommended Visual Studio Code
settings below to make the compiled .js files invisible in the editor.

### Bundling

Run the 'build-bundle' script and rollup.js and closure compiler will create
your bundle automatically in the `dist` directory. You can change the file
references to point to the `dist` directory in `index.html`, they are provided
in commented out form.

Closure compiler is set by default to `SIMPLE` mode in the `rollup.config.js`,
and an ES6 Module is created rather than an IIFE, so don't forget to import it
as a module or it may fail or you will loose the advantage of strict mode.

Closure compiler also has ADVANCED mode which can be set by:

```
compilation_level: 'ADVANCED',
```

but it will most likely require you to re-write parts of your code and is
considered an advanced topic. It will create the smallest bundle sizes known to
humanity if you want to try it.

The zen-typescript-starter-project bundling facilities are the most basic and
important, tree shaking and minification. If you want to expand on that then you
can edit `rollup.config.js` and install additional extensions as needed.
