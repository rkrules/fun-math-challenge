import { Link } from 'react-router-dom';
import { LogOut, User as UserIcon } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const AuthButton = () => {
  const { user, signOut, loading } = useAuth();
  if (loading) return null;

  if (!user) {
    return (
      <Link
        to="/auth"
        className="text-sm px-3 py-1.5 rounded-lg border hover:bg-muted transition"
      >
        Sign in
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-2 text-sm">
      <UserIcon size={14} className="text-muted-foreground" />
      <span className="text-muted-foreground hidden sm:inline truncate max-w-[160px]">
        {user.email}
      </span>
      <button
        onClick={signOut}
        className="p-1.5 rounded-lg hover:bg-muted transition"
        aria-label="Sign out"
      >
        <LogOut size={14} />
      </button>
    </div>
  );
};

export default AuthButton;
