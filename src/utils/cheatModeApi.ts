import got from 'got';
import Client from 'twilio-sync';
import { cheatModeApi } from './config';
import { getUserAgent } from './diagnostics';

type ApiQueryConfig = {
  ModerateQuery: boolean;
  PostToGitHub: boolean;
  hostName: string;
  onStatusChange?: (status: string) => any;
};

type ApiResponse = {
  token: string;
  id: string;
  status: string;
  errorMessage?: string;
};

export type TwimlResult = {
  moderation: { result: string };
  type: string;
  twiml: string;
};

export type CheatModeApiResponse = {
  status: 'complete' | string;
  query: string;
  twimls: TwimlResult[];
  twiml: TwimlResult;
  configJson: string;
};

export function cheatModeApiQuery(
  query: string,
  config: Partial<ApiQueryConfig> = {}
): Promise<CheatModeApiResponse> {
  /* eslint-disable no-async-promise-executor */
  return new Promise(async (resolve, reject) => {
    let counter = 0;
    const properties: ApiQueryConfig = {
      ModerateQuery: true,
      PostToGitHub: false,
      hostName: new URL(cheatModeApi).hostname,
      onStatusChange: undefined,
      ...config,
    };

    const response = got(
      `${cheatModeApi}/requester?Query=${encodeURIComponent(
        query
      )}&Config=${encodeURIComponent(JSON.stringify(properties))}`,
      {
        headers: {
          'user-agent': getUserAgent(),
        },
      }
    );

    response.json<ApiResponse>().then((json) => {
      try {
        const syncClient = new Client(json.token);
        syncClient.document(json.id).then((doc) => {
          async function nextStep() {
            try {
              const step = await got(
                `${cheatModeApi}/requester?Id=${json.id}&counter=${++counter}`,
                {
                  headers: {
                    'user-agent': getUserAgent(),
                  },
                }
              );

              if (step.statusCode !== 200) {
                this.logger.debug(
                  'Got error "%s". Trying again.',
                  step.statusMessage
                );
                this.logger.debug('Current counter %d', counter);
                if (counter > 15) {
                  throw new Error('Maximum retries reached');
                }
                // Recurse, what could go wrong?
                nextStep();
              } else {
                const stepJson = JSON.parse(step.body) as ApiResponse;
                if (stepJson.status === 'error') {
                  return reject(new Error(stepJson.errorMessage));
                }
              }
            } catch (err) {
              return reject(err);
            }
          }

          doc.on('updated', (data) => {
            if (data.value.status === 'complete') {
              return resolve(data.value);
            } else {
              if (properties.onStatusChange) {
                properties.onStatusChange(data.value.status);
              }
              nextStep();
            }
          });
          // Kick things off
          nextStep();
        });
      } catch (err) {
        return reject(err);
      }
    });
  });
}
