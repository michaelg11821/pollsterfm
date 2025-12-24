import LoadingIndicator from "../ui/loading-indicator";

function PopularPollsSkeleton() {
  return <LoadingIndicator loading={true} message="Loading polls..." />;
}

export default PopularPollsSkeleton;
