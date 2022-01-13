import { useAppSelector } from 'src/redux/hooks';
import {
  createSelectPunches,
  createSelectYearPunches,
  PunchType,
} from 'src/redux/punches';
import { OverviewData } from 'src/types/constants';

const useFilteredYearData = (employer: string, year: number) => {
  const data = useAppSelector(createSelectYearPunches({ employer, year }));
  const months: PunchType[][] = [
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
  ];

  for (const month in data) {
    const monthNumber = Number(month);
    months[monthNumber] = data[monthNumber];
  }
  months.forEach((_, index) => {
    months[index] = data[index] ?? [];
  });

  return months;
};

const useFilteredEmployerData = () => {
  console.log('useFilteredEmployerData call');

  const rawData = useAppSelector(createSelectPunches);

  const filteredData: OverviewData[] = [];

  for (const employer in rawData) {
    filteredData.push({
      employer,
      firstDay: rawData[employer].firstDay,
      lastDay: rawData[employer].lastDay,
    });
  }

  return filteredData;
};

export { useFilteredYearData, useFilteredEmployerData };
