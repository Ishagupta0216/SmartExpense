import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { ChevronDown, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import styles from './Navbar.module.css';

function getGreeting() {
  const hour = new Date().getHours();

  if (hour < 12) {
    return 'Good morning';
  }

  if (hour < 17) {
    return 'Good afternoon';
  }

  return 'Good evening';
}

function getDisplayName(user) {
  const metadataName = user?.user_metadata?.full_name || user?.user_metadata?.name;

  if (metadataName) {
    return metadataName.trim().split(/\s+/)[0];
  }

  return user?.email?.split('@')[0] || 'there';
}

function Navbar() {
  const { signOut, user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const userName = getDisplayName(user);
  const initials = userName.slice(0, 2).toUpperCase();

  async function handleLogout() {
    try {
      await signOut();
      setMenuOpen(false);
      navigate('/login', { replace: true });
    } catch (error) {
      toast.error(error.message);
    }
  }

  return (
    <header className={styles.navbar}>
      <div>
        <p className={styles.eyebrow}>
          {getGreeting()}, {userName}
        </p>
        <h1>
          Smart<span>Expense</span>
        </h1>
      </div>
      <div className={styles.actions}>
        <div className={styles.profileWrap}>
          <button className={styles.profile} onClick={() => setMenuOpen((value) => !value)} aria-label="Open profile menu" aria-expanded={menuOpen}>
            <span>{initials}</span>
            <ChevronDown size={17} />
          </button>
          {menuOpen ? (
            <div className={styles.profileMenu}>
              <strong>{userName}</strong>
              <p>{user?.email}</p>
              <button onClick={handleLogout}>
                <LogOut size={16} />
                Logout
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
