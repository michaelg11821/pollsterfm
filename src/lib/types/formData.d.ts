export type EditProfileFormData = {
  newHeaderImg: File | null;
  newProfileIcon: File | null;
  newName: string | null;
  newUsername: string;
  newAboutMe: string | null;
  oldHeaderImg: string | null;
  oldProfileIcon: string | null;
};
