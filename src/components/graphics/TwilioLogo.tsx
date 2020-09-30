import React from 'react';
import { TWILIO_ASCII } from '../../utils/asciiLogos';
import { Image } from './Image';

export function TwilioLogo() {
  return <Image imageString={TWILIO_ASCII} color="redBright" />;
}
