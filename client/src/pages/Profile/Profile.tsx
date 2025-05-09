import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import Input from '../../components/UI/Input';
import { User, Moon, Sun, LogOut, Save, Camera, Bell, Globe, Lock, HelpCircle } from 'lucide-react';

const Profile: React.FC = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [isEditing, setIsEditing] = useState(false);
  
  const handleSave = () => {
    // Simulate updating profile
    setTimeout(() => {
      setIsEditing(false);
      // In a real app, this would update the user profile
      alert('Profile updated successfully!');
    }, 1000);
  };
  
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold mb-6">Profile</h1>
      
      <Card className="relative">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
              <img 
                src={user?.avatar || 'https://i.pravatar.cc/150?img=68'} 
                alt="Profile"
                className="w-full h-full object-cover" 
              />
            </div>
            <button className={`
              absolute bottom-0 right-0 rounded-full p-1
              ${theme === 'dark' ? 'bg-gray-700' : 'bg-white'}
              border border-gray-300 dark:border-gray-600
            `}>
              <Camera size={14} />
            </button>
          </div>
          
          <div className="flex-1">
            <h2 className="text-xl font-semibold">{user?.name}</h2>
            <p className="text-gray-500 dark:text-gray-400">{user?.email}</p>
          </div>
        </div>
        
        {!isEditing ? (
          <Button
            variant="outline"
            size="sm"
            className="mt-4"
            onClick={() => setIsEditing(true)}
          >
            Edit Profile
          </Button>
        ) : (
          <div className="mt-4 space-y-4">
            <Input
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
            />
            
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
            />
            
            <div className="flex gap-2">
              <Button
                variant="primary"
                onClick={handleSave}
                className="flex items-center gap-2"
              >
                <Save size={16} />
                <span>Save Changes</span>
              </Button>
              
              <Button
                variant="outline"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </Card>
      
      <Card>
        <h2 className="text-lg font-semibold mb-4">Settings</h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-3">
              <Bell size={20} className="text-gray-500" />
              <span>Notifications</span>
            </div>
            <div className="relative">
              <input 
                type="checkbox" 
                id="notifications" 
                className="sr-only"
                defaultChecked 
              />
              <label
                htmlFor="notifications"
                className={`
                  block w-12 h-6 rounded-full transition cursor-pointer
                  ${theme === 'dark' ? 'bg-teal-500' : 'bg-teal-500'}
                `}
              >
                <span 
                  className={`
                    absolute left-6 top-1 bg-white w-4 h-4 rounded-full transition-transform
                  `}
                ></span>
              </label>
            </div>
          </div>
          
          <div className="flex items-center justify-between py-2 border-t dark:border-gray-700">
            <div className="flex items-center gap-3">
              <Globe size={20} className="text-gray-500" />
              <span>Language</span>
            </div>
            <div>
              <select 
                className={`
                  rounded px-2 py-1 text-sm
                  ${theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600' 
                    : 'bg-white border-gray-300'
                  }
                  border
                `}
              >
                <option>English</option>
                <option>Spanish</option>
                <option>French</option>
              </select>
            </div>
          </div>
          
          <div className="flex items-center justify-between py-2 border-t dark:border-gray-700">
            <div className="flex items-center gap-3">
              <Sun size={20} className="text-gray-500" />
              <span>Dark Mode</span>
            </div>
            <div className="relative">
              <input 
                type="checkbox" 
                id="theme-toggle" 
                className="sr-only"
                checked={theme === 'dark'}
                onChange={toggleTheme}
              />
              <label
                htmlFor="theme-toggle"
                className={`
                  block w-12 h-6 rounded-full transition cursor-pointer
                  ${theme === 'dark' ? 'bg-teal-500' : 'bg-gray-300'}
                `}
              >
                <span 
                  className={`
                    absolute top-1 bg-white w-4 h-4 rounded-full transition-transform
                    ${theme === 'dark' ? 'left-6' : 'left-1'}
                  `}
                ></span>
              </label>
            </div>
          </div>
        </div>
      </Card>
      
      <Card>
        <h2 className="text-lg font-semibold mb-4">Support</h2>
        
        <div className="space-y-4">
          <div className="flex items-center gap-3 py-2 cursor-pointer hover:opacity-80">
            <HelpCircle size={20} className="text-gray-500" />
            <span>Help Center</span>
          </div>
          
          <div className="flex items-center gap-3 py-2 cursor-pointer hover:opacity-80 border-t dark:border-gray-700">
            <Lock size={20} className="text-gray-500" />
            <span>Privacy Policy</span>
          </div>
        </div>
      </Card>
      
      <div className="mt-8 text-center">
        <Button
          variant="ghost"
          className="text-red-500 hover:text-red-600 flex items-center gap-2 mx-auto"
          onClick={logout}
        >
          <LogOut size={18} />
          <span>Sign Out</span>
        </Button>
      </div>
    </div>
  );
};

export default Profile;