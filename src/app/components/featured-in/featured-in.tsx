import { Users } from "lucide-react";
import styles from "./featured-in.module.css";

const detailedPollsData = [
  {
    id: "p1",
    title: "Best Radiohead Albums of All Time",
    votes: 1243,
    position: "In Rainbows ranked #1",
    date: "2 weeks ago",
    comments: 87,
  },
  {
    id: "p2",
    title: "Most Influential Alternative Rock Bands",
    votes: 876,
    position: "Radiohead ranked #3",
    date: "1 month ago",
    comments: 42,
  },
  {
    id: "p3",
    title: "Artists That Defined the 2000s",
    votes: 1567,
    position: "Radiohead ranked #5",
    date: "3 months ago",
    comments: 124,
  },
  {
    id: "p4",
    title: "Best Live Performances",
    votes: 932,
    position: "Radiohead at Glastonbury ranked #2",
    date: "2 months ago",
    comments: 76,
  },
];

const simplePollsData = [
  {
    id: "p5",
    title: "Best Album Openers That Really Hook You In From The Start",
    votes: 743,
    date: "4 months ago",
  },
  {
    id: "p6",
    title: "Most Experimental Artists",
    votes: 612,
    date: "5 months ago",
  },
  { id: "p7", title: "Best Music Videos", votes: 891, date: "3 months ago" },
];

async function FeaturedIn() {
  return (
    <section className={styles.featuredPollsSectionWrapper}>
      <div className={styles.featuredPollsHeaderContainer}>
        <h2 className={styles.featuredPollsHeadline}>Featured In Polls</h2>
        <button className={styles.featuredPollsViewAllTopButton}>
          View All Polls
        </button>
      </div>
      <div className={styles.detailedPollsGrid}>
        {detailedPollsData.map((poll) => (
          <div key={poll.id} className={styles.detailedPollCard}>
            <div className={styles.detailedPollContent}>
              <h3 className={styles.detailedPollTitle}>{poll.title}</h3>
              <div className={styles.detailedPollPositionWrapper}>
                <span className={styles.detailedPollPositionBadge}>
                  {poll.position}
                </span>
              </div>
              <div className={styles.detailedPollMetaRow}>
                <div className={styles.detailedPollMetaItem}>
                  <Users className={styles.detailedPollMetaIcon} />
                  <span className={styles.detailedPollMetaText}>
                    {poll.votes} votes
                  </span>
                </div>
                <span className={styles.detailedPollDateText}>{poll.date}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className={styles.simplePollsGrid}>
        {simplePollsData.map((poll) => (
          <div key={poll.id} className={styles.simplePollCard}>
            <h3 className={styles.simplePollTitle}>{poll.title}</h3>
            <div className={styles.simplePollMetaRow}>
              <div className={styles.simplePollMetaItem}>
                <Users className={styles.simplePollMetaIcon} />
                <span className={styles.simplePollMetaText}>
                  {poll.votes} votes
                </span>
              </div>
              <span className={styles.simplePollDateText}>{poll.date}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default FeaturedIn;
