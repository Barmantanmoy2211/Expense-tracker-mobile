import { Pressable, StyleSheet, Text } from 'react-native';

type Props = {
  name: string;
  color: string;
  selected: boolean;
  onPress: () => void;
};

export function CategoryChip({ name, color, selected, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.chip,
        { borderColor: color, backgroundColor: selected ? color : 'transparent' },
      ]}>
      <Text style={[styles.text, { color: selected ? '#fff' : color }]}>{name}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    borderWidth: 1.5,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  text: {
    fontSize: 14,
    fontWeight: '600',
  },
});
