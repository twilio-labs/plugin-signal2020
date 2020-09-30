import open from 'open';
import config from './config';

export function addUtmParameters(url: string) {
  const parsedUrl = new URL(url);
  parsedUrl.searchParams.append('utm_source', 'Twilio');
  parsedUrl.searchParams.append('utm_medium', 'Terminal');
  parsedUrl.searchParams.append('utm_campaign', 'signal_developer_mode');

  return parsedUrl.toString();
}

export function openBrowserUrl(url: string, addParameters = true) {
  if (addParameters) {
    url = addUtmParameters(url);
  }

  return open(url);
}

export function openSessionUrl(sessionId: string) {
  return openBrowserUrl(`${config.signalWebsite}/sessions/${sessionId}`);
}
