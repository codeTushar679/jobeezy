import Image from "next/image";
import Link from "next/link";

function Homepage() {
  return (
    <div className="flex justify-center flex-col mt-10">
      <div className="text-center">
        <h1 className="text-5xl text-gray-500">Welcome to</h1>
        <h1 className="text-8xl font-extrabold font-serif text-gray-600">
          JOBEEZY
        </h1>
      </div>
      <div className="flex justify-center mt-5">
        <Image src="/jobseek.gif" alt="Jobeezy Gif" width={400} height={400} className="rounded-xl"/>
      </div>
      <div className="flex justify-center gap-20 mt-8">
        <Link href="/jobs">
          <button className="bg-gray-600 hover:cursor-pointer hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-md">
            See Jobs
          </button>
        </Link>
        <Link href="/jobs/post">
          <button className="bg-gray-600 hover:cursor-pointer hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-md">
            Post Job
          </button>
        </Link>
      </div>
    </div>
  );
}

export default Homepage;
