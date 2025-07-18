
import { User, CreditCard, Trash2, Shield, Currency, Receipt } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface AccountSettingsNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onDeleteClick?: () => void;
}

export const AccountSettingsNavigation = ({ activeTab, onTabChange, onDeleteClick }: AccountSettingsNavigationProps) => {
  const navigationItems = [
    { id: 'account', label: 'Profil', icon: User },
    { id: 'security', label: 'Sécurité', icon: Shield },
    { id: 'currency', label: 'Devise', icon: Currency },
    { id: 'billing', label: 'Moyen de paiement', icon: CreditCard },
    { id: 'invoices', label: 'Historique de facturation', icon: Receipt },
  ];

  return (
    <div className="w-80 bg-slate-50 border-r p-6 flex flex-col">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-slate-900">Paramètres du compte</h2>
        <p className="text-sm text-slate-600">Gérez vos informations personnelles</p>
      </div>
      
      <nav className="space-y-3 flex-1">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm rounded-xl transition-colors text-left ${
                activeTab === item.id 
                  ? 'bg-white text-slate-900 shadow-sm font-medium' 
                  : 'text-slate-600 hover:bg-white/50'
              }`}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              <span className="text-left leading-tight">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="mt-6">
        <Separator className="mb-4" />
        <div className="space-y-3">
          <div>
            <p className="text-xs font-medium text-red-600 uppercase tracking-wide">Danger Zone</p>
          </div>
          <button
            onClick={onDeleteClick}
            className="w-full flex items-center justify-start gap-2 px-4 py-3 bg-red-50 hover:bg-red-100 text-red-700 rounded-xl transition-colors text-sm font-medium border border-red-200"
          >
            <Trash2 className="h-4 w-4" />
            Supprimer le compte
          </button>
        </div>
      </div>
    </div>
  );
};
