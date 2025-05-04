import DatePicker, {
  type DatePickerProps as RNDatePickerProps,
} from "react-native-date-picker";
import { withUnistyles } from "react-native-unistyles";

interface DateTimePickerProps
  extends Omit<
    RNDatePickerProps,
    "date" | "maximumDate" | "minimumDate" | "onConfirm" | "mode"
  > {
  date: Temporal.PlainDateTime;
  maximumDate?: Temporal.PlainDateTime;
  minimumDate?: Temporal.PlainDateTime;
  onConfirm?: (date: Temporal.PlainDateTime) => void;
}

const UniDateTimePicker = withUnistyles(DatePicker);

const DateTimePicker = ({
  date: inputDate,
  maximumDate,
  minimumDate,
  modal = true,
  buttonColor,
  onConfirm,
  ...rest
}: DateTimePickerProps) => {
  const confirmDate = (date: Date) => {
    const temporalDate = date
      .toTemporalInstant()
      .toZonedDateTimeISO(Temporal.Now.timeZoneId())
      .toPlainDateTime();
    onConfirm?.(temporalDate);
  };

  return (
    <UniDateTimePicker
      modal={modal}
      date={new Date(inputDate.toString())}
      mode="datetime"
      maximumDate={maximumDate ? new Date(maximumDate.toString()) : undefined}
      minimumDate={minimumDate ? new Date(minimumDate.toString()) : undefined}
      onConfirm={confirmDate}
      uniProps={(theme) => ({
        buttonColor: buttonColor ?? theme.colors.text,
      })}
      {...rest}
    />
  );
};

export default DateTimePicker;
