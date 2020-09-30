export type ChatMessage = {
  author: string | null;
  id: string;
  content: string | JSX.Element;
};
