
'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
  Calendar,
  ArrowLeft,
  MessageCircle,
  Send,
  User,
} from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

const normalizeSourceUrl = (value) => {
  const input = String(value || '').trim();
  if (!input) return '';

  const candidate = input.startsWith('http://') || input.startsWith('https://')
    ? input
    : `https://${input}`;

  try {
    const url = new URL(candidate);
    return ['https:', 'http:'].includes(url.protocol) ? url.href : '';
  } catch {
    return '';
  }
};

const BlogDetail = () => {
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Comments
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [submittingComment, setSubmittingComment] = useState(false);
  const [commentError, setCommentError] = useState('');

  // Authentication
  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  const params = useParams();
  const blogId = params.id;

  // Extract footnotes and citations from the saved blog HTML.
  const { footnotes, citations } = useMemo(() => {
    if (!blog?.content || typeof window === 'undefined') {
      return { footnotes: [], citations: [] };
    }

    const parsed = new DOMParser().parseFromString(blog.content, 'text/html');

    const extract = (selector, prefix, attributes) => {
      const seen = new Set();

      return Array.from(parsed.querySelectorAll(selector))
        .map((marker, index) => ({
          id: marker.getAttribute(attributes.id) || `${prefix}-${index + 1}`,
          number: marker.getAttribute(attributes.number) || String(index + 1),
          text: marker.getAttribute(attributes.text) || '',
          url: marker.getAttribute(attributes.url) || '',
        }))
        .filter((item) => {
          if (seen.has(item.id) || !item.text.trim()) return false;
          seen.add(item.id);
          return true;
        });
    };

    return {
      footnotes: extract('sup[data-footnote-id]', 'footnote', {
        id: 'data-footnote-id',
        number: 'data-footnote-number',
        text: 'data-footnote-text',
        url: 'data-footnote-url',
      }),
      citations: extract('sup[data-citation-id]', 'citation', {
        id: 'data-citation-id',
        number: 'data-citation-number',
        text: 'data-citation-text',
        url: 'data-citation-url',
      }),
    };
  }, [blog?.content]);

  // Handle in-page navigation without allowing the browser to reload the blog route.
  const handleReferenceNavigation = (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;

    const link = target.closest(
      'a[data-footnote-link="true"], a[id^="footnote-ref-"], a[data-citation-link="true"], a[id^="citation-ref-"]'
    );

    if (!link) return;

    const href = link.getAttribute('href');
    if (!href || !href.startsWith('#')) return;

    const destination = document.getElementById(href.slice(1));
    if (!destination) return;

    event.preventDefault();
    event.stopPropagation();

    destination.scrollIntoView({ behavior: 'smooth', block: 'center' });
    window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}${href}`);
  };

  const handleReturnToMarker = (event, markerId) => {
    event.preventDefault();
    const marker = document.getElementById(markerId);
    if (!marker) return;

    marker.scrollIntoView({ behavior: 'smooth', block: 'center' });
    window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}#${markerId}`);
  };

  // Fetch blog.
  useEffect(() => {
    if (!blogId) return;

    const fetchBlog = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `/api/blog/by-id/${encodeURIComponent(blogId)}`
        );

        if (!response.ok) {
          throw new Error(`Unable to load blog: ${response.status}`);
        }

        const data = await response.json();

        if (data.success && data.blog) {
          setBlog(data.blog);
        } else {
          setError(data.message || 'Failed to load blog.');
        }
      } catch (err) {
        console.error('Error fetching blog:', err);
        setError(err.message || 'Failed to load blog.');
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [blogId]);

  // Check logged-in user.
  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const response = await fetch('/api/auth/validate-token', {
          method: 'GET',
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          setCurrentUser(data);
        } else {
          setCurrentUser(null);
        }
      } catch (err) {
        console.error('Authentication check failed:', err);
        setCurrentUser(null);
      } finally {
        setAuthLoading(false);
      }
    };

    checkAuthentication();
  }, []);

  // Fetch comments.
  const fetchComments = async () => {
    if (!blogId) return;

    try {
      setCommentsLoading(true);
      setCommentError('');

      const response = await fetch(
        `/api/blog/by-id/${encodeURIComponent(blogId)}/comments`
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Unable to load comments.');
      }

      setComments(data.comments || []);
    } catch (err) {
      console.error('Fetch comments error:', err);
      setCommentError(err.message || 'Unable to load comments.');
    } finally {
      setCommentsLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [blogId]);

  // Submit comment.
  const handleCommentSubmit = async (event) => {
    event.preventDefault();

    const text = commentText.trim();

    if (!text) {
      setCommentError('Please enter a comment.');
      return;
    }

    if (text.length > 2000) {
      setCommentError('Comment cannot exceed 2000 characters.');
      return;
    }

    try {
      setSubmittingComment(true);
      setCommentError('');

      const response = await fetch(
        `/api/blog/by-id/${encodeURIComponent(blogId)}/comments`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ text }),
        }
      );

      const data = await response.json();

      if (response.status === 401) {
        setCurrentUser(null);
        throw new Error('Please log in to submit a comment.');
      }

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Unable to submit comment.');
      }

      setCommentText('');
      await fetchComments();
    } catch (err) {
      console.error('Comment submission error:', err);
      setCommentError(err.message || 'Unable to submit comment.');
    } finally {
      setSubmittingComment(false);
    }
  };


  if (loading) {
    return (
      <div className="grow flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#005F63] mx-auto mb-4" />
          <p className="text-gray-600">Loading blog...</p>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="grow flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <p className="text-red-600 mb-4">
            {error || 'Blog not found.'}
          </p>

          <Link
            href="/blogs"
            className="inline-flex items-center text-[#005F63] hover:underline"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Blogs
          </Link>
        </div>
      </div>
    );
  }

  const authorName = blog.author || 'JuriLingo';

  const date = blog.publishDate
    ? new Date(blog.publishDate)
    : null;

  const formattedDate =
    date && !Number.isNaN(date.getTime())
      ? date.toLocaleDateString('en-IN', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      : '';

  return (
    <div className="grow w-full py-12 px-4 md:px-8 bg-white">
      <div className="max-w-3xl mx-auto">

        {/* Back navigation */}

        <Link
          href="/blogs"
          className="flex items-center text-gray-500 hover:text-[#005F63] mb-8 transition-colors"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Blogs
        </Link>

        {/* Blog title */}

        <h1 className="text-3xl md:text-5xl font-bold font-serif text-[#002B36] mb-6 leading-tight">
          {blog.title}
        </h1>

        {/* Author and publication date */}

        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 pb-8 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#E3B65B]/20 flex items-center justify-center text-[#005F63] font-bold">
              {authorName.charAt(0).toUpperCase()}
            </div>

            <p className="font-bold text-gray-900 text-sm">
              {authorName}
            </p>
          </div>

          {formattedDate && (
            <div className="text-gray-500 text-sm flex items-center">
              <Calendar size={16} className="mr-2 text-[#E3B65B]" />
              {formattedDate}
            </div>
          )}
        </div>

        {/* Published blog content */}

        <article
          id="published-blog-content"
          onClick={handleReferenceNavigation}
          className="
            prose prose-lg
            prose-headings:text-[#005F63]
            prose-a:text-[#005F63]
            prose-a:underline
            prose-img:rounded-lg
            prose-img:mx-auto
            text-gray-700
            leading-relaxed
            max-w-none
            [&_.blog-content-image]:max-w-full
            [&_.blog-content-image]:h-auto
            [&_.blog-content-image]:mx-auto
            [&_.blog-content-image]:my-6
            [&_.jl-footnote-marker]:text-[#005F63]
            [&_.jl-footnote-marker]:font-semibold
          "
          dangerouslySetInnerHTML={{
            __html: blog.content || '',
          }}
        />

        {/* Citations */}
        {citations.length > 0 && (
          <section
            aria-labelledby="blog-citations-heading"
            className="mt-12 border-t border-gray-200 pt-8"
          >
            <h2
              id="blog-citations-heading"
              className="text-xl font-bold font-serif text-[#005F63] mb-5"
            >
              Citations
            </h2>

            <ol className="list-decimal pl-6 space-y-4 text-sm text-gray-700">
              {citations.map((citation) => {
                const sourceUrl = normalizeSourceUrl(citation.url);
                const markerId = `citation-ref-${citation.id}`;

                return (
                  <li
                    key={citation.id}
                    id={`citation-${citation.id}`}
                    className="pl-1 scroll-mt-24"
                  >
                    <span>{citation.text}</span>

                    {sourceUrl && (
                      <>
                        {' '}
                        <a
                          href={sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#005F63] underline break-all"
                        >
                          View source
                        </a>
                      </>
                    )}

                    {' '}
                    <a
                      href={`#${markerId}`}
                      onClick={(event) => handleReturnToMarker(event, markerId)}
                      aria-label={`Return to citation marker ${citation.number}`}
                      title="Return to article"
                      className="text-[#005F63] hover:text-[#E3B65B] font-bold ml-1"
                    >
                      ↩
                    </a>
                  </li>
                );
              })}
            </ol>
          </section>
        )}

        {/* Footnotes */}
        {footnotes.length > 0 && (
          <section
            aria-labelledby="blog-footnotes-heading"
            className="mt-12 border-t border-gray-200 pt-8"
          >
            <h2
              id="blog-footnotes-heading"
              className="text-xl font-bold font-serif text-[#005F63] mb-5"
            >
              References &amp; Footnotes
            </h2>

            <ol className="list-decimal pl-6 space-y-4 text-sm text-gray-700">
              {footnotes.map((note) => {
                const sourceUrl = normalizeSourceUrl(note.url);
                const markerId = `footnote-ref-${note.id}`;

                return (
                  <li
                    key={note.id}
                    id={`footnote-${note.id}`}
                    className="pl-1 scroll-mt-24"
                  >
                    <span>{note.text}</span>

                    {sourceUrl && (
                      <>
                        {' '}
                        <a
                          href={sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#005F63] underline break-all"
                        >
                          View source
                        </a>
                      </>
                    )}

                    {' '}
                    <a
                      href={`#${markerId}`}
                      onClick={(event) => handleReturnToMarker(event, markerId)}
                      aria-label={`Return to footnote marker ${note.number}`}
                      title="Return to article"
                      className="text-[#005F63] hover:text-[#E3B65B] font-bold ml-1"
                    >
                      ↩
                    </a>
                  </li>
                );
              })}
            </ol>
          </section>
        )}

        {/* Comments section */}

        <section className="mt-16 border-t border-gray-200 pt-10">
          <div className="flex items-center gap-3 mb-8">
            <MessageCircle size={24} className="text-[#005F63]" />

            <h2 className="text-2xl font-bold font-serif text-[#002B36]">
              Comments ({comments.length})
            </h2>
          </div>

          {/* Comment form */}

          {!authLoading && currentUser ? (
            <form onSubmit={handleCommentSubmit} className="mb-10">
              <label
                htmlFor="blog-comment"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Share your thoughts
              </label>

              <textarea
                id="blog-comment"
                value={commentText}
                onChange={(event) => setCommentText(event.target.value)}
                placeholder="Write a comment..."
                maxLength={2000}
                rows={4}
                className="w-full border border-gray-300 rounded-lg p-4 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#005F63]/30 focus:border-[#005F63] resize-y"
              />

              <div className="flex justify-between items-center mt-2 gap-3">
                <span className="text-xs text-gray-400">
                  {commentText.length}/2000 characters
                </span>

                <button
                  type="submit"
                  disabled={submittingComment || !commentText.trim()}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#005F63] text-white font-semibold hover:bg-[#00494c] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send size={16} />
                  {submittingComment ? 'Posting...' : 'Post Comment'}
                </button>
              </div>
            </form>
          ) : !authLoading ? (
            <div className="mb-10 p-5 rounded-lg bg-gray-50 border border-gray-200">
              <p className="text-gray-700 mb-3">
                Please log in to join the discussion.
              </p>

              <Link
                href="/auth/login"
                className="inline-flex items-center text-[#005F63] font-semibold hover:underline"
              >
                Log in to comment
                <ArrowLeft size={15} className="ml-2 rotate-180" />
              </Link>
            </div>
          ) : (
            <p className="text-sm text-gray-500 mb-8">
              Checking login status...
            </p>
          )}

          {commentError && (
            <p className="text-sm text-red-600 mb-5">
              {commentError}
            </p>
          )}

          {/* Existing comments */}

          {commentsLoading ? (
            <p className="text-gray-500 text-sm">
              Loading comments...
            </p>
          ) : comments.length === 0 ? (
            <div className="text-center py-10 bg-gray-50 rounded-lg">
              <MessageCircle
                size={30}
                className="mx-auto mb-3 text-gray-300"
              />

              <p className="text-gray-500">
                No comments yet. Be the first to share your thoughts.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {comments.map((comment) => {
                const commenterName =
                  comment.user?.name || 'Registered User';

                const commentDate = comment.createdAt
                  ? new Date(comment.createdAt)
                  : null;

                return (
                  <article
                    key={comment._id}
                    className="flex gap-4 border-b border-gray-100 pb-6"
                  >
                    <div className="w-10 h-10 shrink-0 rounded-full bg-[#E3B65B]/20 flex items-center justify-center text-[#005F63]">
                      {commenterName.charAt(0).toUpperCase() || (
                        <User size={18} />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-3 mb-2">
                        <p className="font-semibold text-gray-900 text-sm">
                          {commenterName}
                        </p>

                        {commentDate &&
                          !Number.isNaN(commentDate.getTime()) && (
                            <time className="text-xs text-gray-400">
                              {commentDate.toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                              })}
                            </time>
                          )}
                      </div>

                      <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap break-words">
                        {comment.text}
                      </p>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        {/* Footer */}

        <div className="mt-16 pt-8 border-t border-gray-100">
          <p className="text-gray-400 italic text-center text-sm">
            Thanks for reading on JuriLingo
          </p>
        </div>

      </div>
    </div>
  );
};

export default BlogDetail;
