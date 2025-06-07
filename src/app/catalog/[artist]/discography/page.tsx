type AlbumProps = {
  params: Promise<{ album: string }>;
};

async function Album({ params }: AlbumProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { album } = await params;

  return <p>coming soon</p>;
}

export default Album;
