import { PhotoForUserDetail } from './photo-for-user-detail.model';

export interface UserDetail{
  id: number;
  username: string;
  knownAs: string;
  age: number;
  gender: string;
  created: Date;
  lastActive: Date;
  city: string;
  country: string;
  photoUrl: string;
  introduction?: string;
  lookingFor?: string;
  intrests?: string;
  photos?: PhotoForUserDetail[];
}
