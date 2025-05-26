"use client"
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { daysAgo } from '../lib/utils'
import ImageWithFallback from './ImageFallBack'
import { authClient } from '../lib/auth-client'
import { deleteVideo } from '../lib/actions/video'

const VideoDetailHeader = ({ 
    title, 
    createdAt, 
    userImg, 
    username, 
    videoId, 
    ownerId, 
    visibility, 
    thumbnailUrl ,
    id
}: VideoDetailHeaderProps) => {
    const[isDeleting, setIsDeleting] = useState<boolean>(false);
    const[copied, setCopied] = useState<boolean>(false);
    const router = useRouter();
    const { data: session } = authClient.useSession();
    const userId = session?.user.id;
    const isOwner = userId === ownerId;
    
    
    const HandleCopyLink = () => {
        navigator.clipboard.writeText(`${window.location.origin}/video/${id}`);
        setCopied(true);
    }

    const handleDelete = async() => {
        try {
            setIsDeleting(true);
            await deleteVideo(videoId, thumbnailUrl);
            router.push("/");
        } catch (error) {
            console.error("Error deleting video:", error);
        } finally {
            setIsDeleting(false);
        }
    }

    useEffect(() => {
        const changedChecked = setTimeout(() => {
            if(copied) setCopied(false);
        }, 3000)
        return () => clearTimeout(changedChecked);
    }, [copied])
    return (
    <header className="detail-header">
      <aside className="user-info">
        <h1>{title}</h1>
        <figure>
          <button onClick={() => router.push(`/profile/${ownerId}`)}>
            <ImageWithFallback
              src={userImg ?? ""}
              alt="Jason"
              width={24}
              height={24}
              className="rounded-full"
            />
            <h2>{username ?? "Guest"}</h2>
          </button>
          <figcaption>
            <span className="mt-1">・</span>
            <p>{daysAgo(createdAt)}</p>
          </figcaption>
        </figure>
      </aside>
      <aside className="cta">
        <button onClick={HandleCopyLink}>
          <Image
            src={
              copied ? "/assets/images/checked.png" : "/assets/icons/link.svg"
            }
            alt="Copy Link"
            width={24}
            height={24}
          />
        </button>
        {isOwner && (
          <div className="user-btn">
            <button
              className="delete-btn"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete video"}
            </button>
            {/* <div className="bar" />
            {isUpdating ? (
              <div className="update-stats">
                <p>Updating...</p>
              </div>
            ) : (
              <DropdownList
                options={visibilities}
                selectedOption={visibilityState}
                onOptionSelect={handleVisibilityChange}
                triggerElement={TriggerVisibility}
              />
            )} */}
          </div> 
        )}
      </aside>
    </header>
  );
}

export default VideoDetailHeader