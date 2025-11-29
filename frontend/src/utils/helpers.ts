type ExtraHeaders = {
  [key: string]: string;
};

export const setAuthHeaders = (token: string, extra?: ExtraHeaders) => {
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      ...extra,
    },
  };
};

export const calculateAge = (birthDate: string): string => {
  const birthDateObj = new Date(birthDate);

  const currentDate = new Date();

  let ageInYears = currentDate.getFullYear() - birthDateObj.getFullYear();

  const birthMonth = birthDateObj.getMonth();
  const currentMonth = currentDate.getMonth();
  const birthDay = birthDateObj.getDate();
  const currentDay = currentDate.getDate();

  if (
    currentMonth < birthMonth ||
    (currentMonth === birthMonth && currentDay < birthDay)
  ) {
    ageInYears--;
  }
  const ageInMonths =
    currentDate.getMonth() -
    birthDateObj.getMonth() +
    (currentDate.getFullYear() - birthDateObj.getFullYear()) * 12;

  if (ageInYears > 0) {
    // If age is in years, return age with "year" or "years"
    return ageInYears + (ageInYears === 1 ? 'year' : 'years');
  } else {
    return ageInMonths + 'm';
  }
};

export function getPreviousTenYears() {
  const currentYear = new Date().getFullYear();
  const years = [];

  for (let i = 0; i < 10; i++) {
    years.push(currentYear - i);
  }

  return years;
}
