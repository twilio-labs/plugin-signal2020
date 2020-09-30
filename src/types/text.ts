import { Text } from 'ink';
import React from 'react';
import { ValueOf } from 'type-fest';

export type Color = ValueOf<React.ComponentProps<typeof Text>, 'color'>;
