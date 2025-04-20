export const supabase = {
  storage: {
    from: vi.fn().mockImplementation((bucketName: string) => ({
      upload: vi.fn().mockResolvedValue({
        data: { path: `${bucketName}/fake-uploaded-image.png` },
        error: null,
      }),
      remove: vi.fn().mockResolvedValue({
        data: null,
        error: null,
      }),
      getPublicUrl: vi.fn().mockImplementation((path: string) => ({
        data: {
          publicUrl: `https://cdn.supabase.mock/${path}`,
        },
      })),
    })),
  },
};
