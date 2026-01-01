"use client";
import { useEffect, useState } from "react"
import axios from "axios"
import { useUser, SignedIn, SignedOut, SignInButton } from "@clerk/nextjs"

type ApplicationWithJob = {
  id: string;
  jobId: string;
  appliedAt: string;
  job: {
    id: string;
    title: string;
    company: string;
    location: string;
    type: string;
    salary: string | null;
    description: string;
  };
};

export default function DashboardPage() {
  const { isSignedIn } = useUser();
  const [applications, setApplications] = useState<ApplicationWithJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadApplications = async () => {
    try {
      setLoading(true);
      const res = await axios.get<ApplicationWithJob[]>("/api/applications");
      setApplications(res.data);
    } catch (e) {
      console.error("Failed to load applications", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isSignedIn) {
      loadApplications();
    }
  }, [isSignedIn]);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await axios.delete(`/api/applications/${id}`);
      setApplications((prev) => prev.filter((a) => a.id !== id));
    } catch (e) {
      console.error("Delete failed", e);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <SignedOut>
        <div className="text-center py-16">
          <p className="text-lg mb-4">
            Please sign in to see your applied jobs.
          </p>
          <SignInButton mode="modal">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md">
              Sign in with Clerk
            </button>
          </SignInButton>
        </div>
      </SignedOut>

      <SignedIn>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-700">Your Applied Jobs</h1>
          <button
            onClick={loadApplications}
            className="w-full md:w-32 hover:bg-gray-800 hover:cursor-pointer text-white rounded-md px-4 py-2 text-sm font-medium bg-gray-600 transition"
          >
            Refresh
          </button>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : applications.length === 0 ? (
          <p className="text-gray-600">You have not applied to any jobs yet.</p>
        ) : (
          <div className="space-y-4">
            {applications.map((app) => (
              <div
                key={app.id}
                className="border border-gray-300 rounded-lg p-4 shadow-sm bg-white hover:drop-shadow-md"
              >
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <h2 className="text-lg font-semibold">{app.job.title}</h2>
                    <p className="text-sm text-gray-700">
                      {app.job.company} • {app.job.location} • {app.job.type}
                    </p>
                  </div>
                  <span className="text-sm text-gray-500">
                    Applied on {new Date(app.appliedAt).toLocaleDateString()}
                  </span>
                </div>

                {app.job.salary && (
                  <p className="text-sm text-green-700 mb-1">
                    {app.job.salary}
                  </p>
                )}
                <p className="text-sm text-gray-600 mb-3">
                  {app.job.description}
                </p>

                <button
                  onClick={() => handleDelete(app.id)}
                  disabled={deletingId === app.id}
                  className="hover:cursor-pointer w-full py-2 px-4 rounded-md text-sm font-medium bg-red-700 text-white hover:bg-red-800 disabled:bg-gray-400"
                >
                  {deletingId === app.id ? "Deleting..." : "Delete"}
                </button>
              </div>
            ))}
          </div>
        )}
      </SignedIn>
    </div>
  );
}
