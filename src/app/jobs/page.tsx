"use client";
import axios from "axios";
import { useEffect, useState } from "react";

type Job = {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  description: string;
  salary: string;
  postedAt: string;
};

type Application = {
  id: string;
  jobId: string;
  userId: string;
  appliedAt: string;
};

function JobsPage() {
  const [allJobs, setAllJobs] = useState<Job[]>([]);
  const [visibleJobs, setVisibleJobs] = useState<Job[]>([]);
  const [searchTitle, setSearchTitle] = useState("");
  const [searchType, setSearchType] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [applications, setApplications] = useState<Application[]>([]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await axios.get("/api/upjobs");
        setVisibleJobs(res.data);
        setAllJobs(res.data);
      } catch (error) {
        console.error("Error fetching jobs", error);
      }
    };
    
    const fetchAll = async () => {
      await fetchJobs();
      try {
        const resApps = await axios.get("/api/applications");
        setApplications(resApps.data || []);
      } catch (err) {
        console.error("Error fetching applications", err);
      }
    };

    fetchAll();
  }, []);

  const handleClear = () => {
    setSearchTitle("");
    setSearchType("");
  };

  const handleApply = async (jobId: string) => {
    try {
      const res = await axios.post("/api/applications", { jobId });
      const newApp = res.data;
      setApplications((prev) =>
        prev.some((app) => app.jobId === jobId) ? prev : [...prev, newApp]
      );
    } catch (error) {
      console.error("Apply failed", error);
    }

  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    const filtered = allJobs.filter((job) => {
      const matchTitle =
        searchTitle.trim() === "" ||
        job.title.toLowerCase().includes(searchTitle.toLowerCase());
      const matchType =
        searchType === "" ||
        job.type.toLowerCase() === searchType.toLowerCase();

      return matchTitle && matchType;
    });
    setVisibleJobs(filtered);
    setHasSearched(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="p-2 flex justify-center flex-col items-center">
        <h1 className="text-5xl font-bold mb-6 text-gray-800">All Jobs</h1>
        {/* Search section */}
        <form
          onSubmit={handleSearch}
          className="flex flex-col md:flex-row gap-3 mb-8 items-stretch md:items-end"
        >
          <div className="">
            <label
              htmlFor="jobTitle"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Job Title
            </label>
            <input
              id="jobTitle"
              name="jobTitle"
              type="text"
              placeholder="Search by job title..."
              className="w-100 border border-gray-400 rounded-md px-3 py-2 text-sm"
              value={searchTitle}
              onChange={(e) => setSearchTitle(e.target.value)}
            />
          </div>

          <div className="w-full md:w-48">
            <label
              htmlFor="jobType"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Job Type
            </label>
            <select
              id="jobType"
              name="jobType"
              className="w-full border border-gray-400 rounded-md px-3 py-2 text-sm bg-white"
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
            >
              <option value="">All types</option>
              <option value="full-time">Full-time</option>
              <option value="part-time">Part-time</option>
              <option value="contract">Contract</option>
              <option value="internship">Internship</option>
              <option value="freelance">Freelance</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full md:w-32 hover:bg-gray-800 hover:cursor-pointer text-white rounded-md px-4 py-2 text-sm font-medium bg-gray-600 transition"
          >
            Search
          </button>

          <button
            type="button"
            onClick={handleClear}
            className="w-full md:w-24 border hover:cursor-pointer border-gray-400 text-gray-800 rounded-md px-4 py-2 text-sm font-medium bg-white hover:bg-gray-100 transition"
          >
            Clear
          </button>
        </form>
      </div>
      <div>
        {/* All jobs list */}
        {visibleJobs.length === 0 && hasSearched ? (
          <div className="text-center py-12">
            <p>Refresh the page to see all jobs!</p>
            <p className="text-gray-600 text-2xl mt-10 font-medium mb-2">
              Sorry this job is not available now!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {visibleJobs.map((job) => {
                const isApplied = applications.some((app) => app.jobId === job.id);
              return (
                <div
                  key={job.id}
                  className="border border-gray-300 rounded-lg p-4 shadow-sm bg-white hover:drop-shadow-md"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <h2 className="text-lg font-semibold">{job.title}</h2>
                    <span className="inline-flex items-center rounded-full bg-gray-900 text-white text-xs px-3 py-1">
                      {job.type}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mb-1">
                    <span className="font-medium">{job.company}</span> •{" "}
                    <span>{job.location}</span>
                  </p>
                  {job.salary && (
                    <p className="text-sm text-green-700 mb-1">{job.salary}</p>
                  )}
                  <div className="flex justify-between">
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {job.description}
                    </p>
                    <button onClick={() => handleApply(job.id)} disabled={isApplied} className="py-2 px-2 hover:bg-green-700 hover:text-white hover:cursor-pointer rounded-md text-sm font-medium border-green-700 border-2 text-gray-800">
                      {isApplied ? "Applied✓" : "Apply Now"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default JobsPage;
