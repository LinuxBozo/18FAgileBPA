# 18FAgileBPA - RFQ993471

[![Stories in Ready](https://badge.waffle.io/devis/18FAgileBPA.svg?label=ready&title=Ready)](http://waffle.io/devis/18FAgileBPA)
[![Circle CI](https://circleci.com/gh/devis/18FAgileBPA.svg?style=svg)](https://circleci.com/gh/devis/18FAgileBPA)
[![Test Coverage](https://codeclimate.com/github/devis/18FAgileBPA/badges/coverage.svg)](https://codeclimate.com/github/devis/18FAgileBPA/coverage)
[![Code Climate](https://codeclimate.com/github/devis/18FAgileBPA/badges/gpa.svg)](https://codeclimate.com/github/devis/18FAgileBPA)

This code is live at [https://devis18f.herokuapp.com](https://devis18f.herokuapp.com) using [Heroku IaaS](https://www.heroku.com)

## Technical Approach

Approach description

_See our [Approach Criteria Evidence](APPROACH_EVIDENCE.md)_

## Contributing

Please use the [fork and pull](https://help.github.com/articles/using-pull-requests#fork--pull) collaborative model, basing your pull requests on the `master` branch.

This application makes use of multiple open source frontend and backend technologies, so coming up to speed on what they provide is optimal.

 - **Frontend**
  - [AngularJS](https://angularjs.org/)
  - [Browserify](http://browserify.org/)
 - **Backend**
  - [node.js](https://nodejs.org/)
  - [express](http://expressjs.com/)
  - [KrakenJS](http://krakenjs.com/)

### Prerequisites for Development Environment

Make sure you have [node.js](https://nodejs.org) installed (currently, version 0.12.4), and you can use the `npm` command:

```shell
$ npm version
```

Install [Grunt](http://gruntjs.com), our chosen build task runner, globally:

```shell
$ npm install -g grunt-cli
```

### Running Locally

Clone this repository

```shell
$ git clone https://github.com/devis/18FAgileBPA.git
$ cd 18FAgileBPA
```

Then install dependencies from the project root directory:

```shell
$ npm install
```

Start the server with a grunt task:

```shell
$ grunt serve
```

You can now open [http://localhost:8000](http://localhost:8000) in your browser.

### Testing

#### Unit tests

To run the unit tests, use the grunt task:
```shell
$ grunt test
```

There are two sets of tests that are run, one using [mocha](http://mochajs.org/) and [must](https://github.com/moll/js-must) for the backend, and one using [karma](http://karma-runner.github.io/) and [jasmine](http://jasmine.github.io/) for the frontend. When complete, you will see the results of both sets of tests (pass/fail) as well as text summaries of the code coverage, as instrumented by [istanbul](http://istanbul-js.org/), assuming there are no test failures.

You can view the full details of this coverage in a drill-down enabled report by opening:

 - Backend report: `coverage/lcov-report/index.html`
 - Frontend report: `coverage/html-report/index.html`

## Deploying