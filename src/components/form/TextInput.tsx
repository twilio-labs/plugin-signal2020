import InkTextInput from 'ink-text-input';
import React, { useCallback, useState } from 'react';

export type TextInputProps = {
  name: string;
  defaultValue?: string;
  onSubmit: (data: { [key: string]: string }) => any;
  mask?: string;
  focus?: boolean;
};

export const TextInput: React.FC<TextInputProps> = ({
  name,
  defaultValue,
  onSubmit,
  ...props
}) => {
  const [value, setValue] = useState(defaultValue || '');
  const wrappedOnSubmit = useCallback(
    (val) => {
      onSubmit({
        [name]: val,
      });
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

export const SecretInput: React.FC<TextInputProps> = ({ ...props }) => {
  return <TextInput {...props} mask="*" />;
};
