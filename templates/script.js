
let startDateInput = document.getElementById("start_date");
let endDateInput = document.getElementById("end_date");

startDateInput.addEventListener("change", function() {
        let startDate = startDateInput.value;
        let endDate = endDateInput.value;

        leaderboard.filter_by_date_range(startDate, endDate);
        leaderboard.group_by_user();
        leaderboard.filter_users_with_no_exercises();
        // update the view and progress board with the new data
});

endDateInput.addEventListener("change", function() {
        let startDate = startDateInput.value;
        let endDate = endDateInput.value;

        leaderboard.filter_by_date_range(startDate, endDate);
        leaderboard.group_by_user();
        leaderboard.filter_users_with_no_exercises();
        
        updateView(leaderboard.data);
        updateProgressBoard(leaderboard.data);
});
