import DashboardPage from '@/components/dashboard/dashboard-page';
import {auth} from '@/lib/firebase';
import {redirect} from 'next/navigation';

export default function Home() {
  const user = auth.currentUser;

  if (!user) {
    redirect('/login');
  }

  return <DashboardPage />;
}
