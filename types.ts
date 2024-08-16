export type VoteValue = '' | 'up' | 'down' | 'super';

export type Vote = {
  vote: VoteValue;
  id: string;
}

export type ClipDatum = {
  id: string;
  vote: VoteValue;
  file: string;
  categories: string[];
}

export type CategoryDatum = {
  id: string;
  name: string;
}

export type ClipRecord = {
  id: string;
  vote: string;
  file: string;
  categories: string;
};
