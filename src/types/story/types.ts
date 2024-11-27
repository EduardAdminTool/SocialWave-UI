export interface Story {
  name: string;
  image: string;
}

export interface StoryCarouselProps {
  stories: Story[];
}

export interface StoryItemProps {
  name: string;
  image: string;
  isOwn?: boolean;
}
