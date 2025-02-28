import mongoose, { Document, Schema } from 'mongoose';

export enum ClubMemberRole {
  OWNER = 'owner',
  ADMIN = 'admin',
  MEMBER = 'member',
  PENDING = 'pending',
}

// 동아리 내 회원 정보 인터페이스
export interface IClubMember {
  user: mongoose.Types.ObjectId;
  role: ClubMemberRole;
  joinedAt: Date;
}

export interface IClub extends Document {
  name: string;
  description: string;
  category: string;
  imageUrl?: string;
  owner: mongoose.Types.ObjectId;
  members: IClubMember[];
  isActive: boolean;
  isPrivate: boolean; // 가입 승인이 필요한지 여부
  createdAt: Date;
  updatedAt: Date;
}

const ClubMemberSchema = new Schema<IClubMember>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  role: {
    type: String,
    enum: Object.values(ClubMemberRole),
    default: ClubMemberRole.MEMBER,
  },
  joinedAt: {
    type: Date,
    default: Date.now,
  },
});

const ClubSchema = new Schema<IClub>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    imageUrl: {
      type: String,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    members: [ClubMemberSchema],
    isActive: {
      type: Boolean,
      default: true,
    },
    isPrivate: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// 인덱스 추가 (검색 및 필터링 최적화)
ClubSchema.index({ name: 'text', category: 'text' });
ClubSchema.index({ 'members.user': 1, 'members.role': 1 });

const Club = mongoose.model<IClub>('Club', ClubSchema);

export default Club;
