const debounce = (callback, time) => {
  let interval;
  return (...args) => {
    clearTimeout(interval);
    interval = setTimeout(() => {
      interval = null;
      callback(...args);
    }, time);
  };
};

let chosenUsers = [];
function sendEmails() {
  if (chosenUsers.length > 0) {
    const promises = [];
    chosenUsers.forEach(user => {
      const planId = window.location.href.split("/").pop();
      // TODO: switch
      const p = `https://makeapplan.herokuapp.com/plans/${planId}/invite/${user.userID}`;
      // const p = axios.post(`http://localhost:3000/plans/${planId}/invite/${user.userID}`);
      promises.push(p);
    });

    Promise.all(promises)
      .then(() => {
        location.reload(true);
      })
      .catch(e => {
        console.log(e);
      });
  }
}

function addUser(userID, username) {
  addToChosenUsers(userID, username);
  updateChosenUsersList();
}

function addToChosenUsers(userID, username) {
  if (chosenUsers.find(user => user.username == username)) {
    chosenUsers.splice(
      chosenUsers.indexOf(chosenUsers.find(user => user.username == username)),
      1
    );
  } else {
    chosenUsers.push({ userID, username });
  }
}

function updateChosenUsersList() {
  invitedUsers.querySelector("ul").innerHTML = "";

  chosenUsers.forEach(user => {
    let chosenUserDOMEl = document.createElement("li");
    chosenUserDOMEl.innerHTML = user.username;
    invitedUsers.querySelector("ul").appendChild(chosenUserDOMEl);
  });
}

function onSearchInputKeyUp() {
  axios.get(reqUsers).then(results => {
    results = results.data;

    const wordToSearch = searchInput.value.toLowerCase();
    const match = results.filter(user =>
      user.username.toLowerCase().includes(wordToSearch)
    );

    if (!wordToSearch) {
      searchResults.innerHTML = ``;
    } else {
      let usersMatch = match
        .map(user => {
          return `
          <div class="invited">
            <form action="/plans/:id/invite" method="post">
              <label><input type="checkbox" class="check" value="${user._id}" onclick="addUser('${user._id}', '${user.username}')">${user.username}</label>
            </form>            
          </div>
        `;
        })
        .join("");

      searchResults.innerHTML = usersMatch;
    }
  });
}

const debouncedSendEmails = debounce(sendEmails, 1000);
const debouncedOnSearchInputKeyUp = debounce(onSearchInputKeyUp, 350);

// TODO: switch
const reqUsers = `https://makeapplan.herokuapp.com/api/users`;
// const reqUsers = `http://localhost:3000/api/users`;

const searchResults = document.getElementById("search-results");
const invitedUsers = document.getElementById("invited-users");

searchInput.addEventListener("keyup", debouncedOnSearchInputKeyUp);
