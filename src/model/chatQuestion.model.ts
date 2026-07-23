import mongoose, { model, Schema } from "mongoose";

interface IRecentQuestion {
  question: string;
  askedAt: Date;
}

interface IChatQuestion {
  ownerId: string;
  normalizedQuestion: string;
  latestQuestion: string;
  answer: string;
  responseLanguage: string;
  knowledgeSignature: string;
  askedCount: number;
  cacheHits: number;
  firstAskedAt: Date;
  lastAskedAt: Date;
  recentQuestions: IRecentQuestion[];
  createdAt?: Date;
  updatedAt?: Date;
}

const recentQuestionSchema = new Schema<IRecentQuestion>(
  {
    question: {
      type: String,
      required: true,
      trim: true,
    },
    askedAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
  { _id: false }
);

const chatQuestionSchema = new Schema<IChatQuestion>(
  {
    ownerId: {
      type: String,
      required: true,
      index: true,
    },
    normalizedQuestion: {
      type: String,
      required: true,
      trim: true,
    },
    latestQuestion: {
      type: String,
      required: true,
      trim: true,
    },
    answer: {
      type: String,
      required: true,
      trim: true,
    },
    responseLanguage: {
      type: String,
      required: true,
      trim: true,
    },
    knowledgeSignature: {
      type: String,
      required: true,
      trim: true,
    },
    askedCount: {
      type: Number,
      default: 1,
      min: 1,
    },
    cacheHits: {
      type: Number,
      default: 0,
      min: 0,
    },
    firstAskedAt: {
      type: Date,
      default: Date.now,
    },
    lastAskedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
    recentQuestions: {
      type: [recentQuestionSchema],
      default: [],
    },
  },
  { timestamps: true }
);

chatQuestionSchema.index(
  {
    ownerId: 1,
    normalizedQuestion: 1,
    responseLanguage: 1,
    knowledgeSignature: 1,
  },
  { unique: true }
);

const ChatQuestion =
  mongoose.models.ChatQuestion || model("ChatQuestion", chatQuestionSchema);

export default ChatQuestion;
