import { Link } from "react-router-dom";
import styles from "../styles/notFoundPage.module.css";
function NotFoundPage() {
  return (
    <>
      <div className={styles.not_found__container}>
        404 Not Found
        <div className={styles.link__container}>
          <Link to="/">Go to main page</Link>
        </div>
      </div>
    </>
  );
}

export default NotFoundPage;
