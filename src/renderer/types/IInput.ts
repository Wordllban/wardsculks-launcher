import { HTMLProps } from 'react';

export interface IFormInput extends HTMLProps<HTMLInputElement> {
  key?: string;
  errorMessage?: string;
}
