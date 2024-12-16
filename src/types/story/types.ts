export interface StoryCarouselProps {
  stories: Story[];
  type?: string;
}

export interface StoryItemProps {
  name: string;
  image: string;
  isOwn?: boolean;
}

export interface Story {
  storyId: number;
  imageUrl?: string;
  videoUrl?: string;
  createdAt: string;
  userId: number;
  name: string;
  profilePicture: string;
}
