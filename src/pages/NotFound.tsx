import { Link } from "react-router-dom";

const NotFound = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
            <h1 className="text-8xl font-bold text-gray-900">404</h1>

            <h2 className="mt-4 text-2xl font-semibold text-gray-800">
                Page Not Found
            </h2>

            <p className="mt-2 text-gray-500 max-w-md">
                Sorry, the page you are looking for does not exist or has been moved.
            </p>

            <Link
                to="/"
                replace
                className="mt-6 rounded-lg bg-black px-6 py-3 text-white transition hover:opacity-90"
            >
                Go Home
            </Link>
        </div>
    );
};

export default NotFound;