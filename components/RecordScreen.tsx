"use client"
import Image from 'next/image'
import React, { useRef, useState } from 'react'
import { ICONS } from '../constants'
import { useRouter } from 'next/navigation'
import { useScreenRecording } from '../lib/hooks/useScreenRecording'

const RecordScreen = () => {
  const[isOpen, setIsOpen] =useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const router = useRouter();
  const { 
    resetRecording,
    startRecording,
    stopRecording,
    isRecording,
    recordedBlob,
    recordedVideoUrl,
    recordingDuration
 } = useScreenRecording();

  const closeModel = () => {
    resetRecording();
    setIsOpen(false);
  }

  const handleStart =async () => {
    await startRecording();
  };

  const recordAgain = async() => {
    resetRecording();
    await startRecording();

    if(recordedVideoUrl && videoRef.current){
        videoRef.current.src = recordedVideoUrl
    }

  } 

  const goToUpload = () => {
    if(!recordedBlob) return;
    const url = URL.createObjectURL(recordedBlob);
    sessionStorage.setItem("recordedVideo", 
        JSON.stringify({
            url,
            name: "screen-recording.webm",
            type: recordedBlob.type,
            size: recordedBlob.size,
            duration: recordingDuration || 0,
        }) 
    )
    router.push('/upload');
    // closeModel();
  }

  return (
    <div className='record'>
        <button className='primary-btn' onClick={() => setIsOpen(prev => !prev)}>
                <Image 
                    src={ICONS.record}
                    alt='record'
                    width={16}
                    height={16}
                    className=''
                />
                <span>Record a video</span>
        </button>
        {
            isOpen && (
                <section className='dialog'>
                    <div className='overlay-record' onClick={closeModel} />
                        <div className='dialog-content'>
                            <figure>
                                <h3>Screen Recording</h3>
                                <button onClick={closeModel}>
                                    <Image
                                        src={ICONS.close}
                                        alt='close'
                                        width={20}
                                        height={20}
                                    />
                                </button>
                            </figure>
                            <section>
                                {
                                    isRecording ? (
                                        <article>
                                            <div />
                                            <span>Recording in progress</span>
                                        </article>
                                    ) : recordedVideoUrl ? (
                                        <video ref={videoRef} src={recordedVideoUrl} controls/>
                                    ) : (
                                        <p>Click record to start capturing your screen</p>
                                    )
                                }
                            </section>
                            <div className='record-box'>
                                {
                                    !isRecording && !recordedVideoUrl && (
                                        <button onClick={handleStart} className='record-start'>
                                            <Image 
                                                src={ICONS.record}
                                                alt='record'
                                                width={16}
                                                height={16}
                                            />
                                            Record
                                        </button>
                                    )
                                }
                                {
                                    isRecording && (
                                        <button onClick={stopRecording} className='record-stop'>
                                            <Image 
                                                src={ICONS.record}
                                                alt='record'
                                                width={16}
                                                height={16}
                                            />
                                            Stop Recording
                                        </button>
                                    )
                                }
                                {
                                    recordedVideoUrl && (
                                        <>
                                            <button className='record-again' onClick={recordAgain}>
                                                Record Again
                                            </button>
                                            <button onClick={goToUpload} className='record-upload'>
                                                <Image 
                                                    src={ICONS.upload}
                                                    alt='upload'
                                                    width={16}
                                                    height={16}
                                                />
                                                Continue to upload
                                            </button>   
                                        </>
                                    )
                                }
                            </div>
                        </div>
                </section>
            )
        }
    </div>
  )
}

export default RecordScreen