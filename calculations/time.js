module.exports = {

    months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"],

    getYears: function() {
        let years = [];
        let currentYear = 2019;

        for(let i = 0; i < 101; i++) {
            currentYear += 1;
            years.push(currentYear);
        }

        return years;
    },

    getCurrentTime: function() {
        let today = new Date();
        let hours = today.getHours();
        let minutes = today.getMinutes();
        let seconds = today.getSeconds();

        let ampm = hours >= 12 ? "PM" : "AM";
        hours = hours % 12;
        hours = hours ? hours : 12;
        hours = hours < 10 ? "0"+hours : hours;
        minutes = minutes < 10 ? "0"+minutes : minutes;
        seconds = seconds < 10 ? "0"+seconds : seconds;

        let time = `${hours}:${minutes}:${seconds}${ampm}`;
        return time;
    },

    getDate: function() {
        let today = new Date();
        let date = today.getDate();
        let month = today.getMonth() + 1;
        let year = today.getFullYear();

        return `${date}-${month}-${year} @ ` + this.getCurrentTime();
    }
};


// Note: this keyword can't be used if arrow functions are used inside objects