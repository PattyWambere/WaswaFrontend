import React, { useState } from 'react';
import ChangePasswordForm from '../components/ChangePasswordForm';
import ProfileForm from '../components/ProfileForm';
import ReferralCard from '../components/ReferralCard';
import { User, Shield, Gift } from 'lucide-react';

export const Security: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'referral'>('profile');

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold text-white">Account Settings</h2>
                <p className="text-slate-400 mt-1">Manage your public profile and account security</p>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 border-b border-slate-700/50">
                <button
                    onClick={() => setActiveTab('profile')}
                    className={`pb-4 px-2 text-sm font-medium transition-all relative ${activeTab === 'profile' ? 'text-primary' : 'text-slate-400 hover:text-white'}`}
                >
                    <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Profile Info
                    </div>
                    {activeTab === 'profile' && (
                        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary animate-in slide-in-from-left-full duration-300" />
                    )}
                </button>

                <button
                    onClick={() => setActiveTab('security')}
                    className={`pb-4 px-2 text-sm font-medium transition-all relative ${activeTab === 'security' ? 'text-primary' : 'text-slate-400 hover:text-white'}`}
                >
                    <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4" />
                        Security &amp; Password
                    </div>
                    {activeTab === 'security' && (
                        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary animate-in slide-in-from-right-full duration-300" />
                    )}
                </button>

                <button
                    onClick={() => setActiveTab('referral')}
                    className={`pb-4 px-2 text-sm font-medium transition-all relative ${activeTab === 'referral' ? 'text-primary' : 'text-slate-400 hover:text-white'}`}
                >
                    <div className="flex items-center gap-2">
                        <Gift className="w-4 h-4" />
                        Referrals
                    </div>
                    {activeTab === 'referral' && (
                        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary animate-in slide-in-from-right-full duration-300" />
                    )}
                </button>
            </div>

            <div className="mt-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                {activeTab === 'profile' && <ProfileForm />}
                {activeTab === 'security' && <ChangePasswordForm />}
                {activeTab === 'referral' && <ReferralCard />}
            </div>
        </div>
    );
};
