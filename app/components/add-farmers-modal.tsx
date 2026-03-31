import { useState } from 'react'
import { Plus, Search, Mail } from 'lucide-react'
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogClose } from '~/components/ui/dialog'
import { toast } from 'sonner'

interface AddFarmersModalProps {
  isOpen: boolean
  onClose: () => void
}

export function AddFarmersModal({ isOpen, onClose }: AddFarmersModalProps) {
  const [activeTab, setActiveTab] = useState<'search' | 'invite'>('search')
  const [searchQuery, setSearchQuery] = useState('')
  const [inviteForm, setInviteForm] = useState({
    fullName: '',
    emailOrPhone: '',
    state: '',
    lga: '',
  })

  return (
    <Dialog open={isOpen} onOpenChange={(open: boolean) => !open && onClose()}>
        <DialogContent showCloseButton={true} className="max-w-2xl p-0 gap-0 overflow-hidden outline-none">
          <div className="flex items-center justify-between border-b border-gray-100 p-6 pb-2">
            <div>
              <DialogTitle className="text-xl font-bold text-brand flex items-center gap-2">
                Add Farmers to Cooperative
              </DialogTitle>
              <DialogDescription className="text-sm text-gray-500 mt-1 pb-4">
                Search existing farmers or create accounts to invite new ones
              </DialogDescription>
            </div>
          </div>

          <div className="border-b border-gray-100 px-6">
            <div className="flex gap-6 -mb-px">
              <button
                onClick={() => setActiveTab('search')}
                className={`py-4 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
                  activeTab === 'search'
                    ? 'border-brand text-brand'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Search className="size-4" />
                Search Existing Farmers
              </button>
              <button
                onClick={() => setActiveTab('invite')}
                className={`py-4 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
                  activeTab === 'invite'
                    ? 'border-brand text-brand'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Plus className="size-4" />
                Invite New Farmer
              </button>
            </div>
          </div>

          <div className="p-6">
            {activeTab === 'search' ? (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    Search by Email, Name or Phone
                  </label>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      placeholder="Enter email, name or phone number..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="flex-1 h-10 rounded-md border border-gray-200 px-3 text-sm focus:border-brand focus:ring-1 focus:ring-brand focus:outline-none placeholder:text-gray-400"
                    />
                    <button className="flex h-10 items-center gap-2 rounded-md bg-[#1d3d1e] px-4 text-sm font-medium text-white transition-colors hover:bg-black">
                      <Search className="size-4" />
                      Search
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-gray-100 pt-6">
                  <span className="text-sm text-gray-500">Search and select farmers to add</span>
                  <div className="flex gap-3">
                    <button
                      onClick={onClose}
                      className="rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-900 transition-colors hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        toast.success('Farmers added to cooperative')
                        onClose()
                      }}
                      className="flex items-center gap-2 rounded-md bg-brand px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-dark"
                    >
                      <Plus className="size-4" />
                      Add Farmers
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="rounded-lg bg-green-50 p-4 flex items-start gap-3">
                  <div className="rounded-full bg-green-100 p-1 shrink-0 mt-0.5">
                    <Plus className="size-4 text-green-700" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-brand">Create & Invite Farmer</h4>
                    <p className="text-xs text-gray-600 mt-1">
                      If the farmer is not on the AgTrail platform yet, enter their details below. We will create an account for them and add them to your cooperative.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-1.5">
                      Full Name *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                        <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <input
                        type="text"
                        placeholder="e.g. Ousmane Dembele"
                        value={inviteForm.fullName}
                        onChange={(e) => setInviteForm(prev => ({ ...prev, fullName: e.target.value }))}
                        className="w-full h-10 rounded-md border border-gray-200 pl-10 pr-3 text-sm focus:border-brand focus:ring-1 focus:ring-brand focus:outline-none placeholder:text-gray-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-1.5">
                      Email or Phone Number *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                        <Mail className="size-4" />
                      </div>
                      <input
                        type="text"
                        placeholder="e.g. +2348000000000 or farmer@example.com"
                        value={inviteForm.emailOrPhone}
                        onChange={(e) => setInviteForm(prev => ({ ...prev, emailOrPhone: e.target.value }))}
                        className="w-full h-10 rounded-md border border-gray-200 pl-10 pr-3 text-sm focus:border-brand focus:ring-1 focus:ring-brand focus:outline-none placeholder:text-gray-400"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-900 mb-1.5">
                        State / Region
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Kano"
                        value={inviteForm.state}
                        onChange={(e) => setInviteForm(prev => ({ ...prev, state: e.target.value }))}
                        className="w-full h-10 rounded-md border border-gray-200 px-3 text-sm focus:border-brand focus:ring-1 focus:ring-brand focus:outline-none placeholder:text-gray-400"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-900 mb-1.5">
                        LGA / District
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Dala"
                        value={inviteForm.lga}
                        onChange={(e) => setInviteForm(prev => ({ ...prev, lga: e.target.value }))}
                        className="w-full h-10 rounded-md border border-gray-200 px-3 text-sm focus:border-brand focus:ring-1 focus:ring-brand focus:outline-none placeholder:text-gray-400"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-gray-100 pt-6 mt-6">
                  <span className="text-xs text-gray-500">* Required fields</span>
                  <div className="flex gap-3">
                    <button
                      onClick={onClose}
                      className="rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-900 transition-colors hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        if (inviteForm.fullName && inviteForm.emailOrPhone) {
                          toast.success(`Invitation sent to ${inviteForm.fullName}`)
                          onClose()
                        } else {
                          toast.error('Please fill in all required fields')
                        }
                      }}
                      className="flex items-center gap-2 rounded-md bg-brand px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-dark"
                    >
                      <Plus className="size-4" />
                      Invite Farmer
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
    </Dialog>
  )
}
