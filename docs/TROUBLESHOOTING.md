# Troubleshooting

- [Troubleshooting](#troubleshooting)
  - [Common Issues](#common-issues)
    - [Can't login](#cant-login)
    - [No download & setup option](#no-download--setup-option)
    - [Dependencies are not installed when downloading a sample](#dependencies-are-not-installed-when-downloading-a-sample)
    - [Odd layout or no content](#odd-layout-or-no-content)
    - [Flickering](#flickering)
    - [I can't identify some of the colors](#i-cant-identify-some-of-the-colors)
    - [All URLs that get opened contain UTM tags. I don't want that.](#all-urls-that-get-opened-contain-utm-tags-i-dont-want-that)
    - [I have an issue I can't find here](#i-have-an-issue-i-cant-find-here)
  - [Reporting an Issue](#reporting-an-issue)
    - [Support channels](#support-channels)
    - [Providing information when requesting help](#providing-information-when-requesting-help)

## Common Issues

### Can't login

The SIGNAL Developer Mode prompts you for your SIGNAL 2020 credentials. *These are not your regular Twilio credentials.*

To check if you are using the right credentials, try logging into [signal.twilio.com/login](https://signal.twilio.com/login).

### No download & setup option

The "download & setup" option will __only__ show up if we were able to detect `git` running on your system. It has to be part of your `PATH` for us to detect it. You can still use the "view source" option to open the relevant GitHub project and download it from there.

### Dependencies are not installed when downloading a sample

Right now we are only supporting installing dependencies in Node.js projects. For any other programming languages you'll have to manually installed the dependencies. Check the `README.md` file of the project that was created by SIGNAL Developer Mode for relevant instructions.

### Odd layout or no content

We tried to test as many terminal sizes as possible and will adjust the content according to your terminal size. In some edge cases it might still cause odd rendering. Try resizing your terminal window size or your font size. If that does not fix the issue, [report an issue][#reporting-an-issue].

### Flickering

SIGNAL Developer Mode uses a React-based framework called [`ink`](https://term.ink). The way it renders output can [cause flickering in some terminal applications](https://github.com/vadimdemedes/ink/issues/359). If we detect you are using a terminal that has a bad flickering problem we'll turn off animations which will reduce the amount of flickering. However, any interaction itself might still cause flickering.

Reducing the terminal size can improve the situation in some terminals. Some of the terminals that we found that were doing a good job of not flickering are: [Hyper](https://hyper.is), the built-in macOS Terminal.app and [cmder](https://cmder.net/) on Windows.

If animations were not turned off automatically or you'd want to turn them off explicitly, you can [set an environment variable][set-environment] of `FORCE_ANIMATION` to the value of `0`. In Linux and macOS you can do this by running:

```bash
export FORCE_ANIMATION=0
twilio signal2020
```

For a guide for Windows checkout this article on [setting environment variables][set-environment].

### I can't identify some of the colors

By default we are coloring the output of SIGNAL Developer Mode. You can turn that off at any point by [setting an environment variable][set-environment] with the key `FORCE_COLOR` and the value `0`. In Linux and macOS you can do this by running:

```bash
export FORCE_COLOR=0
twilio signal2020
```

For a guide for Windows checkout this article on [setting environment variables][set-environment].

### All URLs that get opened contain UTM tags. I don't want that.

You can turn this off by [setting the following environment variable][set-environment] `SIGNAL_NO_UTM` to `True`. For example in Linux or macOS:

```bash
export SIGNAL_NO_UTM=True
twilio signal2020
```

For a guide for Windows checkout this article on [setting environment variables][set-environment].

You can also set `SIGNAL_NO_DIAGNOSTICS=True` to not send **anonymous** diagnostics information.

[Check out our privacy policy on how Twilio handles data](https://www.twilio.com/legal/privacy).

### I have an issue I can't find here

If you can't find your issue here, make sure to also [check the issues on this project](https://github.com/twilio-labs/plugin-signal2020/issues) for any existing issues.

For anything that can't be found there, consider [reporting an issue](#reporting-an-issue).

## Reporting an Issue

If you are encountering any issue that you can't find listed above, please reach out and we'll try to help you.

### Support channels

For any paid-ticket holders, you can start by reaching out to our SIGNAL Concierge at the bottom corner of the [SIGNAL 2020 website](https://signal.twilio.com).

Alternatively, anyone can [open a *public* GitHub issue on this project](https://github.com/twilio-labs/plugin-signal2020/issues/new). 

> **Important.** Please don't try to reach out via email to any of the maintainers. The channels mentioned above are being monitored during SIGNAL and will result in the fastest help. Email requests might not get answers until after the show.

### Providing information when requesting help

There are two pieces of information that you can give us to better help you tracking down the issue.

1. Please provide us with the diagnostics information that will be output when you run `twilio signal2020 --diagnostics -o=json`.
2. Additionally a screenshot of the issue, if possible, can be useful.
3. During the debugging you might be asked to run `twilio signal2020 -l debug`, which will stop overriding your content to display any errors that might be output. It will also tell you before logging in, where you can find the full log file as you might be asked for that.


[set-environment]: https://www.twilio.com/blog/2017/01/how-to-set-environment-variables.html
