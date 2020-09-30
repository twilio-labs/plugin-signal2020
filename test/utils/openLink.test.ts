jest.mock('open', () => {
  return jest.fn().mockReturnValue(Promise.resolve());
});

import open from 'open';
import * as openLink from '../../src/utils/openLink';

describe('open-link', () => {
  describe('addUtmParameters', () => {
    test('adds parameters to regular URL', () => {
      const url = openLink.addUtmParameters('https://www.twilio.com/signal');
      expect(url).toBe(
        'https://www.twilio.com/signal?utm_source=Twilio&utm_medium=Terminal&utm_campaign=signal_developer_mode'
      );
    });

    test('handles existing query parameters', () => {
      const url = openLink.addUtmParameters(
        'https://www.twilio.com/signal?hello=ahoy'
      );
      expect(url).toBe(
        'https://www.twilio.com/signal?hello=ahoy&utm_source=Twilio&utm_medium=Terminal&utm_campaign=signal_developer_mode'
      );
    });
  });

  describe('openBrowserUrl', () => {
    test('adds parameters to the URL by default', () => {
      openLink.openBrowserUrl('https://www.twilio.com/signal');
      expect(open).toHaveBeenCalledWith(
        'https://www.twilio.com/signal?utm_source=Twilio&utm_medium=Terminal&utm_campaign=signal_developer_mode'
      );
    });

    test('adds parameters if addParameters is true', () => {
      openLink.openBrowserUrl('https://www.twilio.com/signal', true);
      expect(open).toHaveBeenCalledWith(
        'https://www.twilio.com/signal?utm_source=Twilio&utm_medium=Terminal&utm_campaign=signal_developer_mode'
      );
    });

    test('does not add parameters if addParameters is false', () => {
      openLink.openBrowserUrl('https://www.twilio.com/signal', false);
      expect(open).toHaveBeenCalledWith('https://www.twilio.com/signal');
    });
  });
});
