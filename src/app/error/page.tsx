import { Metadata } from "next";

import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Error | Pollster.fm",
  description: "An error has occurred.",
};

function Error() {
  return (
    <main className="centered-main">
      <h2 className={styles.errorTitle}>Error ⚠️</h2>
      <p className={styles.errorText}>
        A major error has occurred. Please contact an admin if the issue
        persists.
      </p>
    </main>
  );
}

export default Error;
