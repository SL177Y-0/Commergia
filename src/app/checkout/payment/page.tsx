import CheckoutForm from "@/components/commerce/CheckoutForm";

export default function CheckoutPaymentPage() {
  return (
    <div className="mx-auto my-8 max-w-3xl">
      <CheckoutForm step="payment" />
    </div>
  );
}
