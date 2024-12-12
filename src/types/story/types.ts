export interface StoryCarouselProps {
  stories: Story[];
}

export interface StoryItemProps {
  name: string;
  image: string;
  isOwn?: boolean;
}

export interface Story {
  storyId: string;
  imageUrl?: string;
  videoUrl?: string;
  createdAt: string;
  name: string;
  profilePicture: string;
}
