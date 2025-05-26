"use client";
import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import FormField from '../../../components/FormField'
import FileInput from '../../../components/FileInput'
import { useFileInput } from '../../../lib/hooks/useFileInput';
import { MAX_THUMBNAIL_SIZE, MAX_VIDEO_SIZE } from '../../../constants';
import { getThumbnailUploadUrl, getVideoUploadUrl, saveVideoDetails } from '../../../lib/actions/video';
import { useRouter } from 'next/navigation';

const uploadFileToBunny = (file: File, uploadUrl: string, accessKey: string): Promise<void> => {
    return fetch(uploadUrl, {
        method: "PUT",
        headers: {
            'Content-type': file.type,
            AccessKey: accessKey
        },
        body: file
    }).then((response) => {
        if(!response.ok) throw new Error("Upload failed");
    })
}

const Page = () => {
  const[error, setError] = useState<string | null>(null);
  const[isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const[videoDuration, setVideoDuration] = useState<number>(0);
  const[formdata, setFormData] = useState({
    title: "",
    description: "",
    visibility: "public",
  });
  const router = useRouter();
  
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    
    const video = useFileInput(MAX_VIDEO_SIZE);
    const thumbnail = useFileInput(MAX_THUMBNAIL_SIZE);
    
    const handleSubmit = async(e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        setIsSubmitting(true);
        try {
            if(!video.file || !thumbnail.file){
                setError("Please upload the video and thumbnail");
                return;
            }
            if(!formdata.title || !formdata.description){
                setError("Please full in all the details");
                return;
            }
            
            //uplaod the video to bunny 
            // 1. get upload URL
            const { 
                videoId,
                uploadUrl: videoUploadUrl,
                accessKey: videoAccessKey
            } = await getVideoUploadUrl();
            console.log("Video credentials", videoAccessKey, videoUploadUrl);
            
            if (!videoUploadUrl || !videoAccessKey) {
                throw new Error("Failed to get video upload credentials");
            }
            // 2. upload the video to bunny 
            await uploadFileToBunny(video.file, videoUploadUrl, videoAccessKey);
            
            //uplaod the thumbnail to db
            const { 
                uploadUrl: thumbnailUploadUrl,
                accessKey: thumbnailAccessKey,
                cdnUrl: thumbnailCdnUrl
            } = await getThumbnailUploadUrl(videoId);
            if (!thumbnailUploadUrl || !thumbnailAccessKey || !thumbnailCdnUrl) {
                throw new Error("Failed to get thumbnail upload credentials");
            }
            //atttach the thumbnail to video
            await uploadFileToBunny(thumbnail.file, thumbnailUploadUrl, thumbnailAccessKey);
            
            //create a new db entry for thr video details(url, data) 
            await saveVideoDetails({
                videoId,
                thumbnailUrl: thumbnailCdnUrl,
                ...formdata,
                duration: video.duration
            });
            router.push(`/`);
            
        } catch (error) {
            console.log("Error submitting form...", error);
        }finally {
            setIsSubmitting(false);
        }
    }

    useEffect(() => {
      if(video.duration !== null || 0){
          setVideoDuration(video.duration); 
      }
    }, [video.duration]);
    
    useEffect(() => {
        const checkForRecordedVideo = async() => {
            try {
                const stored = sessionStorage.getItem("recordedVideo");
                if(!stored) return;
                const { url, name, type, duration } = JSON.parse(stored);
                const blob = await fetch(url).then((res) => res.blob());
                const file = new File([blob], name, { type, lastModified: Date.now() } )

                if(video.inputRef.current){
                    const dataTransfer = new DataTransfer();
                    dataTransfer.items.add(file);
                    video.inputRef.current.files = dataTransfer.files;

                    const event = new Event('change', { bubbles: true });
                    video.inputRef.current.dispatchEvent(event);

                    video.handleFileChange({
                        target: { files: dataTransfer.files }
                    } as ChangeEvent<HTMLInputElement>) 
                }
                if(duration) setVideoDuration(duration);
                sessionStorage.removeItem("recordedVideo");
                URL.revokeObjectURL(url);
            } catch (error) {
                console.error("Error loading recorded video: ", error);
            }
        }
        checkForRecordedVideo();
    }, [])

    return (
        <div className='wrapper-md upload-page'>
        <h1 className='text-center'>Upload a video</h1>
        {
            error && <div className='error-field'>{error}</div>
        }
        <form className="rounded-20 shadow-10 gap-6 w-full flex flex-col px-5 py-7.5" onSubmit={handleSubmit}>
            <FormField 
                id="title"
                label="Title"
                value={formdata.title}
                onChange={handleInputChange}
                placeholder="Enter a clear and concise video title"
            />
            <FormField 
                id="description"
                label="Description"
                value={formdata.description}
                as='textarea'
                onChange={handleInputChange}
                placeholder="Describe what this video is about"
            />
            <FileInput 
                id="video"
                label="Video"
                accept="video/*"
                file={video.file}
                previewUrl={video.previewUrl}
                inputRef={video.inputRef}
                onChange={video.handleFileChange}
                onReset={video.resetFile}
                type="video"
            />
            <FileInput 
                id="thumbnail"
                label="Thumbnail"
                accept="image/*"
                file={thumbnail.file}
                previewUrl={thumbnail.previewUrl}
                inputRef={thumbnail.inputRef}
                onChange={thumbnail.handleFileChange}
                onReset={thumbnail.resetFile}
                type="image"
            />
            <FormField 
                id="visibility"
                label="Visibility"
                value={formdata.visibility}
                as='select'
                onChange={handleInputChange}
                options={[
                    { value: 'public', label: "Public" },
                    { value: 'private', label: "Private" }
                ]}
            />
            <button type='submit' disabled={isSubmitting} className='submit-button'> 
                {isSubmitting ? "Uploading..." : "Upload video"}
            </button>
        </form>
    </div>
  )
}

export default Page