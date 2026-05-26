import { SignOutButton } from "@clerk/nextjs";

export default function UnauthorizedPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="bg-white p-8 rounded-2xl shadow-md max-w-md w-full text-center">
                <h1 className="text-2xl font-bold text-red-500 mb-3">
                    Access Denied
                </h1>

                <p className="text-gray-600 mb-6">
                    Your account does not have administrator permission.
                </p>

                <SignOutButton redirectUrl="/sign-in">
                    <button className="px-5 py-3 rounded-xl bg-linear-to-t from-slate-900 via-slate-800 to-slate-700 text-white">
                        Sign in with another account
                    </button>
                </SignOutButton>

            </div>
        </div>
    );
}