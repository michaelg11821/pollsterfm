type TrackPageProps = {
  params: Promise<{ track: string }>;
};

async function TrackPage({ params }: TrackPageProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { track } = await params;

  return <p>coming soon</p>;
}

export default TrackPage;
