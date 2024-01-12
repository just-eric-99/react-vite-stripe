export default function CheckoutButton() {
  return (
    <>
      <div className="flex justify-center items-center min-h-screen">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => {
            window.location.href = "/payment";
          }}
        >
          Checkout
        </button>
      </div>
    </>
  );
}
