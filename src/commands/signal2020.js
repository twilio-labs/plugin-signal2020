/* eslint @typescript-eslint/no-var-requires: "off" */
const { TwilioClientCommand } = require('@twilio/cli-core').baseCommands;
const { flags } = require('@oclif/command');
const { login } = require('../api/login');
const { setAuthToken } = require('../utils/graphqlClient');

const { render } = require('../components/App');
const { stripIndent } = require('common-tags');
const {
  default: logger,
  loggerPath,
  cliLogLevelToPinoLogLevel,
  pinoFinalHandler,
} = require('../utils/logger');
const { computeDiagnostics } = require('../utils/diagnostics');

let shouldCleanScreen = false;

class Signal2020Command extends TwilioClientCommand {
  constructor(argv, config, secureStorage) {
    super(argv, config, secureStorage);

    this.showHeaders = false;
  }

  async catch(error) {
    pinoFinalHandler(error, 'cliError', true);
    if (error) {
      this.logger.info(
        `Please check your log file for more details at: ${loggerPath}`
      );
    }
    return super.catch(error);
  }

  async run() {
    await super.run();
    logger.level = cliLogLevelToPinoLogLevel(this.logger.config.level);
    let debug =
      this.logger.config.level === -1 || Boolean(process.env.DEBUG_SIGNAL);

    const diagnostics = computeDiagnostics(this);
    if (this.flags.diagnostics) {
      this.output(diagnostics);
      return;
    }

    if (this.flags.feedback) {
      this.logger.info(
        'We would love to hear what you think about SIGNAL Developer Mode. Head over to https://twil.io/signal-dev-mode-feedback'
      );
      return;
    }

    this.logger.debug('Full log file at ' + loggerPath);
    logger.info({
      ...diagnostics,
      msg: 'Diagnostics',
      twilioCliLogLevel: this.logger.config.level,
    });

    if (!process.stdout.isTTY) {
      if (diagnostics.terminal === 'mintty') {
        this.logger.info(stripIndent`
          It appears as if you are using Git Bash or a similar to run SIGNAL Developer Mode.
          Unfortunately Git Bash won't give you the best experience. Check out Windows Terminal as an alternative. If you still want to use it run next:
          winpty twilio.cmd signal2020
        `);
        process.exit(1);
      }

      this.logger.info(
        `We get it, you had to try it. We would have, too. However, you'll get the most out of SIGNAL Developer Mode by running it just using:\n$ twilio signal2020\nEnjoy SIGNAL!`
      );
      process.exit(0);
    }

    if (this.flags.tail) {
      this.logger.info(
        `Welcome! Using --tail doesn't actually do something but we are glad you are listening :)`
      );
    }

    if (!diagnostics.hasGit) {
      this.logger.info(
        `We could not find git on your system. That means you won't be able to use the download & setup functionality of SIGNAL Developer Mode. You can still continue. If you wish to use that functionality, make sure you have git installed and it is part of your PATH. You might have to restart your terminal for this.`
      );
    }

    let signalEmail = this.flags.email;
    let signalPassword = this.flags.password;

    let promptQuestions = [];
    if (!this.flags.email) {
      promptQuestions.push({
        type: 'input',
        name: 'email',
        message: 'SIGNAL account email',
      });
    }

    if (!this.flags.password) {
      promptQuestions.push({
        type: 'password',
        name: 'password',
        message: 'SIGNAL account password',
      });
    }

    try {
      if (promptQuestions.length > 0) {
        this.logger.info(
          'To get started with SIGNAL Developer Mode please log in.'
        );
        const { email, password } = await this.inquirer.prompt(promptQuestions);
        if (email) {
          signalEmail = email;
        }
        if (password) {
          signalPassword = password;
        }
      }
    } catch (err) {
      this.logger.error(
        'Failed to capture email & password. Try using --email and --password instead.'
      );
      this.exit(1);
      return;
    }

    let result;
    try {
      result = await login(signalEmail, signalPassword);
    } catch (err) {
      logger.error({ msg: 'Failed to log in', error: err });
      const msg = err.message
        .toLowerCase()
        .startsWith('access token is expired')
        ? 'Invalid credentials'
        : err.message;
      this.logger.error(`${msg}. Please try again`);
      process.exit(1);
      return;
    }
    setAuthToken(result.access_token);
    shouldCleanScreen = !debug;
    await render(
      {
        name: result.first_name,
        refreshToken: result.refresh_token,
        accountSid: this.twilioClient.accountSid,
        twilioUsername: this.twilioClient.username,
        twilioPassword: this.twilioClient.password,
      },
      debug
    );
  }
}

Signal2020Command.flags = Object.assign(
  // ChatTokenGeneratorFlags,
  TwilioClientCommand.flags,
  {
    diagnostics: flags.boolean({
      char: 'd',
      default: false,
      description:
        'Using this flag will output diagnostics information that will be useful when debugging issues.',
    }),
    email: flags.string({
      description: 'The email you use to log into signal.twilio.com/login',
    }),
    password: flags.string({
      description: 'The password you use to log into signal.twilio.com/login',
    }),
    feedback: flags.boolean({
      default: false,
      description: 'Learn how you can give feedback on SIGNAL Developer Mode.',
    }),
  },
  {
    tail: flags.boolean({
      default: false,
    }),
  }
  // globalFlags
);

Signal2020Command.aliases = ['signal'];

module.exports = Signal2020Command;

// catch all the ways node might exit
process.on('beforeExit', () => pinoFinalHandler(null, 'beforeExit'));
process.on('exit', () => {
  if (shouldCleanScreen) {
    const leaveAltScreenCommand = '\x1b[?1049l';
    process.stdout.write(leaveAltScreenCommand);
  }
  return pinoFinalHandler(null, 'exit');
});
process.on('uncaughtException', (err) =>
  pinoFinalHandler(err, 'uncaughtException')
);
process.on('SIGINT', () => pinoFinalHandler(null, 'SIGINT'));
process.on('SIGQUIT', () => pinoFinalHandler(null, 'SIGQUIT'));
process.on('SIGTERM', () => pinoFinalHandler(null, 'SIGTERM'));
