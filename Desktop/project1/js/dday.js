function diffDay() {
    const masTime = new Date("2024-12-25");
    const todayTime = new Date();
    
    const diff = masTime - todayTime;

    const diffDay = String(Math.floor(diff / (1000*60*60*24)));
    const diffHour =String( Math.floor((diff / (1000*60*60)) % 24)).padStart(2,"0");
    const diffMin = String(Math.floor((diff / (1000*60)) % 60)).padStart(2,"0");
    const diffSec = String(Math.floor(diff / 1000 % 60)).padStart(2,"0");
    
    remainTime.innerText = `D-${diffDay}일 ${diffHour}시간 ${diffMin}분 ${diffSec}초`;
}

diffDay();
setInterval(diffDay, 1000);