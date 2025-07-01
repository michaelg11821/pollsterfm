export type EditProfileFormData = {
  newHeaderImg: File | null;
  newProfileIcon: File | null;
  newName: string | undefined;
  newUsername: string;
  newAboutMe: string | undefined;
  deleteHeaderImg: boolean;
  deleteProfileIcon: boolean;
};
