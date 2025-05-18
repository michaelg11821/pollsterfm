type FileBytes = {
  bytes: Uint8Array;
  name: string;
  mimeType: string;
};

export type EditProfileFormData = {
  newHeaderImg: FileBytes | null;
  newProfileIcon: FileBytes | null;
  newName: string | null;
  newUsername: string;
  newAboutMe: string | null;
  oldHeaderImg: string | null;
  oldProfileIcon: string | null;
  deleteHeaderImg: boolean;
  deleteProfileIcon: boolean;
};
