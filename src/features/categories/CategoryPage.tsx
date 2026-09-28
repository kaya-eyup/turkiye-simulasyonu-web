import { useParams } from "react-router";

export const CategoryPage = () => {
  const { slug } = useParams();
  // TODO(day35): zod ile sınırda doğrula

  return (
    <div>
      <h1>Kategori: {slug}</h1>
    </div>
  );
};