import Image from "next/image";

import newStyles from "./artist-header.module.css";

async function ArtistHeader() {
  const artistData = {
    name: "Radiohead",
    image: "/placeholder.svg?height=500&width=500&text=Radiohead",
    coverImage: null,
    genres: ["Alternative Rock", "Art Rock", "Experimental Rock", "Electronic"],
  };

  return (
    <div className={newStyles.profileHeaderSection}>
      <div className={newStyles.profileInfoBox}>
        <div className={newStyles.profileDetailRow}>
          <div className={newStyles.profilePictureFrame}>
            <Image
              src={artistData.image || "/placeholder-artist.svg"}
              alt={artistData.name}
              width={224}
              height={224}
              className={newStyles.profilePicture}
              priority
            />
          </div>
          <div className={newStyles.profileDescriptionArea}>
            <div className={newStyles.profileDescriptionInner}>
              <div>
                <div className={newStyles.profileMetadataLine}>
                  <span className={newStyles.profileArtistTypeBadge}>
                    Artist
                  </span>
                </div>
                <h1 className={newStyles.profileDisplayName}>
                  {artistData.name}
                </h1>
                <div className={newStyles.profileGenreList}>
                  {(artistData.genres || []).map((genre, i) => (
                    <span key={i} className={newStyles.profileGenreTag}>
                      {genre}
                      {i < artistData.genres.length - 1 && (
                        <span className={newStyles.profileGenreDivider}>•</span>
                      )}
                    </span>
                  ))}
                </div>
              </div>
              <button className={newStyles.profileCreatePollAction}>
                Create Poll
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ArtistHeader;
