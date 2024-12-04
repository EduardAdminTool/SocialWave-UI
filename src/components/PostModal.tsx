import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Heart, MessageCircle, Send, Bookmark } from 'lucide-react'
import Image from "next/image"
import { Post } from '@/types/posts/types'
interface PostModalProps {
  post: Post | null
  isOpen: boolean
  onClose: () => void
}

export function PostModal({ post, isOpen, onClose }: PostModalProps) {
  if (!post) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] p-0">
        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-2/3 relative h-[400px] md:h-[600px]">
            {/* <Image
              src={post.images[0].imageUrl}
              alt="Post image"
              layout="fill"
              objectFit="cover"
            /> */}
          </div>
          <div className="w-full md:w-1/3 p-4 flex flex-col">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={post.author.profilePicture} />
                  <AvatarFallback>{post.author.name[0]}</AvatarFallback>
                </Avatar>
                <span>{post.author.name}</span>
              </DialogTitle>
            </DialogHeader>
            <div className="flex-grow overflow-y-auto">
              <p className="text-sm mt-2">{post.caption}</p>
              {/* Add comments here if available in your data structure */}
            </div>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between">
                <div className="flex space-x-2">
                  <Button variant="ghost" size="icon">
                    <Heart className="h-6 w-6" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <MessageCircle className="h-6 w-6" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Send className="h-6 w-6" />
                  </Button>
                </div>
                <Button variant="ghost" size="icon">
                  <Bookmark className="h-6 w-6" />
                </Button>
              </div>
              <p className="font-bold">{post.likes} likes</p>
              <p className="text-xs text-gray-500">{new Date(post.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

