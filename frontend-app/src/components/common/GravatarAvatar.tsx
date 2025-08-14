import React from 'react';
import { Avatar } from '@mui/material';
import CryptoJS from 'crypto-js';

interface GravatarAvatarProps {
  email?: string | null;
  size?: number;
  defaultImage?: string;
  alt?: string;
  sx?: object;
}

const getGravatarUrl = (email: string, size: number = 40, defaultImage: string = 'identicon') => {
  if (!email) {
    return `https://www.gravatar.com/avatar/?s=${size}&d=${defaultImage}`;
  }
  const hash = CryptoJS.MD5(email.trim().toLowerCase()).toString();
  return `https://www.gravatar.com/avatar/${hash}?s=${size}&d=${defaultImage}`;
};

const GravatarAvatar: React.FC<GravatarAvatarProps> = ({
  email,
  size = 40,
  defaultImage = 'identicon',
  alt = 'User Avatar',
  sx,
}) => {
  const gravatarUrl = getGravatarUrl(email || '', size, defaultImage);

  return (
    <Avatar
      src={gravatarUrl}
      alt={alt}
      sx={{ width: size, height: size, ...sx }}
    />
  );
};

export default GravatarAvatar;
