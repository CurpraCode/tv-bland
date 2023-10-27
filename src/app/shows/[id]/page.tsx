import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

// Define types for your data
type Params = {
  params: {
    id: string;
  };
}

interface ShowEpisode {
  id: number;
  name: string;
  status: string;
  summary: string;
  schedule: [string];
  genres: [string];
  rating: {
    average: number;
  };
  network: {
    name: string;
  };
  image: {
    original: string;
  };
}

async function fetchShowData(id: string): Promise<ShowEpisode> {
  const res = await fetch(`https://api.tvmaze.com/shows/${id}`);

  if (!res.ok) {
    console.log('Failed to fetch show data', res.status, res.statusText);
    throw new Error('Failed to fetch show data');
  }

  const showData: ShowEpisode = await res.json();
  return showData;
}

export default async function ShowPage({ params: { id } }: Params) {
  const data = await fetchShowData(id);

  const renderHTML = (html: string) => {
    return { __html: html };
  };
  function formatSchedule(schedule: any) {
    if (schedule && schedule.time && schedule.days) {
      return `${schedule.time} (${schedule.days.join(', ')})`;
    } else {
      return 'Not available';
    }
  }
  return (
    <div className='p-9'>
      <div className='p-4 flex flex-col items-center md:flex-row'>
        <div className='mr-4'>
          <Image
            src={data.image?.original}
            width={300}
            height={400}
            alt='Picture of the Show'
          />
        </div>
        <div className='text-left'>
          <h2 className='text-2xl mb-10 mt-8 sm:mt-0 font-bold'>{data.name}</h2>
          <div dangerouslySetInnerHTML={renderHTML(data.summary)} className='text-md w-96 font-semibold' />
        </div>
      </div>

      <div className='mt-8'>
        
       
        <div className='grid grid-cols-2 gap-4'>
          <div>
             <h2 className='font-bold text-2xl'>Show Info</h2>
             <div className="py-5">
            <p>Streamed on: {data.network.name}</p>
          </div>
          <div className="py-5">
            <p>Schedule: {formatSchedule(data.schedule)}</p>
          </div>
          <div className="py-5">
            <p>Status: {data.status}</p>
          </div>
          <div className="py-5">
            <p>Genres: {data.genres.join(', ')}</p>
          </div>
          </div>
          
         
          <div>
             <h2 className='font-bold text-2xl'>Starring</h2>
             <div className="py-5">
            <p>Streamed on: {data.network.name}</p>
          </div>
          <div className="py-5">
            <p>Schedule: {formatSchedule(data.schedule)}</p>
          </div>
          <div className="py-5">
            <p>Status: {data.status}</p>
          </div>
          <div className="py-5">
            <p>Genres: {data.genres.join(', ')}</p>
          </div>
          </div>
         
        </div>
      </div>
    </div>
  );
}
