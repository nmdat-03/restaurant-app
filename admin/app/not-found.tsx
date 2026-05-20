import Link from "next/link";
import { AlertTriangle } from "lucide-react";

export default function AdminNotFound() {
    return (
        <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
            <div className="rounded-2xl border border-slate-200 bg-white p-10 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-500/10">
                    <AlertTriangle size={32} className="text-red-500" />
                </div>

                <h1 className="mt-6 text-3xl font-bold">
                    404 - Page Not Found
                </h1>

                <p className="mt-3 text-slate-500 dark:text-slate-400">
                    The admin page you are looking for does not exist.
                </p>

                <Link
                    href="/dashboard"
                    className="mt-6 inline-flex rounded-xl bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:opacity-90 dark:bg-white dark:text-slate-900"
                >
                    Back to Dashboard
                </Link>
            </div>
        </div>
    );
}