export type UpdateProfileResult =
  | { success: true }
  | {
      success: false;
      errors: { path: (string | number)[]; message: string }[];
    };
