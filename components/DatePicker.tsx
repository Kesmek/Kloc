import DatePicker, {
  type DatePickerProps as RNDatePickerProps,
} from "react-native-date-picker";
import { useUnistyles } from "react-native-unistyles";

interface DatePickerProps
  extends Omit<
    RNDatePickerProps,
    "date" | "maximumDate" | "minimumDate" | "onConfirm"
  > {
  date: Temporal.PlainDateTime;
  maximumDate?: Temporal.PlainDateTime;
  minimumDate?: Temporal.PlainDateTime;
  onConfirm?: (date: Temporal.PlainDate) => void;
}

const CustomDatePicker = ({
  date: inputDate,
  maximumDate,
  minimumDate,
  modal = true,
  buttonColor,
  onConfirm,
  ...rest
}: DatePickerProps) => {
  const { theme } = useUnistyles();

  const confirmDate = (date: Date) => {
    const temporalDate = date
      .toTemporalInstant()
      .toZonedDateTimeISO(Temporal.Now.timeZoneId())
      .toPlainDate();
    onConfirm?.(temporalDate);
  };

  return (
    <DatePicker
      modal={modal}
      date={new Date(inputDate.toString())}
      maximumDate={maximumDate ? new Date(maximumDate.toString()) : undefined}
      minimumDate={minimumDate ? new Date(minimumDate.toString()) : undefined}
      buttonColor={buttonColor ?? theme.colors.text}
      onConfirm={confirmDate}
      {...rest}
    />
  );
};

export default CustomDatePicker;
