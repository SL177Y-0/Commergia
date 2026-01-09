const reviews = [
  { id: 1, name: "Alex N.", rating: 5, comment: "Excellent quality and fast delivery." },
  { id: 2, name: "Maria T.", rating: 4, comment: "Fit and material are great. Will buy again." },
  { id: 3, name: "Ibrahim S.", rating: 5, comment: "One of the best purchases this season." },
];

export default function ProductReviews() {
  return (
    <section className="mt-10 rounded-xl border border-gray-200 p-5">
      <h2 className="text-lg font-semibold">Customer Reviews</h2>
      <div className="mt-4 space-y-4">
        {reviews.map((review) => (
          <article key={review.id} className="border-b border-gray-100 pb-4 last:border-b-0 last:pb-0">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">{review.name}</h3>
              <p className="text-xs text-amber-500">{"?".repeat(review.rating)}</p>
            </div>
            <p className="mt-1 text-sm text-gray-600">{review.comment}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
