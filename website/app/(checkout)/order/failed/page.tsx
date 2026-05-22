import { Suspense } from "react";
import FailedContent from "./FailedContent";

export default function FailedPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <FailedContent />
        </Suspense>
    );
}