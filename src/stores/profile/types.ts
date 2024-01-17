import { UpdateProfilePasswordRequest } from '@/api';

export interface ProfileErrors {
  updateName: {
    name?: Error;
  };
  updateEmail: {
    email?: Error;
    password?: Error;
  };
  updatePassword: {
    password?: Error;
    newPassword?: Error;
    confirmPassword?: Error;
  };
}

export interface ProfileEdit {
    name: boolean;
    email: boolean;
    password: boolean;
}
 
export interface UpdateProfilePasswordRequestExt extends UpdateProfilePasswordRequest {
    confirmPassword: string;
}
