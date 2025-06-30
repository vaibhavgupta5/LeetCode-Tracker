import mongoose, { Schema, Document, model, models } from "mongoose";

export interface IStudent  {
  fullName: string;
  username: string;
  totalQuestions: {
    All: number;
    Easy: number;
    Medium: number;
    Hard: number;
  };
  raking: number;
  rating: number;
  last5Submissions: {
    title: string;
    slug: string;
    timeStamp: string;
    status: string;
    language: string;
  }[];
  contests: {
    attended: boolean;
    title: string;
    ranking: number;
    problemsSolved: number;
    totalQuestions: number;
    rating: number;
    timeStamp: string;
  }[];
  badges: {
    title: string;
    timeStamp: string;
    icon: string;
  }[];
  calender: {
    date: string;
    questions: number;
  }[];
  about: string;
  mainLanguages: string[];
  avatar: string;
  socials: {
    github: string;
    linkedin: string;
    twitter: string;
  };
  totalSubmissions: {
    All: number;
    Easy: number;
    Medium: number;
    Hard: number;
  };
  timeStamp: Date;
}

const StudentSchema = new Schema<IStudent>({
  fullName: { type: String, required: true },
  username: { type: String, required: true },
  totalQuestions: {
    All: { type: Number, required: true },
    Easy: { type: Number, required: true },
    Medium: { type: Number, required: true },
    Hard: { type: Number, required: true },
  },
  raking: { type: Number, required: true },
  rating: { type: Number, required: true },
  last5Submissions: [
    {
      title: { type: String, required: true },
      slug: { type: String, required: true },
      timeStamp: { type: String, required: true },
      status: { type: String, required: true },
      language: { type: String, required: true },
    },
  ],
  contests: [
    {
      attended: { type: Boolean, required: true },
      title: { type: String, required: true },
      ranking: { type: Number, required: true },
      problemsSolved: { type: Number, required: true },
      totalQuestions: { type: Number, required: true },
      rating: { type: Number, required: true },
      timeStamp: { type: String, required: true },
    },
  ],
  badges: [
    {
      title: { type: String, required: true },
      timeStamp: { type: String, required: true },
      icon: { type: String, required: true },
    },
  ],
  calender: [
    {
      date: { type: String, required: true },
      questions: { type: Number, required: true },
    },
  ],
  about: { type: String, required: true },
  mainLanguages: { type: [String], required: true },
  avatar: { type: String, required: true },
  socials: {
    github: { type: String },
    linkedin: { type: String },
    twitter: { type: String },
  },
  totalSubmissions: {
    All: { type: Number, required: true },
    Easy: { type: Number, required: true },
    Medium: { type: Number, required: true },
    Hard: { type: Number, required: true },
  },
  timeStamp: { type: Date, default: Date.now },
});

export default models.Student || model("Student", StudentSchema);

