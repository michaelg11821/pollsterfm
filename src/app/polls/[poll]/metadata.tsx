type MetadataProps = {
  seoTitle: string;
  seoDescription: string;
};

function Metadata({ seoTitle, seoDescription }: MetadataProps) {
  return (
    <>
      <title>{seoTitle}</title>
      <meta name="description" content={seoDescription} />
    </>
  );
}

export default Metadata;
