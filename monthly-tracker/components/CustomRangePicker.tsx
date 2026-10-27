import { useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import DateTimePicker, { type DateTimePickerEvent } from '@react-native-community/datetimepicker';

import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import { formatPickDate } from '@/lib/format';
import type { CustomDateRange } from '@/lib/period';

type Props = {
  range: CustomDateRange;
  onChange: (range: CustomDateRange) => void;
};

type PickerField = 'start' | 'end' | null;

export function CustomRangePicker({ range, onChange }: Props) {
  const scheme = useColorScheme();
  const colors = Colors[scheme];
  const inputBg = scheme === 'dark' ? '#1a1a1a' : '#f4f6f8';
  const [pickerField, setPickerField] = useState<PickerField>(null);

  const onDateChange = (event: DateTimePickerEvent, date?: Date) => {
    if (Platform.OS === 'android') {
      setPickerField(null);
    }
    if (event.type === 'dismissed' || !date || !pickerField) {
      return;
    }
    if (pickerField === 'start') {
      onChange({ ...range, start: date });
    } else {
      onChange({ ...range, end: date });
    }
  };

  return (
    <View style={styles.wrap}>
      <View style={styles.row}>
        <Text style={[styles.fieldLabel, { color: colors.tabIconDefault }]}>From</Text>
        <Pressable
          onPress={() => setPickerField('start')}
          style={[styles.dateBtn, { backgroundColor: inputBg }]}>
          <Text style={[styles.dateText, { color: colors.text }]}>{formatPickDate(range.start)}</Text>
        </Pressable>
      </View>
      <View style={styles.row}>
        <Text style={[styles.fieldLabel, { color: colors.tabIconDefault }]}>To</Text>
        <Pressable
          onPress={() => setPickerField('end')}
          style={[styles.dateBtn, { backgroundColor: inputBg }]}>
          <Text style={[styles.dateText, { color: colors.text }]}>{formatPickDate(range.end)}</Text>
        </Pressable>
      </View>
      {pickerField ? (
        <>
          <DateTimePicker
            value={pickerField === 'start' ? range.start : range.end}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={onDateChange}
            maximumDate={new Date(2100, 11, 31)}
            minimumDate={new Date(2000, 0, 1)}
          />
          {Platform.OS === 'ios' ? (
            <Pressable onPress={() => setPickerField(null)} style={styles.done}>
              <Text style={{ color: '#2563eb', fontWeight: '700' }}>Done</Text>
            </Pressable>
          ) : null}
        </>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingVertical: 4,
    gap: 10,
  },
  row: {
    gap: 6,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  dateBtn: {
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  dateText: {
    fontSize: 15,
    fontWeight: '500',
  },
  done: {
    alignSelf: 'flex-end',
    paddingVertical: 6,
  },
});
