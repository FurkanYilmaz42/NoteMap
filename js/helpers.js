import {
  defaulIcon,
  goToIcon,
  homeIcon,
  jobIcon,
  parkIcon,
} from "./constant.js";


const formateDate = (date) => {
  const formatedDate = new Date(date).toLocaleDateString("tr", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return formatedDate;
};

const setStatus = (status) => {
  switch (status) {
    case "goto":
      return "Ziyaret";

    case "park":
      return "Park";

    case "home":
      return "Ev";

    case "job":
      return "İş";

    default:
      return "Tanımsız Durum";
  }
};

const getNoteIcon = (status) => {
  switch (status) {
    case "goto":
      return goToIcon;
    case "park":
      return parkIcon;
    case "home":
      return homeIcon;
    case "job":
      return jobIcon;
    default:
      return defaulIcon;
  }
};

export { formateDate, setStatus, getNoteIcon };