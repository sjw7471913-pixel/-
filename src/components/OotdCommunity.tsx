import React, { useState } from 'react';
import { OotdPost, ClothingItem, BodyProfile } from '../types';
import { Heart, MessageSquare, Share2, Plus, Sparkles, CheckCircle2, ThumbsUp, Send, User, Tag } from 'lucide-react';

interface OotdCommunityProps {
  posts: OotdPost[];
  onAddPost: (post: OotdPost) => void;
  onLikePost: (postId: string) => void;
  onVotePoll: (postId: string, option: 'A' | 'B') => void;
  onAddComment: (postId: string, commentText: string) => void;
  closetItems: ClothingItem[];
  bodyProfile: BodyProfile;
}

export const OotdCommunity: React.FC<OotdCommunityProps> = ({
  posts,
  onAddPost,
  onLikePost,
  onVotePoll,
  onAddComment,
  closetItems,
  bodyProfile
}) => {
  const [showShareModal, setShowShareModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);
  const [pollOptionA, setPollOptionA] = useState('');
  const [pollOptionB, setPollOptionB] = useState('');

  // Comment input state per post
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});

  const handleCreatePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const usedItems = closetItems
      .filter((i) => selectedItemIds.includes(i.id))
      .map((i) => ({ category: i.subCategory, name: i.name }));

    const newPost: OotdPost = {
      id: `post-${Date.now()}`,
      authorName: '나의 퍼스널 OOTD',
      authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      authorBodyType: bodyProfile.bodyTypeKorean.split(' ')[0] || '내 체형',
      outfitTitle: newTitle.trim(),
      description: newDescription.trim() || '오늘 AI 핏코디 추천으로 완성한 OOTD입니다!',
      imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop&q=80',
      itemsUsed: usedItems.length > 0 ? usedItems : [{ category: '전체', name: 'AI 맞춤 스캔 코디' }],
      likesCount: 1,
      isLiked: true,
      weatherTag: '서울 23°C 맑음',
      createdAt: '방금 전',
      comments: [],
      pollOptionA: pollOptionA.trim() || undefined,
      pollOptionB: pollOptionB.trim() || undefined,
      pollVotesA: pollOptionA ? 1 : 0,
      pollVotesB: 0
    };

    onAddPost(newPost);
    setShowShareModal(false);
    setNewTitle('');
    setNewDescription('');
    setSelectedItemIds([]);
    setPollOptionA('');
    setPollOptionB('');
  };

  const toggleSelectItem = (id: string) => {
    if (selectedItemIds.includes(id)) {
      setSelectedItemIds(selectedItemIds.filter((i) => i !== id));
    } else {
      setSelectedItemIds([...selectedItemIds, id]);
    }
  };

  const handleCommentSubmit = (postId: string) => {
    const text = commentInputs[postId];
    if (text && text.trim()) {
      onAddComment(postId, text.trim());
      setCommentInputs({ ...commentInputs, [postId]: '' });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-stone-900 flex items-center gap-2">
            <Share2 className="w-5 h-5 text-indigo-600" />
            <span>OOTD 커뮤니티 &amp; 친구 코디 피드</span>
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            내 체형과 비슷한 친구들의 착장을 구경하고, 오늘 입을 코디 투표(A vs B)를 올려보세요!
          </p>
        </div>

        <button
          id="btn-open-share-ootd"
          onClick={() => setShowShareModal(true)}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm shadow-md transition-colors flex items-center gap-2 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>내 코디/투표 공유하기</span>
        </button>
      </div>

      {/* Posts Stream */}
      <div className="space-y-6">
        {posts.map((post) => (
          <div
            key={post.id}
            className="bg-white rounded-3xl border border-stone-200 shadow-md p-5 sm:p-6 space-y-4"
          >
            {/* Author bar */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={post.authorAvatar}
                  alt={post.authorName}
                  className="w-10 h-10 rounded-full object-cover border border-stone-200"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm text-stone-900">{post.authorName}</h4>
                    {post.authorBodyType && (
                      <span className="text-[10px] font-semibold bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full">
                        {post.authorBodyType}
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-stone-400">{post.createdAt} · {post.weatherTag}</span>
                </div>
              </div>
            </div>

            {/* Post Title & Description */}
            <div className="space-y-1">
              <h3 className="font-bold text-base text-stone-900">{post.outfitTitle}</h3>
              <p className="text-xs text-stone-700 leading-relaxed whitespace-pre-line">
                {post.description}
              </p>
            </div>

            {/* Items Used Chips */}
            {post.itemsUsed && post.itemsUsed.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[11px] font-bold text-stone-500">착용 아이템:</span>
                {post.itemsUsed.map((item, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] font-medium bg-stone-100 text-stone-800 px-2 py-0.5 rounded-md border border-stone-200"
                  >
                    {item.category}: {item.name}
                  </span>
                ))}
              </div>
            )}

            {/* Interactive Poll Section (A vs B) if present */}
            {post.pollOptionA && post.pollOptionB && (
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-4 rounded-2xl border border-indigo-100 space-y-3">
                <div className="flex items-center gap-1.5 text-indigo-900 font-bold text-xs">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  <span>🗳️ 실시간 코디 결정 투표: 어떤 코디가 더 나을까요?</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => onVotePoll(post.id, 'A')}
                    className={`p-3 rounded-xl border text-left text-xs font-bold transition-all flex items-center justify-between ${
                      post.userVoted === 'A'
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                        : 'bg-white text-stone-800 border-stone-200 hover:border-indigo-300'
                    }`}
                  >
                    <span>{post.pollOptionA}</span>
                    <span className="text-[11px] opacity-80 shrink-0 ml-2">
                      {post.pollVotesA || 0}표
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onVotePoll(post.id, 'B')}
                    className={`p-3 rounded-xl border text-left text-xs font-bold transition-all flex items-center justify-between ${
                      post.userVoted === 'B'
                        ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                        : 'bg-white text-stone-800 border-stone-200 hover:border-purple-300'
                    }`}
                  >
                    <span>{post.pollOptionB}</span>
                    <span className="text-[11px] opacity-80 shrink-0 ml-2">
                      {post.pollVotesB || 0}표
                    </span>
                  </button>
                </div>
              </div>
            )}

            {/* Like & Comment Bar */}
            <div className="flex items-center gap-4 pt-2 border-t border-stone-100 text-xs">
              <button
                type="button"
                onClick={() => onLikePost(post.id)}
                className={`flex items-center gap-1.5 font-bold transition-colors cursor-pointer ${
                  post.isLiked ? 'text-rose-600' : 'text-stone-500 hover:text-rose-600'
                }`}
              >
                <Heart className={`w-4 h-4 ${post.isLiked ? 'fill-rose-600' : ''}`} />
                <span>좋아요 {post.likesCount}</span>
              </button>

              <div className="flex items-center gap-1.5 text-stone-500 font-bold">
                <MessageSquare className="w-4 h-4" />
                <span>댓글 {post.comments?.length || 0}</span>
              </div>
            </div>

            {/* Comments Stream */}
            <div className="space-y-2 pt-1">
              {post.comments?.map((comment) => (
                <div key={comment.id} className="bg-stone-50 p-2.5 rounded-xl text-xs flex gap-2.5">
                  <img
                    src={comment.authorAvatar}
                    alt={comment.authorName}
                    className="w-6 h-6 rounded-full object-cover shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-stone-900">{comment.authorName}</span>
                      <span className="text-[10px] text-stone-400">{comment.createdAt}</span>
                    </div>
                    <p className="text-stone-700 mt-0.5">{comment.content}</p>
                  </div>
                </div>
              ))}

              {/* Add Comment Input */}
              <div className="flex gap-2 pt-1">
                <input
                  type="text"
                  placeholder="의견이나 피드백 댓글을 남겨보세요..."
                  value={commentInputs[post.id] || ''}
                  onChange={(e) => setCommentInputs({ ...commentInputs, [post.id]: e.target.value })}
                  onKeyDown={(e) => e.key === 'Enter' && handleCommentSubmit(post.id)}
                  className="flex-1 bg-stone-50 border border-stone-200 rounded-xl px-3 py-1.5 text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                />
                <button
                  type="button"
                  onClick={() => handleCommentSubmit(post.id)}
                  className="px-3 py-1.5 rounded-xl bg-stone-900 text-white font-bold text-xs hover:bg-stone-800 cursor-pointer"
                >
                  등록
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleCreatePostSubmit}
            className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl relative"
          >
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="font-bold text-base text-stone-900">내 OOTD 공유 &amp; 투표 등록</h3>
              <button
                type="button"
                onClick={() => setShowShareModal(false)}
                className="text-stone-400 hover:text-stone-700 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-stone-700 font-bold block mb-1">제목 *</label>
                <input
                  type="text"
                  required
                  placeholder="예: 오늘 서울 날씨에 입은 시티보이 트렌치 코디✨"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full border border-stone-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-indigo-500/30 outline-none"
                />
              </div>

              <div>
                <label className="text-stone-700 font-bold block mb-1">스타일 설명</label>
                <textarea
                  rows={2}
                  placeholder="AI 코디 추천 후기나 오늘 착장의 포인트를 작성해보세요."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full border border-stone-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-indigo-500/30 outline-none"
                />
              </div>

              {/* Attach items from user's closet */}
              <div>
                <label className="text-stone-700 font-bold block mb-1">
                  태그할 내 옷장 아이템 선택 ({selectedItemIds.length}개 선택됨)
                </label>
                <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto p-2 bg-stone-50 rounded-xl border border-stone-200">
                  {closetItems.map((item) => {
                    const isSelected = selectedItemIds.includes(item.id);
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => toggleSelectItem(item.id)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-indigo-600 text-white'
                            : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-100'
                        }`}
                      >
                        {item.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* A vs B Poll (Optional) */}
              <div className="bg-indigo-50/60 p-3 rounded-2xl border border-indigo-100 space-y-2">
                <span className="text-[11px] font-bold text-indigo-900 block">
                  🗳️ 친구들에게 물어볼 코디 선택지 투표 (선택 사항)
                </span>
                <input
                  type="text"
                  placeholder="선택지 A: 단정한 베이지 트렌치 코디"
                  value={pollOptionA}
                  onChange={(e) => setPollOptionA(e.target.value)}
                  className="w-full border border-stone-200 rounded-xl px-3 py-1.5 text-xs bg-white"
                />
                <input
                  type="text"
                  placeholder="선택지 B: 편안한 후드 데님 코디"
                  value={pollOptionB}
                  onChange={(e) => setPollOptionB(e.target.value)}
                  className="w-full border border-stone-200 rounded-xl px-3 py-1.5 text-xs bg-white"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-100">
              <button
                type="button"
                onClick={() => setShowShareModal(false)}
                className="px-4 py-2 rounded-xl text-stone-600 font-semibold text-xs hover:bg-stone-100"
              >
                취소
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md"
              >
                피드에 공유하기
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
