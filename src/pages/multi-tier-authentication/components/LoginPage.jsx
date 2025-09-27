import React, { useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
 import Icon from'../../../components/AppIcon';
 import Button from'../../../components/ui/Button';

export default function LoginForm({ onSuccess }) {
  const { signIn } = useAuth()
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error: signInError } = await signIn(formData?.email, formData?.password)
    
    if (signInError) {
      setError(signInError?.message || 'Failed to sign in')
    } else {
      onSuccess?.()
    }
    
    setLoading(false)
  }

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const fillDemoCredentials = (email, password) => {
    setFormData({ email, password })
  }

  return (
    <div className="max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Email</label>
          <input
            type="email"
            name="email"
            value={formData?.email || ''}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your email"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Password</label>
          <input
            type="password"
            name="password"
            value={formData?.password || ''}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your password"
          />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        <Button
          type="submit"
          disabled={loading}
          className="w-full"
          variant="default"
          iconName={loading ? "Loader" : "LogIn"}
          iconSize={16}
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </Button>
      </form>

      {/* Demo Credentials Display */}
      <div className="mt-6 p-4 bg-gray-50 rounded-md">
        <h3 className="font-medium mb-3 flex items-center space-x-2">
          <Icon name="Info" size={16} className="text-blue-600" />
          <span>Demo Credentials</span>
        </h3>
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between p-2 bg-white rounded border">
            <div>
              <strong>Admin:</strong> admin@mindcare.com
              <br />
              <span className="text-gray-600">Password: password123</span>
            </div>
            <Button
              variant="ghost"
              size="xs"
              onClick={() => fillDemoCredentials('admin@mindcare.com', 'password123')}
            >
              Use
            </Button>
          </div>
          
          <div className="flex items-center justify-between p-2 bg-white rounded border">
            <div>
              <strong>Therapist:</strong> therapist@mindcare.com
              <br />
              <span className="text-gray-600">Password: password123</span>
            </div>
            <Button
              variant="ghost"
              size="xs"
              onClick={() => fillDemoCredentials('therapist@mindcare.com', 'password123')}
            >
              Use
            </Button>
          </div>
          
          <div className="flex items-center justify-between p-2 bg-white rounded border">
            <div>
              <strong>Student:</strong> student@mindcare.com
              <br />
              <span className="text-gray-600">Password: password123</span>
            </div>
            <Button
              variant="ghost"
              size="xs"
              onClick={() => fillDemoCredentials('student@mindcare.com', 'password123')}
            >
              Use
            </Button>
          </div>
        </div>
        
        <p className="text-xs text-gray-500 mt-3">
          Click "Use" to automatically fill the credentials, then click "Sign In"
        </p>
      </div>
    </div>
  )
}