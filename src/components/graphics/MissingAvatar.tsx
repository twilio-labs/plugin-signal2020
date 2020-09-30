import React from 'react';
import { SIGNAL } from '../../utils/asciiLogos';
import { Image } from './Image';

export function MissingAvatar() {
  const noColor = process.env.FORCE_COLOR === '0';

  const additionalMessage = noColor
    ? ''
    : 'Configure your avatar on\n    signal.twilio.com';
  return <Image imageString={SIGNAL + `\n${additionalMessage}`} color="cyan" />;
}
