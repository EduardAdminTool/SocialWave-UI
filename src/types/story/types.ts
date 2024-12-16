export interface StoryCarouselProps {
  stories: Story[];
  type?: string;
  setStories: (stories: Story[]) => void;
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
