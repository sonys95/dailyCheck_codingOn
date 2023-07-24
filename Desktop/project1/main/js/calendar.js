// DOM 요소들
const monthYearElement = document.getElementById("monthYear");
const datesContainer = document.getElementById("datesContainer");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const scheduleInput = document.getElementById("scheduleInput");
const addScheduleBtn = document.getElementById("addScheduleBtn");
const scheduleList = document.getElementById("scheduleList");
const scheduleItemsList = document.getElementById("scheduleItemsList");
const noScheduleMessage = document.getElementById("noScheduleMessage");
const scheduleForm = document.getElementById("scheduleForm");

// 달력 초기화
let currentDate = new Date();
let schedules = {}; // 스케줄을 날짜별로 저장하는 객체

// Load schedules from local storage on page load
function loadSchedulesFromLocalStorage() {
  const storedSchedules = localStorage.getItem("schedules");
  if (storedSchedules) {
    schedules = JSON.parse(storedSchedules);
    showCalendar(currentDate); // Update the calendar with the loaded schedules
    showDdayList(); // Update the D-Day list with the loaded schedules
  }
}

// Save schedules to local storage
function saveSchedulesToLocalStorage() {
  localStorage.setItem("schedules", JSON.stringify(schedules));
}

// 이전 달로 이동하는 함수
function showPreviousMonth() {
  currentDate.setMonth(currentDate.getMonth() - 1);
  showCalendar(currentDate); // 달력 업데이트를 위해 showCalendar 함수 호출
}

// 다음 달로 이동하는 함수
function showNextMonth() {
  currentDate.setMonth(currentDate.getMonth() + 1);
  showCalendar(currentDate); // 달력 업데이트를 위해 showCalendar 함수 호출
}

// 달력 표시 함수
function showCalendar(date) {
  // 이전 달력 초기화
  datesContainer.innerHTML = "";

  // 헤더에 월과 년도 표시
  const month = date.toLocaleString("ko-KR", { month: "long" });
  const year = date.getFullYear();
  monthYearElement.textContent = `${month} ${year}`;

  // 현재 월의 첫 번째 날과 마지막 날을 얻음
  const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  const lastDayOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);

  // 첫 번째 날과 마지막 날의 요일(0: 일요일, 1: 월요일, ..., 6: 토요일)을 얻음
  const startDayOfWeek = firstDayOfMonth.getDay();
  const endDayOfWeek = lastDayOfMonth.getDay();

  // 이전 달의 날짜 생성
  const prevMonthLastDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    0
  ).getDate();
  for (let i = startDayOfWeek - 1; i >= 0; i--) {
    const dateElement = createDateElement(prevMonthLastDate - i, "prevMonth");
    datesContainer.appendChild(dateElement);
  }

  // 현재 달의 날짜 생성
  const lastDate = lastDayOfMonth.getDate();
  for (let i = 1; i <= lastDate; i++) {
    const dateElement = createDateElement(i, "currentMonth");
    datesContainer.appendChild(dateElement);

    // Check if the date has any schedules
    const dateString = getDateKey(date.getFullYear(), date.getMonth(), i);
    if (schedules[dateString]) {
      dateElement.classList.add("has-schedule"); // Add class for dates with schedules
    }
  }
  // Helper function to get a string key for a date in the format "YYYY-MM-DD"
  function getDateKey(year, month, day) {
    const monthString = String(month + 1).padStart(2, "0");
    const dayString = String(day).padStart(2, "0");
    return `${year}-${monthString}-${dayString}`;
  }

  // 다음 달의 날짜 생성
  const remainingSlots = 6 - endDayOfWeek;
  for (let i = 1; i <= remainingSlots; i++) {
    const dateElement = createDateElement(i, "nextMonth");
    datesContainer.appendChild(dateElement);
  }

  showDdayList();
}

// 날짜 요소 생성 함수
function createDateElement(date, type) {
  const dateElement = document.createElement("div");
  dateElement.textContent = date;
  dateElement.classList.add("date");

  if (type === "currentMonth") {
    const currentDateObj = new Date(currentDate); // currentDate의 복사본 생성
    if (
      currentDateObj.getDate() === date &&
      currentDateObj.getMonth() === currentDate.getMonth() &&
      currentDateObj.getFullYear() === currentDate.getFullYear()
    ) {
      dateElement.classList.add("today");
    }

    dateElement.addEventListener("click", () => {
      showScheduleForm(date);
      showScheduleList(date);
    });
  } else {
    dateElement.style.visibility = "hidden";
  }

  return dateElement;
}

// D-Day 목록 보여주기 함수
function showDdayList() {
  const ddayList = document.getElementById("ddayItemsList");
  ddayList.innerHTML = "";

  for (const date in schedules) {
    const scheduleItems = schedules[date];
    for (const { schedule, isDday } of scheduleItems) {
      if (isDday) {
        const ddayElement = document.createElement("li");

        const { daysDiff } = getDaysDiffFromToday(Number(date));
        let dDayText;
        if (daysDiff === 0) {
          dDayText = "D-Day";
        } else if (daysDiff > 0) {
          dDayText = `D-${daysDiff}`;
        } else {
          dDayText = `D+${Math.abs(daysDiff)}`;
        }

        ddayElement.textContent = `${dDayText}     ${schedule}`;
        ddayList.appendChild(ddayElement);
      }
    }
  }
}
// Function to add D-Day to local storage
function addDdayToLocalStorage(schedule, date) {
  if (!schedules[date]) {
    schedules[date] = [];
  }

  // Check if the schedule already exists in the schedule list for the selected date
  const selectedSchedule = schedules[date].find(
    (item) => item.schedule === schedule
  );

  // Only add the D-Day if it doesn't already exist for the selected date
  if (!selectedSchedule) {
    schedules[date].push({ schedule, isDday: true });
    addDdayToList(schedule, date); // Add the D-Day to the D-Day list
  }

  saveSchedulesToLocalStorage(); // Save the schedules to local storage
}

// Add D-Day to the D-Day list function
function addDdayToList(schedule, date) {
  const ddayList = document.getElementById("ddayItemsList");
  const ddayElement = document.createElement("li");

  const { daysDiff } = getDaysDiffFromToday(date);

  let dDayText;
  if (daysDiff === 0) {
    dDayText = "D-Day";
  } else if (daysDiff > 0) {
    dDayText = `D-${daysDiff}`;
  } else {
    dDayText = `D+${Math.abs(daysDiff)}`;
  }
  ddayElement.textContent = `${dDayText}: ${schedule}`;
}
// D-Day 목록에 스케줄 추가 함수
function addDdayToListForDate(date) {
  const ddayList = document.getElementById("ddayItemsList");
  const ddayElement = document.createElement("li");

  const { daysDiff } = getDaysDiffFromToday(date);

  let dDayText;
  if (daysDiff === 0) {
    dDayText = "D-Day";
  } else if (daysDiff > 0) {
    dDayText = `D-${daysDiff}`;
  } else {
    dDayText = `D+${Math.abs(daysDiff)}`;
  }
  ddayElement.textContent = `${dDayText}: ${schedules[date][0].schedule}`;
  ddayList.appendChild(ddayElement);
}

// 스케줄 추가 함수
function addSchedule(schedule, date, isDday) {
  if (!schedules[date]) {
    schedules[date] = [];
  }

  // Check if the schedule already exists in the schedule list for the selected date
  const selectedSchedule = schedules[date].find(
    (item) => item.schedule === schedule
  );

  // Only add the schedule if it doesn't already exist for the selected date
  if (!selectedSchedule) {
    schedules[date].push({ schedule, isDday });
    showScheduleList(date); // Show the schedule list for the selected date

    if (isDday) {
      addDdayToList(schedule, date);
    }
  }

  // Clear the input value and uncheck the D-Day checkbox
  scheduleInput.value = "";
  document.getElementById("isDday").checked = false;

  saveSchedulesToLocalStorage(); // Save the schedules to local storage
}

// 스케줄 삭제 함수
function deleteSchedule(schedule, date) {
  schedules[date] = schedules[date].filter(
    (item) => item.schedule !== schedule
  );
  showScheduleList(date);
  saveSchedulesToLocalStorage(); // Save the schedules to local storage
}

// 현재 날짜와 선택한 날짜의 차이를 계산하는 함수
function getDaysDiffFromToday(date) {
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  const selectedDateTime = new Date(currentYear, currentMonth, date);

  const today = new Date();
  const timeDiff = selectedDateTime.getTime() - today.getTime();
  const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

  return { daysDiff };
}

function showScheduleList(date) {
  const scheduleItems = schedules[date] || [];
  scheduleItemsList.innerHTML = "";
  ddayItemsList.innerHTML = ""; // Clear the D-Day list

  if (scheduleItems.length === 0) {
    noScheduleMessage.style.display = "block"; // Show the message
  } else {
    noScheduleMessage.style.display = "none"; // Hide the message
    for (const { schedule, isDday } of scheduleItems) {
      const scheduleElement = document.createElement("li");
      scheduleElement.textContent = schedule;
      scheduleItemsList.appendChild(scheduleElement);

      // Check if the schedule has a D-Day and show the D-Day list
      if (isDday) {
        const ddayList = document.getElementById("ddayItemsList");
        ddayList.style.display = "block";
      }

      // Create the delete button for each schedule
      const deleteButton = document.createElement("button");
      deleteButton.textContent = "X";
      deleteButton.classList.add("delete-btn");
      deleteButton.addEventListener("click", () => {
        deleteSchedule(schedule, date);
      });
      scheduleElement.appendChild(deleteButton);
    }

    // Add D-Day items for the current date
    addDdayToListForDate(date);
  }
  showDdayList();
}

// 스케줄 폼 보여주기 함수
function showScheduleForm(date) {
  scheduleForm.style.display = "flex";
  scheduleInput.focus();

  // Clear the input value and uncheck the D-Day checkbox
  scheduleInput.value = "";
  document.getElementById("isDday").checked = false;

  addScheduleBtn.onclick = function () {
    const scheduleContent = scheduleInput.value.trim();
    const isDday = document.getElementById("isDday").checked;
    if (scheduleContent) {
      addSchedule(scheduleContent, date, isDday);
    }
  };
}

// 현재 선택된 날짜 반환하는 함수
function getSelectedDate() {
  const selectedDateElement = document.querySelector(".today");
  const selectedDate = parseInt(selectedDateElement.textContent);

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  const selectedDateTime = new Date(currentYear, currentMonth, selectedDate);

  const today = new Date();
  const timeDiff = selectedDateTime.getTime() - today.getTime();
  const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

  return { date: selectedDate, daysDiff };
}

// 이전 달과 다음 달로 이동하는 버튼에 이벤트 리스너 추가
prevBtn.addEventListener("click", showPreviousMonth);
nextBtn.addEventListener("click", showNextMonth);

// 초기 달력 표시
showCalendar(currentDate);
loadSchedulesFromLocalStorage();
