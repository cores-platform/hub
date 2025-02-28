import { Request } from 'express';
import { IClub } from '../models/Club';
import { IPost } from '../models/Post';

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        role: string;
      };
      club?: IClub;
      post?: IPost;
    }
  }
}

export {}; 