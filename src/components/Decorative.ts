'use client';
// True while a page is only shown as a picture (thumbnails, previews): tools
// then draw their controls without buttons and links. The thumbnails are
// buttons themselves, and buttons inside buttons are not valid HTML.
import { createContext, useContext } from 'react';

export const Decorative = createContext(false);
export const useDecorative = () => useContext(Decorative);
