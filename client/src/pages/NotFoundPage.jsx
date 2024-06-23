import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          flexDirection: "column",
          fontSize: "60px",
          textAlign: "center",
        }}
      >
        404 Not Found
        <div
          style={{
            fontSize: "30px",
            color: "blue",
            marginTop: "20px",
          }}
        >
          <Link to="/main">Go to main page</Link>
        </div>
      </div>
    </>
  );
}

export default NotFoundPage;
