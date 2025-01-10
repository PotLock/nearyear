import Link from 'next/link';

export const NotFound = () => {
  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gray-100">
      <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
      <p className="text-xl text-gray-600 mb-8">The voting contract has not been deployed.</p>
      <Link href="/nomination" className="text-blue-500 underline text-lg">
        Go to Nomination Page
      </Link>
    </div>
  );
}; 