"use client";
import axios from "axios";

function JobPostPage() {

  const handleSubmit = async (e:React.FormEvent<HTMLFormElement>) => {
    const formData = new FormData(e.currentTarget);
    const jobData = Object.fromEntries(formData)

    const response = await axios.post('/api/upjobs', jobData,
      { headers: { 'Content-Type': 'application/json' } }
    );

    e.preventDefault();
    console.log("Form submitted", response.data);
  }
  return (
    <div className="flex flex-col items-center">
      <h1 className="text-center font-bold text-5xl text-gray-700 my-5">
        Post your Job
      </h1>
      <form className="w-100" onSubmit={handleSubmit}>
        <div className="my-3">
          <label className="text-gray-700" htmlFor="title">
            Job Title:
          </label>
          <input
            type="text"
            id="title"
            name="title"
            required
            className="w-95 border p-1 border-gray-500 rounded-md"
            autoComplete="title"
            defaultValue=""
          />
        </div>
        <div className="my-3">
          <label className="text-gray-700" htmlFor="company">
            Company Name:
          </label>
          <input
            type="text"
            id="company"
            name="company"
            required
            className="w-95 border p-1 border-gray-500 rounded-md"
            autoComplete="company"
            defaultValue=""
          />
        </div>
        <div className="my-3">
          <label className="text-gray-700" htmlFor="location">
            Location:
          </label>
          <input
            type="text"
            id="location"
            name="location"
            required
            className="w-95 border p-1 border-gray-500 rounded-md"
            autoComplete="location"
            defaultValue=""
          />
        </div>
        <div className="my-3">
          <label className="text-gray-700" htmlFor="type">
            Job Type:
          </label>
          <select
            id="type"
            name="type"
            required
            className="w-95 border p-1 border-gray-500 rounded-md"
            defaultValue=""
          >
            <option value="">Select Job Type</option>
            <option value="full-time">Full-time</option>
            <option value="part-time">Part-time</option>
            <option value="contract">Contract</option>
            <option value="internship">Internship</option>
            <option value="freelance">Freelance</option>
          </select>
        </div>
        <div className="my-3">
          <label className="text-gray-700" htmlFor="description">
            Description:
          </label>
          <textarea
            id="description"
            name="description"
            required
            className="w-95 border p-1 border-gray-500 rounded-md h-30"
            defaultValue=""
          />
        </div>
        <div className="my-3">
          <label className="text-gray-700" htmlFor="salary">
            Salary:
          </label>
          <input
            type="text"
            id="salary"
            name="salary"
            required
            className="w-95 border p-1 border-gray-500 rounded-md"
            autoComplete="salary"
            defaultValue=""
          />
        </div>
        <button className="hover:cursor-pointer hover:bg-gray-700 bg-gray-600 w-95 h-8 text-white rounded-sm">
          Post Job
        </button>
      </form>
    </div>
  );
}

export default JobPostPage;
