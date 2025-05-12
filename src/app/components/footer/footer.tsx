import { siteName } from "@/config";
import Link from "next/link";

function Footer() {
  return (
    <footer className="border-t p-5 py-15">
      <div className="content-wrapper mx-auto my-0">
        <div className="mb-12 grid grid-cols-2 gap-8 md:grid-cols-4">
          <div>
            <div className="mb-6 flex items-center gap-3">
              <span className="text-xl font-semibold">{siteName}</span>
            </div>
            <p className="text-muted-foreground text-sm">
              Connecting music lovers through shared affinities since 2025.
            </p>
          </div>

          <div>
            <p className="mb-4 font-bold">Platform</p>
            <ul className="flex list-none flex-col gap-2">
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-foreground text-center transition-[color]"
                >
                  Discover
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-foreground text-center transition-[color]"
                >
                  Polls
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-foreground text-center transition-[color]"
                >
                  Reviews
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-foreground text-center transition-[color]"
                >
                  Affinities
                </Link>
              </li>
            </ul>
          </div>

          {/* Pollster.fm is not a company. I don't intend to change that. */}
          {/* In this future, this section will likely have information about contributing to the project. */}
          {/* <div>
            <p className={styles.sectionTitle}>Company</p>
            <ul className={styles.list}>
              <li>
                <Link href="#" className={styles.link}>
                  About
                </Link>
              </li>
              <li>
                <Link href="#" className={styles.link}>
                  Blog
                </Link>
              </li>
              <li>
                <Link href="#" className={styles.link}>
                  Careers
                </Link>
              </li>
              <li>
                <Link href="#" className={styles.link}>
                  Contact
                </Link>
              </li>
            </ul>
          </div> */}

          <div>
            <p className="mb-4 font-bold">Legal</p>
            <ul className="flex list-none flex-col gap-2">
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-foreground text-center transition-[color]"
                >
                  Terms
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-foreground text-center transition-[color]"
                >
                  Privacy
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-foreground text-center transition-[color]"
                >
                  Cookies
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-foreground text-center transition-[color]"
                >
                  Licenses
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center gap-4 border-t pt-8 md:flex-row md:justify-between">
          <p className="text-muted-foreground text-sm md:mb-0">
            © {new Date().getFullYear()} {siteName}. All rights reserved.
          </p>

          <div className="flex gap-6">
            <Link
              href="#"
              className="text-muted-foreground hover:text-foreground text-center transition-[color]"
            >
              <svg
                className="text-muted-foreground hover:text-foreground h-6 w-6 transition-[color]"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M18.94 4.46a18.44 18.44 0 0 0-4.56-1.42 0.12 0.12 0 0 0-.13 0.06c-0.2 0.68-0.42 1.39-0.57 2.1a17.32 17.32 0 0 0-5.14 0c-0.15-0.71-0.37-1.42-0.57-2.1a0.12 0.12 0 0 0-.13-0.06A18.44 18.44 0 0 0 2.99 4.46a0.11 0.11 0 0 0-.06 0.04C0.26 8.91-0.09 13.52 0.04 18.06a0.14 0.14 0 0 0 0.05 0.1c2.36 1.74 4.66 2.79 6.94 3.46a0.12 0.12 0 0 0 0.13-0.04c0.52-0.63 0.99-1.29 1.39-1.98a0.12 0.12 0 0 0-.07-0.17c-0.73-0.29-1.43-0.7-2.1-1.22a0.12 0.12 0 0 1 0-0.18c0.14-0.21 0.29-0.41 0.45-0.61a0.12 0.12 0 0 1 0.17 0c1.48 1.08 3.37 1.71 5.33 1.71s3.85-0.63 5.33-1.71a0.12 0.12 0 0 1 0.17 0c0.16 0.2 0.31 0.4 0.45 0.61a0.12 0.12 0 0 1 0 0.18c-0.67 0.52-1.37 0.93-2.1 1.22a0.12 0.12 0 0 0-.07 0.17c0.4 0.69 0.87 1.36 1.39 1.98a0.12 0.12 0 0 0 0.13 0.04c2.28-0.67 4.58-1.72 6.94-3.46a0.14 0.14 0 0 0 0.05-0.1c0.15-4.54-0.23-9.15-3.7-13.54a0.11 0.11 0 0 0-.06-0.04zM8.43 14.93c-1.04 0-1.89-0.93-1.89-2.08s0.84-2.08 1.89-2.08 1.91 0.93 1.91 2.08-0.85 2.08-1.91 2.08zm7.14 0c-1.04 0-1.89-0.93-1.89-2.08s0.84-2.08 1.89-2.08 1.91 0.93 1.91 2.08-0.85 2.08-1.91 2.08z" />
              </svg>
            </Link>

            <Link
              href="#"
              className="text-muted-foreground hover:text-foreground text-center transition-[color]"
            >
              <svg
                className="text-muted-foreground hover:text-foreground h-6 w-6 transition-[color]"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  clipRule="evenodd"
                />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
