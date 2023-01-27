// event listener for the submit button
document.getElementById("submit-date-range").addEventListener("click", function(event){
  event.preventDefault();
  // Get the start and end date from the input fields
  var startDate = new Date(document.getElementById("start-date").value);
  var endDate = new Date(document.getElementById("end-date").value);
  //filter data by the date range
  var filteredData = data.filter(function(d){
    var commitDate = new Date(d.latest_commit_url);
    return commitDate >= startDate && commitDate <= endDate;
  });
  // Group the filtered data by user
  var groupedData = filteredData.reduce(function(acc, curr) {
    acc[curr.user] = acc[curr.user] || [];
    acc[curr.user].push(curr);
    return acc;
  }, {});

  // Iterate through the grouped data and check if each user has at least one exercise in the current selection
  for (var user in groupedData) {
    var hasExercise = false;
    for (var i = 0; i < groupedData[user].length; i++) {
      if (groupedData[user][i].exercise) {
        hasExercise = true;
        break;
      }
    }
    // If the user does not have any exercises in the current selection, remove them from the grouped data
    if (!hasExercise) {
      delete groupedData[user];
    }
  }
  // Update the view and progress board with the filtered and grouped data
  updateView(groupedData);
  updateProgressBoard(groupedData);
});

function updateView(data) {
  // Clear the current view
  var view = document.getElementById("view");
  view.innerHTML = "";
  // Iterate through the grouped data and create elements to display the information
  for (var user in data) {
    var userDiv = document.createElement("div");
    userDiv.classList.add("user");
    var userName = document.createElement("h2");
    userName.innerText = user;
    userDiv.appendChild(userName);
    for (var i = 0; i < data[user].length; i++) {
      var exercise = data[user][i];
      var exerciseDiv = document.createElement("div");
      exerciseDiv.classList.add("exercise");
      var exerciseName = document.createElement("p");
      exerciseName.innerText = exercise.name;
      exerciseDiv.appendChild(exerciseName);
      userDiv.appendChild(exerciseDiv);
    }
    view.appendChild(userDiv);
  }
}

function updateProgressBoard(data) {
  // Clear the current progress board
  var progressBoard = document.getElementById("progress-board");
  progressBoard.innerHTML = "";
  // Iterate through the grouped data and calculate progress
  for (var user in data) {
    var userProgress = 0;
    for (var i = 0; i < data[user].length; i++) {
      var exercise = data[user][i];
      userProgress += exercise.progress;
    }
    var averageProgress = (userProgress / data[user].length).toFixed(2);
    var progressDiv = document.createElement("div");
    progressDiv.classList.add("progress");
    var userName = document.createElement("h3");
    userName.innerText = user;
    progressDiv.appendChild(userName);
    var progressBar = document.createElement("div");
    progressBar.classList.add("progress-bar");
    progressBar.style.width = averageProgress + "%";
    progressDiv.appendChild(progressBar);
    progressBoard.appendChild(progressDiv);
  }
}
