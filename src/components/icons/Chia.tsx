import React from 'react';
import { SvgIcon, SvgIconProps } from '@material-ui/core';
import { ReactComponent as ChiaIcon } from './images/chia.svg';

export default function Keys(props: SvgIconProps) {
  return <SvgIcon component={ChiaIcon} viewBox="0 0 100 100" {...props} />;
}
