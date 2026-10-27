import { useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, View } from 'react-native';

import { ExpenseForm } from '@/components/ExpenseForm';
import { useColorScheme } from '@/components/useColorScheme';
import { useTracker } from '@/context/TrackerContext';
import Colors from '@/constants/Colors';
import { formatPickDate } from '@/lib/format';

export default function AddExpenseScreen() {
  const scheme = useColorScheme();
  const colors = Colors[scheme];
  const { ready, categories, createExpense, settings } = useTracker();
  const [saving, setSaving] = useState(false);
  const [formKey, setFormKey] = useState(0);

  if (!ready) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <ActivityIndicator color={colors.tint} />
      </View>
    );
  }

  return (
    <ExpenseForm
      key={formKey}
      categories={categories}
      currencyCode={settings.currencyCode}
      initialAmount=""
      initialCategoryId={categories[0]?.id ?? null}
      initialNote=""
      initialDate={new Date()}
      submitLabel="Save expense"
      saving={saving}
      onSubmit={async (values) => {
        setSaving(true);
        try {
          await createExpense(values);
          setFormKey((k) => k + 1);
          Alert.alert('Saved', `Expense recorded for ${formatPickDate(new Date(values.spentAt))}.`);
        } catch {
          Alert.alert('Error', 'Could not save. Try again.');
        } finally {
          setSaving(false);
        }
      }}
    />
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
