import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
// Define types for your data
interface Episode {
  show: {
    id: number;
    name: string;
    image: {
      original: string;
    };
  };
}

async function fetchScheduleData(): Promise<Episode[]> {
  const res = await fetch('https://api.tvmaze.com/schedule/');

  if (!res.ok) {
    console.log('Failed to fetch schedule data', res.status, res.statusText);
    throw new Error('Failed to fetch schedule data');
  }

  const scheduleData: Episode[] = await res.json();
  return scheduleData;
}

export default async function Home() {
  const data = await fetchScheduleData();
  console.log(data)
  return (
    <div className='p-4'>
      <div className='p-9'> 
      <p className='text-sm md:text-lg'>TV Show and web series database.
        <br />
        Create personalised schedules. Episode guide, cast, crew and character information
      </p>
      </div>
        <h2 className='px-9 text-xl sm:text-2xl mt-4'>Last Added Shows</h2>
      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
        {data?.map((episode) => (
          <div className='flex flex-col items-center p-4 rounded-md shadow-md' key={episode.show.id}>
            <Link href={`/shows/${episode?.show?.id}`}>
              <Image
                src={episode?.show.image?.original}
                width={200}
                height={300}
                alt="Picture of the Movie"
              />
            </Link> 
            <p className='mt-2 text-center font-semibold text-sm md:text-lg'>
                {episode.show.name}
              </p>
          </div>
        ))}
      </div>
    </div>
  );
}


