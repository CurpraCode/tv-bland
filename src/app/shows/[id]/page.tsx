// 'use client'
import React from 'react';
import { z } from 'zod';
import Image from 'next/image';

import StarRating  from './StarRating';


// Define types for your data
type Params = {
  params: {
    id: string;
  };
}

const ShowEpisodeSchema = z.object({
  id: z.number(),
  name: z.string(),
  status: z.string(),
  summary: z.string(),
  schedule: z.union([
    z.array(z.string()),
    z.object({
      time: z.string(),
      days: z.array(z.string()),
    }),
  ]),
  genres: z.array(z.string()),
  rating: z.object({
    average: z.number().nullable(),
  }),
  network: z.object({
    name: z.string(),
  }),
  image: z.object({
    original: z.string(),
  }),
});

interface ShowEpisode {
  id: number;
  name: string;
  status: string;
  summary: string;
  schedule: string[] | { time: string; days: string[] };
  genres: string[];
  rating: {
    average: number | null;
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
    console.error('Failed to fetch show data', res.status, res.statusText);
    throw new Error('Failed to fetch show data');
  }

  const showData = await res.json();

  // Explicitly cast the data to the expected type
  const validationResult = ShowEpisodeSchema.safeParse(showData);

  if (validationResult.success) {
    return validationResult.data;
  } else {
    console.error('Fetched data:', showData);
    console.error('Validation error:', validationResult.error.message);
    console.error('Validation issues:', validationResult.error.issues);
    throw new Error('Data validation failed');
  }
}

export default async function ShowPage({ params: { id } }: Params) {
  const data = await fetchShowData(id);
  console.log(data);
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
  const normalizedRating = data.rating.average !== null ? Math.max(0, Math.min(5, data.rating.average)) : null;

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
          <h2 className='text-2xl mb-6 mt-8 sm:mt-0 font-bold'>{data.name}</h2>
          <div className='text-md flex mb-4'>
          <StarRating value={normalizedRating !== null ? normalizedRating : 0} />
            <p className="ml-3">{data.rating.average !== null ? `${data.rating.average}/5` : 'N/A'}</p>
          </div>
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
              <p>Genres: {data.genres?.join(', ')}</p>
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
              <p>Genres: {data.genres?.join(', ')}</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
