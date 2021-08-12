import RNDateTimePicker, {
  Event,
} from "@react-native-community/datetimepicker";
import { useRef, useState } from "react";
import { View, Text, Keyboard } from "react-native";
import {
  BaseButton,
  BorderlessButton,
  RectButton,
  TextInput,
} from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useAppSelector } from "../../redux";
import { createSelectPunches } from "../../redux/punches";
import { colors } from "../../utils/constants";
import { formatDate } from "../../utils/functions";
import styles from "./styles";
const minutes: number[] = [];

for (let i = 1; i <= 120; i++) {
  minutes.push(i);
}

const Calculator = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [startDateSelector, setStartDateSelector] = useState(false);
  const [endDateSelector, setEndDateSelector] = useState(false);
  const [breakLength, setBreakLength] = useState(0);
  const [breakSubtraction, setBreakSubtraction] = useState(false);
  const textInputRef = useRef<TextInput>(null);

  const rawData = useAppSelector(createSelectPunches());

  const renderStartTime = () => {
    const formattedDate = formatDate(startDate);
    return (
      <RectButton
        onPress={() => setStartDateSelector(true)}
        style={styles.rowContainer}
      >
        <Icon color={colors.SECONDARY_GREEN} name={"today"} size={40} />
        <Text
          style={styles.date}
        >{`${formattedDate.month} ${formattedDate.day}${formattedDate.suffix}`}</Text>
      </RectButton>
    );
  };

  const renderEndTime = () => {
    const formattedDate = formatDate(endDate);
    return (
      <RectButton
        onPress={() => setEndDateSelector(true)}
        style={styles.rowContainer}
      >
        <Icon color={colors.SECONDARY_RED} name={"event"} size={40} />
        <Text
          style={styles.date}
        >{`${formattedDate.month} ${formattedDate.day}${formattedDate.suffix}`}</Text>
      </RectButton>
    );
  };

  const handleChangeStartDate = (date?: Date) => {
    setStartDateSelector(false);
    date && setStartDate(date);
  };

  const handleChangeEndDate = (date?: Date) => {
    setEndDateSelector(false);
    date && setEndDate(date);
  };

  const handleChangeBreakLength = (text: string) => {
    const value = Number(text);
    setBreakLength(value ?? 0);
  };

  const computeHours = () => {
    let totalMillis = 0;
    let dayCount = 0;
    rawData[rawData.focusedYear].forEach((month, index) => {
      if (index >= startDate.getMonth() && index <= endDate.getMonth()) {
        month.forEach((day) => {
          if (day.punchIn && day.punchOut) {
            const date = new Date(day.date);

            //Range is in the same month
            if (startDate.getMonth() === endDate.getMonth()) {
              if (
                date.getDate() >= startDate.getDate() &&
                date.getDate() <= endDate.getDate()
              ) {
                totalMillis += day.punchOut - day.punchIn;
                dayCount++;
              }
            } else {
              //End month is larger than start month
              if (index === startDate.getMonth()) {
                if (date.getDate() >= startDate.getDate()) {
                  totalMillis += day.punchOut - day.punchIn;
                  dayCount++;
                }
              } else if (index === endDate.getMonth()) {
                if (date.getDate() <= endDate.getDate()) {
                  totalMillis += day.punchOut - day.punchIn;
                  dayCount++;
                }
              } else {
                totalMillis += day.punchOut - day.punchIn;
                dayCount++;
              }
            }
          }
        });
      }
    });

    if (breakSubtraction) {
      const milliseconds = breakLength * 60 * 1000;
      for (let i = 0; i < dayCount; i++) {
        totalMillis -= milliseconds;
      }
    }

    const rawMinutes = Math.round(totalMillis / 1000 / 60);
    const hours = Math.floor(rawMinutes / 60);
    const minutes = rawMinutes % 60;
    const averageRawMinutes = dayCount ? rawMinutes / dayCount : 0;
    const averageHours = Math.floor(averageRawMinutes / 60);
    const averageMinutes = Math.round(averageRawMinutes % 60);

    return (
      <>
        <View style={styles.rowContainer}>
          <Text style={[styles.statisticHeader, { flex: 3 }]}>Total Hours</Text>
          <Icon
            color={colors.SECONDARY_PURPLE}
            name={"schedule"}
            size={40}
            style={{ flex: 1 }}
          />
          <Text style={styles.statisticText}>{`${hours}h ${minutes}m`}</Text>
        </View>
        <View style={styles.rowContainer}>
          <Text style={[styles.statisticHeader, { flex: 3 }]}>Total Days</Text>
          <Icon
            color={colors.SECONDARY_YELLOW}
            name={"calendar-today"}
            size={40}
            style={{ flex: 1 }}
          />
          <Text style={styles.statisticText}>{`${dayCount}`}</Text>
        </View>
        <View style={styles.rowContainer}>
          <Text style={[styles.statisticHeader, { flex: 3 }]}>
            Average Shift
          </Text>
          <Icon
            color={colors.SECONDARY_BLUE}
            name={"timer"}
            size={40}
            style={{ flex: 1 }}
          />
          <Text style={styles.statisticText}>
            {`${averageHours}h ${averageMinutes}m`}
          </Text>
        </View>
      </>
    );
  };

  return (
    <BaseButton
      onPress={Keyboard.dismiss}
      rippleColor={"transparent"}
      style={styles.root}
    >
      <View style={styles.rowContainer}>
        {renderStartTime()}
        <Icon
          color={colors.PRIMARY_WHITE}
          name={"arrow-forward"}
          size={25}
          style={{ alignSelf: "center", marginHorizontal: 5, marginTop: 10 }}
        />
        {renderEndTime()}
      </View>
      {startDateSelector && (
        <RNDateTimePicker
          maximumDate={
            new Date(
              rawData.focusedYear,
              Math.min(11, endDate.getMonth()),
              endDate.getDate(),
            )
          }
          minimumDate={new Date(rawData.focusedYear, 0)}
          onChange={(_: Event, date?: Date) => handleChangeStartDate(date)}
          value={startDate}
        />
      )}
      {endDateSelector && (
        <RNDateTimePicker
          maximumDate={new Date(rawData.focusedYear, 11, 31)}
          minimumDate={
            new Date(
              rawData.focusedYear,
              startDate.getMonth(),
              startDate.getDate(),
            )
          }
          onChange={(_: Event, date?: Date) => handleChangeEndDate(date)}
          value={endDate}
        />
      )}
      <View style={styles.rowContainer}>
        <Text style={styles.settingsText}>Break deductions from total?</Text>
        <BorderlessButton
          onPress={() => {
            if (breakSubtraction) {
              //@ts-ignore
              textInputRef.current?.blur();
            } else {
              //@ts-ignore
              textInputRef.current?.focus();
            }
            setBreakSubtraction(!breakSubtraction);
          }}
          style={{ marginHorizontal: 10 }}
        >
          {breakSubtraction ? (
            <Icon color={colors.PRIMARY_WHITE} name={"check-box"} size={30} />
          ) : (
            <Icon
              color={colors.PRIMARY_WHITE}
              name={"check-box-outline-blank"}
              size={30}
            />
          )}
        </BorderlessButton>
      </View>
      <View
        pointerEvents={breakSubtraction ? "auto" : "none"}
        style={[styles.rowContainer, { justifyContent: "space-between" }]}
      >
        <TextInput
          keyboardType={"numeric"}
          maxLength={2}
          onChangeText={handleChangeBreakLength}
          placeholder={"??"}
          ref={textInputRef}
          style={[
            styles.presetBreakContainer,
            styles.presetBreakText,
            {
              borderColor:
                breakLength !== 15 &&
                breakLength !== 30 &&
                breakLength !== 45 &&
                breakLength !== 60 &&
                breakSubtraction
                  ? colors.SECONDARY_WHITE
                  : "transparent",
              color: breakSubtraction
                ? colors.PRIMARY_WHITE
                : colors.SECONDARY_WHITE,
            },
          ]}
        />
        <View
          style={[
            styles.presetBreakContainer,
            {
              borderColor:
                breakLength === 15 && breakSubtraction
                  ? colors.SECONDARY_WHITE
                  : "transparent",
            },
          ]}
        >
          <RectButton
            onPress={() => {
              handleChangeBreakLength("15");
              Keyboard.dismiss();
            }}
            style={styles.presetBreakButton}
          >
            <Text
              style={[
                styles.presetBreakText,
                {
                  color: breakSubtraction
                    ? colors.PRIMARY_WHITE
                    : colors.SECONDARY_WHITE,
                },
              ]}
            >
              15
            </Text>
          </RectButton>
        </View>
        <View
          style={[
            styles.presetBreakContainer,
            {
              borderColor:
                breakLength === 30 && breakSubtraction
                  ? colors.SECONDARY_WHITE
                  : "transparent",
            },
          ]}
        >
          <RectButton
            onPress={() => {
              handleChangeBreakLength("30");
              Keyboard.dismiss();
            }}
            style={styles.presetBreakButton}
          >
            <Text
              style={[
                styles.presetBreakText,
                {
                  color: breakSubtraction
                    ? colors.PRIMARY_WHITE
                    : colors.SECONDARY_WHITE,
                },
              ]}
            >
              30
            </Text>
          </RectButton>
        </View>
        <View
          style={[
            styles.presetBreakContainer,
            {
              borderColor:
                breakLength === 45 && breakSubtraction
                  ? colors.SECONDARY_WHITE
                  : "transparent",
            },
          ]}
        >
          <RectButton
            onPress={() => {
              handleChangeBreakLength("45");
              Keyboard.dismiss();
            }}
            style={styles.presetBreakButton}
          >
            <Text
              style={[
                styles.presetBreakText,
                {
                  color: breakSubtraction
                    ? colors.PRIMARY_WHITE
                    : colors.SECONDARY_WHITE,
                },
              ]}
            >
              45
            </Text>
          </RectButton>
        </View>
        <View
          style={[
            styles.presetBreakContainer,
            {
              borderColor:
                breakLength === 60 && breakSubtraction
                  ? colors.SECONDARY_WHITE
                  : "transparent",
            },
          ]}
        >
          <RectButton
            onPress={() => {
              handleChangeBreakLength("60");
              Keyboard.dismiss();
            }}
            style={styles.presetBreakButton}
          >
            <Text
              style={[
                styles.presetBreakText,
                {
                  color: breakSubtraction
                    ? colors.PRIMARY_WHITE
                    : colors.SECONDARY_WHITE,
                },
              ]}
            >
              60
            </Text>
          </RectButton>
        </View>
      </View>
      {computeHours()}
    </BaseButton>
  );
};

export default Calculator;
