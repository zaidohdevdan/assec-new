import React, { useState, useEffect } from 'react';
import { X, Plus, Edit, Trash, Filter } from 'lucide-react'; // Import icons for actions
import ScheduleForm from '../tabs/ScheduleForm'; // Import the existing ScheduleForm
import { Schedule } from '@/src/types';

interface SchedulesModalProps {
  open: boolean;
  onClose: () => void;
}

// Define a type for a Schedule item (this should align with your backend model)


const SchedulesModal: React.FC<SchedulesModalProps> = ({ open, onClose }) => {
  const [schedules, setSchedules] = useState<Schedule[]>([]); // State for storing schedules
  const [showForm, setShowForm] = useState(false); // State to toggle create/edit form
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null); // State for schedule being edited
  const [filterStatus, setFilterStatus] = useState<string>('all'); // State for status filter
  const [filterDate, setFilterDate] = useState<string>(''); // State for date filter
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // TODO: Replace with actual API calls in Phase 2
  useEffect(() => {
    if (open) {
      fetchSchedules();
    }
  }, [open]);

  const fetchSchedules = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Simulate API call
      const dummySchedules: Schedule[] = [
        {
            id: '1', type: 'Clube A', date: '2026-06-01', status: 'pending', info: 'Reserva para 2 pessoas',
            title: '',
            time: ''
        },
        {
            id: '2', type: 'Clube B', date: '2026-06-10', status: 'approved', info: 'Reunião da diretoria',
            title: '',
            time: ''
        },
        {
            id: '3', type: 'Clube C', date: '2026-06-15', status: 'rejected', info: 'Evento particular',
            title: '',
            time: ''
        },
      ];
      setSchedules(dummySchedules);
      setSuccessMessage(null); // Clear any previous success messages
    } catch (err) {
      setError('Erro ao carregar agendamentos.');
      console.error('Fetch schedules error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateSchedule = () => {
    setEditingSchedule(null);
    setShowForm(true);
  };

  const handleEditSchedule = (schedule: Schedule) => {
    setEditingSchedule(schedule);
    setShowForm(true);
  };

  const handleDeleteSchedule = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este agendamento?')) {
      setIsLoading(true);
      setError(null);
      try {
        // Simulate API call for deletion
        setSchedules(prev => prev.filter(s => s.id !== id));
        setSuccessMessage('Agendamento excluído com sucesso!');
        // TODO: Call actual delete API in Phase 2
      } catch (err) {
        setError('Erro ao excluir agendamento.');
        console.error('Delete schedule error:', err);
      } finally {
        setIsLoading(false);
      }
    }
  };

    const handleFormSubmit = async (data: Omit<Schedule, 'id' | 'createdAt' | 'updatedAt'>) => {
        setIsLoading(true);
        setError(null);
        try {
            if (editingSchedule) {
                // Update: mantenha campos imutáveis
                const updatedSchedule: Schedule = {
                    ...editingSchedule,
                    ...data,
                    updatedAt: new Date().toISOString(),
                };
                setSchedules(prev => prev.map(s => s.id === editingSchedule.id ? updatedSchedule : s));
                setSuccessMessage('Agendamento atualizado com sucesso!');
            } else {
                // Create: gere ID e timestamps
                const newSchedule: Schedule = {
                    id: crypto.randomUUID(), // ou String(Date.now())
                    ...data,
                    status: 'pending',
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                };
                setSchedules(prev => [...prev, newSchedule]);
                setSuccessMessage('Agendamento criado com sucesso!');
            }
            setShowForm(false);
            setEditingSchedule(null);
            fetchSchedules();
        } catch (err) {
            setError('Erro ao salvar agendamento.');
            console.error('Save schedule error:', err);
        } finally {
            setIsLoading(false);
        }
    };

  const filteredSchedules = schedules.filter(schedule => {
    const statusMatch = filterStatus === 'all' || schedule.status === filterStatus;
    const dateMatch = filterDate === '' || schedule.date.includes(filterDate); // Simple date match

    return statusMatch && dateMatch;
  });

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-500 hover:text-slate-800"
          aria-label="Fechar"
        >
          <X className="w-6 h-6" />
        </button>
        <h2 className="text-2xl font-bold text-blue-950 mb-6">Meus Agendamentos</h2>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            {error}
          </div>
        )}
        {successMessage && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-600 text-sm">
            {successMessage}
          </div>
        )}

        {showForm ? (
          <ScheduleForm
            onClose={() => setShowForm(false)}
            onScheduleCreated={handleFormSubmit} // Assuming ScheduleForm can handle both create and edit
            initialData={editingSchedule || undefined} // Pass initial data for editing
          />
        ) : (
          <>
            <div className="flex justify-between items-center mb-6">
              <button
                onClick={handleCreateSchedule}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-5 h-5" /> Novo Agendamento
              </button>

              <div className="flex items-center gap-4">
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="pl-9 pr-3 py-2 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">Todos os Status</option>
                    <option value="pending">Pendente</option>
                    <option value="approved">Aprovado</option>
                    <option value="rejected">Rejeitado</option>
                  </select>
                </div>
                <input
                  type="date"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                  className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {isLoading && <p className="text-center text-slate-500">Carregando agendamentos...</p>}
            {!isLoading && filteredSchedules.length === 0 && (
              <p className="text-center text-slate-500">Nenhum agendamento encontrado.</p>
            )}

            {!isLoading && filteredSchedules.length > 0 && (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-slate-200 rounded-lg">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Tipo</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Data</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Informações</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredSchedules.map((schedule) => (
                      <tr key={schedule.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{schedule.type}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{schedule.date}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            schedule.status === 'approved' ? 'bg-green-100 text-green-800' :
                            schedule.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {schedule.status === 'approved' && 'Aprovado'}
                            {schedule.status === 'pending' && 'Pendente'}
                            {schedule.status === 'rejected' && 'Rejeitado'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-500">{schedule.info}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => handleEditSchedule(schedule)}
                            className="text-blue-600 hover:text-blue-900 mr-4"
                            title="Editar"
                          >
                            <Edit className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDeleteSchedule(schedule.id)}
                            className="text-red-600 hover:text-red-900"
                            title="Excluir"
                          >
                            <Trash className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SchedulesModal;