import DatePicker, {
  type DatePickerProps as RNDatePickerProps,
} from "react-native-date-picker";
import { withUnistyles } from "react-native-unistyles";

interface DatePickerProps
  extends Omit<
    RNDatePickerProps,
    "date" | "maximumDate" | "minimumDate" | "onConfirm" | "mode"
  > {
  date: Temporal.Instant;
  maximumDate?: Temporal.Instant;
  minimumDate?: Temporal.Instant;
  onConfirm?: (date: Temporal.Instant) => void;
}

const UniDatePicker = withUnistyles(DatePicker);

const CustomTimePicker = ({
  date: inputTime,
  maximumDate,
  minimumDate,
  modal = true,
  buttonColor,
  onConfirm,
  ...rest
}: DatePickerProps) => {
  const confirmDate = (date: Date) => {
    const instant = date.toTemporalInstant();
    onConfirm?.(instant);
  };

  return (
    <UniDatePicker
      modal={modal}
      date={new Date(inputTime.toString())}
      maximumDate={maximumDate ? new Date(maximumDate.toString()) : undefined}
      minimumDate={minimumDate ? new Date(minimumDate.toString()) : undefined}
      onConfirm={confirmDate}
      mode="time"
      uniProps={(theme) => ({
        buttonColor: buttonColor ?? theme.colors.text,
      })}
      {...rest}
    />
  );
};

export default CustomTimePicker;
