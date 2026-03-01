import { useEffect, useState } from "react";
import { CardPost } from "../../components/CardPost";
import styles from "./feed.module.css";

export const Feed = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/blog-posts")
      .then((respostaApi) => {
        return respostaApi.json();
      })
      .then((resposta) => {
        setPosts(resposta);
      });
  }, []);

  return (
    <main className={styles.grid}>
      {posts.map((post) => (
        <CardPost key={post.slug} post={post} />
      ))}
    </main>
  );
};
