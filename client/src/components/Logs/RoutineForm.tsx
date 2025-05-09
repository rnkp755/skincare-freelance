import React, { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import Button from '../UI/Button';
import { Camera, X } from 'lucide-react';
import { RoutineStep } from '../../contexts/LogContext';

interface RoutineFormProps {
  step: RoutineStep;
  onComplete: (completed: boolean, photoUrl?: string, reason?: string) => void;
}

const RoutineForm: React.FC<RoutineFormProps> = ({ step, onComplete }) => {
  const [showPhotoUpload, setShowPhotoUpload] = useState(false);
  const [showReasonInput, setShowReasonInput] = useState(false);
  const [reason, setReason] = useState('');
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const { theme, colors } = useTheme();

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      // Simulate photo upload - in real app this would upload to server
      const mockUrl = 'https://images.pexels.com/photos/3762453/pexels-photo-3762453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1';
      setPhotoUrl(mockUrl);
    }
  };

  const handleComplete = (completed: boolean) => {
    if (completed) {
      setShowPhotoUpload(true);
    } else {
      setShowReasonInput(true);
    }
  };

  const handleSubmit = () => {
    onComplete(showPhotoUpload, photoUrl || undefined, showReasonInput ? reason : undefined);
  };

  if (showPhotoUpload) {
    return (
      <div className="space-y-4">
        <p className="font-medium">Upload a photo of your skin after completing the routine:</p>
        
        {photoUrl ? (
          <div className="relative inline-block">
            <img src={photoUrl} alt="Uploaded" className="w-32 h-32 object-cover rounded-lg" />
            <button
              onClick={() => setPhotoUrl(null)}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
            >
              <X size={14} />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => document.getElementById('photo-upload')?.click()}
              className="flex items-center gap-2"
            >
              <Camera size={18} />
              <span>Take Photo</span>
            </Button>
            <input
              type="file"
              id="photo-upload"
              accept="image/*"
              className="hidden"
              onChange={handlePhotoUpload}
            />
          </div>
        )}
        
        <div className="flex gap-2">
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={!photoUrl}
          >
            Submit
          </Button>
          <Button
            variant="outline"
            onClick={() => setShowPhotoUpload(false)}
          >
            Back
          </Button>
        </div>
      </div>
    );
  }

  if (showReasonInput) {
    return (
      <div className="space-y-4">
        <p className="font-medium">Why couldn't you complete this step?</p>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className={`w-full p-3 rounded-lg border ${
            theme === 'dark'
              ? 'bg-gray-700 border-gray-600 text-white'
              : 'bg-white border-gray-300'
          }`}
          rows={3}
          placeholder="Enter your reason..."
        />
        <div className="flex gap-2">
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={!reason.trim()}
          >
            Submit
          </Button>
          <Button
            variant="outline"
            onClick={() => setShowReasonInput(false)}
          >
            Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-medium capitalize">{step.timeOfDay} Routine</p>
          <p className="text-sm opacity-75">{step.description}</p>
        </div>
      </div>
      
      <div className="flex gap-2">
        <Button
          variant="primary"
          onClick={() => handleComplete(true)}
        >
          Complete
        </Button>
        <Button
          variant="outline"
          onClick={() => handleComplete(false)}
        >
          Skip
        </Button>
      </div>
    </div>
  );
};

export default RoutineForm