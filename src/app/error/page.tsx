import Nav from "../components/nav/nav";
import styles from "./page.module.css";

async function Error() {
  return (
    <>
      <header>
        <div className="header-content-wrapper">
          <Nav />
        </div>
      </header>
      <main>
        <h2 className={styles.errorTitle}>Error</h2>
        <p className={styles.errorText}>
          There was an error loading this page. Please check the URL or contact
          an admin if the issue persists.
        </p>
      </main>
    </>
  );
}

export default Error;
