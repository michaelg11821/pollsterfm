type TrackProps = {
  params: Promise<{ track: string }>;
};

async function Track({ params }: TrackProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { track } = await params;

  return <p>coming soon</p>;
}

export default Track;
