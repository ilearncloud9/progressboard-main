const submitButton = document.getElementById("submit-date-range");
const startDate = document.getElementById("start-date");
const endDate = document.getElementById("end-date");
const leaderboardTable = document.getElementById("man-heatmap");

submitButton.addEventListener("click", (event) => {
  event.preventDefault();
  const start = startDate.value;
  const end = endDate.value;
  
  // make an API call to the server to retrieve the filtered data
  fetch("/leaderboard?start=" + start + "&end=" + end)
    .then((response) => response.json())
    .then((data) => {
      // Clear the existing leaderboard table
      while (leaderboardTable.firstChild) {
        leaderboardTable.removeChild(leaderboardTable.firstChild);
      }

      // Create and append the new table with the filtered data
      const table = createTable(data);
      leaderboardTable.appendChild(table);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
});

function createTable(data) {
  // Create the table and headers
  const table = document.createElement("table");
  table.id = "man-heatmap";
  const headerRow = document.createElement("tr");
  headerRow.className = "header";
  const colorTitle = document.createElement("th");
  colorTitle.className = "color title";
  headerRow.appendChild(colorTitle);

  // Append the session headers
  for (let i = 1; i <= 15; i++) {
    const sessionHeader = document.createElement("th");
    sessionHeader.className = "color session";
    const sessionLink = document.createElement("a");
    sessionLink.href = "#";
    sessionLink.textContent = i;
    sessionHeader.appendChild(sessionLink);
    headerRow.appendChild(sessionHeader);
  }
  table.appendChild(headerRow);

  // Append the rows for each user
  for (let user in data) {
    const userRow = document.createElement("tr");
    const nameHeader = document.createElement("th");
    nameHeader.className = "color name";
    const nameLink = document.createElement("a");
    nameLink.href = data[user][0]["user_url"];
    const nameImg = document.createElement("img");
    nameImg.src = data[user][0]["avatar"];
    nameImg.alt = user;
    nameLink.appendChild(nameImg);
    nameHeader.appendChild(nameLink);
    userRow.appendChild(nameHeader);

    // Append the cells for each exercise
    for (let i = 1; i <= 15; i++) {
      const exerciseCell = document.createElement("td");
      exerciseCell.className = "color exercise";
      const exerciseLink = document.createElement("a");
      exerciseLink.href =data[user][i]["exercise_url"];
      const exerciseImg = document.createElement("img");
      exerciseImg.src = data[user][i]["exercise_img"];
      exerciseImg.alt = data[user][i]["exercise_name"];
      exerciseLink.appendChild(exerciseImg);
      exerciseCell.appendChild(exerciseLink);
      userRow.appendChild(exerciseCell);
      }
      table.appendChild(userRow);
      }
      return table;
      }
