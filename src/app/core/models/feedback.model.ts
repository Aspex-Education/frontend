export interface Feedback {
  id?: string;
  type: 'doubt' | 'suggestion' | 'other';
  message: string;
  email?: string;
  createdAt: Date;
  userId?: string;
}
