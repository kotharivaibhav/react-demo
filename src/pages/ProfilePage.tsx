import { ProfileUpdateForm } from '@/components/forms/ProfileUpdateForm';
import { ROLE_LABELS } from '@/constants';
import { useToast } from '@/context';
import { selectAuthUser, updateProfileThunk } from '@/features/auth';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import type { ProfileUpdateFormValues } from '@/validations/schemas';

export const ProfilePage = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectAuthUser);
  const { showToast } = useToast();

  if (!user) return null;

  const handleUpdate = async (values: ProfileUpdateFormValues) => {
    try {
      await dispatch(updateProfileThunk(values)).unwrap();
      showToast('Profile updated', 'success');
    } catch {
      showToast('Update failed', 'error');
    }
  };

  return (
    <div>
      <h2 style={{ marginBottom: '0.25rem', fontSize: '1.125rem' }}>Profile</h2>
      <p className="page-subtitle" style={{ marginBottom: '1rem' }}>
        Role: {ROLE_LABELS[user.role]}
      </p>
      <div className="profile-card">
        <ProfileUpdateForm user={user} onSubmit={handleUpdate} />
      </div>
    </div>
  );
};
