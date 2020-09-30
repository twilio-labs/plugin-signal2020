import React from 'react';
import { useImage } from '../../hooks/useImage';
import { useResponsiveMeasureElement } from '../../hooks/useResize';
import { Image } from './Image';

export type AvatarProps = { imageBuffer: Buffer | null };
export function Avatar({ imageBuffer }: AvatarProps): JSX.Element {
  const {
    width: availableWidth,
    height: availableHeight,
    ref,
  } = useResponsiveMeasureElement();

  const imageWidth = isNaN(availableWidth) ? 34 : availableWidth - 4;

  const imageString = useImage(imageBuffer, imageWidth);

  return <Image ref={ref} imageString={imageString} height={availableHeight} />;
}
