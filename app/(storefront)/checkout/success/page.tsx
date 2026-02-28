import Link from "next/link";

interface SuccessPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function CheckoutSuccessPage({ searchParams }: SuccessPageProps) {
  const params = await searchParams;
  const orderNumber = typeof params["order"] === "string" ? params["order"] : null;

  return (
    <div className="mx-auto max-w-xl px-4 py-16 text-center sm:px-6 lg:px-8">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
        <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <h1 className="mt-6 text-3xl font-bold text-gray-900">Grazie per il tuo ordine!</h1>

      {orderNumber && (
        <p className="mt-3 text-lg text-gray-600">
          Numero ordine: <span className="font-semibold text-gray-900">{orderNumber}</span>
        </p>
      )}

      <p className="mt-4 text-gray-500">
        Il pagamento verrà gestito separatamente. Riceverai una conferma via email con i dettagli dell&apos;ordine.
      </p>

      <div className="mt-8 flex justify-center gap-4">
        <Link
          href="/products"
          className="rounded-lg border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
        >
          Continua lo shopping
        </Link>
        <Link
          href="/account"
          className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700"
        >
          I miei ordini
        </Link>
      </div>
    </div>
  );
}
