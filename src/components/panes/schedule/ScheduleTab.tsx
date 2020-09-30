import { parse } from 'date-fns';
import format from 'date-fns/format';
import { Box, Text } from 'ink';
import React from 'react';
import { Inverse } from '../../common/Inverse';

export type ScheduleTabProps = {
  day: string;
  active: boolean;
};
export function ScheduleTab({ day, active }: ScheduleTabProps) {
  const TextComponent = active ? Inverse : Text;

  let title = day;
  if (day.includes('-')) {
    const parsedDate = parse(day, 'yyyy-MM-dd', new Date());
    title = format(parsedDate, 'EEE, MMM d');
  }

  return (
    <Box>
      <TextComponent>{title}</TextComponent>
    </Box>
  );
}
