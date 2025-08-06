import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const AccountSettings = () => {
  const [profileData, setProfileData] = useState({
    fullName: 'John Anderson',
    email: 'john.anderson@email.com',
    phone: '+1 (555) 123-4567',
    timezone: 'America/New_York',
    language: 'English'
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const handleProfileChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePasswordChange = (field, value) => {
    setPasswordData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveProfile = () => {
    // Simulate saving profile
    console.log('Saving profile:', profileData);
    setIsEditingProfile(false);
  };

  const handleChangePassword = () => {
    if (passwordData?.newPassword !== passwordData?.confirmPassword) {
      alert('New passwords do not match!');
      return;
    }
    if (passwordData?.newPassword?.length < 8) {
      alert('Password must be at least 8 characters long!');
      return;
    }
    // Simulate password change
    console.log('Changing password...');
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setIsChangingPassword(false);
    alert('Password changed successfully!');
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev?.[field]
    }));
  };

  const handleDeleteAccount = () => {
    const confirmation = window.prompt(
      'This action cannot be undone. All your data will be permanently deleted.\n\nType "DELETE" to confirm:'
    );
    
    if (confirmation === 'DELETE') {
      alert('Account deletion initiated. You will be logged out shortly.');
      // Simulate account deletion
      console.log('Deleting account...');
    }
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
          <Icon name="User" size={20} className="text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">Account Settings</h3>
          <p className="text-sm text-muted-foreground">Manage your profile and security settings</p>
        </div>
      </div>
      <div className="space-y-8">
        {/* Profile Information */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium text-foreground">Profile Information</h4>
            <Button
              variant={isEditingProfile ? "outline" : "default"}
              size="sm"
              onClick={() => setIsEditingProfile(!isEditingProfile)}
              iconName={isEditingProfile ? "X" : "Edit2"}
              iconPosition="left"
            >
              {isEditingProfile ? 'Cancel' : 'Edit Profile'}
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              type="text"
              value={profileData?.fullName}
              onChange={(e) => handleProfileChange('fullName', e?.target?.value)}
              disabled={!isEditingProfile}
            />
            <Input
              label="Email Address"
              type="email"
              value={profileData?.email}
              onChange={(e) => handleProfileChange('email', e?.target?.value)}
              disabled={!isEditingProfile}
            />
            <Input
              label="Phone Number"
              type="tel"
              value={profileData?.phone}
              onChange={(e) => handleProfileChange('phone', e?.target?.value)}
              disabled={!isEditingProfile}
            />
            <Input
              label="Timezone"
              type="text"
              value={profileData?.timezone}
              onChange={(e) => handleProfileChange('timezone', e?.target?.value)}
              disabled={!isEditingProfile}
            />
          </div>

          {isEditingProfile && (
            <div className="flex items-center space-x-2 mt-4">
              <Button
                onClick={handleSaveProfile}
                iconName="Save"
                iconPosition="left"
              >
                Save Changes
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsEditingProfile(false)}
              >
                Cancel
              </Button>
            </div>
          )}
        </div>

        {/* Security Settings */}
        <div className="pt-6 border-t border-border">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium text-foreground">Security</h4>
            <Button
              variant={isChangingPassword ? "outline" : "default"}
              size="sm"
              onClick={() => setIsChangingPassword(!isChangingPassword)}
              iconName={isChangingPassword ? "X" : "Lock"}
              iconPosition="left"
            >
              {isChangingPassword ? 'Cancel' : 'Change Password'}
            </Button>
          </div>

          {!isChangingPassword ? (
            <div className="bg-muted rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <Icon name="Shield" size={20} className="text-success" />
                <div>
                  <p className="font-medium text-foreground">Password Protected</p>
                  <p className="text-sm text-muted-foreground">
                    Your account is secured with a strong password. Last changed on December 15, 2023.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative">
                <Input
                  label="Current Password"
                  type={showPasswords?.current ? "text" : "password"}
                  value={passwordData?.currentPassword}
                  onChange={(e) => handlePasswordChange('currentPassword', e?.target?.value)}
                  placeholder="Enter your current password"
                  required
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('current')}
                  className="absolute right-3 top-9 text-muted-foreground hover:text-foreground"
                >
                  <Icon name={showPasswords?.current ? "EyeOff" : "Eye"} size={16} />
                </button>
              </div>

              <div className="relative">
                <Input
                  label="New Password"
                  type={showPasswords?.new ? "text" : "password"}
                  value={passwordData?.newPassword}
                  onChange={(e) => handlePasswordChange('newPassword', e?.target?.value)}
                  placeholder="Enter your new password"
                  description="Password must be at least 8 characters long"
                  required
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('new')}
                  className="absolute right-3 top-9 text-muted-foreground hover:text-foreground"
                >
                  <Icon name={showPasswords?.new ? "EyeOff" : "Eye"} size={16} />
                </button>
              </div>

              <div className="relative">
                <Input
                  label="Confirm New Password"
                  type={showPasswords?.confirm ? "text" : "password"}
                  value={passwordData?.confirmPassword}
                  onChange={(e) => handlePasswordChange('confirmPassword', e?.target?.value)}
                  placeholder="Confirm your new password"
                  required
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('confirm')}
                  className="absolute right-3 top-9 text-muted-foreground hover:text-foreground"
                >
                  <Icon name={showPasswords?.confirm ? "EyeOff" : "Eye"} size={16} />
                </button>
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  onClick={handleChangePassword}
                  disabled={!passwordData?.currentPassword || !passwordData?.newPassword || !passwordData?.confirmPassword}
                  iconName="Save"
                  iconPosition="left"
                >
                  Update Password
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsChangingPassword(false);
                    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Two-Factor Authentication */}
        <div className="pt-6 border-t border-border">
          <h4 className="font-medium text-foreground mb-4">Two-Factor Authentication</h4>
          <div className="bg-muted rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Icon name="Smartphone" size={20} className="text-muted-foreground" />
                <div>
                  <p className="font-medium text-foreground">2FA Status</p>
                  <p className="text-sm text-muted-foreground">
                    Two-factor authentication is currently disabled
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                iconName="Shield"
                iconPosition="left"
              >
                Enable 2FA
              </Button>
            </div>
          </div>
        </div>

        {/* Account Actions */}
        <div className="pt-6 border-t border-border">
          <h4 className="font-medium text-foreground mb-4">Account Actions</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div>
                <p className="font-medium text-foreground">Export Account Data</p>
                <p className="text-sm text-muted-foreground">
                  Download a copy of all your account data and transactions
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                iconName="Download"
                iconPosition="left"
              >
                Export Data
              </Button>
            </div>

            <div className="bg-error/5 border border-error/20 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-start space-x-3">
                  <Icon name="AlertTriangle" size={20} className="text-error mt-0.5" />
                  <div>
                    <p className="font-medium text-error">Delete Account</p>
                    <p className="text-sm text-muted-foreground">
                      Permanently delete your account and all associated data. This action cannot be undone.
                    </p>
                  </div>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleDeleteAccount}
                  iconName="Trash2"
                  iconPosition="left"
                >
                  Delete Account
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;