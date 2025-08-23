const STORAGE_KEY = 'family-expense-data';

export const loadData = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : { expenses: [], savings: { personal: 0, normal: 0 } };
  } catch (error) {
    console.error('Error loading data:', error);
    return { expenses: [], savings: { personal: 0, normal: 0 } };
  }
};

export const saveData = (data) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving data:', error);
  }
};