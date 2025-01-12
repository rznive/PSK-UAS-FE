import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import axios from "axios";

const NewsDetailPage = () => {
  const { id } = useParams();
  const [report, setReport] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [editComment, setEditComment] = useState("");
  const [editCommentId, setEditCommentId] = useState(null);
  const token = useSelector((state) => state.auth.token);
  const loggedInUserName = token ? JSON.parse(atob(token.split('.')[1])).nama : null;

  useEffect(() => {
    axios
      .get(`https://psk-uas.vercel.app/api/news/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (response.data.status) {
          setReport(response.data.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching report details:", error);
      });

    axios
      .get(`https://psk-uas.vercel.app/api/news/comments/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (response.data.status) {
          setComments(response.data.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching comments:", error);
      });
  }, [id]);

  const addComment = () => {
    if (newComment.trim()) {
      const commentData = {
        activity_report_id: id,
        comment_text: newComment,
        nama: loggedInUserName,
      };

      axios
        .post("https://psk-uas.vercel.app/api/news/comments", commentData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          if (response.data.status) {
            setComments([
              ...comments,
              {
                comment_text: newComment,
                nama: loggedInUserName,
                created_at: new Date().toISOString(),
              },
            ]);
            setNewComment("");
          }
        })
        .catch((error) => {
          console.error("Error posting comment:", error);
        });
    }
  };

  const updateComment = (commentId) => {
    if (editComment.trim()) {
      const updatedData = { comment_text: editComment };

      axios
        .put(`https://psk-uas.vercel.app/api/news/comments/${commentId}`, updatedData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          if (response.data.status) {
            const updatedComments = comments.map((comment) =>
              comment.id === commentId ? { ...comment, comment_text: editComment } : comment
            );
            setComments(updatedComments);
            setEditComment("");
            setEditCommentId(null);
          }
        })
        .catch((error) => {
          console.error("Error updating comment:", error);
        });
    }
  };

  const deleteComment = (commentId) => {
    axios
      .delete(`https://psk-uas.vercel.app/api/news/comments/${commentId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (response.data.status) {
          setComments(comments.filter((comment) => comment.id !== commentId));
        }
      })
      .catch((error) => {
        console.error("Error deleting comment:", error);
      });
  };

  return (
    <div className="p-6 bg-gray-100 flex-1 w-full max-w-full pt-20">
      <div className="bg-white rounded-lg shadow-md p-8 space-y-8">
        {report ? (
          <div>
            <div className="bg-gray-100 rounded-lg p-6">
              <img
                src={report.image_url}
                alt={`Image of ${report.nama_gunung}`}
                className="w-full h-96 object-cover rounded-lg mb-6"
              />
              <p className="text-sm text-gray-600">{report.ttl_report} - {report.status_gunung}</p>
              <p className="mt-4 text-gray-700">{report.desc_report}</p>

              {/* Tabel untuk Pengamatan Visual, Gempa Visual, dan Klimatologi Visual */}
              <div className="mt-8">
                <table className="w-full table-auto">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="px-4 py-2 text-left">Kategori</th>
                      <th className="px-4 py-2 text-left">Deskripsi</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="px-4 py-2 font-semibold">Pengamatan</td>
                      <td className="px-4 py-2">{report.pengamatan_visual}</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 font-semibold">Klimatologi</td>
                      <td className="px-4 py-2">{report.klimatologi_visual}</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 font-semibold">Gempa</td>
                      <td className="px-4 py-2">{report.gempa_visual}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p className="mt-4 text-sm text-gray-500">
                Laporan oleh: <a href={report.detail_url} target="_blank">{report.report_by}</a>
              </p>
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-500">Loading report details...</p>
        )}

        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4">Komentar</h3>
          <div className="space-y-4">
            {comments.length > 0 ? (
              comments.map((comment, index) => (
                <div key={index} className="p-4 bg-gray-200 rounded-lg shadow-md">
                  <p className="text-xs text-gray-500">{comment.nama}</p>
                  {editCommentId === comment.id ? (
                    <div>
                      <input
                        type="text"
                        value={editComment}
                        onChange={(e) => setEditComment(e.target.value)}
                        className="w-full p-2 mt-2 border border-gray-300 rounded-lg"
                      />
                      <button
                        onClick={() => updateComment(comment.id)}
                        className="mt-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                      >
                        Update
                      </button>
                    </div>
                  ) : (
                    <div>
                      <p className="text-gray-700 mt-1">{comment.comment_text}</p>
                      <p className="text-xs text-gray-500 mt-2">
                        {new Date(comment.created_at).toLocaleString()}
                      </p>
                      {comment.nama === loggedInUserName && (
                        <div>
                          <button
                            onClick={() => { setEditComment(comment.comment_text); setEditCommentId(comment.id); }}
                            className="mt-2 text-blue-600 hover:underline"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deleteComment(comment.id)}
                            className="ml-4 text-red-600 hover:underline"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className="text-gray-500">Belum ada komentar. Jadilah yang pertama!</p>
            )}
          </div>

          <div className="mt-6 flex space-x-4">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="flex-1 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Tambahkan komentar..."
            />
            <button
              onClick={addComment}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Tambah
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsDetailPage;
