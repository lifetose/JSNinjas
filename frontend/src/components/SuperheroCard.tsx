import { ISuperhero } from "../types/Superhero";
import { Link } from "react-router-dom";

import notfounditem from "../assets/not-found-item.png";

export default function SuperheroCard({ hero }: { hero: ISuperhero }) {
  return (
    <div>
      <figure className='relative h-[30vh] max-h-[250px] sm:max-h-[300px] md:max-h-[360px] md:h-[360px]'>
        <img
          src={hero.image || notfounditem}
          alt={hero.nickname}
          className='w-full h-full object-cover bg-base-100'
          loading='lazy'
          onError={(e) => {
            (e.target as HTMLImageElement).src = notfounditem;
          }}
        />
      </figure>

      <div className='mt-[5px]'>
        <h2 className='font-bold whitespace-nowrap text-ellipsis block overflow-hidden'>
          {hero.nickname}
        </h2>
        <h3 className='text-[12px] whitespace-nowrap text-ellipsis block overflow-hidden'>
          {hero.real_name}
        </h3>
        <Link to={`/hero/${hero.id}`} className='text-blue-600 block'>
          View Details →
        </Link>
      </div>
    </div>
  );
}
