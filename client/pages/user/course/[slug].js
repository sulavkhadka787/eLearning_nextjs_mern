import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import axios from "axios";
import StudentRoute from "../../../components/routes/StudentRoutes";

const SingleCourse = () => {
  const [loading, setLoading] = useState(false);
  const [course, setCourse] = useState({ lessons: [] });

  const router = useRouter();
  const { slug } = router.query;

  useEffect(() => {
    if (slug) loadCourse();
  }, [slug]);

  const loadCourse = async () => {
    const { data } = await axios.get(`/api/user/course/${slug}`);
    setCourse(data);
  };
  return (
    <StudentRoute>
      <h1>Course slug is {JSON.stringify(router.query.slug)}</h1>
    </StudentRoute>
  );
};

export default SingleCourse;
