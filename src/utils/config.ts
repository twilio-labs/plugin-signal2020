export const signalWebsite =
  process.env?.SIGNAL_WEBSITE_URL || 'https://signal.twilio.com';
export const signalApi =
  process.env?.SIGNAL_API_URL || 'https://twilio-signal-api.herokuapp.com';
export const cheatModeApi =
  process.env?.SIGNAL_CHEATMODE_API || `https://twiliomatic.dev`;

export const developerModeApi =
  process.env?.SIGNAL_DEVELOPER_MODE_API ||
  `https://signal-developer-mode-6892.twil.io`;

export const signalTvSchedule =
  process.env?.SIGNAL_TV_SCHEDULE ||
  'https://wq6d88kzgk.execute-api.us-east-1.amazonaws.com/dev/';

export const config = {
  cheatModeApi,
  signalWebsite,
  signalApi,
  developerModeApi,
  signalTvSchedule,
};

export default config;
