import InkTextInput from 'ink-text-input';
import React, { useCallback, useState } from 'react';
import { Merge } from 'type-fest';
import { TextInputProps } from './TextInput';

export function textToBoolean(
  text: string,
  defaultValue: boolean
): boolean | null {
  const normalizedText = text.toLowerCase().trim();
  if (normalizedText === '') {
    return defaultValue;
  }

  if (
    normalizedText === 'y' ||
    normalizedText === 'yes' ||
    normalizedText === 'true'
  ) {
    return true;
  }

  if (
    normalizedText === 'n' ||
    normalizedText === 'no' ||
    normalizedText === 'false'
  ) {
    return false;
  }

  return null;
}

export type ConfirmInputProps = Merge<
  TextInputProps,
  {
    onInvalid?: (value: string) => any;
    defaultValue?: boolean;
    onSubmit?: (data: { [key: string]: boolean }) => any;
  }
>;

export const ConfirmInput: React.FC<ConfirmInputProps> = ({
  name,
  onSubmit,
  defaultValue = false,
  onInvalid,
  ...props
}) => {
  const [value, setValue] = useState('');
  const wrappedOnSubmit = useCallback(
    (val) => {
      const booleanVal = textToBoolean(val, defaultValue);
      if (typeof booleanVal !== 'boolean') {
        if (typeof onInvalid === 'function') {
          onInvalid(val);
        }
        return;
      }
      if (val.trim().length === 0) {
        setValue(defaultValue ? 'Y' : 'N');
      }

      if (typeof onSubmit === 'function') {
        onSubmit({
          [name]: booleanVal,
        });
      }
    },
    [name, onSubmit]
  );
  return (
    <InkTextInput
      value={value}
      onChange={setValue}
      onSubmit={wrappedOnSubmit}
      {...props}
    />
  );
};
