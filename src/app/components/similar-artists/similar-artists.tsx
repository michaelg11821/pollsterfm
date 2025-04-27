import Image from "next/image";
import Link from "next/link";

import styles from "./similar-artists.module.css";

function SimilarArtists() {
  const similarArtists = [
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
  ];

  return (
    <div className={styles.relatedArtistsCardShell}>
      <h2 className={styles.relatedArtistsCardHeader}>Similar Artists</h2>
      <div className={styles.relatedArtistsListing}>
        {similarArtists.map((artist) => (
          <Link
            href={`/artist/${artist.id}`}
            key={artist.id}
            className={styles.relatedArtistEntryLink}
          >
            <div className={styles.relatedArtistAvatarContainer}>
              <Image
                src={artist.image || "/placeholder-artist.svg"}
                alt={artist.name}
                width={48}
                height={48}
                className={styles.relatedArtistAvatar}
              />
            </div>
            <div className={styles.relatedArtistInfoBlock}>
              <p className={styles.relatedArtistDisplayName}>{artist.name}</p>
              <span className={styles.relatedArtistLikenessBadge}>
                {artist.match}% match
              </span>
            </div>
          </Link>
        ))}
      </div>
      <button className={styles.relatedArtistsViewMoreAction}>View More</button>
    </div>
  );
}

export default SimilarArtists;
