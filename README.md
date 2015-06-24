# 18FAgileBPA - RFQ993471

[![Stories in Ready](https://badge.waffle.io/devis/18FAgileBPA.svg?label=ready&title=Ready)](http://waffle.io/devis/18FAgileBPA)
[![Circle CI](https://circleci.com/gh/devis/18FAgileBPA.svg?style=svg)](https://circleci.com/gh/devis/18FAgileBPA)
[![Test Coverage](https://codeclimate.com/github/devis/18FAgileBPA/badges/coverage.svg)](https://codeclimate.com/github/devis/18FAgileBPA/coverage)
[![Code Climate](https://codeclimate.com/github/devis/18FAgileBPA/badges/gpa.svg)](https://codeclimate.com/github/devis/18FAgileBPA)

## Approach

See a description of our [Approach](#approach).

The prototype is live at [https://devis18f.herokuapp.com](https://devis18f.herokuapp.com) using [Heroku IaaS](https://www.heroku.com)

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

The steps defined here describe a manual deployment process. This process can be automated with the use of continuous integration systems, like [Circle CI](https://circleci.com/) or [Jenkins](https://jenkins-ci.org/), and other configuration management tools, such as [Puppet](https://puppetlabs.com/) or [Chef](https://www.chef.io/).

### Using Heroku

Make sure you have the [Heroku toolbelt](https://toolbelt.heroku.com/) installed, and have logged in to your Heroku account.

Clone this repository:

```shell
$ git clone https://github.com/devis/18FAgileBPA.git
$ cd 18FAgileBPA
```

Create a new app in your Heroku account:

```shell
$ heroku create
```

_**NOTE**: Heroku generates a random name for your app, unless you pass a parameter to specify your own app/host name._

Next, you'll want to request your own [openFDA API key](https://open.fda.gov/api/reference/#authentication). We'll set this key in our heroku environment directly. This ensures that we aren't storing these credentials in the source code, or in a database that could be compromised.

```shell
$ heroku config:add OPENFDA_API_KEY=<your API key>
```

When you create an app, a git remote (called `heroku`) is also created and associated with your local git repository. You can now use this remote to deploy your code:

```shell
$ git push heroku master
```

Assuming there are no errors, the application is now deployed.

If this is the first time you have deployed your application, you need to make sure at least one _web_ dyno instance is running, and set the environment (assuming a production instance):

```shell
$ heroku config:set NODE_ENV=prod
$ heroku ps:scale web=1
```

Finally, you can visit your new app using it's name in your browser, or use the toolbelt to do it for you:

```shell
$ heroku open
```

#### Gathering metrics (_OPTIONAL_)

If you would like to gather performance metrics, there is built in support for using [datadog](http://datadoghq.com). This does require some changes to your Heroku container.

Set the buildpack to use with the Heroku container:

```shell
$ heroku config:add BUILDPACK_URL=https://github.com/ddollar/heroku-buildpack-multi.git
```

This allows us to use [multiple build steps](.buildpacks) when using the container. These build packs install software required for both a node.js application, and the datadog StatsD collection agent.

Next, [get your datadog API key](https://app.datadoghq.com/account/settings#api). Once you have your key, you can now set a config variable in your Heroku container:

```shell
$ heroku config:add DATADOG_API_KEY=<your API key>
```

Once you redeploy your application, and you have traffic coming in, you should now have some basic stats in your datadog account that you can now report. These stats start with the key of `node.express`.

### Your own server

Make sure you have [node.js](https://nodejs.org) installed (currently, version 0.12.4), and you can use the `npm` command:

```shell
$ npm version
```

Install [Grunt](http://gruntjs.com), our chosen build task runner, globally:

```shell
$ npm install -g grunt-cli
```

Clone or pull from this repository

```shell
$ git clone https://github.com/devis/18FAgileBPA.git
$ cd 18FAgileBPA
```

Then install dependencies from the project root directory:

```shell
$ npm install
```

After this, there are several ways that you can go to get the application running in your environment.

This can be as simple as running the `server.js` directly with properly set environment variables:

```shell
$ OPENFDA_API_KEY=<your API key> NODE_ENV=prod PORT=80 node server.js
```

However, it is recommended that you use a services framework (like [upstart](http://upstart.ubuntu.com/)), or similar, that will allow you to script the startup and keep the process running should it run into any issues. There are also tools to keep the process running as a daemon, such as [pm2](https://github.com/Unitech/PM2) and [forever](https://www.npmjs.com/package/forever)

We also recommend that you do not directly run the application on port 80, but rather, use a proxy setup from either [Apache](http://httpd.apache.org/) or preferably, [nginx](http://nginx.org/en/).

#### Gathering metrics (_OPTIONAL_)

If you would like to gather performance metrics, there is built in support for using [datadog](http://datadoghq.com).

Make sure you have a proper [datadog agent](http://docs.datadoghq.com/guides/basic_agent_usage/) installed on your server/container platform, and it is listening on the default port.

Next, [get your datadog API key](https://app.datadoghq.com/account/settings#api). Modify your service script (if you created one) to export the variable `DATADOG_API_KEY` and set it to your newly created key.

Once you restart your service, and have traffic coming in, you should now have some basic stats in your datadog account that you can now report. These stats start with the key of `node.express`.

## Approach

_See our [Approach Criteria Evidence](APPROACH_EVIDENCE.md)_

Upon receiving the openFDA data assignment, we appointed proxy users among our internal staff to play the role of customer. We then spent time brain-storming useful applications we might develop, or real-life problems we might solve, using the FDA APIs. See Project Vision for the idea we eventually adopted.

With a problem defined, and a 'client' to work for, we began our normal process.

### Project Initiation / Communication Plan
* Identify roles
* Name a Product Owner
* Create Project Plan and Schedule
* Specify communications plan
* Conduct project kickoff meeting with the client, in this case our proxy users.

#### Risk Management
An important element of project kickoff is to perform a risk assessment.
Our [risk management plan](Risk-Management-Plan) is also updated as the project progresses:
* during and after requirements elicitation with the customer
* during release and iteration planning meetings
* during retrospectives

### Initial Requirements Elicitation and Design Session
* Craft a [vision](Project-Charter) for the project with users
* Conduct requirements workshop
* Produce draft user stories (no acceptance criteria yet)
* Initial prioritization of features/stories
* Enter draft users stories directly as Github issues, with a 'user-story' label

### Technical Approach
With vision and high-level user stories completed, design software infrastructure best suited to solving this problem.

#### Configuration Management
* Back-end / API stack
* Front-end / UI tools
#### Continuous Integration
#### Application Monitoring
#### Code Quality monitoring
#### Continuous Deployment

### Design Session: Complete/Prioritize User Stories
* for each story, lead a discussion between developers and users
  * add acceptance criteria to users stories
  * update stories or add new ones as required
* prioritize stories according to user

### Release Planning/Iteration Planning
With user stories completed and prioritized, conduct initial release planning meeting:
* Add estimates to each story
* Group the stories into multiple releases, based on users priorities and developer time estimates  
* Break user stories into tasks
* Assign stories to developers for the first iteration
* Publish a project [Project Road Map](Project-Road-Map) with our initial release specified as our minimum viable product.

## Daily Scrum
Start iterative development process. Given the compressed time frame:
* Use continuous deployment so the latest code would always be on the prototype server, so planning specific releases became less important
* Use a more flexible iteration process: First iteration would include user stories for a minimum viable product. 
  * took responsibility for producing an MVP by the submission date.
  * subsequent iterations could be planned during daily scrums to add additional features from our release plan and road map

## Acceptance Testing
Accelerating our normal process:
* Using continuous deployment, users were free to test the application any time, and provide feedback to the product owner
* Feedback resulted in new issues or defects, or in the creation of new user stories added to the backlog

