import figures from 'figures';
import { Box, Text } from 'ink';
import React, { useState } from 'react';
import { Merge } from 'type-fest';
import { ConfirmInput, ConfirmInputProps } from './ConfirmInput';
import { SecretInput, TextInput, TextInputProps } from './TextInput';

export type InputTypes = 'confirm' | 'text' | 'secret' | string;

type InputBaseProps = {
  type: InputTypes;
  details?: string;
  message: string;
  active?: boolean;
  done?: boolean;
  name: string;
};

export type InputProps =
  | Merge<InputBaseProps, Merge<ConfirmInputProps, { type: 'confirm' }>>
  | Merge<InputBaseProps, Merge<TextInputProps, { type: 'text' }>>
  | Merge<InputBaseProps, Merge<TextInputProps, { type: 'secret' }>>;

export const Input: React.FC<InputProps> = ({
  type,
  details,
  message,
  active,
  done,
  name,
  ...props
}) => {
  const [isInvalid, setInvalid] = useState(false);

  let InputComponent:
    | typeof TextInput
    | typeof ConfirmInput
    | typeof SecretInput = TextInput;
  if (type === 'text') {
    InputComponent = TextInput;
  } else if (type === 'confirm') {
    message = message + (props.defaultValue ? '(Y/n)' : '(y/N)');
    InputComponent = ConfirmInput;
  } else if (type === 'secret') {
    InputComponent = SecretInput;
  }
  const prefix = done ? (
    <Text bold color="green">
      {figures.tick}
    </Text>
  ) : isInvalid ? (
    <Text bold color="redBright">
      {figures.cross}
    </Text>
  ) : active ? (
    <Text bold color="green">
      {figures.pointer}
    </Text>
  ) : (
    <Text bold color="blue">
      ?
    </Text>
  );

  return (
    <Box flexDirection="column">
      <Box>
        <Box marginRight={1}>
          <Text bold>
            {prefix} {message}
          </Text>
        </Box>
        <Box>
          {/* @ts-ignore */}
          <InputComponent
            {...props}
            name={name}
            focus={active}
            onInvalid={() => setInvalid(true)}
          />
        </Box>
      </Box>
      {details && (
        <Box marginLeft={2}>
          <Text dimColor wrap="truncate-end">
            {details}
          </Text>
        </Box>
      )}
    </Box>
  );
};
