// src/types.ts
export interface Message {
    id: string;
    text: string;
    sender: 'me' | 'them';
    timestamp: Date;
  }
  
  export interface User {
    id: string;
    name?: string; // Optional if you want to show names
  }