import mongoose, { Document, Schema } from 'mongoose';

export enum PostType {
  NOTICE = 'notice',
  GENERAL = 'general',
  EVENT = 'event',
}

export interface IPost extends Document {
  title: string;
  content: string;
  author: mongoose.Types.ObjectId;
  board: mongoose.Types.ObjectId;
  club: mongoose.Types.ObjectId;
  isActive: boolean;
  type: PostType;
  likes: mongoose.Types.ObjectId[];
  comments: {
    user: mongoose.Types.ObjectId;
    content: string;
    createdAt: Date;
  }[];
  attachments: string[];
  views: number;
  createdAt: Date;
  updatedAt: Date;
}

const PostSchema = new Schema<IPost>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    board: {
      type: Schema.Types.ObjectId,
      ref: 'Board',
      required: true,
    },
    club: {
      type: Schema.Types.ObjectId,
      ref: 'Club',
      required: true,
    },
    type: {
      type: String,
      enum: Object.values(PostType),
      default: PostType.GENERAL,
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    comments: [
      {
        user: {
          type: Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        content: {
          type: String,
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    attachments: [
      {
        type: String,
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// 인덱스 추가 (검색 및 필터링 최적화)
PostSchema.index({ title: 'text', content: 'text' });
PostSchema.index({ board: 1, createdAt: -1 }); // 게시판별 정렬
PostSchema.index({ author: 1 }); // 작성자별 검색

const Post = mongoose.model<IPost>('Post', PostSchema);

export default Post;
