import { Suspense } from "react";
import ProductsClient from "./ProductsClient";

export default function ProductsPage({
    searchParams,
}: {
    searchParams: Promise<{
        q?: string;
        sort?: string;
        category?: string;
        page?: string;
    }>;
}) {
    return (
        <div className="container py-6">
            <Suspense fallback={null}>
                <ProductsClient searchParams={searchParams} />
            </Suspense>
        </div>
    );
}