import { useParams } from "react-router";

export const ItemPage = () => {
  const { id } = useParams();
  // TODO(day35): zod ile sınırda doğrula

  return (
    <div>
      <h1>Öğe: {id}</h1>
    </div>
  );
};