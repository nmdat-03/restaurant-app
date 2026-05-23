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
        <div className="container py-3">
            <ProductsClient searchParams={searchParams} />
        </div>
    );
}