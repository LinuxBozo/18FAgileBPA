# Manual Deployment Guide
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

Next, you'll want to request your own [openFDA API key](https://open.fda.gov/api/reference/#authentication).
After this, there are several ways that you can go to get the application running in your environment.

This can be as simple as running the `server.js` directly with properly set environment variables:

```shell
$ OPENFDA_API_KEY=<your API key> NODE_ENV=prod PORT=80 node server.js
```

However, it is recommended that you use a services framework (like [upstart](http://upstart.ubuntu.com/)), or similar, that will allow you to script the startup and keep the process running should it run into any issues. There are also tools to keep the process running as a daemon, such as [pm2](https://github.com/Unitech/PM2) and [forever](https://www.npmjs.com/package/forever)

We also recommend that you do not directly run the application on port 80, or as the root user, but rather, create a user to run your node applications, and use a proxy setup from either [Apache](http://httpd.apache.org/) or preferably, [nginx](http://nginx.org/en/).

## Gathering metrics (_OPTIONAL_)

If you would like to gather performance metrics, there is built in support for using [datadog](http://datadoghq.com).

Make sure you have a proper [datadog agent](http://docs.datadoghq.com/guides/basic_agent_usage/) installed on your server/container platform, and it is listening on the default port.

Next, [get your datadog API key](https://app.datadoghq.com/account/settings#api). Modify your service script (if you created one) to export the variable `DATADOG_API_KEY` and set it to your newly created key.

Once you restart your service, and have traffic coming in, you should now have some basic stats in your datadog account that you can now report. These stats start with the key of `node.express`.