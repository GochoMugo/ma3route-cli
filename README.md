
# ma3route-cli

> Terminal Client for the **Ma3Route REST API v2**

[![node](https://img.shields.io/node/v/ma3route-cli.svg?style=flat-square)](https://www.npmjs.com/package/ma3route-cli) [![npm](https://img.shields.io/npm/v/ma3route-cli.svg?style=flat-square)](https://www.npmjs.com/package/ma3route-cli) [![Travis](https://img.shields.io/travis/GochoMugo/ma3route-cli.svg?style=flat-square)](https://travis-ci.org/GochoMugo/ma3route-cli) [![Gemnasium](https://img.shields.io/gemnasium/GochoMugo/ma3route-cli.svg?style=flat-square)](https://gemnasium.com/GochoMugo/ma3route-cli) [![Coveralls](https://img.shields.io/coveralls/GochoMugo/ma3route-cli.svg?style=flat-square)](https://coveralls.io/github/GochoMugo/ma3route-cli?branch=master)


## installation:

```bash
$ npm install --global ma3route-cli
```


## usage:

### options:

Options can be passed to any sub-command in different styles:

```bash
$ ma3route --limit=1 # preferred way
$ ma3route --limit 1
```


### configurations:

To configure the client, you use the `config` sub-comand:

```bash
$ ma3route config --key=somekey --secret=somesecret
$ ma3route config --limit=1
```

All the configurations are used to build requests to the API. Therefore, if you configure `limit` to `10`, all requests to the API (where applicable) will use this parameter.

The CLI ships with some default configurations, you can view them with:

```bash
$ ma3route config --default
```

To view your configurations, you can view them with:

```bash
$ ma3route config --user
```

To delete a configuration, you specify its key, use `--delete` as so:

```bash
$ ma3route config --delete=limit
```


### endpoints:

The terminal client uses the awesome [Ma3Route Node-SDK](https://github.com/ma3route/node-sdk) to perform operations against the API.

```bash
banner-adverts      banner adverts
driving-reports     driving reports
external-stream     external stream
listed-adverts      listed adverts
misc                miscellaneous operations
news                news articles
places              places
traffic-updates     traffic updates
users               ma3route users
```

All these sub-commands refer to the SDK inner modules. For example, `banner-adverts` uses the `bannerAdverts` module in the SDK.

If a module (which most do) has a `get` or `getOne` function, you run the relevant sub-command straight away.

```bash
$ ma3route traffic-updates
```

To use a module's `createOne` function, use the flag `--create`.

```bash
$ ma3route users --create --email=john.done@example.com --password=secretpassword
```

Any other module function can be specified using a decamelized option. For example, to invoke the `getTowns` function in module `places`, use the flag `--get-towns`

```bash
$ ma3route places --get-towns
```


### parameters:

To pass parameters to the any module function, you use flags. For example, if we wanted to limit a response to 20 items, we could:

```bash
$ ma3route driving-reports --limit=20
```


### help information:

To view help information:

```bash
$ ma3route help
```

To view version information:

```bash
$ ma3route version
```


## license:

**The MIT License (MIT)**

Copyright (c) 2015 GochoMugo <mugo@forfuture.co.ke>
