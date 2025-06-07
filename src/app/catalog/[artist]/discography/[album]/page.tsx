type AlbumPageProps = {
  params: Promise<{ album: string }>;
};

async function AlbumPage({ params }: AlbumPageProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { album } = await params;

  return <p>coming soon</p>;
}

export default AlbumPage;
