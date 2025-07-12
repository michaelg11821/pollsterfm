import SearchResults from "../components/search-results/search-results";

type SearchPageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

async function SearchPage({ searchParams }: SearchPageProps) {
  const { query } = await searchParams;

  const searchQuery = query && typeof query !== "string" ? query[0] : query;

  return (
    <main className="content-wrapper px-5 py-8 xl:px-0">
      {!searchQuery ? (
        <p>Please enter a query.</p>
      ) : (
        <SearchResults query={searchQuery} />
      )}
    </main>
  );
}

export default SearchPage;
