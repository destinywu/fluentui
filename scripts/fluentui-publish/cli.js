const { joinPathFragments } = require('@nx/devkit');
const { registerTsProject } = require('nx/src/utils/register');

registerTsProject(joinPathFragments(__dirname, '.'), 'tsconfig.lib.json');

require('./index');
