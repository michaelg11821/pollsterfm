import { type Metadata } from "next";

import Discography from "@/app/components/discography/discography";
import FeaturedIn from "@/app/components/featured-in/featured-in";
import TopListeners from "@/app/components/top-listeners/top-listeners";
import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";

type ArtistProps = {
  params: Promise<{ artist: string }>;
};

export const metadata: Metadata = {
  title: "(artist) | Pollster.fm",
  description: "Find more about (artist) on Pollster.fm.",
};

async function Artist({ params }: ArtistProps) {
  const { artist } = await params;

  // if (!artist) return redirect("/not-found");

  const artistData = {
    id: params.id,
    name: "Radiohead",
    image: "/placeholder.svg?height=500&width=500&text=Radiohead",
    coverImage: null,
    bio: "Radiohead are an English rock band formed in Abingdon, Oxfordshire, in 1985. The band consists of Thom Yorke, brothers Jonny Greenwood and Colin Greenwood, Ed O'Brien and Philip Selway. They have worked with producer Nigel Godrich and cover artist Stanley Donwood since 1994.",
    genres: ["Alternative Rock", "Art Rock", "Experimental Rock", "Electronic"],
    formed: "1985",
    location: "Oxford, UK",
    monthlyListeners: "12.4M",
    followers: "8.2M",
    topAffinities: [
      { name: "Introspective", score: 95 },
      { name: "Atmospheric", score: 92 },
      { name: "Melancholic", score: 89 },
      { name: "Experimental", score: 87 },
    ],
    topAlbums: [
      {
        id: "ok-computer",
        name: "OK Computer",
        year: "1997",
        image: "/placeholder.svg?height=300&width=300&text=OK+Computer",
        rating: 4.8,
      },
      {
        id: "in-rainbows",
        name: "In Rainbows",
        year: "2007",
        image: "/placeholder.svg?height=300&width=300&text=In+Rainbows",
        rating: 4.9,
      },
      {
        id: "kid-a",
        name: "Kid A",
        year: "2000",
        image: "/placeholder.svg?height=300&width=300&text=Kid+A",
        rating: 4.7,
      },
      {
        id: "a-moon-shaped-pool",
        name: "A Moon Shaped Pool",
        year: "2016",
        image: "/placeholder.svg?height=300&width=300&text=A+Moon+Shaped+Pool",
        rating: 4.6,
      },
    ],
    topTracks: [
      {
        id: "karma-police",
        name: "Karma Police",
        album: "OK Computer",
        plays: "32M",
        duration: "4:21",
        image: "/placeholder.svg?height=60&width=60&text=OK+Computer",
      },
      {
        id: "paranoid-android",
        name: "Paranoid Android",
        album: "OK Computer",
        plays: "28M",
        duration: "6:23",
        image: "/placeholder.svg?height=60&width=60&text=OK+Computer",
      },
      {
        id: "creep",
        name: "Creep",
        album: "Pablo Honey",
        plays: "54M",
        duration: "3:56",
        image: "/placeholder.svg?height=60&width=60&text=Pablo+Honey",
      },
      {
        id: "weird-fishes",
        name: "Weird Fishes/Arpeggi",
        album: "In Rainbows",
        plays: "26M",
        duration: "5:18",
        image: "/placeholder.svg?height=60&width=60&text=In+Rainbows",
      },
      {
        id: "everything-in-its-right-place",
        name: "Everything In Its Right Place",
        album: "Kid A",
        plays: "22M",
        duration: "4:11",
        image: "/placeholder.svg?height=60&width=60&text=Kid+A",
      },
    ],
    similarArtists: [
      {
        id: "thom-yorke",
        name: "Thom Yorke",
        image: "/placeholder.svg?height=150&width=150&text=Thom+Yorke",
        match: 94,
      },
      {
        id: "arcade-fire",
        name: "Arcade Fire",
        image: "/placeholder.svg?height=150&width=150&text=Arcade+Fire",
        match: 86,
      },
      {
        id: "the-national",
        name: "The National",
        image: "/placeholder.svg?height=150&width=150&text=The+National",
        match: 82,
      },
      {
        id: "bjork",
        name: "Björk",
        image: "/placeholder.svg?height=150&width=150&text=Björk",
        match: 79,
      },
    ],
    recentPolls: [
      {
        title: "Best Radiohead Album",
        votes: 1243,
        topChoice: "In Rainbows (34%)",
        date: "2 weeks ago",
      },
      {
        title: "Most Underrated Radiohead Track",
        votes: 876,
        topChoice: "Let Down (22%)",
        date: "1 month ago",
      },
    ],
    recentReviews: [
      {
        album: "A Moon Shaped Pool",
        rating: 4.5,
        user: "musicaficionado",
        userImage: "/placeholder.svg?height=50&width=50",
        date: "3 days ago",
        excerpt:
          "A hauntingly beautiful album that rewards repeated listens. The string arrangements are particularly exquisite.",
      },
      {
        album: "OK Computer",
        rating: 5,
        user: "alternativeguru",
        userImage: "/placeholder.svg?height=50&width=50",
        date: "2 weeks ago",
        excerpt:
          "Still a masterpiece 25 years later. This album predicted our modern technological anxieties with eerie precision.",
      },
    ],
  };

  // look for img on spotify first

  return (
    <main className={styles.pageContainer}>
      <div className={styles.artistHeader}>
        <div className={styles.artistInfoContainer}>
          <div className={styles.artistDetails}>
            <div className={styles.artistImageWrapper}>
              <Image
                src={artistData.image || "/placeholder.svg"}
                alt={artistData.name}
                width={224}
                height={224}
                className={styles.artistImage}
              />
            </div>
            <div className={styles.artistTextInfo}>
              <div className={styles.artistTextInner}>
                <div>
                  <div className={styles.artistMeta}>
                    <span className={`${styles.badge} ${styles.badgeArtist}`}>
                      Artist
                    </span>
                  </div>
                  <h1 className={styles.artistName}>{artistData.name}</h1>
                  <div className={styles.genresContainer}>
                    {artistData.genres.map((genre, i) => (
                      <span key={i} className={styles.genreText}>
                        {genre}
                        {i < artistData.genres.length - 1 && (
                          <span className={styles.genreSeparator}>•</span>
                        )}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.contentContainer}>
        <div className={styles.contentGrid}>
          <aside className={styles.sidebar}>
            {/*  nice nose manny */}
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>Artist Affinities</h2>
              <div className={styles.affinityList}>
                {artistData.topAffinities.map((affinity, i) => (
                  <div key={i} className={styles.affinityItem}>
                    <div className={styles.affinityHeader}>
                      <span className={styles.affinityName}>
                        {affinity.name}
                      </span>
                      <span className={styles.affinityScore}>
                        {affinity.score}%
                      </span>
                    </div>
                    <div className={styles.affinityProgressBar}>
                      <div
                        className={styles.affinityProgressBarFill}
                        style={{ width: `${affinity.score}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Similar Artists */}
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>Similar Artists</h2>
              <div className={styles.similarArtistList}>
                {artistData.similarArtists.map((artist, i) => (
                  <Link
                    href={`/artist/${artist.id}`} // Template literal for dynamic href
                    key={i}
                    className={styles.similarArtistLink}
                  >
                    <div className={styles.similarArtistImageWrapper}>
                      <Image
                        src={artist.image || "/placeholder.svg"}
                        alt={artist.name}
                        width={48}
                        height={48}
                        className={styles.similarArtistImage}
                      />
                    </div>
                    <div>
                      <p className={styles.similarArtistName}>{artist.name}</p>
                      <span
                        className={`${styles.badge} ${styles.badgeMatch} ${styles.similarArtistMatchBadge}`}
                      >
                        {artist.match}% match
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
              <button className={`${styles.button} ${styles.cardButton}`}>
                View More
              </button>
            </div>
          </aside>
          <div className={styles.mainContent}>
            <Discography />
            <TopListeners />
            <FeaturedIn />
          </div>
        </div>
      </div>
    </main>
  );
}

export default Artist;
