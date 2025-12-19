import { useState, useEffect } from 'react';

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  date: string;
  status: 'unread' | 'read';
}

export default function Messages() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/messages`);
      if (!response.ok) throw new Error('Erreur lors du chargement');
      const data = await response.json();
      setMessages(data);
      setLoading(false);
    } catch (error) {
      console.error('Erreur:', error);
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/messages/${id}/read`, {
        method: 'PUT',
      });
      if (!response.ok) throw new Error('Erreur');
      fetchMessages();
      if (selectedMessage?.id === id) {
        setSelectedMessage({ ...selectedMessage, status: 'read' });
      }
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const handleDeleteMessage = async (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce message ?')) {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/messages/${id}`, {
          method: 'DELETE',
        });
        if (!response.ok) throw new Error('Erreur');
        fetchMessages();
        setSelectedMessage(null);
      } catch (error) {
        console.error('Erreur:', error);
      }
    }
  };

  const filteredMessages = messages.filter((m) => {
    if (filter === 'all') return true;
    return m.status === filter;
  });

  const unreadCount = messages.filter((m) => m.status === 'unread').length;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold">💬 Messages de Contact</h1>
        <div className="badge badge-lg badge-primary">{unreadCount} non lus</div>
      </div>

      <div className="flex gap-2 mb-6">
        <button
          className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-ghost'}`}
          onClick={() => setFilter('all')}
        >
          Tous ({messages.length})
        </button>
        <button
          className={`btn ${filter === 'unread' ? 'btn-primary' : 'btn-ghost'}`}
          onClick={() => setFilter('unread')}
        >
          Non lus ({unreadCount})
        </button>
        <button
          className={`btn ${filter === 'read' ? 'btn-primary' : 'btn-ghost'}`}
          onClick={() => setFilter('read')}
        >
          Lus ({messages.length - unreadCount})
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : filteredMessages.length === 0 ? (
        <div className="text-center py-12 text-base-content/60">
          <p className="text-xl">Aucun message {filter !== 'all' ? 'dans cette catégorie' : ''}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Liste des messages */}
          <div className="lg:col-span-1 space-y-2 max-h-[600px] overflow-y-auto">
            {filteredMessages.map((msg) => (
              <button
                key={msg.id}
                onClick={() => handleMarkAsRead(msg.id).then(() => setSelectedMessage(msg))}
                className={`w-full text-left p-4 rounded-lg border transition-all ${
                  selectedMessage?.id === msg.id
                    ? 'bg-primary text-primary-content border-primary-focus'
                    : msg.status === 'unread'
                      ? 'bg-warning/20 border-warning hover:bg-warning/30'
                      : 'bg-base-200 border-base-300 hover:bg-base-300'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate">{msg.name}</p>
                    <p className="text-sm opacity-75 truncate">{msg.subject}</p>
                    <p className="text-xs opacity-60 mt-1">
                      {new Date(msg.date).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  {msg.status === 'unread' && (
                    <div className="badge badge-sm badge-warning">Nouveau</div>
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Détail du message */}
          {selectedMessage && (
            <div className="lg:col-span-2">
              <div className="card bg-base-100 shadow-lg border border-base-300 sticky top-6">
                <div className="card-body">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="card-title text-2xl">{selectedMessage.subject}</h2>
                      <p className="text-base-content/70">{selectedMessage.name}</p>
                    </div>
                    <div className="text-right text-sm opacity-60">
                      {new Date(selectedMessage.date).toLocaleDateString('fr-FR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </div>

                  <div className="divider my-2"></div>

                  {/* Informations de contact */}
                  <div className="bg-base-200 p-4 rounded-lg space-y-2 mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold w-20">Email:</span>
                      <a href={`mailto:${selectedMessage.email}`} className="link">
                        {selectedMessage.email}
                      </a>
                    </div>
                    {selectedMessage.phone && (
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold w-20">Téléphone:</span>
                        <a href={`tel:${selectedMessage.phone}`} className="link">
                          {selectedMessage.phone}
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Message */}
                  <div className="bg-base-200 p-4 rounded-lg mb-4 whitespace-pre-wrap">
                    {selectedMessage.message}
                  </div>

                  {/* Actions */}
                  <div className="card-actions justify-between">
                    <div>
                      {selectedMessage.status === 'unread' && (
                        <span className="badge badge-warning">Non lu</span>
                      )}
                      {selectedMessage.status === 'read' && (
                        <span className="badge badge-success">Lu</span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        className="btn btn-error btn-sm"
                        onClick={() => handleDeleteMessage(selectedMessage.id)}
                      >
                        🗑️ Supprimer
                      </button>
                      <a
                        href={`mailto:${selectedMessage.email}`}
                        className="btn btn-primary btn-sm"
                      >
                        ✉️ Répondre
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
