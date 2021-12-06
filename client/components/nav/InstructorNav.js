import { useState, useEffect } from "react";
import Link from "next/link";

const InstructorNav = () => {
  const [current, setCurrent] = useState("");

  useEffect(() => {
    process.browser && setCurrent(window.location.pathname);
  }, [process.browser && window.location.pathname]);

  return (
    <div className="nav flex-column nav-pills  mt-2">
      <Link href="/user">
        <a className={`nav-link ${current === "/instructor" && "active"}`}>
          Dashboard
        </a>
      </Link>
      <Link href="/instructor/course/create">
        <a
          className={`nav-link mt-2 ${
            current === "/instructor/course/create" && "active"
          }`}
        >
          Course Create
        </a>
      </Link>
    </div>
  );
};

export default InstructorNav;
