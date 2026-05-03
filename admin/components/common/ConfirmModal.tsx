"use client";

type ConfirmModalProps = {
    open: boolean;
    title: string;
    description: string;
    confirmText?: string;
    cancelText?: string;
    loading?: boolean;
    danger?: boolean;
    onClose: () => void;
    onConfirm: () => void;
};

export default function ConfirmModal({
    open,
    title,
    description,
    confirmText = "Yes",
    cancelText = "No",
    loading = false,
    danger = false,
    onClose,
    onConfirm,
}: ConfirmModalProps) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
            <div className="w-full max-w-md rounded-md bg-white p-6 space-y-4">
                <h2 className="text-lg font-semibold">
                    {title}
                </h2>

                <p className="text-sm text-gray-500">
                    {description}
                </p>

                <div className="flex justify-end gap-2">
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="rounded-md border px-4 py-2 text-sm"
                    >
                        {cancelText}
                    </button>

                    <button
                        onClick={onConfirm}
                        disabled={loading}
                        className={`rounded-md px-4 py-2 text-sm text-white ${danger
                                ? "bg-red-500 hover:bg-red-600"
                                : "bg-green-500 hover:bg-green-600"
                            }`}
                    >
                        {loading ? "Processing..." : confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}