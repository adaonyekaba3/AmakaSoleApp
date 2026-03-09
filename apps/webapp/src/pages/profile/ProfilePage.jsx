import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useUser, useClerk } from '@clerk/clerk-react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { subscriptionsApi } from '../../api/subscriptions.queries';

const menuItems = [
  { label: 'Shoe Collection', to: '/profile/shoes' },
  { label: 'Subscription', to: '/profile/subscription' },
  { label: 'Settings', to: '/profile/settings' },
];

export default function ProfilePage() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    subscriptionsApi.getProfile().then((r) => setProfile(r.data)).catch(() => {});
  }, []);

  return (
    <div className="p-6">
      <Card className="text-center py-8">
        <div className="w-18 h-18 rounded-full bg-primary-600 flex items-center justify-center mx-auto text-2xl text-white font-bold" style={{ width: 72, height: 72 }}>
          {user?.firstName?.[0]}{user?.lastName?.[0]}
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mt-3">
          {user?.firstName} {user?.lastName}
        </h3>
        <p className="text-sm text-gray-500">{user?.primaryEmailAddress?.emailAddress}</p>
        {profile?.profile && (
          <p className="text-xs text-primary-600 mt-2">
            Health Score: {profile.profile.footHealthScore}
          </p>
        )}
      </Card>

      <div className="mt-6 space-y-2">
        {menuItems.map((item) => (
          <Link key={item.label} to={item.to}>
            <Card className="flex items-center justify-between hover:shadow-md transition-shadow mb-2">
              <span className="text-sm text-gray-800">{item.label}</span>
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Card>
          </Link>
        ))}
      </div>

      <Button variant="outline" onClick={() => signOut()} className="mt-8">
        Sign Out
      </Button>
    </div>
  );
}
