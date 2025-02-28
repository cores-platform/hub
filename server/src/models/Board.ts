import mongoose, { Document, Schema } from 'mongoose';

export interface IBoard extends Document {
  name: string;
  description: string;
  club: mongoose.Types.ObjectId;
  isActive: boolean;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const BoardSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    club: {
      type: Schema.Types.ObjectId,
      ref: 'Club',
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// 같은 동아리 내에서 게시판 이름은 중복될 수 없음
BoardSchema.index({ name: 1, club: 1 }, { unique: true });

const Board = mongoose.model<IBoard>('Board', BoardSchema);

export default Board; 