const uploadMock = vi.fn().mockResolvedValue({
  data: { path: `fake-uploaded-image.png` },
  error: null,
});

const removeMock = vi.fn().mockResolvedValue({
  data: null,
  error: null,
});

const getPublicUrlMock = vi.fn().mockImplementation((path: string) => ({
  data: {
    publicUrl: `https://cdn.supabase.mock/${path}`,
  },
}));

const fromMock = vi.fn().mockImplementation(() => ({
  upload: uploadMock,
  remove: removeMock,
  getPublicUrl: getPublicUrlMock,
}));

export const supabaseMock = {
  storage: {
    from: fromMock,
  },
};
