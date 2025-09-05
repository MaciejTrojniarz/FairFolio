import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../store';
import { fetchCostCategoriesCommand, addCostCategoryCommand } from '../../store/features/costCategories/costCategoriesSlice';
import { fetchEventsCommand } from '../../store/features/events/eventsSlice';
import { costService } from '../../services/costService';
import { showToast } from '../../store/features/ui/uiSlice';
import { useI18n } from '../../contexts/useI18n';

export function useEditCostForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useI18n();

  const categories = useSelector((state: RootState) => state.costCategories.categories);
  const categoriesLoading = useSelector((state: RootState) => state.costCategories.loading);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [eventId, setEventId] = useState<string | undefined>(undefined);
  const [categoryId, setCategoryId] = useState<string>('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [openDialog, setOpenDialog] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  useEffect(() => {
    dispatch(fetchCostCategoriesCommand());
    dispatch(fetchEventsCommand());
    if (id) {
      costService.fetchCostById(id)
        .then(cost => {
          setName(cost.name);
          setEventId(cost.event?.id);
          setCategoryId(cost.cost_category_id ?? '');
          setAmount(cost.amount.toString());
          setDate(cost.date);
        })
        .catch(err => setError(err.message))
        .finally(() => setLoading(false));
    }
  }, [id, dispatch]);

  const handleSaveCategory = (name: string) => {
    if (!name.trim()) return;
    dispatch(addCostCategoryCommand(name));
    setNewCategoryName('');
    setOpenDialog(false);
  };

  const canSubmit = name.trim().length > 0 && amount !== '' && !isNaN(Number(amount));

  const handleSubmit = () => {
    if (!id || !canSubmit) return;
    setLoading(true);
    costService.updateCost(id, {
      name: name.trim(),
      event_id: eventId ?? null,
      cost_category_id: categoryId || null,
      amount: Number(amount),
      date,
    })
      .then(() => {
        dispatch(showToast({ message: t('cost_updated_success'), severity: 'success' }));
        navigate('/costs');
      })
      .catch(err => {
        setError(err.message);
        dispatch(showToast({ message: `${t('error_updating_cost')}: ${err.message}`, severity: 'error' }));
      })
      .finally(() => setLoading(false));
  };

  return {
    loading,
    error,
    name,
    setName,
    eventId,
    setEventId,
    categoryId,
    setCategoryId,
    amount,
    setAmount,
    date,
    setDate,
    openDialog,
    setOpenDialog,
    newCategoryName,
    setNewCategoryName,
    handleSaveCategory,
    canSubmit,
    handleSubmit,
    categories,
    categoriesLoading,
  };
}
