
document.getElementById("filter-button").addEventListener("click", function() {
    filterData();
  });

  function filterData() {
    // Get start and end dates from input fields
    var startDate = document.getElementById("start-date").value;
    var endDate = document.getElementById("end-date").value;

    // Filter data based on date range
    var filteredData = leaderboardData.filter(function(item) {
      var commitDate = new Date(item.latest_commit_date);
      return commitDate >= startDate && commitDate <= endDate;
    });

    // Update view and progress board with filtered data
    updateView(filteredData);
    updateProgressBoard(filteredData);
  }

  function filterData() {
    // Get start and end dates from input fields
    var startDate = document.getElementById("start-date").value;
    var endDate = document.getElementById("end-date").value;

    // Filter data based on date range
    var filteredData = leaderboardData.filter(function(item) {
      var commitDate = new Date(item.latest_commit_date);
      return commitDate >= startDate && commitDate <= endDate;
    });
    var groupedData= filteredData.reduce(function(acc, current) {
      acc[current.user] = acc[current.user] || [];
      acc[current.user].push(current);
      return acc;
    }, {});

    var user_data = Object.values(groupedData).filter(function(user) {
      return user.length > 0;
    });

    // Update view and progress board with filtered data
    updateView(user_data);
    updateProgressBoard(user_data);
  }
