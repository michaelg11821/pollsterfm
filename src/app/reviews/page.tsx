import { SITE_NAME } from "@/lib/constants/site-info";
import type { Metadata } from "next";
import Reviews from "../components/reviews/reviews";

export const metadata: Metadata = {
  title: `Reviews | ${SITE_NAME}`,
  description: `See music reviews on ${SITE_NAME}!`,
};

function ReviewsPage() {
  return (
    <main className="content-wrapper px-5 pt-4 pb-8 xl:px-0">
      <h2 className="my-6 text-3xl font-bold">Reviews</h2>
      <Reviews />
    </main>
  );
}

export default ReviewsPage;
