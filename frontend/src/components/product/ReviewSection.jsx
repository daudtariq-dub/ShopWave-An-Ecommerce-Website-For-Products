import { useState, useEffect, useContext } from 'react';
import { Star, Trash2, Pencil } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import { reviewsApi } from '../../api/reviews.api';
import Button from '../ui/Button';
import { toast } from 'react-toastify';

function StarPicker({ value, onChange }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          className="p-0.5 transition-transform hover:scale-110"
        >
          <Star
            className="w-6 h-6"
            fill={(hovered || value) >= star ? '#fbbf24' : 'none'}
            color={(hovered || value) >= star ? '#fbbf24' : '#d1d5db'}
            strokeWidth={1.5}
          />
        </button>
      ))}
    </div>
  );
}

function StarDisplay({ rating, size = 'sm' }) {
  const sz = size === 'sm' ? 'w-3.5 h-3.5' : 'w-5 h-5';
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={sz}
          fill={s <= Math.round(rating) ? '#fbbf24' : 'none'}
          color={s <= Math.round(rating) ? '#fbbf24' : '#d1d5db'}
          strokeWidth={1.5}
        />
      ))}
    </div>
  );
}

function ReviewForm({ productId, existing, onSaved, onCancel }) {
  const [rating, setRating] = useState(existing?.rating ?? 0);
  const [title, setTitle] = useState(existing?.title ?? '');
  const [body, setBody] = useState(existing?.body ?? '');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating) return toast.error('Please select a rating');
    if (!body.trim()) return toast.error('Please write a review');
    setSaving(true);
    try {
      const review = await reviewsApi.upsert(productId, { rating, title: title.trim() || undefined, body: body.trim() });
      onSaved(review);
      toast.success(existing ? 'Review updated' : 'Review submitted');
    } catch (err) {
      toast.error(err.response?.data?.error ?? 'Failed to submit review');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 bg-indigo-50 border border-indigo-100 rounded-xl p-5">
      <h4 className="font-semibold text-gray-900">{existing ? 'Edit your review' : 'Write a review'}</h4>
      <div>
        <p className="text-xs font-medium text-gray-600 mb-1.5">Your rating</p>
        <StarPicker value={rating} onChange={setRating} />
      </div>
      <input
        type="text"
        placeholder="Review title (optional)"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        maxLength={120}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
      />
      <textarea
        placeholder="Share your experience with this product..."
        value={body}
        onChange={(e) => setBody(e.target.value)}
        rows={4}
        maxLength={2000}
        required
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-300"
      />
      <div className="flex gap-3 justify-end">
        {onCancel && <Button type="button" variant="ghost" size="sm" onClick={onCancel}>Cancel</Button>}
        <Button type="submit" variant="primary" size="sm" loading={saving}>
          {existing ? 'Update' : 'Submit Review'}
        </Button>
      </div>
    </form>
  );
}

function ReviewCard({ review, currentUserId, onDeleted, onEdit }) {
  const [deleting, setDeleting] = useState(false);
  const isOwn = review.user?.id === currentUserId;
  const initials = (review.user?.name ?? 'U').split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await reviewsApi.delete(review.productId, review.id);
      onDeleted(review.id);
      toast.success('Review deleted');
    } catch {
      toast.error('Failed to delete review');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="flex flex-col gap-3 py-4 border-b border-gray-100 last:border-0">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-700 flex-shrink-0">
            {initials}
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">{review.user?.name ?? 'Anonymous'}</p>
            <p className="text-xs text-gray-400">{new Date(review.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <StarDisplay rating={review.rating} />
          {isOwn && (
            <>
              <button onClick={() => onEdit(review)} className="p-1 text-gray-400 hover:text-indigo-600 transition-colors">
                <Pencil className="w-3.5 h-3.5" />
              </button>
              <button onClick={handleDelete} disabled={deleting} className="p-1 text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </>
          )}
        </div>
      </div>
      {review.title && <p className="text-sm font-semibold text-gray-800">{review.title}</p>}
      <p className="text-sm text-gray-600 leading-relaxed">{review.body}</p>
    </div>
  );
}

export default function ReviewSection({ productId }) {
  const { user } = useContext(AuthContext);
  const [data, setData] = useState({ reviews: [], total: 0, totalPages: 0, averageRating: null, ratingCount: 0 });
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingReview, setEditingReview] = useState(null);

  const myReview = data.reviews.find((r) => r.user?.id === user?.id);

  const load = async (p = 0) => {
    setLoading(true);
    try {
      const res = await reviewsApi.getByProduct(productId, { page: p });
      setData(res);
      setPage(p);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(0); }, [productId]); // eslint-disable-line

  const handleSaved = (review) => {
    setData((prev) => {
      const exists = prev.reviews.find((r) => r.id === review.id);
      const reviews = exists
        ? prev.reviews.map((r) => r.id === review.id ? review : r)
        : [review, ...prev.reviews];
      return { ...prev, reviews, total: exists ? prev.total : prev.total + 1 };
    });
    setShowForm(false);
    setEditingReview(null);
    load(0);
  };

  const handleDeleted = (reviewId) => {
    setData((prev) => ({
      ...prev,
      reviews: prev.reviews.filter((r) => r.id !== reviewId),
      total: prev.total - 1,
    }));
    load(0);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Summary */}
      <div className="flex items-center gap-6">
        {data.averageRating ? (
          <>
            <div className="flex flex-col items-center gap-1">
              <span className="text-4xl font-bold text-gray-900">{data.averageRating}</span>
              <StarDisplay rating={data.averageRating} size="md" />
              <span className="text-xs text-gray-400">{data.ratingCount} review{data.ratingCount !== 1 ? 's' : ''}</span>
            </div>
          </>
        ) : (
          <p className="text-sm text-gray-400">No reviews yet. Be the first!</p>
        )}

        {user && !myReview && !showForm && (
          <Button variant="outline" size="sm" onClick={() => setShowForm(true)} className="ml-auto">
            Write a Review
          </Button>
        )}
      </div>

      {/* Form */}
      {(showForm && !editingReview) && (
        <ReviewForm
          productId={productId}
          onSaved={handleSaved}
          onCancel={() => setShowForm(false)}
        />
      )}
      {editingReview && (
        <ReviewForm
          productId={productId}
          existing={editingReview}
          onSaved={handleSaved}
          onCancel={() => setEditingReview(null)}
        />
      )}

      {/* List */}
      {loading ? (
        <p className="text-sm text-gray-400">Loading reviews...</p>
      ) : data.reviews.length === 0 ? (
        <p className="text-sm text-gray-400">No reviews yet.</p>
      ) : (
        <div>
          {data.reviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              currentUserId={user?.id}
              onDeleted={handleDeleted}
              onEdit={(r) => { setEditingReview(r); setShowForm(false); }}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {data.totalPages > 1 && (
        <div className="flex gap-2 justify-center">
          {Array.from({ length: data.totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => load(i)}
              className={`w-8 h-8 rounded-lg text-xs font-medium transition-colors ${i === page ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}

      {!user && (
        <p className="text-sm text-gray-400 text-center">
          <a href="/login" className="text-indigo-600 hover:underline">Sign in</a> to leave a review.
        </p>
      )}
    </div>
  );
}
