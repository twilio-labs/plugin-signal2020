import {
  ServerlessResourceConfig,
  TwilioServerlessApiClient,
} from '@twilio-labs/serverless-api';
import { stripIndent } from 'common-tags';

function getFunctionContent(twiml: string) {
  return stripIndent`
    exports.handler = function (context, event, callback) {
      const resp = new Twilio.Response();
      resp.appendHeader('content-type', 'text/xml');
      resp.setBody(\`${twiml}\`);
      callback(null, resp);
    };
  `;
}

export async function deployTwimlApp(
  twiml: string,
  username: string,
  password: string,
  onUpdate: (msg: string) => void
) {
  const functionContent = getFunctionContent(twiml);
  const config = {
    username,
    password,
    env: {},
    pkgJson: {},
    serviceName: 'magic-cloud',
    overrideExistingService: true,
    functionsEnv: 'demo',
    functions: [
      {
        name: 'Code from the Cloud',
        path: '/',
        content: functionContent,
        access: 'public',
      } as ServerlessResourceConfig,
    ],
    assets: [],
  };

  try {
    const client = new TwilioServerlessApiClient(config);
    if (onUpdate) {
      client.on('status-update', (evt) => {
        onUpdate(evt.message);
      });
    }
    const result = await client.deployProject(config);
    return result;
  } catch (err) {
    throw new Error('Something went wrong. Try again later');
  }
}
