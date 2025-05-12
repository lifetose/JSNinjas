import { useParams, useNavigate } from "react-router-dom";

import { useGetSuperheroByIDQuery } from "@/api/superHeroApiSlice";

import notfounditem from "@/assets/not-found-item.png";
import { getErrorMessage } from "@/api/apiSlice";

export default function SuperheroDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    data: hero,
    isLoading,
    error,
  } = useGetSuperheroByIDQuery(id!, { skip: !id });

  if (isLoading) return <div>Loading superhero...</div>;
  if (error) return <h3 className='text-red-400'>{getErrorMessage(error)}</h3>;

  return (
    <div className='p-6'>
      <button className='mb-4 text-blue-600' onClick={() => navigate("/")}>
        Back to Superheroes
      </button>
      <figure className='h-auto w-[200px]'>
        <img
          src={hero?.image || notfounditem}
          alt={hero?.nickname}
          className='w-full h-full object-cover bg-base-100'
          loading='lazy'
          onError={(e) => {
            (e.target as HTMLImageElement).src = notfounditem;
          }}
        />
      </figure>
      <h1 className='text-2xl font-bold'>{hero?.nickname}</h1>
      <p>
        <strong>Real Name:</strong> {hero?.real_name}
      </p>
      <p>
        <strong>Description:</strong> {hero?.origin_description}
      </p>
      <p>
        <strong>Superpowers:</strong> {hero?.superpowers}
      </p>
      <p>
        <strong>Catch Phrase:</strong> "{hero?.catch_phrase}"
      </p>
    </div>
  );
}
