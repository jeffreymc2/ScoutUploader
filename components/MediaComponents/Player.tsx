// player.tsx
'use client';

import { PlayerProps } from 'next-video';
import Video from 'next-video';

const Player: React.FC<PlayerProps> = (props) => {
  const { src, ...rest } = props;
  return <Video src={src} {...rest} />;
};

export default Player;
