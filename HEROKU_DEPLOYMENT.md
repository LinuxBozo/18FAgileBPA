# Deploying on Heroku
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

## Gathering metrics (_OPTIONAL_)

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