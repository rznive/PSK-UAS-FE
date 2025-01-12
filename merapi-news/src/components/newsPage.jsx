import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const NewsPage = () => {
  const [reports, setReports] = useState([]);
  const [commentsCount, setCommentsCount] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(4);
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    axios
      .get("https://psk-uas.vercel.app/api/news", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (response.data.status) {
          const fetchedReports = response.data.data;
          setReports(fetchedReports);

          fetchedReports.forEach((report) => {
            axios
              .get(`https://psk-uas.vercel.app/api/news/comments/${report.id}`, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              })
              .then((commentResponse) => {
                if (commentResponse.data.status) {
                  setCommentsCount((prevCommentsCount) => ({
                    ...prevCommentsCount,
                    [report.id]: commentResponse.data.data.length,
                  }));
                }
              })
              .catch((error) => {
                console.error("Error fetching comments:", error);
              });
          });
        }
      })
      .catch((error) => {
        console.error("Error fetching reports:", error);
        alert('Failed to fetch news reports!');
      });
  }, [token]);

  const indexOfLastReport = currentPage * itemsPerPage;
  const indexOfFirstReport = indexOfLastReport - itemsPerPage;
  const currentReports = reports.slice(indexOfFirstReport, indexOfLastReport);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const totalPages = Math.ceil(reports.length / itemsPerPage);

  return (
    <div className="p-6 bg-gray-100 flex-1 w-full max-w-full pt-20">
      <div className="bg-white rounded-lg shadow-lg p-10">
        {currentReports.map((report) => (
          <div key={report.id} className="p-4 bg-gray-50 rounded shadow mb-4">
            <p className="text-gray-700">{report.desc_report}</p>
            <p className="text-sm text-gray-500 mt-2">Laporan dibuat {report.ttl_report} | Total Komentar {commentsCount[report.id] || 0}</p>
            <Link
              to={`/newsDetail_page/${report.id}`}
              className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Read More
            </Link>
          </div>
        ))}
        <div className="flex justify-center mt-6">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 mx-2 bg-blue-600 text-white rounded disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 mx-2 bg-blue-600 text-white rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
};

export default NewsPage;
