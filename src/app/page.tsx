import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { z } from 'zod'; 

const ShowSchema = z.object({
  id: z.number(),
  name: z.string(),
  image: z.object({
    original: z.string(),
  }),
});

const EpisodeSchema = z.object({
  show: ShowSchema, 
});


type Episode = z.output<typeof EpisodeSchema>;

async function fetchScheduleData(): Promise<Episode[]> {
  const res = await fetch('https://api.tvmaze.com/schedule/');

  if (!res.ok) {
    console.log('Failed to fetch schedule data', res.status, res.statusText);
    throw new Error('Failed to fetch schedule data');
  }

  const scheduleData = await res.json();

  // Modify the data to provide default values for 'null' image properties
  const modifiedData = scheduleData.map((item: any) => {
    if (item.show.image === null) {
      item.show.image = { original: '' };
    }
    return item;
  });

  // Validate the modified data with Zod
  const validationResult = EpisodeSchema.array().safeParse(modifiedData);

  if (validationResult.success) {
    return validationResult.data; 
  } else {
    console.error('Fetched data:', modifiedData);
    console.error('Validation error:', validationResult.error.message);
    console.error('Validation issues:', validationResult.error.issues);
    throw new Error('Data validation failed');
  }
}


export default async function Home() {
  const data = await fetchScheduleData();


  return (
    <div className='p-4'>
      <div className='p-9'>
        <p className='text-sm md:text-lg'>TV Show and web series database.
          <br />
          Create personalized schedules. Episode guide, cast, crew, and character information
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
