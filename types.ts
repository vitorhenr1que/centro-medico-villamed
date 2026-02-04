import React from 'react';

export interface Testimonial {
  id: number;
  name: string;
  text: string;
  rating: number;
  image: string;
}

export interface Benefit {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
}

declare global {
  interface Window {
    fbq: any;
  }
}