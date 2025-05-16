"use client";
import React, { ChangeEvent, FormEvent, useState } from 'react'
import FormField from '../../../components/FormField'
import FileInput from '../../../components/FileInput'
import { useFileInput } from '../../../lib/hooks/useFileInput';
import { MAX_THUMBNAIL_SIZE, MAX_VIDEO_SIZE } from '../../../constants';

const Page = () => {
  const[error, setError] = useState<string | null>(null);
  const[isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const[formdata, setFormData] = useState({
    title: "",
    description: "",
    visibility: "public",

  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  const video = useFileInput(MAX_VIDEO_SIZE);
  const thumbnail = useFileInput(MAX_THUMBNAIL_SIZE);
  
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
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
        //uplaod the thumbnail to db
        //atttach the thumbnail to video
        //create a new db entry for thr video details(url, data) 

    } catch (error) {
        console.log("Error submitting form...", error);
    }finally {
        setIsSubmitting(false);
    }
  }

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
                label="thumbnail"
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