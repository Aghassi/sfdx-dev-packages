#!/usr/bin/env node
/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

const { basename, join } = require('path');
const shell = require('../utils/shelljs');

const loadRootPath = require('../utils/load-root-path');
const packageRoot = require('../utils/package-path');
const typedoc = require.resolve('typedoc/bin/typedoc');

const options = require('@salesforce/dev-config/typedoc');

try {
  const definedOptions = require(`${packageRoot}/typedoc`);
  options = Object.assign(options, definedOptions);
} catch (err) {}

let outDir = 'docs';
try {
  const lernaPath = loadRootPath('lerna.json');
  outDir = join(lernaPath, 'docs', basename(packageRoot));
} catch (e) {}

let command = `${typedoc} --out ${outDir}`;

// typedocs does not allow extending configs, so merge the
// defaults and overrides and put them on the command
for (const key of Object.keys(options)) {
  const val = options[key];
  if (typeof val === 'boolean') {
    if (val) {
      command += ` --${key}`;
    }
  } else {
    command += ` --${key} ${val}`;
  }
}

shell.rm('-rf', `${outDir}/*`);
shell.exec(command, {
  cwd: packageRoot
});