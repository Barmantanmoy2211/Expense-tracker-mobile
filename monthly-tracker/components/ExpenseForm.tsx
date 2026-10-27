import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import DateTimePicker, { type DateTimePickerEvent } from '@react-native-community/datetimepicker';

import { CategoryChip } from '@/components/CategoryChip';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import { currencySymbol, formatPickDate } from '@/lib/format';
import { noonOnDay } from '@/lib/period';
import type { Category } from '@/lib/types';

export type ExpenseFormValues = {
  amount: number;
  categoryId: number;
  note: string;
  spentAt: number;
};

type Props = {
  categories: Category[];
  currencyCode: string;
  initialAmount: string;
  initialCategoryId: number | null;
  initialNote: string;
  initialDate: Date;
  submitLabel: string;
  saving: boolean;
  onSubmit: (values: ExpenseFormValues) => Promise<void>;
};

export function ExpenseForm({
  categories,
  currencyCode,
  initialAmount,
  initialCategoryId,
  initialNote,
  initialDate,
  submitLabel,
  saving,
  onSubmit,
}: Props) {
  const scheme = useColorScheme();
  const colors = Colors[scheme];
  const inputBg = scheme === 'dark' ? '#1a1a1a' : '#f4f6f8';

  const [amountText, setAmountText] = useState(initialAmount);
  const [note, setNote] = useState(initialNote);
  const [categoryId, setCategoryId] = useState<number | null>(initialCategoryId);
  const [expenseDate, setExpenseDate] = useState(initialDate);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const selectedCategory = categoryId ?? categories[0]?.id ?? null;

  const onDateChange = (event: DateTimePickerEvent, date?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    if (event.type === 'dismissed') {
      return;
    }
    if (date) {
      setExpenseDate(date);
    }
  };

  const handleSave = async () => {
    const amount = parseFloat(amountText.replace(/,/g, ''));
    if (!amount || amount <= 0) {
      Alert.alert('Invalid amount', 'Enter a positive number.');
      return;
    }
    if (!selectedCategory) {
      Alert.alert('No category', 'Pick a category first.');
      return;
    }
    await onSubmit({
      amount,
      categoryId: selectedCategory,
      note,
      spentAt: noonOnDay(expenseDate).getTime(),
    });
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={[styles.label, { color: colors.text }]}>Amount</Text>
        <View style={[styles.amountRow, { backgroundColor: inputBg }]}>
          <Text style={[styles.currency, { color: colors.tabIconDefault }]}>
            {currencySymbol(currencyCode)}
          </Text>
          <TextInput
            value={amountText}
            onChangeText={setAmountText}
            placeholder="0"
            placeholderTextColor={colors.tabIconDefault}
            keyboardType="decimal-pad"
            style={[styles.amountInput, { color: colors.text }]}
          />
        </View>

        <Text style={[styles.label, { color: colors.text }]}>Date</Text>
        <Pressable
          onPress={() => setShowDatePicker(true)}
          style={[styles.dateBtn, { backgroundColor: inputBg }]}>
          <Text style={[styles.dateBtnText, { color: colors.text }]}>{formatPickDate(expenseDate)}</Text>
        </Pressable>
        {showDatePicker ? (
          <>
            <DateTimePicker
              value={expenseDate}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={onDateChange}
              maximumDate={new Date(2100, 11, 31)}
              minimumDate={new Date(2000, 0, 1)}
            />
            {Platform.OS === 'ios' ? (
              <Pressable onPress={() => setShowDatePicker(false)} style={styles.iosDone}>
                <Text style={{ color: '#2563eb', fontWeight: '700' }}>Done</Text>
              </Pressable>
            ) : null}
          </>
        ) : null}

        <Text style={[styles.label, { color: colors.text }]}>Category</Text>
        <View style={styles.chips}>
          {categories.map((cat) => (
            <CategoryChip
              key={cat.id}
              name={cat.name}
              color={cat.color}
              selected={selectedCategory === cat.id}
              onPress={() => setCategoryId(cat.id)}
            />
          ))}
        </View>

        <Text style={[styles.label, { color: colors.text }]}>Note (optional)</Text>
        <TextInput
          value={note}
          onChangeText={setNote}
          placeholder="Coffee, metro, etc."
          placeholderTextColor={colors.tabIconDefault}
          style={[styles.noteInput, { color: colors.text, backgroundColor: inputBg }]}
        />

        <Pressable
          onPress={() => void handleSave()}
          disabled={saving}
          style={({ pressed }) => [
            styles.saveBtn,
            { backgroundColor: '#2563eb', opacity: saving || pressed ? 0.7 : 1 },
          ]}>
          <Text style={styles.saveText}>{saving ? 'Saving…' : submitLabel}</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 16,
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  currency: {
    fontSize: 22,
    fontWeight: '600',
    marginRight: 8,
  },
  amountInput: {
    flex: 1,
    fontSize: 28,
    fontWeight: '700',
    paddingVertical: 12,
  },
  dateBtn: {
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  dateBtnText: {
    fontSize: 16,
    fontWeight: '500',
  },
  iosDone: {
    alignSelf: 'flex-end',
    paddingVertical: 8,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  noteInput: {
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
  },
  saveBtn: {
    marginTop: 28,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  saveText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
  },
});
