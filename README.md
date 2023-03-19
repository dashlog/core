# Core
![version](https://img.shields.io/badge/dynamic/json.svg?style=for-the-badge&url=https://raw.githubusercontent.com/dashlog/core/master/package.json&query=$.version&label=Version)
[![OpenSSF
Scorecard](https://api.securityscorecards.dev/projects/github.com/dashlog/core/badge?style=for-the-badge)]
![MIT](https://img.shields.io/github/license/mashape/apistatus.svg?style=for-the-badge)
![size](https://img.shields.io/github/languages/code-size/dashlog/core?style=for-the-badge)
![build](https://img.shields.io/github/actions/workflow/status/dashlog/core/node.js.yml?style=for-the-badge)

Fetch stats and data of Github repositories

## Getting Started

This package is available in the Node Package Repository and can be easily installed with [npm](https://docs.npmjs.com/getting-started/what-is-npm) or [yarn](https://yarnpkg.com).

```bash
$ npm i @dashlog/core
# or
$ yarn add @dashlog/core
```

## Usage example

```ts
import { fetchOrgMetadata } from "@dashlog/core";

const { logo, projects } = await fetchOrgMetadata("NodeSecure");
console.log({ logo, projects });
```

## Contributors ✨

<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-1-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tbody>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/fraxken"><img src="https://avatars.githubusercontent.com/u/4438263?v=4?s=100" width="100px;" alt="Thomas.G"/><br /><sub><b>Thomas.G</b></sub></a><br /><a href="https://github.com/dashlog/core/commits?author=fraxken" title="Code">💻</a> <a href="https://github.com/dashlog/core/issues?q=author%3Afraxken" title="Bug reports">🐛</a> <a href="#maintenance-fraxken" title="Maintenance">🚧</a> <a href="#security-fraxken" title="Security">🛡️</a> <a href="https://github.com/dashlog/core/pulls?q=is%3Apr+reviewed-by%3Afraxken" title="Reviewed Pull Requests">👀</a></td>
    </tr>
  </tbody>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

## License
MIT
