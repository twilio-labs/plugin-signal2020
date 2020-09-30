# Contributing to this plugin development

## Setup up for development

To set up the project in general run:

```bash
git@github.com:twilio-labs/plugin-signal2020.git
cd plugin-signal2020
npm install
npm run build
```

To test the plugin directly from the Twilio CLI run:

```
twilio plugins:link .
twilio signal2020
```

For ease of development you can also copy `.env.example` into a `.env` file to point against different APIs.

To use those variables instead and skip the auth prompt (this is generally faster)

```
npm run demo
```

Since the UI takes the entire screen it hides errors and `console.*` statements. If you need to see them run:

```
DEBUG_SIGNAL=* npm run demo
```

During the execution any logs are written to `$TMPDIR/twilio-signal-dev-mode.log`. **The file is overriden at every execution**.
Change the log level using the `-l debug` flag.

For a better readibility of the logs, use [pino-pretty](https://npm.im/pino-pretty):

```bash
tail -f $TMPDIR/twilio-signal-dev-mode.log | npx pino-pretty
```

You'll have to re-run the command between executions.

## Releasing for maintainers
```
git commit
npm version patch|minor|major
npm publish
git push origin main --tags
```
