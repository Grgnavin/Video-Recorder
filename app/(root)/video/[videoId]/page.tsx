import React from 'react'
import { getVideoById } from '../../../../lib/actions/video';
import { redirect } from 'next/navigation';
import VideoPlayer from '../../../../components/VideoPlayer';
import VideoDetailHeader from '../../../../components/VideoDetailHeader';
import VideoInfo from '../../../../components/VideoInfo';

const VideoPage =async ({ params }: Params) => {
  const { videoId} = await params;
  const { video, user } = await getVideoById(videoId);
  if(!video) redirect('/404');
  console.log(user?.image);
  
  return (
    <main className='wrapper page'>
        <VideoDetailHeader 
          {...video}
          userImg={user?.image || ""}
          username={user?.name}
          ownerId={video.userId}
        />
        <section className='video-details'>
          <div className='content'>
              <VideoPlayer 
                videoId={video.videoId}
              />
            </div>
            <VideoInfo
              transcript={}
              title={video.title}
              createdAt={video.createdAt}
              description={video.description}
              videoId={videoId}
              videoUrl={video.videoUrl}
            />
        </section>
    </main>
  )
}

export default VideoPage