export interface ShareDetails {
  comments: Comment[];
  shared: Shared[];
}
export interface Comment {
  updateDate: Date;
  comment: string;
}

export interface Shared {
  uid: string;
}
