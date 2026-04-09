import { useQuery } from '@tanstack/react-query';
import { CreditCard } from 'lucide-react';
import { memberService } from '../../services/index.js';
import { LoadingCenter, PageHeader, EmptyState, fmtDate } from '../../components/shared/index.jsx';

export default function MemberPayments() {
    const { data: payments, isLoading } = useQuery({
        queryKey: ['member', 'payments'],
        queryFn: () => memberService.getPayments().then(r => r.data.data)
    });

    const fmtCurrency = (val) => `₹${val.toLocaleString('en-IN')}`;

    if (isLoading) return <LoadingCenter />;

    return (
        <div>
            <PageHeader title="Payments & Billing" subtitle="View your transaction history." />

            <div className="card">
                <h3 className="text-lg font-bold mb-4">Payment History</h3>
                {payments?.length === 0 ? (
                    <EmptyState
                        icon={CreditCard}
                        title="No payments"
                        message="Your payment history will appear here."
                    />
                ) : (
                    <div className="table-wrap">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Amount</th>
                                    <th>Method</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {payments?.map((p, idx) => (
                                    <tr key={idx}>
                                        <td>{fmtDate(p.paidAt || p.createdAt)}</td>
                                        <td className="font-bold">{fmtCurrency(p.amount)}</td>
                                        <td className="text-sm text-capitalize">{p.method}</td>
                                        <td>
                                            <span className={`badge ${p.status === 'paid' ? 'badge-active' : 'badge-expired'}`}>
                                                {p.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
