import figures from 'figures';
import React from 'react';
import { OrderedList, OrderedListProps } from './OrderedList';

export type UnorderedListProps = OrderedListProps;
export function UnorderedList({ ...props }) {
  if (typeof props.symbol === 'undefined') {
    props.symbol = figures.bullet;
  }
  return <OrderedList {...props} />;
}
