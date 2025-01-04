import OrderTable from './components/OrderTable';

export default function OrdersPage() {
  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Open Orders</h1>
      <OrderTable />
    </div>
  );
}
